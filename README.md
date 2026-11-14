# Studio TROV — Wholesale Ordering Website (DRAFT)

First draft for Flamez to review. No real payments.
Built from Flamez's hand-drawn mobile wireframe, made responsive for
mobile, tablet and desktop.

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
- **Payment** — order summary + Stripe, clearly marked DRAFT:
  Stripe is not connected yet, no card details are collected.
  The "Confirm order" button is a simulated step.
- **Confirmation** — order reference (TROV-YYYYMMDD-XXXX), full
  summary, "Email this order to Studio TROV" (mailto:
  thestudiotrov@gmail.com) and "Copy order summary". Cart is saved
  in localStorage on the same device (draft only).

## Facts used (exact, from the line sheet)

- 15 SKUs, unframed art prints only; frames are styling only.
- Wholesale: Medium 12×16 in $40 (MSRP $80), Large 18×24 in $70
  (MSRP $140). The 40% trade tier ($48/$84) is NOT shown.
- Delivery: $19 EU / USA / Canada, $49 rest of world.
- Opening order minimum $200.
- Lead time 3–5 business days; Certificate of Authenticity included;
  blind / white-label dropshipping; fulfilled from New York via
  Creativehub. Contact: thestudiotrov@gmail.com.

## Placeholders / not live yet

- Stripe is NOT connected — payment is simulated, no money moves.
- The order is NOT sent automatically — the buyer sends it by email
  (mailto button) or copies the summary.
- No account/login, no stock control, no tax calculation.
- No third-party marketplaces anywhere on the site.
