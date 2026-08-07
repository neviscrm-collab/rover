# ROVER — Zoho Catalyst Slate Deployment Guide

Catalyst Slate for Next.js uses **`@zcatalyst/nextjs-plugin`** (OpenNext under the hood)
to wrap your Next.js app as serverless functions — it is NOT a raw static CDN.
The plugin runs `next build` and then packages everything for Catalyst's serverless runtime.

---

## How Catalyst Slate deploys this app

```
Git push → Slate CI →  npm install
                     → next build          ← standard build, NO output:'export'
                     → npx zcatalyst-nextjs ← wraps .next/ into serverless functions
                     → Deploy to CDN + Functions
```

The critical rule: **never add `output: 'export'`** to `next.config.mjs`.  
OpenNext looks for `.next/standalone/` which static export never creates.

---

## GitHub-connected auto-deploy (current setup)

The repo `neviscrm-collab/rover` is connected to Catalyst Slate (Project-Rainfall).  
Every push to `main` triggers a new build automatically — no manual upload needed.

```bash
git push origin main   # triggers Catalyst Slate build pipeline
```

Watch progress in: **Catalyst Console → Slate → Deployments**

---

## Known ESLint issue (already fixed)

Catalyst Slate's build environment exposes an ESLint 8/9 API conflict:

```
ESLint: Invalid Options: Unknown options: useEslintrc, extensions
```

**Fix applied** in `next.config.mjs`:

```js
eslint: { ignoreDuringBuilds: true }
```

This skips ESLint during `next build` on Catalyst CI.  
Run `npm run lint` locally to lint before pushing.

---

## Local development

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # verify the build matches what Slate will run
npm run lint     # lint check (not run during Slate CI build)
```

---

## Environment variables

For server-side env vars (API keys, secrets), add them in:  
**Catalyst Console → Slate → Site Settings → Environment Variables**

Client-side vars must be prefixed `NEXT_PUBLIC_` and set in `.env.local`  
(and mirrored in Catalyst env vars so the build can access them).
