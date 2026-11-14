# Studio TROV — Wholesale Ordering Website

Built from Flamez's hand-drawn mobile wireframe, made responsive for
mobile, tablet and desktop. Payment is by bank transfer on invoice
only — invoicing is the primary payment method. No Stripe, no Paystack
(Paystack card payments were removed 2026-11-14 after the account
would not accept USD: "currency is not supported by merchant").

Flow: the buyer picks prints, fills in the order form, then one click
sends the order straight to thestudiotrov@gmail.com (automatic, via
FormSubmit — see below). Studio TROV then emails the invoice to the
buyer straight away. The invoice is NOT shown on the site. Bank
details are in `app.js` only (the order-email body, so the studio can
copy them into the invoice) — they are NOT rendered on any page of
the site, and NOT in this README.

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
  Home + Cart, Welcome hero ("Welcome to Studio TROV's open
  collections. Please place your order."), trade strip,
  Collections 1–3. The hero heading reads "Architectural art
  for calm spaces." Clients reach this site after seeing the
  look book, so there is no long introduction and no banner.
  On mobile each collection is a horizontal scroll row (as sketched);
  tablet shows a 2-column grid, desktop a 3-column grid.
- **Collection pages (3)** — from "View Collection →" under each
  collection heading on the shop page, or header nav
  "Collection pages" → 01 Modernist Form / 02 Archival Herbarium /
  03 Abstract Earth. Each has a hero image, collection intro,
  all 5 works in a grid, and Add to Cart.
- **Product popup** — there are no individual product pages.
  Click any product image or title, on the shop or on a collection
  page, and it pops up full-screen with the full artwork image,
  the framed mockup, SKU, title, collection, description,
  paper/spec, size selector, quantity and Add to Cart. Closes
  with the close button, tapping the backdrop, or Escape.
  Examples: TROV-MOD-01 Monolith and Arch I, TROV-CYA-03 Silver Dollar
  Eucalyptus III, TROV-ERTH-04 Urn & Stone Sphere IV.
- **Cart** — header Cart button, or the floating "Go to Cart" bar at
  the bottom of the page (as sketched). Edit quantities, remove items,
  delivery region, opening-minimum progress ($200).
- **Order details (checkout)** — buyer name, shop name, email, phone,
  delivery address, billing-same checkbox, delivery notes, how found.
- **Send order** — shown only after the order form is submitted.
  Order number (TROV-YYYYMMDD-XXXX), order date, line items,
  subtotal, delivery, TOTAL in USD, and delivery address.
  One button — "Send order email to Studio TROV" — sends the order
  automatically to thestudiotrov@gmail.com via FormSubmit. If the
  automatic send fails, a mailto fallback ("Send from my email app")
  appears. Also "Copy order summary" and "Back to details".
- **Confirmation** — order number, full summary, "Copy order
  summary", and what happens next: Studio TROV emails the invoice
  straight away, the buyer pays by bank transfer using the order
  number as the reference, then Studio TROV checks the payment and
  fulfils. Payment is NOT verified automatically.
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

## How the order email works (FormSubmit)

The site is static (GitHub Pages, no backend), so the automatic
send uses FormSubmit: the site POSTs the order as JSON to
`https://formsubmit.co/ajax/thestudiotrov@gmail.com`, and
FormSubmit emails it to the studio inbox. The buyer also gets an
automatic reply telling them their invoice is on its way.

One-time setup: the first time a form posts to a new address,
FormSubmit does NOT deliver the order — it emails an "Activate Form"
link to thestudiotrov@gmail.com instead. Someone with access to
that inbox must click **Activate Form** once. Until then, every
order shows the buyer the mailto fallback instead, and FormSubmit
keeps pre-activation submissions for 30 days and delivers them
once the form is activated.

## Notes

- Payment is by bank transfer on invoice only. There is no
  automatic payment verification — Studio TROV checks the bank
  transfer before fulfilling.
- The order email to the studio includes the bank details to copy
  into the invoice, plus an "ACTION FOR STUDIO TROV" line: email
  the invoice to the buyer straight away, using the order number
  as the invoice number and payment reference.
- No account/login, no stock control, no tax calculation.
- No third-party marketplaces anywhere on the site.
