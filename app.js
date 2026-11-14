/* Studio TROV — ordering website
   Payment is by bank transfer on invoice. The invoice (and the bank
   details on it) only appears after the buyer submits the order form.
   Cart in localStorage (same device only). The order is sent by the
   buyer via email, and Studio TROV checks the payment manually. */
'use strict';

const EMAIL = 'thestudiotrov@gmail.com';
/* Bank details for the invoice ONLY. These appear in the invoice view
   (rendered by renderInvoice) and in the emailed order body — nowhere
   else on the site: not on the shop, collection or piece pages, not in
   the header, footer or How ordering works text, and not in README. */
const BANK = {
  holder: 'Samuel Onovia Izoma',
  accountNumber: '213722800385',
  accountType: 'Checking',
  achRouting: '101019644',
  bankName: 'Lead',
  wireRouting: '101019644',
  bankAddress: '1801 Main St., Kansas City, MO 64108'
};
/* Paystack card payments — NOT live yet.
   Flamez has not supplied a Paystack public key. Paste your Paystack
   public key here to switch card payments on. NEVER put a Paystack
   secret key in this file (or anywhere on the site). While this is
   empty, the Paystack button stays disabled with a "coming soon"
   message and no payment is attempted. */
const PAYSTACK_PUBLIC_KEY = '';
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
const VIEWS = ['shop', 'collection', 'piece', 'cart', 'checkout', 'invoice', 'confirmation'];
let currentCollection = 'mod';
let currentPiece = null;
function showView(name, param) {
  if (name === 'collection' && param) { currentCollection = param; renderCollectionPage(param); }
  if (name === 'piece' && param) { currentPiece = param; renderPiecePage(param); }
  VIEWS.forEach(v => { const el = document.getElementById('view-' + v); if (el) el.hidden = (v !== name); });
  const floating = document.getElementById('floating-cart');
  floating.hidden = !(['shop', 'collection', 'piece'].includes(name) && cartCount() > 0);
  window.scrollTo({ top: 0 });
  if (name === 'cart') renderCart();
  if (name === 'invoice') renderInvoice();
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
    '<a class="product-link" href="#piece/' + p.sku + '" data-piece="' + p.sku + '">' +
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
function renderPiecePage(sku) {
  const p = findProduct(sku); if (!p) return;
  const c = COLLECTIONS[p.collection];
  const el = document.getElementById('piece-page');
  el.innerHTML = '';
  const wrap = document.createElement('div');
  const related = PRODUCTS.filter(x => x.collection === p.collection && x.sku !== p.sku);
  wrap.innerHTML =
    '<p><a class="back-link" href="#collection" data-collection-view="' + p.collection + '">← ' + c.name + '</a> &nbsp;·&nbsp; <a class="back-link" href="#shop" data-goto="shop">Shop</a></p>' +
    '<div class="piece-layout"><div class="piece-media">' +
    '<figure><img class="flat" src="' + p.img + '" alt="' + p.title + ' — flat unframed art print" width="896" height="1200"><figcaption>The print itself — unframed.</figcaption></figure>' +
    '<figure><img class="mock" src="' + p.mock + '" alt="' + p.title + ' framed in light oak in a considered interior" width="1200" height="800"><figcaption>Framed in light oak, styled in a considered interior. Frame for styling only — not included.</figcaption></figure>' +
    '</div><div class="piece-info">' +
    '<p class="kicker">Collection ' + c.num + ' · ' + c.name + '</p>' +
    '<h1>' + p.title + '</h1>' +
    '<p class="product-sku">' + p.sku + '</p>' +
    '<p class="piece-desc">' + p.desc + '</p>' +
    '<ul class="spec-list">' +
    '<li><strong>Paper:</strong> Hahnemühle German Etching 310gsm archival cotton rag</li>' +
    '<li><strong>Print:</strong> Museum-grade Giclée, open studio edition</li>' +
    '<li><strong>Included:</strong> Certificate of Authenticity and Studio TROV Provenance &amp; Packaging Slip</li>' +
    '<li><strong>Unframed:</strong> Print only — frame not included. Standard frame sizes, prints fit right in.</li>' +
    '<li><strong>Lead time:</strong> 3–5 business days. Fulfilled on demand from New York via Creativehub.</li>' +
    '</ul>' +
    '<p class="product-price">Wholesale <strong>$40 Medium – $70 Large</strong> <s>MSRP $80 / $140</s></p>' +
    '<div class="size-pills" role="group" aria-label="Size for ' + p.title + '" id="piece-sizes">' +
    '<button type="button" class="size-pill" data-size="medium" aria-pressed="true"><strong>Medium — 12 × 16 in</strong>$40 wholesale</button>' +
    '<button type="button" class="size-pill" data-size="large" aria-pressed="false"><strong>Large — 18 × 24 in</strong>$70 wholesale</button>' +
    '</div>' +
    '<div class="piece-buy-row"><div class="qty-row"><label for="qty-piece">Qty</label>' +
    '<input type="number" id="qty-piece" min="1" max="99" value="1" inputmode="numeric" aria-label="Quantity"></div>' +
    '<button type="button" class="btn btn-primary" id="piece-add">Add to Cart</button></div>' +
    '<p class="added-note" id="piece-note" aria-live="polite"></p>' +
    '</div></div>' +
    '<section class="related"><h2>More from ' + c.name + '</h2><div class="product-row" id="related-grid"></div></section>';
  el.appendChild(wrap);
  let selectedSize = 'medium';
  wrap.querySelectorAll('#piece-sizes .size-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size;
      wrap.querySelectorAll('#piece-sizes .size-pill').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });
  wrap.querySelector('#piece-add').addEventListener('click', () => {
    const qty = parseInt(wrap.querySelector('#qty-piece').value, 10);
    addToCart(p, selectedSize, qty, wrap.querySelector('#piece-note'));
  });
  const grid = wrap.querySelector('#related-grid');
  related.forEach(r => grid.appendChild(createProductCard(r, 'rel-' + r.sku)));
}

/* ---------- cart UI ---------- */
function updateCartUI() {
  const n = cartCount();
  document.getElementById('cart-count').textContent = n;
  const floating = document.getElementById('floating-cart');
  const onBrowse = ['shop', 'collection', 'piece'].some(v => !document.getElementById('view-' + v).hidden);
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
let paystackPayment = null; // { reference, amount } once a card payment succeeds via Paystack

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
  const sub = cartSubtotal();
  const del = deliveryAmount();
  const rows = cart.map(item => {
    const p = findProduct(item.sku); const size = SIZES[item.size];
    return '<tr><td>' + p.sku + '<br>' + p.title + '</td><td>' + size.label + '</td><td>' + item.qty + '</td><td>' + money(item.qty * size.price) + '</td></tr>';
  }).join('');
  return '<table class="summary-table"><thead><tr><th>Work</th><th>Size</th><th>Qty</th><th>Amount</th></tr></thead><tbody>' + rows +
    '</tbody><tfoot><tr><td colspan="3">Subtotal</td><td>' + money(sub) + '</td></tr>' +
    '<tr><td colspan="3">Delivery (' + (DELIVERY[String(del)] ? DELIVERY[String(del)].label : '—') + ')</td><td>' + money(del) + '</td></tr>' +
    '<tr><td colspan="3"><strong>Total</strong></td><td><strong>' + money(sub + del) + '</strong></td></tr></tfoot></table>';
}

function orderSummaryText() {
  const lines = ['Studio TROV — Wholesale Order / INVOICE', 'Invoice number: ' + orderRef, 'Invoice date: ' + invoiceDate, ''];
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
  lines.push('', paymentDetailsText(), '');
  if (paystackPayment) {
    lines.push('Card payment via Paystack: PAID — Paystack reference: ' + paystackPayment.reference + ' (Studio TROV to confirm in the Paystack dashboard before fulfilling).', '');
  } else {
    lines.push('Pay by bank transfer using the details above, with the invoice number as the payment reference — or pay by card via Paystack at the invoice step (if switched on).', '');
  }
  lines.push('Studio TROV will check the payment, then fulfil the order via Creativehub and email your tracking number. Payment is not verified automatically.',
    'All works are unframed art prints. Lead time 3–5 business days. Fulfilled from New York via Creativehub.');
  return lines.join('\n');
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
    // Invoice number + date are generated here, on submitting the order
    // form — the invoice only exists from this point on.
    const d = new Date();
    const ymd = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    orderRef = 'TROV-' + ymd + '-' + Math.floor(1000 + Math.random() * 9000);
    invoiceDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    showView('invoice');
  });
}

/* ---------- invoice (bank transfer) + confirmation ---------- */
function renderInvoice() {
  const sheet = document.getElementById('invoice-sheet');
  let html = '<div class="invoice-sheet">' +
    '<div class="invoice-head"><div><p class="footer-brand">Studio <strong>TROV</strong></p>' +
    '<p class="muted">The architecture of quiet space.<br>thestudiotrov@gmail.com</p></div>' +
    '<div class="invoice-title"><h2>INVOICE</h2>' +
    '<p><strong>Invoice no:</strong> ' + orderRef + '<br><strong>Date:</strong> ' + invoiceDate + '</p></div></div>';
  if (orderData) {
    html += '<div class="invoice-billto"><h3>Bill to</h3><p>' + orderData.fullName + ' — ' + orderData.shopName + '<br>' +
      orderData.street + ', ' + orderData.city + ', ' + orderData.state + ' ' + orderData.postcode + ', ' + orderData.country +
      '<br>' + orderData.email + ' · ' + orderData.phone + '</p>';
    if (!orderData.billingSame) html += '<p><strong>Billing:</strong> ' + orderData.billingStreet + ', ' + orderData.billingCity + ' ' + orderData.billingPostcode + ', ' + orderData.billingCountry + '</p>';
    if (orderData.notes) html += '<p><strong>Delivery notes:</strong> ' + orderData.notes + '</p>';
    html += '</div>';
  }
  html += '<h3>Items</h3>' + orderSummaryHTML() +
    '<h3>Pay by bank transfer (USD)</h3>' +
    '<p>Transfer the total above and use your invoice number as the payment reference.</p>' +
    '<dl class="bank-details">' +
    '<div><dt>Payment reference</dt><dd><strong>' + orderRef + '</strong></dd></div>' +
    '<div><dt>Account holder</dt><dd>' + BANK.holder + '</dd></div>' +
    '<div><dt>Account number</dt><dd>' + BANK.accountNumber + '</dd></div>' +
    '<div><dt>Account type</dt><dd>' + BANK.accountType + '</dd></div>' +
    '<div><dt>ACH routing</dt><dd>' + BANK.achRouting + '</dd></div>' +
    '<div><dt>Bank name</dt><dd>' + BANK.bankName + '</dd></div>' +
    '<div><dt>Wire routing</dt><dd>' + BANK.wireRouting + '</dd></div>' +
    '<div><dt>Bank address</dt><dd>' + BANK.bankAddress + '</dd></div>' +
    '</dl>' +
    '<p class="fineprint">Studio TROV will check the payment, then fulfil your order via Creativehub and email your tracking number. Payment is not verified automatically. All works are unframed art prints. Lead time 3–5 business days. Fulfilled from New York via Creativehub.</p>' +
    '</div>';
  sheet.innerHTML = html;
  const subject = encodeURIComponent('Studio TROV Invoice — ' + orderRef + ' — ' + (orderData ? orderData.shopName : ''));
  const body = encodeURIComponent(orderSummaryText());
  document.getElementById('email-invoice-btn').href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;
  document.getElementById('email-order-btn').href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;
  updatePaystackButton();
}

/* ---------- Paystack card payments (public key required — see top of file) ---------- */
let paystackScriptLoading = null;
function ensurePaystackScript() {
  if (typeof window !== 'undefined' && window.PaystackPop) return Promise.resolve(true);
  if (paystackScriptLoading) return paystackScriptLoading;
  paystackScriptLoading = new Promise(resolve => {
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.onload = () => resolve(!!window.PaystackPop);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
  return paystackScriptLoading;
}
function paystackTotalCents() {
  return Math.round((cartSubtotal() + deliveryAmount()) * 100);
}
function updatePaystackButton() {
  const btn = document.getElementById('paystack-btn');
  const status = document.getElementById('paystack-status');
  const desc = document.getElementById('paystack-desc');
  if (!btn || !status) return;
  const total = money(cartSubtotal() + deliveryAmount());
  if (paystackPayment) {
    btn.disabled = true;
    btn.textContent = 'Paid by card via Paystack ✓ — ' + total;
    status.textContent = 'Card payment received via Paystack. Paystack reference: ' + paystackPayment.reference + '. Studio TROV will confirm it in the Paystack dashboard before fulfilling.';
    return;
  }
  if (!PAYSTACK_PUBLIC_KEY) {
    btn.disabled = true;
    btn.textContent = 'Pay by card via Paystack — coming soon, add public key';
    status.textContent = 'Card payment is not switched on yet — the Paystack public key still needs to be added. Bank transfer above works now.';
    if (desc) desc.textContent = 'Pay the invoice total (' + total + ') by card through Paystack.';
    return;
  }
  btn.disabled = false;
  btn.textContent = 'Pay ' + total + ' by card via Paystack';
  status.textContent = 'You will be taken to Paystack to pay by card. If you cancel, you will come back here — your order is not lost, and bank transfer above still works.';
  if (desc) desc.textContent = 'Pay the invoice total (' + total + ') by card through Paystack.';
}
function initPaystack() {
  document.getElementById('paystack-btn').addEventListener('click', async () => {
    const status = document.getElementById('paystack-status');
    if (!PAYSTACK_PUBLIC_KEY) {
      status.textContent = 'Card payment is not switched on yet — the Paystack public key still needs to be added. Bank transfer above works now.';
      return;
    }
    if (!orderData || !orderRef) { status.textContent = 'Please complete the order form first.'; return; }
    const ok = await ensurePaystackScript();
    if (!ok || !window.PaystackPop) {
      status.textContent = 'Paystack could not be loaded — please check your connection and try again, or pay by bank transfer above.';
      return;
    }
    const totalCents = paystackTotalCents();
    try {
      window.PaystackPop.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: orderData.email,
        amount: totalCents,
        currency: 'USD',
        ref: orderRef,
        metadata: { custom_fields: [
          { display_name: 'Buyer', variable_name: 'buyer_name', value: orderData.fullName },
          { display_name: 'Shop', variable_name: 'shop_name', value: orderData.shopName }
        ]},
        onSuccess: function (transaction) {
          paystackPayment = { reference: transaction.reference, amount: totalCents };
          updatePaystackButton();
          showView('confirmation');
        },
        onClose: function () {
          status.textContent = 'Card payment was cancelled — your order is still here. You can pay by bank transfer above, or try card again.';
        }
      });
    } catch (e) {
      status.textContent = 'Card payment could not be started — please try again, or pay by bank transfer above.';
    }
  });
}

function renderConfirmation() {
  document.getElementById('order-ref').textContent = orderRef || '—';
  const note = document.getElementById('confirmation-payment-note');
  if (paystackPayment) {
    note.innerHTML = '<div class="notice notice-paid" role="status"><strong>Card payment received via Paystack.</strong><br>Paystack reference: <strong>' + paystackPayment.reference + '</strong><br>Studio TROV will confirm it in the Paystack dashboard before fulfilling your order — payment is not verified automatically.</div>';
  } else {
    note.innerHTML = '<div class="notice" role="note"><strong>Pay by bank transfer</strong> using the details on your invoice, with invoice number <strong>' + orderRef + '</strong> as the reference — or pay by card via Paystack at the invoice step. Studio TROV will check the payment, then fulfil your order via Creativehub and email your tracking number. Payment is not verified automatically.</div>';
  }
  let html = orderSummaryHTML();
  if (orderData) {
    html += '<h2 style="margin-top:20px">Delivery to</h2><p>' + orderData.fullName + ' — ' + orderData.shopName + '<br>' +
      orderData.street + ', ' + orderData.city + ', ' + orderData.state + ' ' + orderData.postcode + ', ' + orderData.country +
      '<br>' + orderData.email + ' · ' + orderData.phone + '</p>';
    if (orderData.notes) html += '<p><strong>Delivery notes:</strong> ' + orderData.notes + '</p>';
  }
  document.getElementById('confirmation-summary').innerHTML = html;
}

function initInvoice() {
  document.getElementById('print-invoice-btn').addEventListener('click', () => window.print());
  document.getElementById('copy-payment-btn').addEventListener('click', async () => {
    const status = document.getElementById('invoice-copy-status');
    try { await navigator.clipboard.writeText(paymentDetailsText()); status.textContent = 'Payment details copied to clipboard.'; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = paymentDetailsText(); document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); status.textContent = 'Payment details copied to clipboard.'; } catch (e2) { status.textContent = 'Copy did not work in this browser — please copy the details from the invoice instead.'; }
      ta.remove();
    }
  });
  document.getElementById('copy-order-btn-invoice').addEventListener('click', async () => {
    const status = document.getElementById('invoice-copy-status');
    try { await navigator.clipboard.writeText(orderSummaryText()); status.textContent = 'Order summary copied to clipboard.'; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = orderSummaryText(); document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); status.textContent = 'Order summary copied to clipboard.'; } catch (e2) { status.textContent = 'Copy did not work in this browser — please use the email button instead.'; }
      ta.remove();
    }
  });
  document.getElementById('invoice-done-btn').addEventListener('click', () => showView('confirmation'));
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
  document.getElementById('confirmation-print-btn').addEventListener('click', () => showView('invoice'));
  document.getElementById('new-order-btn').addEventListener('click', () => {
    cart = []; orderData = null; orderRef = ''; invoiceDate = ''; paystackPayment = null; saveCart(); updateCartUI(); renderCart();
    document.getElementById('invoice-sheet').innerHTML = '';
    document.getElementById('confirmation-payment-note').innerHTML = '';
    document.getElementById('order-form').reset();
    showView('shop');
  });
}

/* ---------- navigation (delegated — covers dynamically added links too) ---------- */
function initNav() {
  document.addEventListener('click', e => {
    const pieceLink = e.target.closest('[data-piece]');
    if (pieceLink) { e.preventDefault(); showView('piece', pieceLink.dataset.piece); return; }
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
initInvoice();
initPaystack();
initConfirmation();
renderCart();
updateCartUI();
showView('shop');
