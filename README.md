# Patagonia Americas LLC — Website

Static marketing site for Patagonia Americas, an international commodity trading firm based in Boca Raton, FL.

## Stack

- Plain HTML + CSS + vanilla JS (no build step, no dependencies)
- Two pages: `index.html` (landing) and `contact.html` (contact form)
- Fonts loaded from Google Fonts: Fraunces (display serif) + Instrument Sans (body)
- Currently uses placeholder images from Unsplash — these need to be replaced with the client's own assets

## File structure

```
patagonia-website/
├── index.html            # Landing page (hero, services, products, priority band, about, footer)
├── contact.html          # Contact page with form
├── assets/
│   └── images/           # Drop your downloaded images here (see Image Inventory below)
└── README.md
```

---

## 1. Image inventory — what to swap

Every placeholder image is marked with an `IMAGE_SWAP[key]` comment in the source.
Search the codebase for `IMAGE_SWAP` to jump to each location.

| Key                 | File         | Subject                                | Recommended filename                  |
| ------------------- | ------------ | -------------------------------------- | ------------------------------------- |
| Hero slideshow      | `index.html` | 5 cross-fading port / agriculture frames | currently 5 Unsplash hotlinks inside `<div class="hero-slides">`; each has an `onerror` fallback to `assets/images/hero.jpg`. See §7 to swap to local assets. |
| `pillar-global`     | `index.html` | "Global Reach" card — global trade / port aerial | `assets/images/pillar-global.jpg`     |
| `pillar-logistics`  | `index.html` | "Logistics Excellence" card — containers / port logistics | `assets/images/pillar-logistics.jpg`  |
| `pillar-commitment` | `index.html` | "Commitment to You" card — agricultural / wheat field | `assets/images/pillar-commitment.jpg` |
| `priority-truck`    | `index.html` | "Your Success" band, left side — freight truck on highway at sunset | `assets/images/priority-truck.jpg`    |
| `priority-ship`     | `index.html` | "Your Success" band, right side — cargo ship at port with cranes | `assets/images/priority-ship.jpg`     |

### Image sizing recommendations

- **Hero**: 2400×1400 minimum, landscape, will be cropped to cover. Keep important content in the center.
- **Pillar cards**: 1200×800 (3:2). Subject should read well at 240px tall.
- **Priority band**: 1400×800 (16:9-ish). Both sides have gradient fade toward the center, so subjects should sit toward the outer edges.

### Product cards

Currently the four product cards (Soybean Oil, Wheat & Soy Grains, Molasses, Various Grains) use inline SVG illustrations on gradient backgrounds — not stock photos. If the client has product photography, these can also be swapped. Search for `.product-card .visual` in `index.html`.

---

## 2. Contact form — wired

The contact form (`contact.html`) submits via `fetch('/api/contact', …)` to a Vercel Serverless Function at `api/contact.js`. The function:

1. Validates required fields and email format.
2. Maps the `subject` dropdown value to a readable label.
3. Sends an HTML + plain-text email through Resend with `reply_to` set to the inquirer.
4. Returns `200 { ok: true, delivered: true }` on success, `502` if delivery fails.

If `RESEND_API_KEY` is not set, the endpoint still returns success but only logs the inquiry to Vercel function logs (`delivered: false`). That lets you ship the site immediately and add the key later.

**Form payload** (POST body):

```js
{
  name: string,     company: string,  email: string,
  subject: string,  // sourcing | supply | logistics | partnership | press | other
  message: string
}
```

**Environment variables (set on Vercel → Project → Settings → Environment Variables):**

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | yes (for live email) | Get one at https://resend.com/api-keys |
| `CONTACT_TO_EMAIL` | optional | Defaults to `info@patagoniaamericas.com` |
| `CONTACT_FROM_EMAIL` | optional | Defaults to `onboarding@resend.dev` (works for first-deploy testing). For production, verify your own domain in Resend and use e.g. `Patagonia Americas <noreply@patagoniaamericas.com>` |

**Hardening options to consider later**: honeypot field, hCaptcha / reCAPTCHA, rate limiting (`@vercel/kv` or middleware), confirmation email back to the submitter, persisting submissions to a sheet or DB, GDPR notice for EU traffic.

---

## 3. Brand assets

These are baked into CSS variables at the top of each HTML file under `:root`. To change globally, update both files in sync — or extract to a shared `styles.css`.

### Colors

```css
--ink:      #0c1614;   /* near-black, primary text */
--forest:   #0f2922;   /* primary dark brand color */
--forest-2: #14342c;   /* dark variation */
--forest-3: #1a3d34;   /* lighter forest */
--brass:    #b8954a;   /* primary accent (gold/brass) */
--brass-2:  #d4b683;   /* lighter brass */
--brass-3:  #8a6e36;   /* darker brass */
--cream:    #f6f1e8;   /* light text on dark, light surfaces */
--paper:    #fbf8f2;   /* main background */
--line:     #e8e1d2;   /* dividers */
--muted:    #5a6360;   /* secondary text */
```

### Typography

- **Display**: Fraunces (variable, opsz axis used 9-144). Italic gold accents on key words.
- **Body**: Instrument Sans (weights 400, 500, 600).

### Logo

The logo is an inline SVG (globe with grid lines) inside each page. To replace with the client's real vector logo, search for `class="logo-mark"` — there are 3 locations total across the two files (nav + footer in `index.html`, nav in `contact.html`).

### Real contact info already wired in

- 2300 Glades Road, Suite 312 W, Boca Raton, FL 33431
- (561) 410-7750
- info@patagoniaamericas.com

---

## 4. Suggested prompts for Claude Code

Drop the folder into Claude Code and try these:

> "I've added my own images to `assets/images/`. Replace all the `IMAGE_SWAP` placeholders in `index.html` with my local images using the keys from the README inventory."

> "Wire up the contact form in `contact.html` to post to a backend at `/api/contact`. Add proper error handling, a loading state, and show an error message if the request fails. Look for the `FORM_SUBMIT` markers in the file."

> "Extract the duplicated CSS in `<style>` blocks across `index.html` and `contact.html` into a single shared `styles.css`."

> "Add an Instagram / LinkedIn icon row to the contact-brand panel on the contact page, matching the existing brass icon style."

> "Make the site multilingual (English / Spanish) with a language toggle in the nav."

---

## 5. Running locally

No build step. Just open `index.html` in a browser, or serve the folder:

```sh
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

The form's `fetch('/api/contact')` call will fail locally with a Python or `serve` static server because nothing handles `/api/*`. To test the function end-to-end on your machine, install Vercel CLI and run `vercel dev` instead:

```sh
npm i -g vercel
vercel dev
```

`vercel dev` serves the static files **and** runs the function from `api/contact.js`.

---

## 6. Deploying to Vercel

The repository is set up so you can push to GitHub, import on Vercel, and ship without extra build steps.

### One-time: push to GitHub

```sh
cd patagonia-website
git init
git add .
git commit -m "Initial commit"
gh repo create patagonia-website --private --source=. --push
# or, without the gh CLI:
# git remote add origin git@github.com:<your-user>/patagonia-website.git
# git push -u origin main
```

### Import on Vercel

1. Go to https://vercel.com/new and import the GitHub repo.
2. Framework preset: **Other** (Vercel will auto-detect the static files + `/api` function).
3. Build & Output settings: leave defaults — no build command needed.
4. After the first deploy, go to **Project → Settings → Environment Variables** and add:
   - `RESEND_API_KEY` (Production, Preview, Development)
   - Optional: `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
5. Trigger a redeploy (push any commit, or hit **Redeploy** in the dashboard) so the function picks up the env vars.

### Verifying after deploy

- `https://<your-app>.vercel.app/` — landing page loads.
- `https://<your-app>.vercel.app/contact.html` — form renders.
- Submit a test inquiry. Watch **Vercel → Project → Logs → /api/contact** for the request. If `RESEND_API_KEY` is set, the recipient inbox receives the email. If not, you'll see `[contact] RESEND_API_KEY not set` in the logs.

### Connecting a custom domain

In **Project → Settings → Domains**, add `patagoniaamericas.com` (or whichever) and follow the DNS instructions Vercel shows.

---

## 7. Live components (added in the redesign)

### Hero cross-fading slideshow
- 5 Unsplash-hotlinked images, 7-second cross-fade interval, pauses on hover, paginated dots.
- First image loads `eager` with `fetchpriority="high"` so the LCP element paints fast.
- Each `<img>` has an `onerror` fallback to `assets/images/hero.jpg`, so a broken Unsplash URL never leaves the hero blank.
- Disabled under `prefers-reduced-motion` — shows slide 1 only.
- To swap in client photography, replace the 5 `src` attributes inside `<div class="hero-slides">` in `index.html`.

### TradingView live ticker
- Embedded via the official free `embed-widget-ticker-tape.js` script. No API key required.
- Symbols configured inline in `index.html` near the `<div class="ticker-shell">`: ZL1!, ZS1!, ZW1!, ZC1!, SB1!, USDBRL, USDARS, BDI.
- To change symbols, edit the JSON inside the embed `<script>` block.
- Under `prefers-reduced-motion`, the widget is hidden and the `.ticker-fallback` static list is shown instead.

### Interactive world map
- Pure inline SVG (`<svg class="world-map">`) — stylized continent outlines, 4 destination hubs (Rotterdam, Qingdao, Jebel Ali, Singapore), 3 origin hubs (US Midwest, Brazil, Argentina), and 5 animated trade arcs.
- Arcs draw with `stroke-dashoffset` over a 5-second loop, staggered. Hubs pulse with a `transform: scale()` keyframe (not the SVG `r` attribute — Safari compatibility).
- Heading copy is bilingual via `data-i18n` spans. Located between `.who` and `.cta-strip`.

### Animated stat counters
- Each `.stat` in the stats band carries a `.stat-count[data-target]` span. The existing IntersectionObserver was extended to also kick off `animateCount()` and add a `.counted` class that draws a 44px brass underline.
- Pull a stat number by editing `data-target` and the suffix `<em>` separately.
- Under `prefers-reduced-motion`, counters jump straight to their final value.

### EN / ES language toggle
- CSS-driven swap on `<html data-lang>`. Every translatable text node has two adjacent siblings: `<span data-i18n="en">…</span><span data-i18n="es">…</span>`. CSS hides the wrong one.
- Toggle controls: nav (`.lang-toggle`) and footer (`.lang-toggle.footer-lang`). Selection is persisted in `localStorage` under key `pa-lang`.
- Contact-page form `<option>` text and the `<textarea>` placeholder can't use child spans, so they are translated dynamically via `data-i18n-en` / `data-i18n-es` attributes and the `setLang()` function in `contact.html`.
- Form error message and submit-button label are also language-aware (see `I18N` map in `contact.html`).
- To add a new locale (say PT): add a `data-i18n="pt"` sibling everywhere, add a `pt` button to both `.lang-toggle`s, extend the `I18N` map, and add `html[data-lang="pt"] [data-i18n!="pt"] { display: none; }` CSS rules.

### Scrollspy + active nav link
- Implemented inside the existing rAF-throttled `onScroll` handler. It computes the active in-page section based on whether its top has passed 35% of the viewport, and toggles `.active` on the matching nav link (brass underline + cream color).

### OpenStreetMap embed (contact page)
- Static iframe (`https://www.openstreetmap.org/export/embed.html`). No key, no quota, no tracker. Bbox + marker pointing at the Boca Raton HQ.
- Subtle `filter: grayscale + sepia` muting by default; clears on hover for visual interest.
- "View larger map" link opens the full OSM map in a new tab.

### WhatsApp CTA (contact page)
- `.wa-cta` pill inside the phone `.detail` block, opens `https://wa.me/15614107750`.
- Bilingual label, official WhatsApp green (`#25D366`).

### Accessibility hardening
- Global `:focus-visible` outline using `var(--brass)`.
- Global `@media (prefers-reduced-motion: reduce)` block disables all infinite animations and reveal transitions in both files.
- Every below-the-fold `<img>` carries `loading="lazy" decoding="async"`. Hero slide 1 explicitly opts into `loading="eager" fetchpriority="high"` for LCP.

### Verifying the redesign locally
1. `python3 -m http.server 8000` (or `vercel dev`).
2. Open `http://localhost:8000/`.
3. Hero should cross-fade through 6 frames (5 Unsplash + 1 owner photo `wp-port-cranes.jpg`); hover to pause; click a dot to jump.
4. Ticker strip below the hero shows live prices from TradingView.
5. Scroll to the stats band — numbers count up 0→target with easeOutCubic, then the gold underline draws in.
6. Hover any product card — image scales 1.05, brass top bar wipes in, descriptor slides up from the bottom.
7. Continue scrolling to the trade map — gold arcs draw and fade between origin and destination hubs on a loop.
8. Click the EN / ES toggle in the nav (or footer on mobile). Reload to confirm persistence.
9. Open `/contact.html`. Tab through form fields; brass underline + brass focus ring appears. Click "Chat on WhatsApp". The OSM map loads under the address.
10. Submit a test inquiry — inline success state shows with no redirect.
11. DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" — verify slideshow stops on slide 1, ticker falls back to static text, counters jump to final values.

---

## 8. Dream Portal expansion (WordPress fusion)

Layered on top of §7. Brings the institutional depth of the owner's WordPress (Astra Theme) into the Vercel site.

### New sections in `index.html`
After `.who` and before `.trade-map`:
- **`.strategic` (Strategic Positioning)** — two-column block: institutional copy on the left + `assets/images/sacos.png` (Control Union certified jute sacks) on the right with an overlay caption. Below: 3 cards (Long-Term Partnership Focus / Scalable Execution Platform / Institutional Approach), each with a brass icon and brass top-bar wipe on hover. Links to `about.html` via "Read Our Full Approach".

After `.trade-map` and before `.cta-strip`:
- **`.ops-banner`** — full-width transitional banner using `assets/images/wp-grains-mosaic.jpg` with forest gradient + heading "Successful commodity transactions require far more than pricing alone."
- **`.flow-diagram` (Global Supply + Local Execution)** — dark forest section with an inline SVG diagram: three nodes (International Partner → Patagonia Americas → Industrial Clients) joined by animated brass arcs (reuse of the trade-map keyframes `hub-pulse`, `arc-draw`, plus a new `ring-pulse`). Bilingual node labels.
- **`.ops-capabilities`** — black band with a 3×2 grid of 6 tiles (Operational Coordination · Supplier Alignment · Logistics Management · Customer Responsiveness · Documentation Discipline · Market Adaptability), each with a brass icon and short copy.
- **`.growth` (Built for Long-Term Growth)** — closing band immediately before `.cta-strip`, using `wp-grains-mosaic.jpg` as a low-opacity background and the verbatim WP quote about durability.

### Product grid expansion (`.product-grid.product-grid-6`)
Refactored from 2×2 to 3×2 (desktop): Soybean Oil, Wheat, Corn, Sorghum, Cane & Beet Molasses, Sugar. Each card carries the same hover overlay pattern (Origin · Key Markets · Grades/Use). New product images for Corn / Sorghum / Sugar are Unsplash hotlinks with `onerror` fallback to `assets/images/wp-grains-mosaic.jpg`.

### `about.html` (new page)
Dedicated About page with the full WordPress depth. Sections, top to bottom:
1. Hero — `wp-port-cranes.jpg` as background, "Building reliable commercial bridges across global markets."
2. **Our Company Philosophy** — African proverb + 2 paragraphs + a pulled quote with brass left-border, paired with `wp-grains-mosaic.jpg`.
3. **Strategic Positioning** — 2 paragraphs from the WP + the same 3 strategic cards (LTPF / SEP / IA).
4. **Our Business Model** — the SVG flow diagram (same component as `index.html`).
5. **Proven Market Experience** — long prose with two sub-headings (Global Agribusiness Relationships, Operational Execution Capability), the 6-item bullet list of execution capabilities, and a 3-image grid (port cranes + grains mosaic + sacos).
6. **Why Local Coordination Matters** — 4 cards (Commercial Relationships / Operational Adaptability / Documentation & Process Coordination / Customer & Market Intelligence), each with a brass icon.
7. **Closing** — "Built for Long-Term Growth" + CTA to `contact.html`.

The page mirrors the header / nav / footer of `contact.html`, copies the design tokens block, and ships its own short script for the IntersectionObserver-based reveal animations + the EN/ES language toggle.

### Nav-link wiring
"About Us" / "Nosotros" in **all three pages** now points to `about.html` (previously pointed to `#about` in `index.html`, which is now superseded). The scrollspy in `index.html` is unaffected — it only picks up in-page anchors (`href^="#"`), so the cross-page link is ignored cleanly.

### Owner-provided imagery
Three local assets dropped into `assets/images/`:
- **`sacos.png`** (3.4 MB) — Control Union certified jute sacks in warehouse. Used as the protagonist of `.strategic` (right column) and inside the about-experience tri-image grid. Marked `loading="lazy"` + `decoding="async"`. A future optimization pass should convert to WebP and resize down — see `IMAGE_OPTIMIZE[sacos]` consideration.
- **`wp-port-cranes.jpg`** — bulk carrier at dusk beneath port cranes. Inserted as slide #2 in the homepage slideshow and as the hero background of `about.html` + the closing band of `about.html`.
- **`wp-grains-mosaic.jpg`** — grain portfolio mosaic. Banner of `.ops-banner`, the about-philosophy right column, and the about-experience tri-image grid.

### EN / ES coverage
- `index.html` data-i18n span count: **~272** (was ~152 in §7 baseline).
- `about.html` data-i18n span count: **~146** — same `setLang()` pattern, persists in `localStorage.pa-lang`, mirrored in the footer toggle.
- The toggle in the nav is hidden on mobile (≤880px) for all three pages; the mirrored footer toggle stays visible.

### Verifying the dream-portal expansion
1. `python3 -m http.server 8000` → open `http://localhost:8000/`.
2. Scroll past Who We Are → Strategic Positioning appears (sacos.png on the right with "CONTROL UNION CERTIFIED" badge, 3 institutional cards below).
3. Continue scrolling past Global Flow → Operational Execution banner (wp-grains-mosaic) → flow diagram with brass arcs drawing between 3 hubs → 6-tile capability grid.
4. Built for Long-Term Growth appears just above the CTA strip, with the wp-grains-mosaic background at 18% opacity.
5. Product grid is now 3×2 (Soybean Oil, Wheat, Corn, Sorghum, Cane Molasses, Sugar). Hover any card → image scales, brass top accent wipes in, descriptor (Origin / Key Markets / Grades or Use) slides up.
6. Open `/about.html` — hero with wp-port-cranes, then the 6 sections render. Toggle EN/ES; reload — preference persists across pages.
7. From the homepage nav, click "About Us" → lands on `about.html`. The active state in the about nav is on the About Us link.
