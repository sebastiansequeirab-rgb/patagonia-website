# Project status — Patagonia Americas website

_Last updated: 2026-05-27_

**Live:** https://www.patagoniaamericas.com · also https://patagonia-website.vercel.app
**Deploy:** `vercel --prod --yes` (aliases to the custom domain). Static site, no build step.

This file is a quick "where we left off" so the project can be resumed easily. Full architecture
lives in `README.md`.

---

## ✅ Done & live

### Mobile pass — `assets/css/mobile.css` (≤768px)
A single mobile stylesheet loaded **last** in every page's stack, gated by `@media (max-width: 768px)`,
so desktop is byte-identical. Drives every mobile-only treatment.

- **Hamburger nav**. Burger sits in `.nav-inner`; **panel + backdrop live outside `<nav>`** (sibling
  of nav) — critical because `.nav.scrolled` applies `backdrop-filter` and that creates a containing
  block that traps `position: fixed` descendants once the user scrolls. Slide-in editorial drawer
  (Cormorant display links, forest-green bg, gold accents), bilingual lang-toggle + CTA inside, plus
  an explicit "Close / Cerrar  ×" button at the top right of the panel. Logic in
  `assets/js/nav-mobile.js`. Burger hides while the panel is open so there aren't two competing X
  marks.
- **Cuadradita perfecta**: uniform **20px** lateral gutter overriding every hardcoded section
  padding (28/36/40/48/70/90). `html, body { overflow-x: hidden }` as a safety net (explicit
  sacrifice). All decorative bleed elements with negative offsets killed in mobile
  (`.contact-brand::after`, `.botanical`, `.products::after`).
- **Flatten to 1 col** with `!important` to win over the existing patchwork of 1080/880/720/600/560
  breakpoints. Sectors switch from left-borders to top-borders so they read as a list.
- **Autana widgets**: SPV diagram stacks vertically with connectors hidden (`.r-diagram-svg`
  hidden); the CORE node stretches full-width; sectors and the Venezuela map are tappable —
  `autana.js` detects `(hover: none)` and adds toggle-on-active + tap-outside-closes (the
  desktop `mouseenter`/`mouseleave` listeners are untouched).
- **Animations off** in mobile (`.reveal`, hero parallax in `nav.js`) — they were glitchy on iOS
  Safari momentum scroll and arrived as half-visible elements.
- **Important gotcha** (already fixed in commit `c7b560d`): do **not** put `media="(max-width:768px)"`
  on the `<link>` — that gates the whole stylesheet including the out-of-MQ `display:none` rule that
  hides the mobile-only DOM on desktop. The `@media` inside the CSS handles the gating; the link
  attribute would break desktop.

Files: `assets/css/mobile.css`, `assets/js/nav-mobile.js`, edits to `index.html` / `contact.html` /
`autana.html` (add the `<link>`, the burger HTML, the panel HTML outside `<nav>`, the `<script>`),
and aditive edits to `assets/js/autana.js` + `assets/js/nav.js`.

### AUTANA wordmark in the hero — `/autana`
Boss-requested chevron wordmark above "The Autana Platform" eyebrow. Built as **inline SVG** with
a 3-stop gold → deep bronze (#9C7A38) → cream gradient (metallic look). Letters are 1.5:1
height-to-width — chevron A's with no crossbar, near-rectangular U, plain T, geometric N. Sized
with `clamp(240px, 36vw, 440px)` on desktop and `min(78vw, 300px)` on mobile, with
`clamp(40px, 6vh, 80px)` of margin-top on top of the existing hero padding so it doesn't press up
against the nav. Styles live in `autana.css`.

> **The current wordmark is a hand-built SVG approximation** of the brand mark in the boss's
> reference image. If exact-logo fidelity matters, get the original SVG/AI from the boss and swap
> the inline SVG in `autana.html` (≈ line 134-150). It's a 30-second drop-in.

### Autana platform page — `/autana`
- Standalone page at the clean URL **`/autana`** (rewrite in `vercel.json`), linked from the nav
  (**after Contact**) on `index.html`, `contact.html`, and itself. **Venezuela-focused**, branded
  after **Cerro Autana** (Piaroa, Venezuelan Amazon). Tagline: *Access. Structure. Execute.*
- **Native to the portal (hybrid light/editorial):** reuses the portal's own components — `.nav`,
  `.hero`, the real **TradingView `.ticker-shell`**, the `.world-map` (**cropped to Venezuela**, 6
  regional markers), `.cta-strip`, `.footer`. Two dark full-bleed photo moments (hero + Philosophy).
- Interactive widgets: Operating Model diagram + Operating-Footprint map (region hover **+ tap on
  mobile**). Sectors are now a clean 6-tile **presentational** grid. Fully bilingual EN/ES. Files:
  `autana.html`, `assets/css/autana.css`, `assets/js/autana.js`, `assets/images/autana-hero.jpg`,
  `assets/images/autana-philosophy.jpg`.

### Autana fidelity pass — 2026-05-26 (commit `7591337`)
Side-by-side audit of the page against the **owner-provided source copy**. Result:
- Corrected six reworded lines to verbatim.
- Added two missing lines.
- **Stripped invented business data** that was not in the source: the entire **Stats** band, the
  per-sector **Snapshot + "Representative Transactions"** panels, and the per-region **mandate
  counts** on the Venezuela map. Kept (per owner): Cerro Autana facts panel + SPV node descriptions.

### Contact form → Resend, on the verified domain
- `patagoniaamericas.com` is verified in Resend; the form sends from
  **`Patagonia Americas <noreply@patagoniaamericas.com>`**.
- Two emails per submit: a **bilingual** confirmation to the visitor (EN/ES) + a team notification
  to **Exports@patagoniaamericas.com**. Honeypot anti-spam + input caps.
- Env: `RESEND_API_KEY` is set in Vercel (Production) and `.env` (gitignored).

### Housekeeping
- `.vercelignore` keeps `node_modules`/`.git` and stray/personal files out of the public deploy.

---

## 🔜 Optional follow-ups (not blocking)

- **Real AUTANA logo file from the boss.** The current wordmark is a hand-built SVG approximation.
  When the boss sends the actual logo (SVG/AI/high-res PNG), swap the inline SVG in `autana.html`.
- **Autana imagery.** Hero + Philosophy currently reuse the inherited tepui photos as placeholders
  — swap in real Cerro Autana photos (`assets/images/autana-hero.jpg` /
  `assets/images/autana-philosophy.jpg`). Flagged with `NOTE:` in `autana.html`.
- **Cerro Autana elevation** in the facts panel is approximate (≈1,300 m) — confirm with the owner.
- **Sender address:** currently `noreply@`. If preferred, switch to `exports@patagoniaamericas.com`.
- Privacy Policy / Terms pages are placeholder `#` links in the footer.
