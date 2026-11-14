/* Studio TROV — ordering website
   Payment is by bank transfer on invoice (invoicing is the primary
   payment method — card payments via Paystack were removed 2026-11-14).
   Flow: shop → cart → order form → send order by email (one click,
   sent automatically to thestudiotrov@gmail.com) → confirmation.
   Studio TROV then emails the invoice to the buyer straight away;
   the invoice is NOT shown on the site. Cart in localStorage
   (same device only). Studio TROV checks the payment manually. */
'use strict';

const EMAIL = 'thestudiotrov@gmail.com';
/* Bank details — for the ORDER EMAIL to Studio TROV only, so the studio
   can copy them straight into the invoice it emails the buyer. They are
   NOT rendered anywhere on the site: not on the shop, collection or
   piece pages, not in the header, footer or How ordering works text,
   and not in README. */
const BANK = {
  holder: 'Samuel Onovia Izoma',
  accountNumber: '213722800385',
  accountType: 'Checking',
  achRouting: '101019644',
  bankName: 'Lead',
  wireRouting: '101019644',
  bankAddress: '1801 Main St., Kansas City, MO 64108'
};
const MINIMUM = 200;
const DELIVERY = { '19': { label: 'EU / USA / Canada', amount: 19 }, '49': { label: 'Rest of world', amount: 49 } };
const SIZES = {
  medium: { label: 'Medium — 12 × 16 in', price: 40, msrp: 80 },
  large:  { label: 'Large — 18 × 24 in',  price: 70, msrp: 140 }
};

const COLLECTIONS = {
  mod: { num: '01', name: 'Modernist Form & Structural Arches', short: 'Modernist Form',
    hero: 'assets/mock-mod01.jpg',
    intro: 'Arches, monoliths and quiet geometry — bold forms in warm, earthy colour, made to hold a room. Five works, each a museum-grade Giclée print on Hahnemühle German Etching 310gsm cotton rag.' },
  cya: { num: '02', name: 'Archival Herbarium & Botanical Cyanotypes', short: 'Archival Herbarium',
    hero: 'assets/mock-cya01.jpg',
    intro: 'Botanical cyanotypes in deep blue — ginkgo, fern, eucalyptus, grasses and olive, like herbarium plates. Five works, each a museum-grade Giclée print on Hahnemühle German Etching 310gsm cotton rag.' },
  erth: { num: '03', name: 'Abstract Earth', short: 'Abstract Earth',
    hero: 'assets/mock-erth01.jpg',
    intro: 'Handmade vessels and stone forms — terracotta, travertine and warm linen, painted in soft light. Five works, each a museum-grade Giclée print on Hahnemühle German Etching 310gsm cotton rag.' }
};

const PRODUCTS = [
  // Collection 1 — Modernist Form & Structural Arches
  { sku: 'TROV-MOD-01', title: 'Monolith and Arch I', collection: 'mod', img: 'assets/trov-mod-01.jpg', mock: 'assets/mock-mod01.jpg', desc: 'Pale cream background; a large dark charcoal disc in the upper left, a broad beige arch sweeping over a tall terracotta monolith, with a small dark block tucked at the bottom centre.' },
  { sku: 'TROV-MOD-02', title: 'Monumental Contour V', collection: 'mod', img: 'assets/trov-mod-02.jpg', mock: 'assets/mock-mod02.jpg', desc: 'A thick dark chocolate-brown inverted-U arch dominates the centre-left, with a tall rust vertical bar to its right and a large pale beige circle behind them.' },
  { sku: 'TROV-MOD-03', title: 'Equilibrium IV', collection: 'mod', img: 'assets/trov-mod-03.jpg', mock: 'assets/mock-mod03.jpg', desc: 'A large terracotta oval, tilted, dominates the upper centre, over a thick black diagonal bar crossed by a shorter horizontal bar, with a tall pale beige triangle on the right.' },
  { sku: 'TROV-MOD-04', title: 'Receding Portals III', collection: 'mod', img: 'assets/trov-mod-04.jpg', mock: 'assets/mock-mod04.jpg', desc: 'A large rounded arch of nested concentric bands in pale beige, cream and light tan, overlapped by a large solid black triangle, with a small terracotta stepped block at the bottom left.' },
  { sku: 'TROV-MOD-05', title: 'Segmented Balance II', collection: 'mod', img: 'assets/trov-mod-05.jpg', mock: 'assets/mock-mod05.jpg', desc: 'A large nested arch of concentric bands — terracotta, golden ochre and pale speckled terracotta — curving down to a tall slate-blue-grey block, with a tan block below.' },
  // Collection 2 — Archival Herbarium & Botanical Cyanotypes
  { sku: 'TROV-CYA-01', title: 'Botanical Ginkgo Biloba I', collection: 'cya', img: 'assets/trov-cya-01.jpg', mock: 'assets/mock-cya01.jpg', desc: 'A botanical ginkgo cyanotype in deep blue, like a herbarium plate.' },
  { sku: 'TROV-CYA-02', title: 'Woodland Fern II', collection: 'cya', img: 'assets/trov-cya-02.jpg', mock: 'assets/mock-cya02.jpg', desc: 'A woodland fern cyanotype. Colours: Deep Cobalt, Prussian Blue, Cotton.' },
  { sku: 'TROV-CYA-03', title: 'Silver Dollar Eucalyptus III', collection: 'cya', img: 'assets/trov-cya-03.jpg', mock: 'assets/mock-cya03.jpg', desc: 'A silver dollar eucalyptus cyanotype of round-leafed branches. Colours: Midnight Blue, Solar White.' },
  { sku: 'TROV-CYA-04', title: 'Wild Meadow Grasses IV', collection: 'cya', img: 'assets/trov-cya-04.jpg', mock: 'assets/mock-cya04.jpg', desc: 'A wild meadow grasses cyanotype. Colours: Ocean Prussian, Bleached Cream.' },
  { sku: 'TROV-CYA-05', title: 'Mediterranean Olive V', collection: 'cya', img: 'assets/trov-cya-05.jpg', mock: 'assets/mock-cya05.jpg', desc: 'A Mediterranean olive branch cyanotype. Colours: Royal Prussian, Soft Indigo, Linen.' },
  // Collection 3 — Abstract Earth
  { sku: 'TROV-ERTH-01', title: 'Vessels & Marble Plinth I', collection: 'erth', img: 'assets/trov-erth-01.jpg', mock: 'assets/mock-erth01.jpg', desc: 'Twin earthenware vessels and an alabaster disc on a stone ledge. Colours: Raw Terracotta, Umber, Travertine Limestone.' },
  { sku: 'TROV-ERTH-02', title: 'Terracotta Basin & Cylinder II', collection: 'erth', img: 'assets/trov-erth-02.jpg', mock: 'assets/mock-erth02.jpg', desc: 'A low, wide earthenware bowl and an unglazed beige cylinder. Colours: Burnt Sienna, Sandstone, Warm Bleached Linen.' },
  { sku: 'TROV-ERTH-03', title: 'Handled Pitcher & Sphere III', collection: 'erth', img: 'assets/trov-erth-03.jpg', mock: 'assets/mock-erth03.jpg', desc: 'A single-handled artisanal jug and a carved stone sphere. Colours: Rustic Clay, Chalk White, Muted Parchment.' },
  { sku: 'TROV-ERTH-04', title: 'Urn & Stone Sphere IV', collection: 'erth', img: 'assets/trov-erth-04.jpg', mock: 'assets/mock-erth04.jpg', desc: 'A wide-shouldered ceramic vase and a solid pale stone sphere. Colours: Earthy Ochre, Weathered Travertine, Soft Alabaster.' },
  { sku: 'TROV-ERTH-05', title: 'Slender Carafe & Cube V', collection: 'erth', img: 'assets/trov-erth-05.jpg', mock: 'assets/mock-erth05.jpg', desc: 'A tall, tapered bottle vase and a geometric cubic stone block. Colours: Raw Clay, Honed Sandstone, Studio Cream.' }
];

const money = n => '$' + n.toLocaleString('en-US');
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ---------- cart state (localStorage, same device only) ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('trov-cart-v1') || '[]'); } catch (e) { cart = []; }
if (!Array.isArray(cart)) cart = [];
const saveCart = () => { try { localStorage.setItem('trov-cart-v1', JSON.stringify(cart)); } catch (e) {} };
const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
const cartSubtotal = () => cart.reduce((n, i) => n + i.qty * SIZES[i.size].price, 0);
const findProduct = sku => PRODUCTS.find(p => p.sku === sku);

/* ---------- views ---------- */
const VIEWS = ['shop', 'collection', 'cart', 'checkout', 'send', 'confirmation'];
let currentCollection = 'mod';
function showView(name, param) {
  if (name === 'collection' && param) { currentCollection = param; renderCollectionPage(param); }
  VIEWS.forEach(v => { const el = document.getElementById('view-' + v); if (el) el.hidden = (v !== name); });
  const floating = document.getElementById('floating-cart');
  floating.hidden = !(['shop', 'collection'].includes(name) && cartCount() > 0);
  window.scrollTo({ top: 0 });
  if (name === 'cart') renderCart();
  if (name === 'send') renderSend();
  if (name === 'confirmation') renderConfirmation();
  const navDrop = document.querySelector('.nav-collections');
  if (navDrop) navDrop.open = false;
}

/* ---------- product cards (used on shop, collection and related rows) ---------- */
function addToCart(p, size, qty, noteEl) {
  if (!qty || qty < 1) qty = 1; if (qty > 99) qty = 99;
  const existing = cart.find(i => i.sku === p.sku && i.size === size);
  if (existing) existing.qty = Math.min(99, existing.qty + qty);
  else cart.push({ sku: p.sku, size, qty });
  saveCart(); updateCartUI();
  if (noteEl) noteEl.textContent = 'Added ' + qty + ' × ' + SIZES[size].label.split(' — ')[0] + ' to cart ✓';
}
function createProductCard(p, uid) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML =
    '<a class="product-link" href="#product/' + p.sku + '" data-popup="' + p.sku + '">' +
    '<img src="' + p.img + '" alt="' + p.title + ' — unframed art print" loading="lazy" width="896" height="1200">' +
    '<p class="product-sku">' + p.sku + '</p>' +
    '<h4 class="product-title">' + p.title + '</h4></a>' +
    '<p class="product-price">Wholesale <strong>' + money(SIZES.medium.price) + ' – ' + money(SIZES.large.price) + '</strong> <s>MSRP ' + money(SIZES.medium.msrp) + ' / ' + money(SIZES.large.msrp) + '</s></p>' +
    '<div class="size-pills" role="group" aria-label="Size for ' + p.title + '">' +
      '<button type="button" class="size-pill" data-size="medium" aria-pressed="true"><strong>Medium — 12 × 16 in</strong>$40 wholesale</button>' +
      '<button type="button" class="size-pill" data-size="large" aria-pressed="false"><strong>Large — 18 × 24 in</strong>$70 wholesale</button>' +
    '</div>' +
    '<div class="qty-row"><label for="qty-' + uid + '">Qty</label>' +
    '<input type="number" id="qty-' + uid + '" min="1" max="99" value="1" inputmode="numeric" aria-label="Quantity for ' + p.title + '"></div>' +
    '<button type="button" class="btn btn-primary add-btn">Add to Cart</button>' +
    '<p class="added-note" aria-live="polite"></p>';
  let selectedSize = 'medium';
  card.querySelectorAll('.size-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size;
      card.querySelectorAll('.size-pill').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });
  card.querySelector('.add-btn').addEventListener('click', () => {
    const qty = parseInt(card.querySelector('input[type="number"]').value, 10);
    addToCart(p, selectedSize, qty, card.querySelector('.added-note'));
  });
  return card;
}
function renderProducts() {
  $$('.product-row').forEach(row => {
    const coll = row.dataset.collection;
    row.innerHTML = '';
    PRODUCTS.filter(p => p.collection === coll).forEach(p => row.appendChild(createProductCard(p, 'shop-' + p.sku)));
  });
}

/* ---------- collection pages (3) ---------- */
function renderCollectionPage(collId) {
  const c = COLLECTIONS[collId]; if (!c) return;
  const el = document.getElementById('collection-page');
  el.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.innerHTML =
    '<p><a class="back-link" href="#shop" data-goto="shop">← Back to shop</a></p>' +
    '<img class="collection-hero" src="' + c.hero + '" alt="' + c.name + ' — framed in a considered interior" width="1200" height="675">' +
    '<p class="kicker">Collection ' + c.num + ' · Five works</p>' +
    '<h1>' + c.name + '</h1>' +
    '<p class="lead">' + c.intro + '</p>' +
    '<p class="frameless">All works are sold as unframed art prints. Frames shown are for styling only and are not included. Standard frame sizes — prints fit right in.</p>' +
    '<div class="collection-page-grid" id="coll-grid"></div>' +
    '<p style="margin-top:18px"><a class="back-link" href="#shop" data-goto="shop">← Back to shop</a> &nbsp;·&nbsp; <a class="back-link" href="#cart" data-goto="cart">Go to Cart →</a></p>';
  el.appendChild(wrap);
  const grid = el.querySelector('#coll-grid');
  PRODUCTS.filter(p => p.collection === collId).forEach(p => grid.appendChild(createProductCard(p, 'coll-' + p.sku)));
}

/* ---------- piece pages (15) ---------- */
/* ---------- product popup (full-screen) ----------
   There are no individual product pages. Clicking a product opens
   this full-screen popup with the full image, details and
   add-to-order. Closes with the close button, tapping the backdrop,
   or the Escape key. */
let popupSku = null;
function openProductPopup(sku) {
  const p = findProduct(sku); if (!p) return;
  const c = COLLECTIONS[p.collection];
  popupSku = sku;
  const el = document.getElementById('popup-content');
  el.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.innerHTML =
    '<figure class="popup-figure"><img class="flat" src="' + p.img + '" alt="' + p.title + ' — flat unframed art print" width="896" height="1200"></figure>' +
    '<div class="piece-info">' +
    '<p class="kicker">Collection ' + c.num + ' · ' + c.name + '</p>' +
    '<h1 id="popup-title">' + p.title + '</h1>' +
    '<p class="product-sku">' + p.sku + '</p>' +
    '<p class="piece-desc">' + p.desc + '</p>' +
    '<ul class="spec-list">' +
    '<li><strong>Paper:</strong> Hahnemühle German Etching 310gsm archival cotton rag</li>' +
    '<li><strong>Print:</strong> Museum-grade Giclée, open studio edition</li>' +
    '<li><strong>Included:</strong> Certificate of Authenticity and Studio TROV Provenance &amp; Packaging Slip</li>' +
    '<li><strong>Unframed:</strong> Print only — frame not included. Standard frame sizes, prints fit right in.</li>' +
    '<li><strong>Lead time:</strong> 3–5 business days. Fulfilled on demand from New York via Creativehub.</li>' +
    '</ul>' +
    '<figure class="popup-figure"><img class="mock" src="' + p.mock + '" alt="' + p.title + ' framed in light oak in a considered interior" width="1200" height="800"><figcaption>Styled in a considered interior. Frame for styling only — not included.</figcaption></figure>' +
    '<p class="product-price">Wholesale <strong>$40 Medium – $70 Large</strong> <s>MSRP $80 / $140</s></p>' +
    '<div class="size-pills" role="group" aria-label="Size for ' + p.title + '" id="popup-sizes">' +
    '<button type="button" class="size-pill" data-size="medium" aria-pressed="true"><strong>Medium — 12 × 16 in</strong>$40 wholesale</button>' +
    '<button type="button" class="size-pill" data-size="large" aria-pressed="false"><strong>Large — 18 × 24 in</strong>$70 wholesale</button>' +
    '</div>' +
    '<div class="piece-buy-row"><div class="qty-row"><label for="qty-popup">Qty</label>' +
    '<input type="number" id="qty-popup" min="1" max="99" value="1" inputmode="numeric" aria-label="Quantity"></div>' +
    '<button type="button" class="btn btn-primary" id="popup-add">Add to Cart</button></div>' +
    '<p class="added-note" id="popup-note" aria-live="polite"></p>' +
    '</div>';
  el.appendChild(wrap);
  let selectedSize = 'medium';
  wrap.querySelectorAll('#popup-sizes .size-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size;
      wrap.querySelectorAll('#popup-sizes .size-pill').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });
  wrap.querySelector('#popup-add').addEventListener('click', () => {
    const qty = parseInt(wrap.querySelector('#qty-popup').value, 10);
    addToCart(p, selectedSize, qty, wrap.querySelector('#popup-note'));
  });
  document.getElementById('product-popup').hidden = false;
  document.body.style.overflow = 'hidden';
  const panel = document.querySelector('.popup-panel');
  if (panel) panel.scrollTop = 0;
}
function closeProductPopup() {
  document.getElementById('product-popup').hidden = true;
  document.body.style.overflow = '';
  popupSku = null;
}

/* ---------- cart UI ---------- */
function updateCartUI() {
  const n = cartCount();
  document.getElementById('cart-count').textContent = n;
  const floating = document.getElementById('floating-cart');
  const onBrowse = ['shop', 'collection'].some(v => !document.getElementById('view-' + v).hidden);
  floating.hidden = !(onBrowse && n > 0);
  document.getElementById('floating-text').textContent = n + (n === 1 ? ' item' : ' items') + ' · ' + money(cartSubtotal());
}

function deliveryAmount() {
  const v = document.getElementById('delivery-region').value;
  return v ? DELIVERY[v].amount : 0;
}

function renderCart() {
  const empty = document.getElementById('cart-empty');
  const filled = document.getElementById('cart-filled');
  empty.hidden = cart.length > 0;
  filled.hidden = cart.length === 0;
  if (!cart.length) { updateCartUI(); return; }
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  cart.forEach((item, idx) => {
    const p = findProduct(item.sku);
    const size = SIZES[item.size];
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML =
      '<img src="' + p.img + '" alt="' + p.title + '">' +
      '<div><h3>' + p.title + '</h3>' +
      '<p class="muted">' + p.sku + ' · ' + size.label + ' · ' + money(size.price) + ' each</p>' +
      '<div class="cart-qty"><button type="button" aria-label="Decrease quantity">−</button>' +
      '<input type="number" min="1" max="99" value="' + item.qty + '" aria-label="Quantity">' +
      '<button type="button" aria-label="Increase quantity">+</button>' +
      '<span class="line-total">' + money(item.qty * size.price) + '</span></div>' +
      '<button type="button" class="remove-btn">Remove</button></div>';
    const [dec, inc] = li.querySelectorAll('.cart-qty button');
    const qtyInput = li.querySelector('.cart-qty input');
    dec.addEventListener('click', () => { item.qty = Math.max(1, item.qty - 1); saveCart(); renderCart(); updateCartUI(); });
    inc.addEventListener('click', () => { item.qty = Math.min(99, item.qty + 1); saveCart(); renderCart(); updateCartUI(); });
    qtyInput.addEventListener('change', () => {
      let q = parseInt(qtyInput.value, 10); if (!q || q < 1) q = 1; if (q > 99) q = 99;
      item.qty = q; saveCart(); renderCart(); updateCartUI();
    });
    li.querySelector('.remove-btn').addEventListener('click', () => { cart.splice(idx, 1); saveCart(); renderCart(); updateCartUI(); });
    list.appendChild(li);
  });
  const sub = cartSubtotal();
  document.getElementById('cart-subtotal').textContent = money(sub);
  const del = deliveryAmount();
  document.getElementById('cart-delivery').textContent = del ? money(del) : '— select a region';
  document.getElementById('cart-total').textContent = money(sub + del);
  const pct = Math.min(100, Math.round(sub / MINIMUM * 100));
  document.getElementById('minimum-fill').style.width = pct + '%';
  document.getElementById('minimum-bar').setAttribute('aria-valuenow', String(Math.min(sub, MINIMUM)));
  document.getElementById('minimum-text').textContent = sub >= MINIMUM
    ? 'Opening minimum reached — $' + sub + ' of $' + MINIMUM + ' minimum. ✓'
    : 'Opening order minimum is $' + MINIMUM + ' — add ' + money(MINIMUM - sub) + ' more to reach it (' + pct + '% there).';
  updateCartUI();
}

/* ---------- order data ---------- */
let orderData = null;
let orderRef = '';
let invoiceDate = '';
let orderSent = false; // true once the order email has been sent to Studio TROV
let sentOrder = null; // snapshot of items + totals taken at send time, for the confirmation page

function paymentDetailsText() {
  return [
    'Pay by bank transfer (USD)',
    'Payment reference: ' + orderRef,
    'Account holder: ' + BANK.holder,
    'Account number: ' + BANK.accountNumber,
    'Account type: ' + BANK.accountType,
    'ACH routing: ' + BANK.achRouting,
    'Bank name: ' + BANK.bankName,
    'Wire routing: ' + BANK.wireRouting,
    'Bank address: ' + BANK.bankAddress
  ].join('\n');
}

function orderSummaryHTML() {
  // After a successful send the cart is cleared, so the confirmation
  // page reads the snapshot taken at send time instead of the empty cart.
  const items = sentOrder ? sentOrder.items : cart;
  const sub = sentOrder ? sentOrder.subtotal : cartSubtotal();
  const del = sentOrder ? sentOrder.delivery : deliveryAmount();
  const rows = items.map(item => {
    const p = findProduct(item.sku); const size = SIZES[item.size];
    return '<tr><td>' + p.sku + '<br>' + p.title + '</td><td>' + size.label + '</td><td>' + item.qty + '</td><td>' + money(item.qty * size.price) + '</td></tr>';
  }).join('');
  return '<table class="summary-table"><thead><tr><th>Work</th><th>Size</th><th>Qty</th><th>Amount</th></tr></thead><tbody>' + rows +
    '</tbody><tfoot><tr><td colspan="3">Subtotal</td><td>' + money(sub) + '</td></tr>' +
    '<tr><td colspan="3">Delivery (' + (DELIVERY[String(del)] ? DELIVERY[String(del)].label : '—') + ')</td><td>' + money(del) + '</td></tr>' +
    '<tr><td colspan="3"><strong>Total</strong></td><td><strong>' + money(sub + del) + '</strong></td></tr></tfoot></table>';
}

function orderSummaryText() {
  const lines = ['Studio TROV — Wholesale Order', 'Order number: ' + orderRef, 'Order date: ' + invoiceDate, ''];
  cart.forEach(item => {
    const p = findProduct(item.sku); const size = SIZES[item.size];
    lines.push('- ' + p.sku + ' — ' + p.title + ' — ' + size.label + ' — Qty ' + item.qty + ' — ' + money(item.qty * size.price));
  });
  lines.push('', 'Subtotal: ' + money(cartSubtotal()), 'Delivery: ' + money(deliveryAmount()), 'TOTAL (USD): ' + money(cartSubtotal() + deliveryAmount()), '');
  if (orderData) {
    lines.push('Buyer: ' + orderData.fullName, 'Shop: ' + orderData.shopName, 'Email: ' + orderData.email, 'Phone: ' + orderData.phone,
      'Delivery: ' + orderData.street + ', ' + orderData.city + ', ' + orderData.state + ' ' + orderData.postcode + ', ' + orderData.country);
    if (!orderData.billingSame) lines.push('Billing: ' + orderData.billingStreet + ', ' + orderData.billingCity + ' ' + orderData.billingPostcode + ', ' + orderData.billingCountry);
    if (orderData.notes) lines.push('Delivery notes: ' + orderData.notes);
    if (orderData.source) lines.push('Found via: ' + orderData.source);
  }
  lines.push('', 'Bank details to copy into the invoice (USD):', paymentDetailsText(), '');
  lines.push('ACTION FOR STUDIO TROV: email the invoice to the buyer straight away, using the order number above as the invoice number and payment reference.',
    'Studio TROV will check the payment, then fulfil the order via Creativehub and email the tracking number. Payment is not verified automatically.',
    'All works are unframed art prints. Lead time 3–5 business days. Fulfilled from New York via Creativehub.');
  return lines.join('\n');
}

/* ---------- saved buyer details (returning customers) ----------
   Details are saved on the buyer's own device (localStorage) — no
   accounts, nothing leaves their browser. Next order, the form fills
   itself in; any change the buyer makes is saved again automatically.
   The email lookup loads the saved details for that email. */
const DETAILS_KEY = 'trovBuyerDetails';
const DETAIL_FIELDS = ['fullName', 'shopName', 'email', 'phone', 'street', 'city', 'state', 'postcode', 'country',
  'billingStreet', 'billingCity', 'billingPostcode', 'billingCountry', 'notes', 'source'];
function readSavedDetails() {
  try { const d = JSON.parse(localStorage.getItem(DETAILS_KEY) || 'null'); return d && typeof d === 'object' ? d : null; }
  catch (e) { return null; }
}
function collectFormDetails(form) {
  const fd = new FormData(form);
  const d = { billingSame: form.elements.billingSame.checked };
  DETAIL_FIELDS.forEach(n => { d[n] = String(fd.get(n) || '').trim(); });
  return d;
}
function saveDetailsFromForm() {
  try {
    const prev = readSavedDetails() || {};
    const d = collectFormDetails(document.getElementById('order-form'));
    if (prev.pinHash) d.pinHash = prev.pinHash; // never drop the PIN on auto-save
    localStorage.setItem(DETAILS_KEY, JSON.stringify(d));
  } catch (e) {}
}
/* The 4-digit PIN is never stored as plain text — only its hash.
   SHA-256 when available, otherwise a simple fallback hash. */
async function hashPin(pin) {
  try {
    if (window.crypto && crypto.subtle && crypto.subtle.digest) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('trov-pin:' + pin));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {}
  let h = 2166136261; const s = 'trov-pin:' + pin;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return 'fb-' + (h >>> 0).toString(16);
}
/* Four-box PIN fields: type one digit and the cursor moves on;
   Backspace on an empty box moves back; pasting fills all four. */
function pinValue(container) { return [...container.querySelectorAll('input')].map(i => i.value).join(''); }
function clearPinBoxes(container) { container.querySelectorAll('input').forEach(i => { i.value = ''; }); }
function initPinBoxes(container) {
  const inputs = [...container.querySelectorAll('input')];
  inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 1);
      if (input.value && i < inputs.length - 1) inputs[i + 1].focus();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !input.value && i > 0) { e.preventDefault(); inputs[i - 1].focus(); inputs[i - 1].value = ''; }
    });
    input.addEventListener('paste', e => {
      e.preventDefault();
      const data = (e.clipboardData || window.clipboardData);
      const text = data && data.getData ? data.getData('text') : '';
      const digits = (text || '').replace(/\D/g, '').slice(0, 4);
      digits.split('').forEach((d, j) => { if (inputs[j]) inputs[j].value = d; });
      if (digits.length) inputs[Math.min(digits.length, inputs.length - 1)].focus();
    });
  });
}
/* ---------- Supabase (returning-customer database) ----------
   Fill these in once the Studio TROV Supabase project exists — the
   table SQL is in ~/workspace/studio-trov/supabase-buyer-details.sql.
   The anon key is public by design; NEVER put the service_role
   (secret) key in this file. Until these are filled in, profiles
   save on the buyer's own device only and the cloud calls below
   simply do nothing. */
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
function supabaseReady() { return !!SUPABASE_URL && !!SUPABASE_ANON_KEY; }
async function saveProfileToCloud(profile) {
  if (!supabaseReady()) return false;
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/buyer_details', {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'x-buyer-email': profile.email,
        'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ email: profile.email, pin_hash: profile.pinHash, details: profile })
    });
    return res.ok;
  } catch (e) { return false; }
}
async function loadProfileFromCloud(email) {
  if (!supabaseReady()) return null;
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/buyer_details?email=eq.' + encodeURIComponent(email) + '&select=details,pin_hash', {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'x-buyer-email': email }
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows || !rows.length) return null;
    const d = rows[0].details || {};
    d.pinHash = rows[0].pin_hash || d.pinHash;
    return d;
  } catch (e) { return null; }
}
function fillFormDetails(details) {
  const form = document.getElementById('order-form');
  DETAIL_FIELDS.forEach(n => { if (form.elements[n] && details[n] !== undefined) form.elements[n].value = details[n]; });
  if (details.billingSame !== undefined) form.elements.billingSame.checked = !!details.billingSame;
  form.elements.billingSame.dispatchEvent(new Event('change'));
}
function initSavedDetails() {
  const form = document.getElementById('order-form');
  // Any change is saved again automatically.
  form.addEventListener('input', saveDetailsFromForm);
  form.addEventListener('change', saveDetailsFromForm);
  // Returning customer? Yes shows the email + PIN form; No hides the box completely.
  document.getElementById('returning-yes').addEventListener('click', () => {
    document.getElementById('returning-ask').hidden = true;
    document.getElementById('returning-form').hidden = false;
    const saved = readSavedDetails();
    if (saved && saved.email) document.getElementById('returning-email').value = saved.email;
    document.getElementById('returning-email').focus();
  });
  document.getElementById('returning-no').addEventListener('click', () => {
    document.getElementById('returning-box').hidden = true;
  });
  // Returning customer lookup: enter the email + PIN you saved with.
  document.getElementById('returning-load').addEventListener('click', async () => {
    const note = document.getElementById('returning-note');
    const email = document.getElementById('returning-email').value.trim().toLowerCase();
    const pin = pinValue(document.getElementById('returning-pin-boxes'));
    if (!email) { note.textContent = 'Enter the email you ordered with.'; return; }
    let saved = readSavedDetails();
    if (!saved || !saved.email || saved.email.toLowerCase() !== email) {
      if (!supabaseReady()) {
        note.textContent = 'No saved details found for that email. Fill in the form below and we\u2019ll remember them for your next order.';
        return;
      }
      saved = await loadProfileFromCloud(email);
    }
    if (saved && saved.email && saved.email.toLowerCase() === email) {
      if (saved.pinHash) {
        if (!pin || !/^\d{4}$/.test(pin)) { note.textContent = 'Enter the 4-digit PIN you set when you saved your details.'; return; }
        if ((await hashPin(pin)) !== saved.pinHash) { note.textContent = 'That PIN does not match. Try again.'; return; }
      }
      fillFormDetails(saved);
      try { localStorage.setItem(DETAILS_KEY, JSON.stringify(saved)); } catch (e) {}
      document.getElementById('saved-note').hidden = false;
      note.textContent = 'Your details are filled in — change anything you need, and we\u2019ll remember the changes.';
    } else {
      note.textContent = 'No saved details found for that email. Fill in the form below and we\u2019ll remember them for your next order.';
    }
  });
  document.getElementById('returning-clear').addEventListener('click', () => {
    try { localStorage.removeItem(DETAILS_KEY); } catch (e) {}
    form.reset();
    document.getElementById('returning-email').value = '';
    clearPinBoxes(document.getElementById('returning-pin-boxes'));
    document.getElementById('returning-note').textContent = 'Saved details cleared.';
    document.getElementById('saved-note').hidden = true;
    document.getElementById('returning-form').hidden = true;
    document.getElementById('returning-ask').hidden = false;
  });
  initPinBoxes(document.getElementById('returning-pin-boxes'));
}

/* ---------- save-details prompt (after first order) ----------
   Shown once, right after a successful order send, when the buyer
   has not saved their details yet. No = back to the home page.
   Yes = email + 4-digit PIN, then save (device now, Supabase too
   once it is configured). */
function openSaveDetailsPrompt() {
  const saved = readSavedDetails();
  if (saved && saved.pinHash) return; // already saved — don't ask again
  document.getElementById('save-details-ask').hidden = false;
  document.getElementById('save-details-form').hidden = true;
  document.getElementById('save-details-done').hidden = true;
  document.getElementById('save-details-email').value = orderData ? orderData.email : '';
  clearPinBoxes(document.getElementById('save-details-pin-boxes'));
  document.getElementById('save-details-error').hidden = true;
  const pop = document.getElementById('save-details-popup');
  pop.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeSaveDetailsPopup() {
  document.getElementById('save-details-popup').hidden = true;
  document.body.style.overflow = '';
}
function initSaveDetailsPopup() {
  initPinBoxes(document.getElementById('save-details-pin-boxes'));
  document.getElementById('save-details-no').addEventListener('click', () => {
    closeSaveDetailsPopup();
    showView('shop');
  });
  document.getElementById('save-details-yes').addEventListener('click', () => {
    document.getElementById('save-details-ask').hidden = true;
    document.getElementById('save-details-form').hidden = false;
    document.getElementById('save-details-pin').focus();
  });
  document.getElementById('save-details-cancel').addEventListener('click', () => {
    closeSaveDetailsPopup(); // stay on the confirmation page
  });
  document.getElementById('save-details-done-btn').addEventListener('click', () => {
    closeSaveDetailsPopup(); // stay on the confirmation page
  });
  document.getElementById('save-details-save').addEventListener('click', async () => {
    const err = document.getElementById('save-details-error');
    const email = document.getElementById('save-details-email').value.trim().toLowerCase();
    const pin = pinValue(document.getElementById('save-details-pin-boxes'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Please enter a valid email address.'; err.hidden = false; return; }
    if (!/^\d{4}$/.test(pin)) { err.textContent = 'Your PIN must be exactly 4 digits.'; err.hidden = false; return; }
    err.hidden = true;
    const profile = collectFormDetails(document.getElementById('order-form'));
    profile.email = email;
    profile.pinHash = await hashPin(pin);
    try { localStorage.setItem(DETAILS_KEY, JSON.stringify(profile)); } catch (e) {}
    await saveProfileToCloud(profile);
    document.getElementById('save-details-form').hidden = true;
    document.getElementById('save-details-done').hidden = false;
  });
}

/* ---------- checkout form ---------- */
function initCheckout() {
  const form = document.getElementById('order-form');
  const billingSame = form.elements.billingSame;
  const billingFields = document.getElementById('billing-fields');
  const toggleBilling = () => {
    billingFields.hidden = billingSame.checked;
    ['billingStreet', 'billingCity', 'billingPostcode', 'billingCountry'].forEach(n => {
      form.elements[n].required = !billingSame.checked;
    });
  };
  billingSame.addEventListener('change', toggleBilling); toggleBilling();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const err = document.getElementById('form-error');
    const fd = new FormData(form);
    const get = n => String(fd.get(n) || '').trim();
    const data = { fullName: get('fullName'), shopName: get('shopName'), email: get('email'), phone: get('phone'),
      street: get('street'), city: get('city'), state: get('state'), postcode: get('postcode'), country: get('country'),
      billingSame: billingSame.checked, billingStreet: get('billingStreet'), billingCity: get('billingCity'),
      billingPostcode: get('billingPostcode'), billingCountry: get('billingCountry'),
      notes: get('notes'), source: get('source') };
    const missing = [];
    ['fullName', 'shopName', 'email', 'phone', 'street', 'city', 'state', 'postcode', 'country'].forEach(n => { if (!data[n]) missing.push(n); });
    if (!data.billingSame) ['billingStreet', 'billingCity', 'billingPostcode', 'billingCountry'].forEach(n => { if (!data[n]) missing.push(n); });
    $$('#order-form input, #order-form select').forEach(el => el.removeAttribute('aria-invalid'));
    if (missing.length) {
      err.textContent = 'Please fill in all required fields: ' + missing.join(', ') + '.';
      err.hidden = false;
      missing.forEach(n => { const el = form.elements[n]; if (el) el.setAttribute('aria-invalid', 'true'); });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { err.textContent = 'Please enter a valid email address.'; err.hidden = false; form.elements.email.setAttribute('aria-invalid', 'true'); return; }
    if (data.phone.replace(/\D/g, '').length < 7) { err.textContent = 'Please enter a valid phone number.'; err.hidden = false; form.elements.phone.setAttribute('aria-invalid', 'true'); return; }
    err.hidden = true;
    orderData = data;
    saveDetailsFromForm();
    // Order number + date are generated here, on submitting the order
    // form — the order only exists from this point on. The buyer then
    // reviews it and sends it by email; Studio TROV invoices from it.
    const d = new Date();
    const ymd = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    orderRef = 'TROV-' + ymd + '-' + Math.floor(1000 + Math.random() * 9000);
    invoiceDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    orderSent = false;
    sentOrder = null; // new order — the confirmation summary must not show the last one
    showView('send');
  });
}

/* ---------- send order by email + confirmation ----------
   One click sends the order straight to thestudiotrov@gmail.com via
   FormSubmit (a form-email service for static sites — no backend of
   our own). The buyer never has to open an email app. If the automatic
   send fails, the buyer can send it from their own email app instead
   (mailto fallback). Studio TROV then emails the invoice straight
   away — the invoice is not shown on this site. */
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/' + EMAIL;

function renderSend() {
  const summary = document.getElementById('send-summary');
  let html = '<p><strong>Order number: ' + orderRef + '</strong> &middot; ' + invoiceDate + '</p>' + orderSummaryHTML();
  if (orderData) {
    html += '<h2 style="margin-top:20px">Delivery to</h2><p>' + orderData.fullName + ' — ' + orderData.shopName + '<br>' +
      orderData.street + ', ' + orderData.city + ', ' + orderData.state + ' ' + orderData.postcode + ', ' + orderData.country +
      '<br>' + orderData.email + ' · ' + orderData.phone + '</p>';
    if (orderData.notes) html += '<p><strong>Delivery notes:</strong> ' + orderData.notes + '</p>';
  }
  summary.innerHTML = html;
  const subject = encodeURIComponent('Studio TROV Wholesale Order — ' + orderRef + ' — ' + (orderData ? orderData.shopName : ''));
  const body = encodeURIComponent(orderSummaryText());
  document.getElementById('send-mailto-btn').href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;
  const btn = document.getElementById('send-order-btn');
  btn.disabled = false;
  btn.textContent = orderSent ? 'Order sent ✓ — see confirmation' : 'Send Order';
  document.getElementById('send-status').textContent = '';
  document.getElementById('send-fallback').hidden = true;
}

async function sendOrderEmail() {
  const status = document.getElementById('send-status');
  const fallback = document.getElementById('send-fallback');
  const btn = document.getElementById('send-order-btn');
  if (!orderData || !orderRef) { status.textContent = 'Please complete the order form first.'; return; }
  if (orderSent) { showView('confirmation'); return; }
  btn.disabled = true;
  btn.textContent = 'Sending your order…';
  status.textContent = 'Sending your order to Studio TROV…';
  fallback.hidden = true;
  const payload = {
    _subject: 'Studio TROV Wholesale Order — ' + orderRef + ' — ' + orderData.shopName,
    _template: 'table',
    _captcha: 'false',
    _autoresponse: 'Thank you for your Studio TROV wholesale order ' + orderRef + '. We have received it and will email your invoice straight away — please check your inbox (and spam). Once you pay by bank transfer using your order number as the reference, we will fulfil your order and email your tracking number.',
    email: orderData.email,
    name: orderData.fullName,
    'Order number': orderRef,
    'Order date': invoiceDate,
    'Shop': orderData.shopName,
    'Buyer': orderData.fullName,
    'Buyer email': orderData.email,
    'Buyer phone': orderData.phone,
    'Delivery address': orderData.street + ', ' + orderData.city + ', ' + orderData.state + ' ' + orderData.postcode + ', ' + orderData.country,
    'Billing address': orderData.billingSame ? 'Same as delivery' : orderData.billingStreet + ', ' + orderData.billingCity + ' ' + orderData.billingPostcode + ', ' + orderData.billingCountry,
    'Delivery notes': orderData.notes || '—',
    'Found via': orderData.source || '—',
    'Subtotal (USD)': money(cartSubtotal()),
    'Delivery (USD)': money(deliveryAmount()),
    'Total (USD)': money(cartSubtotal() + deliveryAmount()),
    'Order details': orderSummaryText()
  };
  try {
    const res = await fetch(FORMSUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    let data = {};
    try { data = await res.json(); } catch (e) { data = {}; }
    const ok = data && (data.success === true || data.success === 'true');
    if (ok) {
      orderSent = true;
      sentOrder = { items: cart.map(i => ({ ...i })), subtotal: cartSubtotal(), delivery: deliveryAmount() };
      cart = []; saveCart(); updateCartUI(); renderCart();
      showView('confirmation');
      openSaveDetailsPrompt();
      return;
    }
    const msg = (data && data.message) ? String(data.message) : '';
    if (/activat/i.test(msg)) {
      status.textContent = 'Your order could not be sent automatically yet — Studio TROV still needs to activate the order form once (one click in the studio inbox). Please send it from your email app below instead — it goes to the same address, and your order number is ' + orderRef + '.';
    } else {
      status.textContent = 'Your order could not be sent automatically' + (msg ? ' — ' + msg : '') + '. Please send it from your email app below instead — it goes to the same address, and your order number is ' + orderRef + '.';
    }
    fallback.hidden = false;
    btn.disabled = false;
    btn.textContent = 'Try sending again';
  } catch (e) {
    if (typeof console !== 'undefined' && console.error) console.error('Order email failed to send:', e);
    status.textContent = 'Your order could not be sent automatically — please check your connection and try again, or send it from your email app below. Your order number is ' + orderRef + '.';
    fallback.hidden = false;
    btn.disabled = false;
    btn.textContent = 'Try sending again';
  }
}

function initSend() {
  document.getElementById('send-order-btn').addEventListener('click', sendOrderEmail);
  document.getElementById('copy-order-btn-send').addEventListener('click', async () => {
    const status = document.getElementById('send-status');
    try { await navigator.clipboard.writeText(orderSummaryText()); status.textContent = 'Order summary copied to clipboard.'; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = orderSummaryText(); document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); status.textContent = 'Order summary copied to clipboard.'; } catch (e2) { status.textContent = 'Copy did not work in this browser — please use the send button instead.'; }
      ta.remove();
    }
  });
}

function renderConfirmation() {
  document.getElementById('order-ref').textContent = orderRef || '—';
  const note = document.getElementById('confirmation-payment-note');
  note.innerHTML = '<div class="notice" role="note"><strong>Your order has been sent to Studio TROV.</strong><br>We will email your invoice straight away to <strong>' + (orderData ? orderData.email : '') + '</strong> — please check your inbox (and spam). Pay by bank transfer using your order number <strong>' + orderRef + '</strong> as the reference. Studio TROV will check the payment, then fulfil your order via Creativehub and email your tracking number. Payment is not verified automatically.</div>';
  let html = orderSummaryHTML();
  if (orderData) {
    html += '<h2 style="margin-top:20px">Delivery to</h2><p>' + orderData.fullName + ' — ' + orderData.shopName + '<br>' +
      orderData.street + ', ' + orderData.city + ', ' + orderData.state + ' ' + orderData.postcode + ', ' + orderData.country +
      '<br>' + orderData.email + ' · ' + orderData.phone + '</p>';
    if (orderData.notes) html += '<p><strong>Delivery notes:</strong> ' + orderData.notes + '</p>';
  }
  document.getElementById('confirmation-summary').innerHTML = html;
}

function initConfirmation() {
  document.getElementById('copy-order-btn').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try { await navigator.clipboard.writeText(orderSummaryText()); status.textContent = 'Order summary copied to clipboard.'; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = orderSummaryText(); document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); status.textContent = 'Order summary copied to clipboard.'; } catch (e2) { status.textContent = 'Copy did not work in this browser — please use the email button instead.'; }
      ta.remove();
    }
  });
  document.getElementById('new-order-btn').addEventListener('click', () => {
    cart = []; orderData = null; orderRef = ''; invoiceDate = ''; orderSent = false; saveCart(); updateCartUI(); renderCart();
    document.getElementById('send-summary').innerHTML = '';
    document.getElementById('confirmation-payment-note').innerHTML = '';
    document.getElementById('order-form').reset();
    showView('shop');
  });
}

/* ---------- navigation (delegated — covers dynamically added links too) ---------- */
function initNav() {
  document.addEventListener('click', e => {
    const popupLink = e.target.closest('[data-popup]');
    if (popupLink) { e.preventDefault(); openProductPopup(popupLink.dataset.popup); return; }
    const closePopup = e.target.closest('[data-close-popup]');
    if (closePopup) { e.preventDefault(); closeProductPopup(); return; }
    const collLink = e.target.closest('[data-collection-view]');
    if (collLink) { e.preventDefault(); showView('collection', collLink.dataset.collectionView); return; }
    const goto = e.target.closest('[data-goto]');
    if (goto) {
      e.preventDefault();
      showView(goto.dataset.goto);
      if (goto.dataset.scroll) {
        if (goto.dataset.scroll === 'how-it-works') { const d = document.getElementById('how-details'); if (d) d.open = true; }
        setTimeout(() => { const t = document.getElementById(goto.dataset.scroll); if (t) t.scrollIntoView({ behavior: 'smooth' }); }, 50);
      }
    }
    const howLink = e.target.closest('a[href="#how-it-works"]');
    if (howLink) { const d = document.getElementById('how-details'); if (d) d.open = true; }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('product-popup').hidden) closeProductPopup();
  });
  document.getElementById('delivery-region').addEventListener('change', renderCart);
  document.getElementById('to-checkout').addEventListener('click', () => {
    const err = document.getElementById('cart-error');
    if (!cart.length) { err.textContent = 'Your cart is empty.'; err.hidden = false; return; }
    if (cartSubtotal() < MINIMUM) { err.textContent = 'Opening order minimum is $' + MINIMUM + ' — your subtotal is ' + money(cartSubtotal()) + '. Please add ' + money(MINIMUM - cartSubtotal()) + ' more.'; err.hidden = false; return; }
    if (!document.getElementById('delivery-region').value) { err.textContent = 'Please select a delivery region first.'; err.hidden = false; return; }
    err.hidden = true;
    showView('checkout');
  });
}

renderProducts();
initNav();
initCheckout();
initSavedDetails();
initSaveDetailsPopup();
initSend();
initConfirmation();
renderCart();
updateCartUI();
showView('shop');
