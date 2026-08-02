# Ravens on the Green

Website for Ravens on the Green — RHS Golf Booster Club charity golf outing fundraiser.

Static site (plain HTML/CSS/JS, no build step). Promotes the annual Charity Golf
Outing Fundraiser (October 5, 2026 at Cream Ridge Golf Course) and lets visitors register as a
golfer, sponsor, or booster through a Zeffy-style cart/checkout flow.

Two page versions exist side by side — pick one to actually deploy, or keep both:

- **`index.html`** — original forest-green design, multi-section layout, cart split out into `css/styles.css` + `js/main.js`.
- **`landing.html`** — newer green/light-green/white design with yellow/red accent hints, single self-contained file (styles + script inline), same cart/checkout functionality merged in.

## Structure

```
index.html      Forest-green version — all page markup/sections
landing.html    Green/gold-accent version — self-contained (inline CSS + JS)
css/styles.css  Design tokens + styles for index.html
js/main.js      Tier data, cart logic, countdown, accordion, nav toggle, form validation + submit — for index.html
assets/raven-logo.png  Real RHS raven mascot logo, used in both versions
```

## Local preview

No build step — just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
```

## Before you launch — required setup

1. ~~Wire up the registration/sponsorship form (Formspree)~~ — **done.** Both
   `js/main.js` (for `index.html`) and the inline `<script>` in `landing.html` point to
   the real endpoint `https://formspree.io/f/xrenwrjb`, verified end-to-end (test
   submissions returned Formspree's real `{"ok":true}` success response).
   - **One thing to check:** those test submissions landed in Formspree's **Spam** tab
     rather than the inbox, so no email arrived. This is almost certainly because the
     tests were repeated identical text from `localhost` with a placeholder email — a
     classic spam signature — not a sign anything is broken. Once live on your real
     domain, set **"Restrict to domain"** in the form's Formspree settings (this reduces
     false positives) and do one real test submission from the live site to confirm it
     lands in the inbox. Worth glancing at the Spam tab occasionally either way, since
     Formspree won't email you about anything flagged there.

2. ~~Confirm sponsor/booster benefit bullet points~~ — **done.** The "More details"
   accordion, the booster tier one-liners, and the booster intro blurb now use the
   exact wording from `Ravens on the Green Golf Tournament 2026.pdf`. The sponsor
   logo-submission field also points to the specific email printed on that form,
   **Misshollyafd@gmail.com** — double-check that address is correct/current, since
   it's different from the club's general `ravensonthegreen@gmail.com`.

3. ~~Drop in the real Zelle QR code~~ — **done.** Extracted directly from the flyer PDF,
   saved as [`assets/zelle-qr.png`](assets/zelle-qr.png), and verified it decodes to the
   real Zelle enrollment link for "Ravens on the Green Inc" (token `ravensonthegreen`).

4. **Swap in real photography (optional)**
   - `index.html`'s hero/about sections use an illustrated SVG golf-course scene instead
     of a photo. Swap `.hero-bg svg` for a real background photo if you have one licensed
     for use. `landing.html`'s hero is a CSS gradient/pattern by design (no photo).

## Deployment

Deploys to [Vercel](https://vercel.com) with zero configuration — it's a static site, so
just import the GitHub repo in Vercel and it will detect and deploy `index.html` as-is.

## Content notes

- All dollar amounts and deadlines (Sept 1 sponsorship deadline, Sept 21 registration
  deadline, Oct 5 event date) come directly from the club's spec — don't round or change
  them without checking with the club.
