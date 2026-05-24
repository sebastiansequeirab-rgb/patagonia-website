# Project status — Patagonia Americas website

_Last updated: 2026-05-24_

**Live:** https://www.patagoniaamericas.com · also https://patagonia-website.vercel.app
**Deploy:** `vercel --prod --yes` (aliases to the custom domain). Static site, no build step.

This file is a quick "where we left off" so the project can be resumed easily. Full architecture
lives in `README.md`.

---

## ✅ Done & live

### Autana platform page — `/autana`
- Standalone page at the clean URL **`/autana`** (rewrite in `vercel.json`), linked from the
  nav (**after Contact**) on `index.html`, `contact.html`, and itself. **Venezuela-focused**, branded
  after **Cerro Autana** (Piaroa, Venezuelan Amazon). Tagline: *Access. Structure. Execute.*
- **Native to the portal (hybrid light/editorial):** reuses the portal's own components — `.nav`,
  `.hero`, the real **TradingView `.ticker-shell`** (in-flow below the hero, scrolls away like the
  home), `.stats`, the `.world-map` (now **cropped to Venezuela**, 6 regional markers),
  `.cta-strip`, `.footer`. Two dark full-bleed photo moments (hero + Philosophy).
- Interactive: Operating Model diagram, Sectors hover-to-expand, Operating-Footprint map region hover.
  Fully bilingual EN/ES. Files: `autana.html`, `assets/css/autana.css`, `assets/js/autana.js`,
  `assets/images/autana-hero.jpg`, `assets/images/autana-philosophy.jpg`.
- **Was previously misnamed "Roraima"** — rebranded to Autana with a Venezuela focus (map rebuilt from
  the Americas to a Venezuela crop; Mt. Roraima inspiration/facts replaced with Cerro Autana / Piaroa).

### Contact form → Resend, on the verified domain
- `patagoniaamericas.com` is verified in Resend; the form now sends from
  **`Patagonia Americas <noreply@patagoniaamericas.com>`** (no longer the `onboarding@resend.dev`
  test sender).
- Two emails per submit: a **bilingual** confirmation to the visitor (EN/ES) + a team notification
  to **Exports@patagoniaamericas.com** (with a "Language" row). Honeypot anti-spam + input caps.
- Verified end-to-end in production: real submit → `{ok:true, delivered:{visitor:true, company:true}}`.
- Env: `RESEND_API_KEY` is set in Vercel (Production) and `.env` (gitignored). No `CONTACT_FROM_EMAIL`
  needed — the domain sender is the code default.

### Housekeeping
- `.vercelignore` keeps `node_modules`/`.git` and stray/personal files (incl. a personal PDF) out of
  the public deploy. Those stray files are also gitignored now.

---

## 🔜 Optional follow-ups (not blocking)
- **Sender address:** currently `noreply@`. If preferred, switch to `exports@patagoniaamericas.com`
  (one-line default in `api/contact.js`, or set `CONTACT_FROM_EMAIL` in Vercel).
- **Autana imagery:** hero + Philosophy currently reuse the inherited tepui photos as placeholders —
  swap in real Cerro Autana photos (`assets/images/autana-hero.jpg` / `autana-philosophy.jpg`).
- **Autana placeholder data:** confirm the Stats numbers, the per-region mandate counts, and the
  Cerro Autana facts (≈1,300 m, etc.) — all flagged with `NOTE:` comments in `autana.html`.
- Privacy Policy / Terms pages are placeholder `#` links in the footer.
