# Project status — Patagonia Americas website

_Last updated: 2026-05-26_

**Live:** https://www.patagoniaamericas.com · also https://patagonia-website.vercel.app
**Deploy:** `vercel --prod --yes` (aliases to the custom domain). Static site, no build step.

This file is a quick "where we left off" so the project can be resumed easily. Full architecture
lives in `README.md`.

---

## ✅ Done & live

### Autana platform page — `/autana`
- Standalone page at the clean URL **`/autana`** (rewrite in `vercel.json`), linked from the nav
  (**after Contact**) on `index.html`, `contact.html`, and itself. **Venezuela-focused**, branded
  after **Cerro Autana** (Piaroa, Venezuelan Amazon). Tagline: *Access. Structure. Execute.*
- **Native to the portal (hybrid light/editorial):** reuses the portal's own components — `.nav`,
  `.hero`, the real **TradingView `.ticker-shell`**, the `.world-map` (**cropped to Venezuela**, 6
  regional markers), `.cta-strip`, `.footer`. Two dark full-bleed photo moments (hero + Philosophy).
- Interactive widgets remaining: Operating Model diagram + Operating-Footprint map (region hover).
  Sectors are now a clean 6-tile **presentational** grid. Fully bilingual EN/ES. Files: `autana.html`,
  `assets/css/autana.css`, `assets/js/autana.js`, `assets/images/autana-hero.jpg`,
  `assets/images/autana-philosophy.jpg`.
- **Was previously misnamed "Roraima"** — rebranded to Autana with a Venezuela focus on 2026-05-24
  (map rebuilt from the Americas to a Venezuela crop; Mt. Roraima inspiration/facts replaced with
  Cerro Autana / Piaroa). `/roraima` was dropped, no redirect.

### Autana fidelity pass — 2026-05-26 (commit `7591337`)
Side-by-side audit of the page against the **owner-provided source copy**. Result:
- Corrected six reworded lines to verbatim (notably the Cerro Autana inspiration paragraph and the
  philosophy close *"AUTANA exists to connect capital, capability, and execution into real-world
  outcomes."* — previously held the old Roraima wording).
- Added two missing lines: *"Autana was built around a simple premise:"* and the operating-model
  closer *"This structure allows AUTANA to maintain flexibility at the transaction level while
  preserving institutional consistency across the platform."*
- **Stripped invented business data** that was not in the source: the entire **Stats** band
  (animated metrics like *24 Active Mandates*), the per-sector **Snapshot + "Representative
  Transactions"** panels (fake deals like *"Cross-border gas infrastructure"*), and the per-region
  **mandate counts** on the Venezuela map. Kept (per owner): Cerro Autana facts panel + SPV node
  descriptions — descriptive, not business metrics.
- Verified live: bilingual spans 126/126, no fabricated strings served, `/autana` → 200.

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
- **Cerro Autana facts panel:** elevation (~1,300 m) is approximate — confirm with the owner if
  precise values matter. Flagged with `NOTE:` in `autana.html`.
- Privacy Policy / Terms pages are placeholder `#` links in the footer.
