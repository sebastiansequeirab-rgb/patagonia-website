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
| `hero`              | `index.html` | Hero background (port / container terminal aerial) | `assets/images/hero.jpg`              |
| `hero-preload`      | `index.html` | JS preload of the same image — keep in sync with `hero` | (same file)                           |
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
