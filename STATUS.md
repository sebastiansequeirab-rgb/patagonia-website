# Project status — Patagonia Americas website

_Last updated: 2026-05-23_

**Live:** https://www.patagoniaamericas.com · also https://patagonia-website.vercel.app
**Deploy:** `vercel --prod --yes` (aliases to the custom domain). Static site, no build step.

This file is a quick "where we left off" so the project can be resumed easily. Full architecture
lives in `README.md`.

---

## ✅ Done & live

### Roraima platform page — `/roraima`
- New standalone page at the clean URL **`/roraima`** (rewrite in `vercel.json`), linked from the
  nav (**after Contact**) on `index.html`, `contact.html`, and itself.
- **Native to the portal (hybrid light/editorial):** reuses the portal's own components — `.nav`,
  `.hero`, the real **TradingView `.ticker-shell`** (in-flow below the hero, scrolls away like the
  home), `.stats`, the real `.world-map` (forest-on-cream Wikimedia map, 6 Americas markers), 
  `.cta-strip`, `.footer`. The two Mt. Roraima photos are the only **dark full-bleed moments** (hero
  + Philosophy).
- Interactive: Operating Model diagram, Sectors hover-to-expand, Frontier map region hover. Fully
  bilingual EN/ES. Files: `roraima.html`, `assets/css/roraima.css`, `assets/js/roraima.js`,
  `assets/images/roraima-hero.jpg`, `assets/images/roraima-philosophy.jpg`.

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
- **Frontier map framing:** the map shows the full world (like the home Trade Map) with markers in the
  Americas. Could be cropped to the Americas if a tighter focus is wanted.
- Privacy Policy / Terms pages are placeholder `#` links in the footer.
