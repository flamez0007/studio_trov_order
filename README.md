# Studio TROV — Wholesale Ordering Website

Built from Flamez's hand-drawn mobile wireframe, made responsive for
mobile, tablet and desktop. Payment is by bank transfer on invoice, or by card via Paystack
(once switched on — see below). No Stripe.

The invoice (and the bank details on it) only appears after a buyer
fills in the order form and submits it. It is not shown on the shop,
collection or piece pages, or anywhere else on the site. Bank details
are in `app.js` only (the invoice rendering code) — they are NOT in
this README.

## Preview it

From this folder, run:

```sh
python3 -m http.server 8137
```

Then open http://127.0.0.1:8137/index.html in a browser.
Or open `index.html` directly — everything is local files
(`index.html` + `styles.css` + `app.js`, images in `assets/`,
fonts in `fonts/`).

## Pages (all in the one single-page site)

- **Shop** — `index.html` (default view): header with Studio TROV logo,
  Email us + Cart, Welcome hero, trade strip, Collections 1–3.
  On mobile each collection is a horizontal scroll row (as sketched);
  tablet shows a 2-column grid, desktop a 3-column grid.
- **Collection pages (3)** — from "View Collection →" under each
  collection heading on the shop page, or header nav
  "Collection pages" → 01 Modernist Form / 02 Archival Herbarium /
  03 Abstract Earth. Each has a hero image, collection intro,
  all 5 works in a grid, and Add to Cart.
- **Piece pages (15)** — click any product image or title, on the
  shop or on a collection page. Each has the large flat artwork
  + framed mockup, SKU, title, collection, description, paper/spec,
  size selector, quantity, Add to Cart, and 4 related works.
  Examples: TROV-MOD-01 Monolith and Arch I, TROV-CYA-03 Silver Dollar
  Eucalyptus III, TROV-ERTH-04 Urn & Stone Sphere IV.
- **Cart** — header Cart button, or the floating "Go to Cart" bar at
  the bottom of the page (as sketched). Edit quantities, remove items,
  delivery region, opening-minimum progress ($200).
- **Order details (checkout)** — buyer name, shop name, email, phone,
  delivery address, billing-same checkbox, delivery notes, how found.
- **Invoice** — shown only after the order form is submitted.
  Invoice number (TROV-YYYYMMDD-XXXX), invoice date, bill-to
  details, line items, subtotal, delivery, TOTAL in USD, and
  two payment choices:
  1. Bank transfer (USD) with the Grey USD bank details and
     the invoice number as payment reference.
  2. Pay by card via Paystack (Paystack Inline, USD, amount =
     total × 100, email = buyer's email, ref = invoice number).
     NOT live yet — see "Paystack" below.
  Actions: Print / Download invoice, Copy payment details,
  Email this invoice to Studio TROV (mailto:
  thestudiotrov@gmail.com), Copy order summary, and
  "Done — I've sent the payment".
- **Confirmation** — invoice number, full summary, "Email this
  order to Studio TROV" (mailto: thestudiotrov@gmail.com) and
  "Copy order summary", plus what happens next. If the buyer
  paid by card, it shows the Paystack reference and says
  Studio TROV will confirm it in the Paystack dashboard
  before fulfilling. Payment is NOT verified automatically.
  Cart is saved in localStorage on the same device only.

## Facts used (exact, from the line sheet)

- 15 SKUs, unframed art prints only; frames are styling only.
- Wholesale: Medium 12×16 in $40 (MSRP $80), Large 18×24 in $70
  (MSRP $140). The 40% trade tier ($48/$84) is NOT shown.
- Delivery: $19 EU / USA / Canada, $49 rest of world.
- Opening order minimum $200.
- Lead time 3–5 business days; Certificate of Authenticity included;
  blind / white-label dropshipping; fulfilled from New York via
  Creativehub. Contact: thestudiotrov@gmail.com.

## Paystack (card payments — NOT live yet)

Card payment is built in but switched off: `PAYSTACK_PUBLIC_KEY`
in `app.js` is empty, so the Paystack button shows "coming soon,
add public key", is disabled, and no payment is attempted.
To switch it on, Flamez needs to:
1. Create / sign in to Paystack (paystack.com).
2. Copy the **public** key from Settings → API Keys & Webhooks.
3. Tell Oscar — Oscar pastes it into `PAYSTACK_PUBLIC_KEY` in
   `app.js` and redeploys. Never share a Paystack **secret** key.

## Notes

- Payment is by bank transfer on invoice, or by card via
  Paystack (once switched on). There is no automatic payment
  verification — Studio TROV checks the bank transfer, or the
  card payment in the Paystack dashboard, before fulfilling.
- The order is NOT sent automatically — the buyer sends it by email
  (mailto button) or copies the summary.
- No account/login, no stock control, no tax calculation.
- No third-party marketplaces anywhere on the site.
