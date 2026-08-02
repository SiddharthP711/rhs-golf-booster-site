# Ravens on the Green

Website for Ravens on the Green — RHS Golf Booster Club charity golf outing fundraiser.

Single-page static site, self-contained in one file (HTML + inline CSS + inline JS, no
build step). Promotes the annual Charity Golf Outing Fundraiser (October 5, 2026 at
Cream Ridge Golf Course) and lets visitors register as a golfer, sponsor, or booster
through a Zeffy-style cart/checkout flow — green/light-green/white palette with small
yellow/red accent hints.

## Structure

```
index.html              Everything — markup, styles, and script in one file
assets/raven-logo.png   Real RHS raven mascot logo
assets/zelle-qr.png     Real Zelle QR code, extracted and verified from the printed flyer
```

## Local preview

No build step — just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
```

## Before you launch — required setup

1. ~~Wire up the registration/sponsorship form (Formspree)~~ — **done.** `index.html`
   points to the real endpoint `https://formspree.io/f/xrenwrjb`, verified end-to-end
   (test submissions returned Formspree's real `{"ok":true}` success response).
   - **One thing to check:** those test submissions landed in Formspree's **Spam** tab
     rather than the inbox, so no email arrived. This is almost certainly because the
     tests were repeated identical text from `localhost` with a placeholder email — a
     classic spam signature — not a sign anything is broken. Once live on your real
     domain, set **"Restrict to domain"** in the form's Formspree settings (this reduces
     false positives) and do one real test submission from the live site to confirm it
     lands in the inbox. Worth glancing at the Spam tab occasionally either way, since
     Formspree won't email you about anything flagged there.

2. ~~Confirm sponsor/booster benefit bullet points~~ — **done.** The "More details"
   accordion, the booster tier one-liners, and the booster intro blurb use the exact
   wording from `Ravens on the Green Golf Tournament 2026.pdf`. The sponsor
   logo-submission field also points to the specific email printed on that form,
   **Misshollyafd@gmail.com** — double-check that address is correct/current, since
   it's different from the club's general `ravensonthegreen@gmail.com`.

3. ~~Drop in the real Zelle QR code~~ — **done.** Extracted directly from the flyer PDF,
   saved as [`assets/zelle-qr.png`](assets/zelle-qr.png), and verified it decodes to the
   real Zelle enrollment link for "Ravens on the Green Inc" (token `ravensonthegreen`).

4. **Swap in real photography (optional)**
   - The hero currently uses a CSS gradient/pattern by design, no photo. Add one if you
     have real event/course photography licensed for use.

## Deployment

Deploys to [Vercel](https://vercel.com) with zero configuration — it's a static site, so
just import the GitHub repo in Vercel and it will detect and deploy `index.html` as-is.

## Content notes

- All dollar amounts and deadlines (Sept 1 sponsorship deadline, Sept 21 registration
  deadline, Oct 5 event date) come directly from the club's spec — don't round or change
  them without checking with the club.
