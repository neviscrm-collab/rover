import { NextResponse } from "next/server";

/**
 * GET /api/auth/zoho/callback
 *
 * With implicit flow (response_type=token), Zoho sends the access_token in the
 * URL FRAGMENT (#access_token=…). Fragments are never sent to the server, so
 * this route returns a small client-side HTML page that:
 *   1. Reads the fragment via JavaScript
 *   2. Calls /api/auth/zoho/profile to turn the token into a ROVER user
 *   3. Writes everything to localStorage (Zustand key + expiry)
 *   4. Redirects to /app (or /studio for agencies)
 *
 * Auto-logout: tokenExpiry is stored alongside the token; the auth store checks
 * it on rehydration and the AuthGuard clears the session when it's past.
 */
export async function GET() {
  const html = /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Completing sign-in…</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      background:#0a0a0f;color:#fff;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      display:flex;align-items:center;justify-content:center;
      min-height:100vh;flex-direction:column;gap:18px;
    }
    .logo{
      width:52px;height:52px;border-radius:18px;
      background:linear-gradient(135deg,#7C3AED,#06B6D4);
      display:flex;align-items:center;justify-content:center;
      font-size:22px;font-weight:800;color:#fff;
    }
    .spinner{
      width:32px;height:32px;
      border:2px solid rgba(124,58,237,.25);
      border-top-color:#7C3AED;border-radius:50%;
      animation:spin .8s linear infinite;
    }
    @keyframes spin{to{transform:rotate(360deg)}}
    p{color:rgba(255,255,255,.35);font-size:14px}
    .err{color:#f87171;font-size:13px;text-align:center;max-width:300px}
  </style>
</head>
<body>
  <div class="logo">R</div>
  <div class="spinner"></div>
  <p id="msg">Completing sign-in…</p>
  <script>
  (async function () {
    const msg = document.getElementById('msg');
    function fail(err) {
      msg.className = 'err';
      msg.textContent = 'Sign-in failed: ' + err;
      setTimeout(function() {
        window.location.href = '/login?error=' + encodeURIComponent(err);
      }, 1500);
    }

    try {
      // Zoho sends token in the fragment: #access_token=xxx&expires_in=3600&...
      // Also handle query-param fallback just in case.
      var frag  = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      var query = new URLSearchParams(window.location.search);

      var accessToken = frag.get('access_token') || query.get('access_token');
      var expiresIn   = parseInt(frag.get('expires_in') || query.get('expires_in') || '3600', 10);
      var oauthError  = frag.get('error') || query.get('error');

      if (oauthError) { fail(oauthError); return; }
      if (!accessToken) { fail('no_token'); return; }

      msg.textContent = 'Fetching your profile…';

      // Our server calls Zoho CRM /users?type=CurrentUser with this token
      var res = await fetch('/api/auth/zoho/profile', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      });
      if (!res.ok) {
        var body = await res.json().catch(function(){ return {}; });
        throw new Error(body.error || 'profile_fetch_failed');
      }
      var data = await res.json();
      var user = data.user;

      var tokenExpiry = Date.now() + expiresIn * 1000; // ms timestamp

      // ── Write to localStorage ──────────────────────────────────────────────
      // 1. Flat keys (used by AuthService)
      localStorage.setItem('rover_auth_token', accessToken);
      localStorage.setItem('rover_auth_user',  JSON.stringify(user));

      // 2. Zustand persist key (rover_auth) — must match partialize shape
      localStorage.setItem('rover_auth', JSON.stringify({
        state: {
          user:            user,
          role:            user.role,
          isAuthenticated: true,
          token:           accessToken,
          refreshToken:    null,
          tokenExpiry:     tokenExpiry,
        },
        version: 0,
      }));

      // ── Auto-logout after token lifetime ──────────────────────────────────
      // Sets a one-shot timer; won't survive a page refresh, but the store
      // checks tokenExpiry on every rehydration, so the next page load after
      // expiry will clear the session automatically.
      var msLeft = tokenExpiry - Date.now();
      if (msLeft > 0) {
        setTimeout(function () {
          localStorage.removeItem('rover_auth_token');
          localStorage.removeItem('rover_auth_user');
          localStorage.removeItem('rover_auth');
          window.location.href = '/login?error=session_expired';
        }, msLeft);
      }

      msg.textContent = 'Redirecting…';
      window.location.href = user.role === 'AGENCY' ? '/studio' : '/app';

    } catch (e) {
      console.error('[Zoho callback]', e);
      fail(e instanceof Error ? e.message : String(e));
    }
  })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
