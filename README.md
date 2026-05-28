# Patagonia Americas LLC — Website

Static marketing site for Patagonia Americas, an international commodity trading firm based in Fort Lauderdale, FL.

**Live:** https://patagonia-website.vercel.app

---

## Stack

- Plain HTML + CSS + vanilla JS, **no build step, no dependencies**.
- Google Fonts: **Cormorant Garamond** (display serif) + **Inter** (body sans).
- Single-page experience (`index.html`) + dedicated contact page (`contact.html`).
- One Vercel Serverless Function: `api/contact.js` (form submission via Resend).
- Hosted on Vercel under team `sebastiansequeirab-5196s-projects`, project `patagonia-website`.

## File structure

```
patagonia-website/
├── index.html               # Single-page site: all 16 sections live here
├── contact.html             # Standalone contact form + brand panel
├── autana.html              # Standalone "Autana Platform" page, Venezuela focus (served at /autana)
├── about.html               # 5-line meta-refresh redirect to /#about
├── vercel.json              # Rewrite /autana → /autana.html (clean URL)
├── api/
│   └── contact.js           # POST /api/contact → Resend email delivery
├── assets/
│   ├── css/
│   │   ├── tokens.css       # Design system: colors, fonts, spacing, motion, radii
│   │   ├── base.css         # Reset, body, typography, .container, .eyebrow, a11y
│   │   ├── components.css   # Nav, buttons, lang toggle, ticker shell, contact form
│   │   ├── sections.css     # All section-specific styles (hero through footer)
│   │   └── autana.css       # Autana page only: all its section styles + Venezuela map crop
│   ├── js/
│   │   ├── nav.js           # Fixed-nav scroll state + hero parallax + scrollspy
│   │   ├── hero-slideshow.js # 6-frame cross-fader, 8s pacing, hover/visibility pause
│   │   ├── i18n.js          # EN/ES toggle, persisted to localStorage (shared by all pages)
│   │   ├── reveal.js        # IntersectionObserver entrance animations + stat counters
│   │   └── autana.js        # Autana page only: the three interactive widgets (diagram / sectors / map)
│   ├── images/              # Product / hero / pillar / map photos (see § Images)
│   └── REDESIGN_SPEC.md     # Original "Quiet Authority" brief (mostly historical)
├── package.json             # Engines pin only (Node ≥ 18)
└── .gitignore               # Ignores .vercel, .env, .DS_Store, SCR-*.jpeg uploads
```

---

## Page anatomy

### `index.html` — single-page experience

Sections in render order (anchor IDs in parentheses):

1. **Nav** — fixed, transparent until 40 px of scroll, then glass + blur.
2. **Hero** (`<header class="hero">`) — 6-image cross-fading slideshow + headline + lead. 3 s rotation, 1.2 s cross-fade, hover-pause. Its height reserves the ticker band (see below) so content never overflows the fold.
3. **Live ticker** — TradingView ticker-tape embed (commodity ETFs + FX pairs). Lives in a fixed-height (`--ticker-h`, 60 px) band that the hero subtracts from its own height, so it's always visible on load at any zoom level.
4. **What We Do** (`#services`) — 3 pillar cards (Global Reach, Logistics Excellence, Commitment to You).
5. **Premium Commodities** (`#products`) — 8-card category grid (see § Products).
6. **Stats** — 4 animated counters.
7. **Priority band** — three-column priority section ("Your Success. Our Priority.").
8. **Who We Are** (`#about`) — two-column with African-proverb pull-quote.
9. **Company Philosophy** — two-column quote + sacos warehouse image (merged from old `about.html`).
10. **Proven Market Experience** — dark band with global agribusiness narrative + tri-image grid.
11. **Why Local Coordination Matters** — 4-card grid.
12. **Strategic Positioning** (`#positioning`) — 3 sub-cards (Long-Term Partnerships / Scalable Execution / Institutional Approach).
13. **Trade Map / Global Flow** — real Wikimedia world map with 7 markers + 5 trade arcs (see § Trade map).
14. **Ops banner** — full-bleed wp-grains-mosaic image with overlay quote.
15. **Flow Diagram** — Global Supply + Local Execution hub-spoke SVG.
16. **Ops Capabilities** — 6-tile grid (Six Disciplines).
17. **Growth / Closing** — Built for Long-Term Growth, CTA-heavy section.
18. **CTA strip + Footer**.

Bilingual EN/ES is implemented via paired `<span data-i18n="en">…</span><span data-i18n="es">…</span>` siblings. The visibility swap is CSS-driven from `<html data-lang>`; `assets/js/i18n.js` persists the choice in `localStorage.pa-lang`.

### `contact.html`
Two-panel layout: left = brand/contact details + OSM map iframe + WhatsApp pill, right = the contact form. JS is inline (page-specific form handler + i18n for `<option>` and textarea placeholders).

### `autana.html` — the Autana Platform page

A standalone page (served at the clean URL `/autana` via the rewrite in `vercel.json`) presenting
*Autana* — an investment / structuring / execution platform that is part of Patagonia Americas but
framed as its own platform, **focused on Venezuela** and branded after **Cerro Autana**, the sacred
mountain of the **Piaroa** people in the Venezuelan Amazon. Tagline: *Access. Structure. Execute.*
Reached from an "Autana" nav link placed **after Contact** on every page.

**Native to the portal (hybrid light/editorial).** It links the **full portal stylesheet stack**
(`tokens → base → components → sections → autana.css`) and **reuses the portal's own components** so it
reads as part of the site: the fixed `.nav`, the `.hero` (single dark tepui photo, reserves
`--ticker-h`), the **real TradingView `.ticker-shell`** (in-flow below the hero, scrolls away — identical
to the home), `.stats` (animated by `reveal.js`), the `.trade-map`/`.world-map`, `.cta-strip`, and the
standard `.footer`. The two dark full-bleed photo moments are the hero + Philosophy; everything between
is light cream/editorial. Scripts: shared `nav.js` + `i18n.js` + `reveal.js`, plus a slim `autana.js`
for the two remaining interactive widgets (Operating Model diagram, Operating Footprint map).

Sections in order: hero → ticker → Premise (Cerro Autana / Piaroa) → Why + The Platform → Capabilities
→ **interactive Operating Model** (AUTANA CORE + SPV nodes) → **Sectors** (clean 6-tile presentational
grid) → **Operating Footprint** (the portal world-map **cropped to Venezuela** — its `viewBox` is
zoomed to Venezuela's path bounding box, with 6 regional markers + gold arcs + hover detail showing
region + sector focus, **no fabricated mandate counts**) → full-bleed **Philosophy** (Cerro Autana
facts panel) → Pillars → CTA → footer. Fully bilingual EN/ES.

> **Fidelity pass (2026-05-26):** the page text is now near-verbatim to the owner-provided source
> copy. Three blocks of invented business data were stripped because they were not in the source:
> the **Stats band** (animated metrics), the per-sector **Snapshots + "Representative Transactions"**
> (sectors are now just the clean 6-item list of names), and the per-region **mandate counts** on the
> Venezuela map. Kept (owner's call): the **Cerro Autana facts panel** in Philosophy and the **SPV
> node descriptions** in the Operating Model diagram — both are descriptive embellishments rather than
> business metrics. See `git log` `7591337` for the full diff.

`autana.css`/`autana.js` are deliberately small — they only style/script the Autana-specific widgets;
all common chrome comes from the portal CSS. The Venezuela map re-sizing + highlight lives in
`autana.css` scoped under `#coverage` (page-only, so the home Trade Map is never affected). The two
tepui photos live at `assets/images/autana-hero.jpg` and `assets/images/autana-philosophy.jpg`.

> **AUTANA wordmark (2026-05-27):** the hero now opens with a chevron-style "AUTANA" wordmark above
> the "The Autana Platform" eyebrow. It's an **inline SVG** with a 3-stop gold → deep bronze → cream
> gradient (metallic look), styled in `autana.css` under `.autana-wordmark`. The current paths are a
> hand-built approximation of the boss's reference; if exact-logo fidelity matters, get the original
> SVG/AI from the boss and replace the inline SVG in `autana.html` (it's a drop-in swap).

> **Mobile pass (2026-05-27):** the page is part of the site-wide mobile pass (`assets/css/mobile.css`,
> ≤768px). On phone: SPV diagram collapses to 1 column with connectors hidden, sectors switch to a
> top-bordered list, the Venezuela map is capped at 280px height, and `autana.js` adds tap-to-reveal
> (toggle on the active tile, tap-outside closes sectors/regions) — desktop hover behavior is
> untouched.

> **Placeholders to finalize:** the hero + Philosophy photos are currently the inherited tepui images
> (not literally Cerro Autana) — swap in real Cerro Autana photos when available. The Cerro Autana
> facts panel uses an approximate elevation (≈1,300 m); confirm with the owner if exact values matter.
> Both are flagged with `NOTE:` comments in `autana.html`.
>
> History: started life as a mistakenly-named "Roraima" page (all-dark cinematic, from a Claude Design
> handoff), re-aligned to the portal's light editorial system, then **rebranded to Autana** with a
> Venezuela focus — the coverage map was rebuilt from the Americas to a Venezuela crop, and the
> Mt. Roraima inspiration/facts replaced with Cerro Autana / Piaroa.

### `about.html`
5-line meta-refresh redirect to `/#about` — kept so any externally-shared link to `/about.html` doesn't 404.

---

## Design system

All tokens live in `assets/css/tokens.css`. Selection:

| Token | Value | Role |
|---|---|---|
| `--color-bg-primary` | `#1F2D24` | forest green (dark sections, land on the map) |
| `--color-bg-cream-soft` | `#FAF5E8` | page paper / ocean on the map |
| `--color-accent-gold` | `#C8A865` | brass-gold accents, arcs, origin markers |
| `--color-accent-gold-bright` | `#D9B978` | hover state |
| `--color-text-dark` | `#1A1F1A` | body text on cream |
| `--color-text-light` | `#F5EDD8` | cream-bright (text on dark, destination markers) |
| `--font-display` | `'Cormorant Garamond', Georgia, serif` | all headings + display |
| `--font-body` | `'Inter', system-ui, sans-serif` | all body text |

Legacy aliases (`--brass`, `--forest`, `--cream`, etc.) live in tokens.css too and resolve to the new tokens — they exist so any rule that wasn't migrated still works.

### Spacing & layout rhythm

Every section reads its vertical padding from **fluid spacing tokens** so the rhythm stays consistent across the 80–125 % zoom range and all viewport widths — there are no more ad-hoc per-section px values:

| Token | Value | Used by |
|---|---|---|
| `--space-section-y` | `clamp(88px, 9.5vw, 136px)` | big sections — What We Do, Products, Who We Are, the 3 About blocks, Strategic, Flow Diagram, Ops Capabilities, Trade Map, Growth |
| `--space-section-sm` | `clamp(56px, 6vw, 84px)` | compact sections — Stats, CTA strip, Footer top |
| `--ticker-h` | `60px` | live-ticker band height; subtracted from the hero so the ticker stays above the fold |

Horizontal gutters were already uniform (every section wraps its content in `.container` — max 1280 px, 40 px gutter), so synchronizing dimensions was purely a vertical-rhythm job.

---

## Live ticker — important gotcha

**TradingView free embed only resolves a subset of symbols.** Continuous-contract futures (`CBOT:ZL1!`, `CBOT:ZS1!`, `CBOT:ZW1!`, `CBOT:ZC1!`, `ICEUS:SB1!`, `ICEUS:CT1!`, `TVC:DXY`) show a red `!` and no quote. The current symbol set uses NYSE-Arca ETFs which always render:

```js
[
  { description: "Soybeans",   proName: "AMEX:SOYB" },
  { description: "Wheat",      proName: "AMEX:WEAT" },
  { description: "Corn",       proName: "AMEX:CORN" },
  { description: "Sugar",      proName: "AMEX:CANE" },
  { description: "Agri Fund",  proName: "AMEX:DBA"  },
  { description: "USD/BRL",    proName: "FX_IDC:USDBRL" },
  { description: "USD/ARS",    proName: "FX_IDC:USDARS" },
  { description: "US Dollar",  proName: "AMEX:UUP"  }
]
```

Change the symbol set inside the `<script src="…ticker-tape.js" async>` block at the top of `index.html`. Pick symbols that exist on NYSE / AMEX / NYSEARCA / FX_IDC — futures and many regional indices won't render in the free widget.

**Keeping it above the fold:** the ticker band has a fixed height (`--ticker-h`, 60 px) and the hero uses `min-height: calc(100svh - var(--ticker-h))`, so nav + hero + ticker always fit the viewport on load. Don't reintroduce a nav-height subtraction in that calc — the nav is `position: fixed` and doesn't consume flow space, so subtracting it leaves an empty band below the ticker.

---

## Products grid — 8 official categories

Order, image, and one-line "Includes":

| # | Title | Image | Includes |
|---|---|---|---|
| 1 | Soybean Complex | `product-soybean-oil.jpg` | YSB · Meal · Crude Oil · Refined Oil |
| 2 | Wheat, Corn & Feed Grains | `product-wheat-soy.jpg` | Wheat · Corn · Barley · Sorghum |
| 3 | Sugar & Molasses | `product-sugar.jpg` | Raw · White · Refined · HSC · Feed grade |
| 4 | Oil-seeds & Byproducts | `product-grains.jpg` | Oilseeds · pellets · co-products |
| 5 | Specialty Grains & Ingredients | `specialty-grains.jpg` | Identity-preserved · niche varieties |
| 6 | Fats & Oils | `fats-oils.jpg` | UCO · tallow · soy · sunflower · palm · corn · yellow grease |
| 7 | Metals | `metals.jpg` | Aluminum · steel · copper · alumina · coke · caustic soda · fluoride |
| 8 | Urea & Fertilizers | `urea.jpg` | Granular urea · NPK · ammonia · agronomic inputs |

Each card has a hover overlay showing **Origin / Key Markets / Includes**. Grid is `4×2` on desktop (≥ 1080 px), `2×4` on tablet, `1×8` on mobile (`.product-grid-8` class in `assets/css/sections.css`).

---

## Trade map (Global Flow section)

The world map is the public-domain Wikimedia file `World_map_-_low_resolution.svg` (viewBox `950×620`, 338 country paths, ~84 KB). Inlined into `index.html` so CSS can style individual country fills and so markers + arcs sit in the same coordinate system.

Marker positions were tuned by reading each country path's bounding box directly from the SVG, then applying small city-within-country offsets:

| Role | City | Coords (viewBox) |
|---|---|---|
| Origin | USA Midwest | `(230, 200)` |
| Origin | Argentina · Rosario | `(290, 435)` |
| Origin | Brazil · Santos | `(320, 400)` |
| Destination | Rotterdam | `(466, 173)` |
| Destination | Qingdao | `(785, 195)` |
| Destination | Jebel Ali · UAE | `(596, 261)` |
| Destination | Singapore | `(738, 333)` |

Origin markers = solid gold `r=7` with halo. Destination markers = cream fill `r=5` with 1.5 px gold ring. Five quadratic-Bezier arcs animate between them (Brazil→Qingdao, Argentina→Rotterdam, USA Midwest→Jebel Ali, Brazil→Jebel Ali, USA Midwest→Singapore). `prefers-reduced-motion` freezes both pulses and arc draws.

The source SVG file lives at `assets/images/world-map.svg` for reference if anyone wants to swap projection or recompute marker coords.

---

## Images inventory

All under `assets/images/`:

- **Hero slideshow (6 frames)** — `hero.jpg`, `wp-port-cranes.jpg`, `priority-ship.jpg`, `priority-truck.jpg`, `pillar-commitment.jpg`, `pillar-logistics.png`.
- **Pillar cards** — `pillar-global.png`, `pillar-logistics.png`, `pillar-commitment.jpg`.
- **Priority band** — `priority-truck.jpg`, `priority-ship.jpg`.
- **Product cards (8)** — `product-soybean-oil.jpg`, `product-wheat-soy.jpg`, `product-sugar.jpg`, `product-grains.jpg`, `specialty-grains.jpg`, `fats-oils.jpg`, `metals.jpg`, `urea.jpg`.
- **Editorial / about** — `sacos.png` (Control Union certified jute sacks), `wp-grains-mosaic.jpg`, `wp-port-cranes.jpg`.
- **World map source** — `world-map.svg`.
- **Decoration** — `world-dots.svg`.
- **Autana page** — `autana-hero.jpg` (hero tepui), `autana-philosophy.jpg` (philosophy full-bleed). Currently the inherited tepui photos (placeholders — swap in real Cerro Autana imagery when available).

**Important:** Don't hotlink Unsplash for any product or hero photo — the upstream slug can be silently re-pointed (this site has been bitten twice: the basketball-arena hero, then the salad-bowl Sugar card). Always download a copy into `assets/images/` and reference locally.

---

## Contact form

`contact.html` posts JSON to `/api/contact`. `api/contact.js`:

1. Validates required fields and email format.
2. Maps the `subject` dropdown value to a readable label.
3. Sends an HTML + plain-text email via Resend with `reply_to` set to the inquirer.
4. Returns `200 { ok: true, delivered: true }` on success, `502` if delivery fails.

If `RESEND_API_KEY` is missing, the endpoint still returns success but only logs to Vercel function logs (`delivered: false`) — that means we can ship without an API key and add it later.

The Resend env var is already set in Vercel Production + Preview environments.

---

## Deploy

```bash
# Preview deploy (SSO-gated)
vercel

# Production (aliases to https://patagonia-website.vercel.app)
vercel --prod --yes
```

Project is pre-linked to Vercel (see `.vercel/project.json`, gitignored). The first time anyone runs `vercel` they may need to log in with `vercel login`.

Run `npm i -g vercel@latest` to keep the CLI current.

---

## Local development

```bash
# From the repo root
python3 -m http.server 8765
# Then open http://127.0.0.1:8765/
```

No build, no install. Edit any HTML / CSS / JS file and refresh the browser.

---

## Conventions

- Always include both EN and ES spans for any visible text — the bilingual toggle expects them as siblings.
- Add `class="reveal"` to any block that should fade-in on scroll (handled by `assets/js/reveal.js`).
- Prefer existing tokens (`var(--color-accent-gold)` etc.) over hex literals when adding new CSS.
- Stick to the single Cormorant Garamond + Inter pairing — no third font.
- Use `vector-effect: non-scaling-stroke` on SVG strokes that should stay crisp at any size.

---

## Working with this site

If you (or a future Claude) need to:

| Task | Where to look |
|---|---|
| Change ticker symbols | `index.html` inside the `<script src="…ticker-tape.js">` JSON block |
| Add a section to the home | `index.html` between existing `<section>` blocks; add styles in `assets/css/sections.css` |
| Swap a product photo | drop into `assets/images/` with a meaningful filename, update the matching `<img class="product-illust" src="…">` |
| Tune marker positions on the map | adjust the `cx`/`cy` on the 7 `<circle class="hub">` in the trade-map block; arcs are 5 `<path class="arc">` Beziers |
| Change colors / fonts | edit `assets/css/tokens.css` — every component reads from CSS variables, so a one-line change propagates everywhere |

---

## History

The site started as a generic agritrade marketing template. Major arcs:

- **Phase 1 (refactor)**: lifted inline `<style>` and `<script>` blocks into modular files under `assets/css/` and `assets/js/`; swapped fonts to Cormorant Garamond + Inter.
- **Phase 2 (about merge)**: collapsed `about.html` into the home as 3 contiguous sections (Philosophy / Proven Experience / Why Local). `about.html` became a 5-line redirect.
- **Phase 3 (products expansion)**: replaced the 6 hand-picked commodity cards with the 8 official categories (Soybean Complex, Wheat-Corn-Grains, Sugar, Oil-seeds, Specialty Grains, Fats & Oils, Metals, Urea).
- **Phase 4 (trade map)**: replaced the abstract continent-blob SVG with a real Wikimedia world map; re-projected the 7 markers; differentiated origin (solid gold) from destination (cream with gold ring).
- **Phase 5 (responsive polish + correctness pass)**: pinned the live ticker above the fold at any zoom (hero height now reserves `--ticker-h`, and the over-subtracted nav height was removed); normalized every section's vertical rhythm to the fluid spacing tokens (`--space-section-y` / `--space-section-sm`) so the layout stays consistent across the 80–125 % zoom range; corrected the HQ address to **300 SE 2nd Street, Suite 600, Fort Lauderdale, FL 33301** and the inbox to **Exports@patagoniaamericas.com** sitewide (footer, contact page, OSM map embed + links, and the serverless default in `api/contact.js`); added "metals" to the hero lead, Who We Are, Company Philosophy and the flow diagram's Industrial Clients node; and quickened the hero slideshow to a 3 s rotation with a 1.2 s cross-fade.

The original detailed redesign brief lives in `assets/REDESIGN_SPEC.md` — useful historical context but the implementation diverged from it in several places (most notably keeping the hero slideshow instead of switching to a two-column static hero).
