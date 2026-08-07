# ROVER — Zoho Catalyst Slate Deployment Guide

ROVER is configured as a **fully-static Next.js export** (`output: 'export'`).  
Every page is pre-rendered to HTML at build time — no Node server required.  
Zoho Catalyst Slate serves these static files directly from its CDN.

---

## One-command deploy prep

```bash
npm run deploy:zip
```

This runs `next build`, collects the `out/` directory, and produces  
**`rover-slate-deploy.zip`** in the project root — ready to upload to Slate.

---

## Step-by-step Catalyst Slate upload

1. **Log in** to [Zoho Catalyst Console](https://catalyst.zoho.com) and open your project.
2. Navigate to **Hosting → Slate Sites**.
3. Click **Create Site** (or open your existing ROVER site).
4. Under **Deploy**, choose **Upload ZIP**.
5. Select `rover-slate-deploy.zip` from your project root.
6. Click **Deploy** — Slate unpacks the ZIP and distributes via CDN.
7. Your site is live at the Slate-assigned domain (e.g. `rover.zohocatalyst.com`).

### Custom domain (optional)

In the Slate site settings → **Custom Domain**, add your domain (e.g. `rover.app`)  
and follow the CNAME/A-record instructions Catalyst provides.

---

## What's inside the ZIP

```
out/
├── index.html                   ← Marketing home (/)
├── discover/index.html          ← Discover page
├── experience/
│   ├── exp-spiti/index.html     ┐
│   ├── exp-bali-surf/index.html │  8 pre-rendered experience pages
│   ├── exp-japan-anime/…        ┘
│   └── …
├── app/                         ← Customer app (auth-guarded client-side)
├── studio/                      ← Agency Studio (auth-guarded client-side)
├── login/ register/ …           ← Auth pages
└── _next/                       ← JS/CSS chunks + static assets
```

---

## Why it works with Catalyst Slate

| Feature | How it's handled |
|---|---|
| Static HTML | `output: 'export'` in `next.config.mjs` |
| Trailing slashes | `trailingSlash: true` → `/experience/exp-bali/index.html` |
| Dynamic routes | `generateStaticParams()` pre-renders all 8 experience pages |
| Images | `images: { unoptimized: true }` — served directly from Unsplash CDN |
| Auth | Client-side Zustand store with `localStorage` persistence — no server needed |
| PWA | `public/manifest.json` bundled into `out/` |
| Deep links | Slate must serve `index.html` for unknown paths — enable **SPA fallback** in Slate settings |

### ⚠️ Enable SPA Fallback in Slate

Since ROVER uses client-side routing (Next.js App Router), Catalyst Slate needs  
to serve `index.html` for any path it doesn't find — otherwise direct URL visits  
to `/discover` or `/experience/exp-spiti` will 404.

In Slate Site settings → **Error Page** → set the 404 document to `index.html`.

---

## Local development

```bash
npm run dev          # Hot-reload dev server on http://localhost:3000
npm run build        # Production build → out/
npm run deploy:zip   # Build + package for Slate upload
```

---

## Environment variables

No server-side env vars are needed — ROVER uses only mock data and client-side auth.  
If you connect a real backend later, prefix vars with `NEXT_PUBLIC_` so they're  
inlined at build time (required for static export).

```env
# .env.local — add only NEXT_PUBLIC_ vars
NEXT_PUBLIC_API_URL=https://your-api.com
```
