// Engineering Printing storefront logic: catalogue, cart, discount and orders.
// The site is static, so orders go through Web3Forms, which emails them on.
"use strict";

// Delivery endpoint. It accepts JSON and returns JSON, so the page never redirects.
const ORDER_ENDPOINT = "https://api.web3forms.com/submit";
const CART_KEY = "ep-cart-v1";

// In-memory cart. Saving to the browser is only a convenience, so it may fail.
let cart = loadCart();
let activeFilter = "All";

const $ = (id) => document.getElementById(id);
const money = (n) => `$${n.toFixed(2)}`;
const productById = (id) => PRODUCTS.find((p) => p.id === id);
// Unit price for a cart line: the chosen option's price, or the product price.
const unitPrice = (line) => {
  const p = productById(line.id);
  const opt = (p.options || []).find((o) => o.label === line.option);
  return opt ? opt.price : p.price;
};
// Card and dialog price label, for example "From $3.00 CAD" or "Quoted per file".
const priceLabel = (p) => p.quote ? "Quoted per file" : p.options ? `From ${money(Math.min(...p.options.map((o) => o.price)))} CAD` : `${money(p.price)} CAD`;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    // Drop saved lines for products that no longer exist.
    return Array.isArray(saved) ? saved.filter((l) => PRODUCTS.some((p) => p.id === l.id && !p.quote)) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* Private windows can block storage */ }
}

// Builds a live plaque preview. textContent keeps customer text from becoming HTML.
function plaqueNode(text, colour) {
  const el = document.createElement("div");
  el.className = /on blue/.test(colour || "") ? "plaque on-blue" : "plaque";
  el.textContent = text || "YOUR TEXT";
  return el;
}

// Returns the visual for a product: a real photo when one is listed, otherwise
// the plaque preview or the original drawing.
function visual(product, text, colour) {
  if (product.photo) {
    const img = new Image();
    img.src = product.photo;
    img.alt = product.name;
    img.loading = "lazy";
    return img;
  }
  if (product.art === "plaque") return plaqueNode(text, colour);
  const holder = document.createElement("div");
  holder.className = "art";
  holder.innerHTML = ART[product.art]; // Trusted: static strings from art.js
  return holder;
}

function renderFilters() {
  const groups = ["All", ...new Set(PRODUCTS.map((p) => p.category))];
  $("filters").replaceChildren(...groups.map((g) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = g;
    b.setAttribute("aria-pressed", String(g === activeFilter));
    b.onclick = () => { activeFilter = g; renderFilters(); renderGrid(); };
    return b;
  }));
}

function renderGrid() {
  const shown = PRODUCTS.filter((p) => activeFilter === "All" || p.category === activeFilter);
  $("productGrid").replaceChildren(...shown.map((p) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.id = p.id;
    const thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.append(visual(p));
    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h3");
    title.textContent = p.name;
    const blurb = document.createElement("p");
    blurb.textContent = p.blurb;
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = priceLabel(p);
    body.append(title, blurb, price);
    card.append(thumb, body);
    if (p.tag) {
      // Small corner label for highlighted products.
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = p.tag;
      card.append(tag);
    }
    card.onclick = () => (p.quote ? $("custom").scrollIntoView({ behavior: "smooth" }) : openProduct(p));
    return card;
  }));
}

// Opens the product dialog with colour, quantity and any custom text controls.
function openProduct(p) {
  const body = $("productBody");
  body.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "detail";

  const left = document.createElement("div");
  const stage = document.createElement("div");
  stage.className = "thumb";
  stage.append(visual(p));
  left.append(stage);

  const right = document.createElement("form");
  right.innerHTML = `<h2></h2><p class="desc"></p><p class="fine size"></p><p class="price"></p>
    <label>Colour <select name="colour"></select></label>
    <label>Quantity <input name="qty" type="number" min="1" max="${STORE.maxQuantity}" value="1" required></label>
    <p class="error" role="alert"></p>
    <button class="btn primary wide" type="submit">Add to cart</button>`;
  right.querySelector("h2").textContent = p.name;
  right.querySelector(".desc").textContent = p.blurb;
  right.querySelector(".size").textContent = `${p.size}. Printed in PLA.`;
  right.querySelector(".price").textContent = priceLabel(p);
  const select = right.elements.colour;
  p.colours.forEach((c) => select.add(new Option(c, c)));

  // Optional pricing choice, such as a single key cap or a full keyboard set.
  let optionSelect = null;
  if (p.options) {
    const label = document.createElement("label");
    label.textContent = "Option ";
    optionSelect = document.createElement("select");
    optionSelect.name = "option";
    p.options.forEach((o) => optionSelect.add(new Option(`${o.label} (${money(o.price)})`, o.label)));
    label.append(optionSelect);
    select.closest("label").before(label);
  }

  let textInput = null;
  if (p.custom) {
    const label = document.createElement("label");
    label.textContent = `Your text (up to ${STORE.plaqueMaxChars} characters) `;
    textInput = document.createElement("input");
    textInput.name = "customText";
    textInput.maxLength = STORE.plaqueMaxChars;
    textInput.required = true;
    label.append(textInput);
    select.closest("label").before(label);
    const refresh = () => stage.replaceChildren(plaqueNode(textInput.value, select.value));
    textInput.oninput = refresh;
    select.onchange = refresh;
  }

  right.onsubmit = (e) => {
    e.preventDefault();
    const qty = Number(right.elements.qty.value);
    const text = textInput ? textInput.value.trim() : "";
    const err = right.querySelector(".error");
    if (!Number.isInteger(qty) || qty < 1 || qty > STORE.maxQuantity) {
      err.textContent = `Enter a quantity from 1 to ${STORE.maxQuantity}.`;
      return;
    }
    if (textInput && !text) { err.textContent = "Enter the text you want printed."; return; }
    addToCart(p.id, select.value, qty, text, optionSelect ? optionSelect.value : "");
    $("productDialog").close();
    openCart();
  };

  wrap.append(left, right);
  body.append(wrap);
  $("productDialog").showModal();
}

// Merges matching lines so one colour and text combination stays on one row.
function addToCart(id, colour, qty, text, option = "") {
  const line = cart.find((l) => l.id === id && l.colour === colour && (l.text || "") === text && (l.option || "") === option);
  if (line) line.qty = Math.min(line.qty + qty, STORE.maxQuantity);
  else cart.push({ id, colour, qty, text, option });
  saveCart();
  renderCart();
}

// Checks a school address against .edu or the accepted Canadian school domains.
function isSchoolEmail(value) {
  const domain = (value || "").trim().toLowerCase().split("@")[1];
  if (!domain || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return false;
  if (/\.edu$/.test(domain)) return true;
  return SCHOOL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
}

// All money is worked out here so the screen and the email always agree.
function totals() {
  const form = $("checkoutForm");
  const subtotal = cart.reduce((sum, l) => sum + unitPrice(l) * l.qty, 0);
  const student = isSchoolEmail(form.elements.schoolEmail.value);
  const discount = student ? Math.round(subtotal * STORE.studentRate * 100) / 100 : 0;
  const shipping = cart.length && form.elements.delivery.value === "ship" ? STORE.shippingFlat : 0;
  return { subtotal, student, discount, shipping, total: subtotal - discount + shipping };
}

function renderTotals() {
  const t = totals();
  const rows = [["Items", money(t.subtotal)]];
  if (t.student) rows.push(["Student discount (10%)", `-${money(t.discount)}`]);
  rows.push(["Shipping", t.shipping ? money(t.shipping) : "Free"], ["Estimated total", `${money(t.total)} CAD`]);
  $("totals").replaceChildren(...rows.flatMap(([k, v], i) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = v;
    if (i === rows.length - 1) { dt.className = "grand"; dd.className = "grand"; }
    return [dt, dd];
  }));
  const school = $("schoolEmail").value.trim();
  $("studentHint").textContent = !school ? "" : t.student
    ? "10% student discount applied. We confirm this before accepting your order."
    : "This address is not recognized. Email us if your school is missing.";
}

function renderCart() {
  $("cartCount").textContent = cart.reduce((n, l) => n + l.qty, 0);
  const list = $("cartItems");
  $("checkoutForm").hidden = !cart.length;
  if (!cart.length) {
    list.textContent = "Your cart is empty.";
    return;
  }
  list.replaceChildren(...cart.map((l, i) => {
    const p = productById(l.id);
    const row = document.createElement("div");
    row.className = "line";
    const info = document.createElement("div");
    info.textContent = p.name;
    const meta = document.createElement("small");
    meta.textContent = [l.option, l.colour, l.text && `"${l.text}"`, `${money(unitPrice(l))} each`].filter(Boolean).join(" | ");
    info.append(meta);
    const qty = document.createElement("input");
    qty.type = "number";
    qty.min = 1;
    qty.max = STORE.maxQuantity;
    qty.value = l.qty;
    qty.setAttribute("aria-label", `Quantity of ${p.name}`);
    qty.onchange = () => {
      // Keep quantities whole and inside the allowed range.
      l.qty = Math.min(Math.max(Math.round(Number(qty.value)) || 1, 1), STORE.maxQuantity);
      saveCart();
      renderCart();
    };
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.onclick = () => { cart.splice(i, 1); saveCart(); renderCart(); };
    row.append(info, qty, remove);
    return row;
  }));
  renderTotals();
}

function openCart() {
  $("orderDone").hidden = true;
  renderCart();
  if (!$("cartDialog").open) $("cartDialog").showModal();
}

// Short readable reference, for example EP-M2K4Q-7F.
function orderNumber() {
  const random = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `EP-${Date.now().toString(36).toUpperCase().slice(-5)}-${random}`;
}

// Writes the plain-text order that lands in the inbox.
function orderText(order, t) {
  const lines = cart.map((l, i) => {
    const p = productById(l.id);
    const text = l.text ? `, text: "${l.text}"` : "";
    const opt = l.option ? ` | Option: ${l.option}` : "";
    return `${i + 1}. ${p.name}${opt} | Colour: ${l.colour} | Quantity: ${l.qty}${text} | ${money(unitPrice(l) * l.qty)}`;
  });
  return [
    `Order ${order}`, "", ...lines, "",
    `Items: ${money(t.subtotal)}`,
    t.student ? `Student discount: -${money(t.discount)} (VERIFY school email)` : "Student discount: none",
    `Shipping: ${t.shipping ? money(t.shipping) : "Free pickup"}`,
    `Total: ${money(t.total)} CAD`,
  ].join("\n");
}

async function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const error = $("formError");
  error.textContent = "";
  const f = form.elements;

  // Silently drop bot submissions that filled in the hidden trap field.
  if (f._honey.value) return;

  const ship = f.delivery.value === "ship";
  if (!f.name.value.trim()) { error.textContent = "Enter your name."; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { error.textContent = "Enter a valid email."; return; }
  if (ship && !f.address.value.trim()) { error.textContent = "Enter your shipping address."; return; }

  const t = totals();
  const order = orderNumber();
  const button = $("submitOrder");
  button.disabled = true;
  button.textContent = "Sending...";

  try {
    const response = await fetch(ORDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: STORE.web3formsKey,
        subject: `New order ${order}: ${money(t.total)} CAD`,
        from_name: "Engineering Printing store",
        replyto: f.email.value.trim(),
        Order: orderText(order, t),
        Name: f.name.value.trim(),
        Email: f.email.value.trim(),
        "School email": t.student ? f.schoolEmail.value.trim() : "None",
        Delivery: ship ? "Ship in Canada" : "GTA pickup",
        Address: ship ? f.address.value.trim() : "Pickup",
        Notes: f.notes.value.trim() || "None",
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || String(result.success) === "false") throw new Error(result.message || "Order failed");

    // Success: clear the cart and show the customer their reference.
    cart = [];
    saveCart();
    form.reset();
    renderCart();
    form.hidden = true;
    const done = $("orderDone");
    done.hidden = false;
    done.innerHTML = "<h3>Order received</h3><p></p>";
    done.querySelector("p").textContent = `Your order number is ${order}. We will email your final total and e-Transfer details soon.`;
  } catch {
    // Keep the cart so nothing is lost, and offer the same order as a prefilled email.
    const details = `${orderText(order, t)}\n\nName: ${f.name.value.trim()}\nEmail: ${f.email.value.trim()}\nDelivery: ${ship ? f.address.value.trim() : "GTA pickup"}\nNotes: ${f.notes.value.trim() || "None"}`;
    const link = document.createElement("a");
    link.href = `mailto:${STORE.orderEmail}?subject=${encodeURIComponent(`Order ${order}`)}&body=${encodeURIComponent(details)}`;
    link.textContent = "Email this order instead";
    error.textContent = "We could not send your order. Please try again, or ";
    error.append(link);
  } finally {
    button.disabled = false;
    button.textContent = "Send order";
  }
}

// Page start-up.
$("openCart").onclick = openCart;
$("checkoutForm").addEventListener("submit", submitOrder);
$("checkoutForm").addEventListener("input", renderTotals);
$("checkoutForm").addEventListener("change", () => {
  $("addressField").hidden = $("checkoutForm").elements.delivery.value !== "ship";
  renderTotals();
});
renderFilters();
renderGrid();
renderCart();

// Fills the animated hero drawing from art.js.
$("heroFan").innerHTML = HERO_FAN;

// ---------- Custom print uploads ----------
// The upload form posts straight to FormSubmit as multipart data, because the
// order service used by the cart only accepts files on a paid plan.
const UPLOAD_LIMIT = 10 * 1024 * 1024; // FormSubmit caps all files at 10 MB per submission
const UPLOAD_TYPES = /\.(stl|3mf|obj|step|stp|iges|igs|sldprt|sldasm|slddrw|catpart|catproduct|catdrawing|pdf|dwg|dxf|zip)$/i;
const customForm = $("customForm");
if (customForm) {
  // Send customers back to this page with a success flag after the upload.
  customForm.elements._next.value = `${location.origin}${location.pathname}?sent=custom#custom`;
  customForm.addEventListener("submit", (e) => {
    const err = $("customError");
    const file = customForm.elements.attachment.files[0];
    err.textContent = "";
    if (customForm.elements._honey.value) { e.preventDefault(); return; }
    if (!file) { e.preventDefault(); err.textContent = "Attach your design file."; return; }
    if (!UPLOAD_TYPES.test(file.name)) { e.preventDefault(); err.textContent = "Use an STL, 3MF, STEP, SolidWorks, CATIA, PDF drawing or ZIP file."; return; }
    if (file.size > UPLOAD_LIMIT) { e.preventDefault(); err.textContent = `That file is ${(file.size / 1048576).toFixed(1)} MB. Zip it or email it to ${STORE.orderEmail} instead (10 MB maximum).`; return; }
    // Readable subject so requests stand out in the inbox.
    customForm.elements._subject.value = `Custom print request from ${customForm.elements.name.value.trim() || "a customer"}`;
    $("customSubmit").disabled = true;
    $("customSubmit").textContent = "Uploading...";
  });
  // Show the confirmation after FormSubmit redirects back here.
  if (new URLSearchParams(location.search).get("sent") === "custom") {
    customForm.hidden = true;
    $("customDone").hidden = false;
  }
}
