# Patagonia Americas — Website Redesign Spec

> Master brief for Claude Code. Read this file in full before making any changes.
> Work in phases (see §15). After each phase, stop and request review.

---

## 1. Context

You are redesigning the Patagonia Americas website (currently live at `patagonia-website.vercel.app`). It is a static multi-page site (`index.html`, `about.html`, `contact.html`) hosted on Vercel.

The site must remain:
- Fully **bilingual** (EN/ES) — every existing text node has both languages. Preserve this mechanism exactly. Do not break the toggle.
- **Multi-page** structure intact. This spec focuses on `index.html`. After homepage is approved, apply the same design system to `about.html` and `contact.html`.
- **Static** — do not migrate to a framework unless explicitly approved later. Vanilla HTML/CSS/JS only.

---

## 2. Design North Star

**Concept:** "Quiet Authority."

The site must feel like the beautifully designed annual report of a 100-year-old trading house — editorial, cinematic, confident without shouting. Reference quality bar: Patagonia.com (the apparel brand), Hermès Finance, The Carlyle Group, Cargill premium pages.

Three principles, in order of priority:
1. **Air is luxury.** Generous spacing always wins over density.
2. **One protagonist per section.** Either an image, a number, or a headline — never three competing focal points.
3. **Restraint over decoration.** Subtle motion, never flashy. No parallax tricks, no animated gradients, no glitter.

---

## 3. Design System (tokens)

Implement these as CSS custom properties at the top of the global stylesheet.

### Colors
```css
--color-bg-primary: #1F2D24;      /* deep forest green — main dark background */
--color-bg-secondary: #2D3F33;    /* medium green — secondary dark sections */
--color-bg-cream: #F5EDD8;        /* warm cream — light sections */
--color-bg-cream-soft: #FAF5E8;   /* softer cream — subtle alternation */
--color-accent-gold: #C8A865;     /* gold accent — italic display, CTAs */
--color-accent-gold-bright: #D9B978; /* gold hover */
--color-text-dark: #1A1F1A;       /* primary text on cream */
--color-text-dark-muted: #4A5248; /* secondary text on cream */
--color-text-light: #F5EDD8;      /* primary text on dark (cream) */
--color-text-light-muted: rgba(245, 237, 216, 0.72); /* secondary text on dark */
--color-border-subtle: rgba(245, 237, 216, 0.12);
--color-border-gold: rgba(200, 168, 101, 0.4);
```

### Typography
Use exactly **two** font families. Load from Google Fonts or Adobe Fonts.

```css
--font-display: 'Cormorant Garamond', 'GT Sectra', Georgia, serif; /* italics carry the brand */
--font-body: 'Inter', 'GT America', system-ui, sans-serif;
```

Type scale (desktop; mobile scales down with `clamp()`):

| Token | Use | Size | Weight | Line-height |
|---|---|---|---|---|
| `--fs-display-xl` | Hero H1 | `clamp(56px, 7vw, 104px)` | 400 | 1.02 |
| `--fs-display-lg` | Section H2 | `clamp(40px, 5vw, 72px)` | 400 | 1.05 |
| `--fs-display-md` | Subsection H3 / pull quote | `clamp(28px, 3.5vw, 44px)` | 400 | 1.15 |
| `--fs-stats` | Stats numbers | `clamp(72px, 10vw, 160px)` | 400 | 1.0 |
| `--fs-body-lg` | Lead paragraph | 20px | 400 | 1.55 |
| `--fs-body` | Body | 17px | 400 | 1.6 |
| `--fs-body-sm` | Captions, meta | 14px | 400 | 1.5 |
| `--fs-eyebrow` | Section eyebrows | 12px | 500 | 1.2 (tracking: 0.18em, uppercase) |

Rules:
- **Italics = display serif italic only.** Never italicize body sans.
- Bold is forbidden in headlines — use scale, not weight.
- Body text never below 16px on mobile, 17px on desktop.
- Avoid all-caps except for eyebrows.

### Spacing
```css
--space-section-y: clamp(96px, 12vw, 160px); /* vertical padding between sections */
--space-block-y: clamp(48px, 6vw, 80px);     /* between blocks within a section */
--space-container: clamp(24px, 5vw, 88px);   /* horizontal page padding */
--container-max: 1440px;                      /* max content width */
--container-narrow: 880px;                    /* for prose-heavy blocks */
```

### Motion
```css
--ease: cubic-bezier(0.22, 1, 0.36, 1);    /* primary easing */
--ease-slow: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast: 200ms;
--duration-base: 400ms;
--duration-slow: 800ms;
```

Animation rules:
- All entrance animations: fade-in + 16px translate-up, staggered 80ms between sibling elements, triggered by `IntersectionObserver` at 15% visibility.
- All hover transitions: 200ms with `--ease`.
- Honor `prefers-reduced-motion: reduce` — disable all entrance and ambient animations, keep instant state changes only.
- No infinite loops except the logo marquee (§5) and hero subtle zoom (§4).

### Borders & elevation
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--shadow-card: 0 12px 32px -16px rgba(0, 0, 0, 0.25);
--shadow-card-hover: 0 24px 48px -20px rgba(0, 0, 0, 0.35);
```

---

## 4. SECTION — Hero (priority section)

**This is the section the owner cares most about. Spend extra time here.**

### Layout
- Two-column on desktop. Left column: text (38% width). Right column: image (62% width).
- The image must visually breathe — **no overlay covers the image area itself.**
- On viewports below 1024px, stack: text on top, image below (image at 70vh).
- On viewports below 640px, collapse to single column with text overlaid on image (with full gradient).

### Text column (left)
- Vertically centered.
- Background: full-bleed vertical gradient applied **only to the left 45% of the viewport** — `linear-gradient(90deg, rgba(31,45,36,0.92) 0%, rgba(31,45,36,0.72) 60%, rgba(31,45,36,0) 100%)`. This protects the text without darkening the right image area.
- Content order:
  1. Eyebrow: `International Commodity Trading` / `Comercio Internacional de Materias Primas` — gold color, `--fs-eyebrow`.
  2. Headline H1: "Global Commodities. *Reliable Solutions.*" — display serif, `--fs-display-xl`, cream. The italic part is gold (`--color-accent-gold`).
  3. Lead paragraph — `--fs-body-lg`, `--color-text-light-muted`, max-width 480px.
  4. CTA button: "Start a Conversation" / "Iniciar una Conversación" — solid cream background, dark green text, `padding: 18px 32px`, `border-radius: 2px`, no border. Hover: background shifts to gold-bright with 200ms transition.

### Image column (right)
- Use the existing `assets/images/hero.jpg`.
- `object-fit: cover; object-position: center right;`
- Apply a slow Ken Burns effect: 20-second linear loop, scale 1.0 → 1.04 → 1.0, ease-in-out. Pause on `prefers-reduced-motion`.
- No filter, no overlay, no vignette on the image itself.

### Scroll indicator
- Position: bottom center of the viewport, 32px from bottom.
- A vertical 1px line, 40px tall, color `--color-text-light-muted`.
- A small dot (4px) traveling top → bottom along the line in a 2.4s loop with ease.
- No text label. No "Scroll to Explore" copy.

### Top navigation
- Position: `fixed; top: 0;`
- Initial state: fully transparent background, no border. White-cream text.
- After scrolling 80px: background `rgba(31, 45, 36, 0.92)` with `backdrop-filter: blur(12px)`, bottom border `1px solid var(--color-border-subtle)`. Transition 300ms.
- Logo left, nav links center-right, EN/ES toggle far right, then a compact CTA button.
- Logo: if SVG is available, use it inline. Render at 28px height. Make sure it's legible on both transparent and solid states.
- Nav links: `--fs-body-sm`, letter-spacing 0.04em, color cream-muted. Active page: cream solid + 1px gold underline 2px below baseline.

### Acceptance criteria
- [ ] Owner's request honored: text is left-aligned, the right portion of the image is fully visible without overlay.
- [ ] Gradient only on left portion — image clarity preserved on right.
- [ ] Hero is exactly 100vh on desktop (min-height: 720px).
- [ ] CTA visible above the fold without scrolling.
- [ ] Both EN and ES versions present in DOM and toggle correctly.
- [ ] Lighthouse mobile Performance ≥ 85, LCP < 2.5s.

---

## 5. SECTION — Trusted Partners Strip

Replaces the current chaotic logo row directly below the hero.

### Layout
- Full-bleed dark band (`--color-bg-primary`), 88px tall on desktop.
- Eyebrow above the logos (centered): `Trusted partners across global markets` / `Socios de confianza en mercados globales` — `--fs-eyebrow`, gold.
- Logos in a single horizontal row, marquee-style infinite scroll, **rightward to leftward**, speed: 60s per loop.
- Pause on hover.
- All logos rendered in single-color cream at 55% opacity. Normalize visual sizes (max-height: 28px each, with optical adjustments per logo).
- Min 64px horizontal spacing between logos.
- Use the existing logos from the current site — preserve the same set, just restyle them.

### Acceptance criteria
- [ ] Logos legible against dark background.
- [ ] Marquee pauses cleanly on hover (no stutter).
- [ ] Honors `prefers-reduced-motion` — falls back to static row.

---

## 6. SECTION — Integrated Solutions. Proven Results.

### Layout
- Background: `--color-bg-cream`.
- Eyebrow centered: `What We Do` / `Lo Que Hacemos`.
- Section heading: "Integrated Solutions. *Proven Results.*" — `--fs-display-lg`, centered, max-width 880px.
- Three-column grid below. Columns equal width. Gap: 48px.

### Each column
- **Image** at top, aspect ratio 4/5 (vertical, not horizontal as currently). Use existing assets: `pillar-global.png`, `pillar-logistics.png`, `pillar-commitment.jpg`.
- Custom monoline SVG icon, 32px, gold, below the image with 24px margin.
- H3 heading, `--fs-display-md` scaled down to 28px, dark text.
- Paragraph: `--fs-body`, `--color-text-dark-muted`, max 4 lines.

### Custom icons (create as inline SVGs)
- Global Reach: a simplified globe with longitude lines + a single connecting arc.
- Logistics Excellence: a stylized container/ship silhouette with a directional arrow.
- Commitment to You: a handshake or interlocking-rings motif.
All 1.5px stroke, no fill, rounded line-caps, gold color.

### Acceptance criteria
- [ ] Images vertical (4/5), not horizontal.
- [ ] Custom SVG icons inline, not from a library.
- [ ] Columns collapse to single-column on mobile (gap reduces to 64px).

---

## 7. SECTION — Premium Commodities. Global Demand.

This section is the strongest in the current site. **Refine, do not reinvent.**

### Layout
- Background: `--color-bg-primary` (deep green).
- Eyebrow: `Our Products` / `Nuestros Productos` — gold.
- Heading: "Premium Commodities. *Global Demand.*" — cream + gold italic.
- Lead paragraph below heading, `--fs-body-lg`, `--color-text-light-muted`, max-width 720px, centered.

### Product grid
- 3 columns × 2 rows, gap 24px.
- Each card: aspect ratio 4/5, image full-bleed inside the card.
- Bottom label strip on each card: white background, dark text, `--fs-body` weight 500, padding 16px 20px, with the product name + a small gold underline that animates in on hover.

### Hover interaction (NEW — the data already exists in your HTML)
- On hover: image scales to 1.04 (400ms), and a **dark cream overlay** slides up from the bottom showing the product metadata that is already in the existing HTML markup (Origin / Key Markets / Grades or Use).
- Layout of the hover detail:
  ```
  Origin / Origen          → Argentina · Brazil
  Key Markets / Mercados   → China · EU · India
  Grades / Calidades       → Crude · Degummed · Refined
  ```
- Each row: label in gold eyebrow style, value in cream body.
- The currently visible labels above each image in the live site should be **moved into this hover state** — they are clutter on the default view.

### Acceptance criteria
- [ ] Default view shows only product image + name. No metadata visible by default.
- [ ] Hover reveals full product detail card sliding up.
- [ ] Touch devices: tap reveals overlay; tap again to dismiss.
- [ ] All existing product data (origins, markets, grades) preserved in DOM for both EN and ES.

---

## 8. SECTION — Stats

Replaces the current small-numbers strip. **The numbers are the star.**

### Layout
- Background: `--color-bg-secondary` (medium green).
- Full-bleed band, vertical padding `--space-section-y`.
- Single horizontal row with 4 stats, equal columns.
- Vertical 1px hairline dividers in `--color-border-gold` between stats.

### Each stat
- **Number**: `--fs-stats` (huge, 100-160px), display serif, gold color, with the existing prefix/suffix preserved:
  - `25+` Countries Served / Países Atendidos
  - `500K MT` Annual Volume / Volumen Anual
  - `15+` Years of Expertise / Años de Experiencia
  - `100%` Client Commitment / Compromiso con el Cliente
- The suffix (`+`, `K MT`, `%`) is italic display serif, 60% the size of the number, with letter-spacing 0.
- **Label** below: `--fs-eyebrow`, cream-muted.

### Count-up animation
- On scroll into view (15% visibility), animate from 0 to the target value over 1600ms with `--ease`.
- For `500K MT`: animate the `500` portion only.
- For `100%`: animate `0 → 100`.
- Disabled under `prefers-reduced-motion` — show final values immediately.

### Acceptance criteria
- [ ] Numbers visually dominant — at least 8× the size of the labels.
- [ ] Count-up triggers exactly once per page load.
- [ ] Bilingual labels work correctly.

---

## 9. SECTION — Your Success. Our Priority. (REMOVE)

**Remove this section entirely from `index.html`.** It breaks the rhythm with a redundant message and a busy truck image that fights the rest of the site.

The sentiment ("Dependable service. Sharper market insight...") can be relocated as a small caption inside the Hero or merged with §13 "Durability is built through trust" as a supporting paragraph. Decide where it reads best after the rest is done.

---

## 10. SECTION — Who We Are + Pull Quote

### Layout
- Background: `--color-bg-cream`.
- Two-column asymmetric grid: left 58%, right 42%. Gap: 96px.

### Left column
- Eyebrow: `About Patagonia Americas`.
- H2: "Who We Are" / "Quiénes Somos" — `--fs-display-lg`.
- First sentence of the paragraph styled as **lead** (`--fs-body-lg`, slightly darker, 1.45 line-height).
- Rest of paragraph in `--fs-body`.
- CTA: "Learn More About Us →" — outlined button with 1px gold border, gold text, transparent background. On hover: background fills gold, text becomes dark green.

### Right column — pull quote
- Large gold opening quotation mark, 96px display serif, decorative, top-left.
- Quote text in display serif italic, `--fs-display-md`, dark text.
- Attribution below quote: 32px horizontal gold line + "African Proverb" / "Proverbio Africano" in `--fs-eyebrow`.
- The whole quote block: vertically centered relative to left column.

### Acceptance criteria
- [ ] Lead sentence visually distinct from body.
- [ ] Pull quote feels editorial, not like a card.
- [ ] Decorative quotation mark does not affect text alignment.

---

## 11. SECTION — Commercial Bridges + grain sacks

### Layout
- Background: `--color-bg-cream-soft`.
- Asymmetric two-column: left 50% text, right 50% image. Gap: 80px.
- The image (`sacos.png`) extends 80px beyond the right edge of the content container into the gutter (editorial magazine technique). Apply `margin-right: calc(var(--space-container) * -1);` on viewports above 1024px.

### Left text column
- Eyebrow: `Strategic Positioning`.
- H2 heading.
- Two body paragraphs.
- CTA: "Read Our Full Approach →" — same style as in §10.

### Right image
- Remove the current floating gold "View the union content" badge unless it links to actual video content. If it stays, restyle: small pill-shaped button, bottom-right of image, with a play-triangle icon.

### Three sub-cards below (full-width row)
- Three equal columns, gap 24px.
- Each card:
  - 2px top border in `--color-accent-gold`.
  - Cream background, padding 32px.
  - Small custom icon at top (24px, gold).
  - H4 title, `--fs-body-lg` weight 500.
  - Paragraph, `--fs-body-sm`, dark-muted.

### Acceptance criteria
- [ ] Image bleed effect works on desktop, collapses cleanly on mobile.
- [ ] Three sub-cards align baselines (use grid, not flex with uneven heights).

---

## 12. SECTION — From Origin to Destination (REPLACE ENTIRELY)

**This is the biggest creative lift in the spec.** The current section is a weak abstract illustration. Replace it with a real interactive world-map visualization.

### Layout
- Background: `--color-bg-primary`.
- Eyebrow: `Global Flow` / `Flujo Global`.
- H2: "From *origin* to *destination.*"
- Full-width interactive map component below the heading, height 600px desktop, 480px tablet, 380px mobile.

### Map component (build as inline SVG + JS)
- **Base map**: stylized world map (use a simple SVG world topology — no Mercator distortion artifacts in equatorial regions). Land masses in `--color-bg-secondary`, oceans in `--color-bg-primary`, country borders 0.5px in `rgba(245,237,216,0.08)`.
- **Origin points** (gold pulsing circles, 8px radius):
  - Argentina (Rosario region) — Soybean Oil, Wheat, Sorghum
  - Brazil (Santos) — Soybean Oil, Corn, Sugar, Molasses
  - USA Midwest (New Orleans gulf) — Wheat, Corn, Sorghum
  - Black Sea (Odessa) — Wheat
  - Guatemala — Molasses, Sugar
  - India — Sugar
- **Destination points** (cream circles, 6px radius, no pulse):
  - China
  - EU (Rotterdam)
  - India
  - North Africa (Casablanca/Egypt)
  - Middle East (UAE)
  - Mexico
  - Latin America (São Paulo)
- **Trade routes**: curved Bézier paths between origins and destinations, 1px gold at 30% opacity. On page load, animate each route drawing in over 1.2s with stagger 120ms.
- **Active "shipment" dot** travels along each route in a 6-second loop — small gold dot with a 12px trailing glow.
- **Hover state on origin point**: tooltip appears showing country + list of commodities sourced.
- **Hover on route**: route highlights to 100% opacity gold + 1.5px.

### Below the map
- A small legend, centered: gold dot + "Origin" / "Origen" — cream dot + "Destination" / "Destino" — both in `--fs-eyebrow`.

### Technical notes
- Build as a single self-contained component in `assets/js/origin-destination-map.js`.
- Coordinates use a simple [x, y] system in percentage of SVG viewBox — no need for real geo-projection libraries.
- Total JS payload < 12KB minified. No external dependencies.
- Fallback for `prefers-reduced-motion`: render the map static with all routes drawn, no pulsing, no traveling dots.

### Acceptance criteria
- [ ] Map renders correctly across all viewports.
- [ ] All routes visible and labeled.
- [ ] Tooltip works on hover (desktop) and tap (mobile).
- [ ] Total network cost < 25KB additional (SVG + JS).
- [ ] No layout shift on map load.

---

## 13. SECTION — Successful Commodity Transactions

### Layout
- Full-bleed background image — use `wp-grains-mosaic.jpg` with a dark overlay `rgba(31, 45, 36, 0.78)`.
- Single centered text block, max-width 880px.
- Eyebrow: `Operational Execution`.
- H2: "Successful commodity transactions require far *more than pricing alone.*" — cream + gold italic, centered.

No body paragraph, no CTA. Pure statement section.

---

## 14. SECTION — Global Supply + Local Execution

### Layout
- Background: `--color-bg-primary`.
- Eyebrow: `Our Business Model`.
- H2: "Global Supply *+ Local Execution.*"
- Below: a three-pillar **horizontal diagram**, not three floating points.

### Diagram structure
- A horizontal 1px gold line spans 80% of the container width, centered.
- Three circles sit on this line:
  - Left: `International Partner` / `Socio Internacional` — 80px diameter circle.
  - Center: `Patagonia Americas` — 110px diameter (larger to indicate central role), with a subtle gold glow halo (`box-shadow: 0 0 0 8px rgba(200,168,101,0.15)`).
  - Right: `Industrial Clients` / `Clientes Industriales` — 80px diameter.
- Inside each circle: a small custom icon (gold, 32px).
- Below each circle: name in cream `--fs-body-lg` + 1-line role description in cream-muted `--fs-body-sm`.

### Acceptance criteria
- [ ] Line visually connects the three circles — not just floating elements.
- [ ] Center circle clearly larger than the side circles.
- [ ] Collapses gracefully on mobile to a vertical stack with a vertical connecting line.

---

## 15. SECTION — Six Disciplines, One Transaction

### Layout
- Background: `--color-bg-secondary`.
- Eyebrow: `What Execution Depends On`.
- H2: "Six disciplines, *one transaction.*"
- Grid 3 cols × 2 rows desktop; 2 × 3 tablet; 1 × 6 mobile. Gap: 24px.

### Each card
- Padding: 40px.
- Cream-tinted background `rgba(245, 237, 216, 0.04)` (subtle, almost invisible).
- 1px bottom border `--color-border-subtle`, transitions to `--color-border-gold` on hover.
- Top of card: large number in display serif italic, gold, `--fs-display-md`: `01`, `02`, `03`, `04`, `05`, `06`.
- Custom monoline icon below the number, 28px, gold.
- H4 title, cream, `--fs-body-lg`.
- 2-line body, cream-muted, `--fs-body-sm`.

### Hover state
- Card lifts 4px (`transform: translateY(-4px)`).
- Border becomes gold.
- Subtle background lightens to `rgba(245, 237, 216, 0.07)`.

### Acceptance criteria
- [ ] Six discipline numbers (01-06) clearly visible.
- [ ] Grid responsive across breakpoints.

---

## 16. SECTION — Durability + Closing CTA

### Layout
- Background: `--color-bg-primary` with a subtle organic texture overlay (very faint grain-noise SVG at 8% opacity).
- Vertical padding doubled: `calc(var(--space-section-y) * 1.4)`.
- Centered single column, max-width 880px.

### Content
- Eyebrow: `Built for Long-Term Growth`.
- H2: "Durability is built through trust, *execution, and time.*" — `--fs-display-lg`, cream + gold italic.
- Pull quote below in display serif italic, `--fs-body-lg`, cream-muted, with decorative quotation marks.
- One paragraph of commitment text.
- 64px vertical space.
- **The CTA**: solid cream background, dark green text, large — padding 24px 56px, `--fs-body-lg`, label "Start a Conversation →" / "Iniciar una Conversación →". Hover: shifts to gold-bright.

### Acceptance criteria
- [ ] This section feels like the conclusion — most vertical air on the page.
- [ ] CTA is the most prominent on the entire homepage.

---

## 17. Footer

Keep all existing content (Quick Links, Contact, Follow Us, copyright, legal links) but apply the design system:
- Background `--color-bg-primary`, slightly darker than other dark sections (mix with 8% black).
- Eyebrow-style column headers in gold.
- Logo on the left, larger than nav — 40px tall.
- Address: `2300 Glades Road, Suite 312 W Boca Raton, FL 33431` — preserved exactly.
- Phone: `(561) 410-7750` — preserved.
- Email: `info@patagoniaamericas.com` — preserved.
- LinkedIn icon as small monoline SVG, gold, with a real link when available.

---

## 18. Cross-cutting requirements

### Bilingual EN/ES
- Preserve every existing dual-language text node.
- The toggle mechanism must continue to work without regression.
- Any new copy you add must include both EN and ES versions. If unsure of an ES translation, mark with `<!-- TODO ES -->` and continue.

### Accessibility (WCAG 2.1 AA minimum)
- All text contrast ratios verified — especially cream-muted on cream backgrounds (avoid) and gold on cream (verify ≥ 4.5:1; gold-bright may be needed in some contexts).
- All interactive elements: visible `:focus-visible` state with gold 2px outline + 2px offset.
- All images: meaningful `alt` attributes (current site is good here — preserve).
- Map component: keyboard navigable. Origin points reachable via Tab. Enter/Space triggers tooltip.
- `prefers-reduced-motion`: all custom animations honor it (hero zoom, count-up, route drawing, pulse, marquee).
- Skip-to-content link at the top of the page.

### Performance
- Hero image: serve as WebP with JPG fallback. Provide responsive `srcset` with breakpoints at 640w, 1280w, 1920w.
- All other images: WebP where browser supports.
- Lazy-load all images below the fold (`loading="lazy"`).
- Total JS payload across the homepage: < 50KB minified, < 18KB gzipped.
- Lighthouse targets: Performance ≥ 90 desktop / ≥ 80 mobile; Accessibility ≥ 95; Best Practices ≥ 95.
- No render-blocking resources except the critical CSS (inline the above-the-fold CSS in `<head>`).

### Browser support
- Chrome / Edge / Safari / Firefox last 2 versions.
- iOS Safari 15+. Android Chrome 100+.
- No IE11 support required.

---

## 19. Implementation phases

Work in this order. After each phase, **stop and request review before continuing.**

**Phase 1: Foundation**
- Set up the design tokens in `assets/css/tokens.css`.
- Add font loading.
- Refactor the existing CSS into logical files: `tokens.css`, `base.css`, `components.css`, `sections.css`.

**Phase 2: Hero** (the owner's priority — get this perfect)
- Implement the new hero layout with left-aligned text and unobscured right-side image.
- Implement nav scroll behavior.
- Implement scroll indicator.

**Phase 3: Logo strip + Stats**
- Both rely on dark backgrounds and shared patterns — build together.

**Phase 4: Premium Commodities hover system**

**Phase 5: Integrated Solutions + Who We Are + Commercial Bridges**

**Phase 6: Origin → Destination interactive map** (biggest creative work)

**Phase 7: Global Supply + Six Disciplines**

**Phase 8: Closing CTA + Footer**

**Phase 9: about.html + contact.html** — apply system to other pages.

**Phase 10: QA pass**
- Lighthouse audits across all pages.
- Manual accessibility audit (keyboard-only navigation, screen reader spot check with VoiceOver or NVDA).
- Cross-browser visual QA.
- Bilingual toggle regression test.

---

## 20. File structure target

```
/
├── index.html
├── about.html
├── contact.html
├── assets/
│   ├── css/
│   │   ├── tokens.css        (design system tokens)
│   │   ├── base.css          (reset, typography, helpers)
│   │   ├── components.css    (nav, buttons, cards, icons)
│   │   └── sections.css      (section-specific styles)
│   ├── js/
│   │   ├── nav.js            (scroll-aware nav)
│   │   ├── i18n.js           (EN/ES toggle — preserve existing logic)
│   │   ├── stats-counter.js  (count-up animation)
│   │   ├── product-hover.js  (product card overlays)
│   │   ├── origin-destination-map.js
│   │   └── reveal.js         (IntersectionObserver entrance animations)
│   ├── images/   (preserve existing)
│   └── fonts/    (if self-hosted)
```

---

## 21. What NOT to do

- Do not introduce a CSS framework (Tailwind, Bootstrap). Vanilla CSS only.
- Do not add a build step (Webpack, Vite). Static HTML/CSS/JS only.
- Do not add jQuery or any large JS dependency.
- Do not introduce dark/light mode toggle (out of scope).
- Do not change page URLs or break existing anchors.
- Do not remove the EN/ES toggle or change its mechanism.
- Do not add cookie banners, popups, or chatbots.
- Do not commit the Vercel `.vercel` directory or any secrets.

---

## 22. Definition of done (homepage)

The homepage is complete when:

- [ ] All 14 sections (Hero through Footer) render correctly across viewports 360px → 1920px.
- [ ] EN/ES toggle works on every section.
- [ ] Lighthouse mobile Performance ≥ 80, Accessibility ≥ 95.
- [ ] No console errors, no broken images, no layout shifts (CLS < 0.05).
- [ ] All hover/focus/active states work as specified.
- [ ] `prefers-reduced-motion` honored everywhere.
- [ ] Owner has visually approved the Hero section first, then the full page.
- [ ] Vercel preview deploy generated and shared.

---

## 23. Working agreement

- Before starting each phase, **briefly summarize what you plan to change** and wait for go-ahead.
- After completing each phase, **deploy a Vercel preview** and share the URL.
- If you're unsure about a creative call (e.g., the exact curve of a Bézier route on the map), make a reasonable default and **flag it as a decision point** in your phase summary.
- Never silently delete content. If something needs to be removed, list it in the phase summary.
- All commits use Conventional Commits format (`feat:`, `fix:`, `style:`, `refactor:`).
- Branch strategy: work on a branch named `redesign/quiet-authority`. Open a PR per phase against `main`.
