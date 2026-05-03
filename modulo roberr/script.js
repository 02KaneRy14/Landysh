/* ====================================
   LANDYSH — script.js
   Funciones: carrito, búsqueda, formulario, accesibilidad
==================================== */

// ============================
// UTILIDADES GENERALES
// ============================
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

// ============================
// CARRO DE COMPRAS
// ============================
let cart = JSON.parse(localStorage.getItem("landyshCart")) || [];

const cartBtn = qs("#cartBtn");
const cartEl = qs("#cart");
const cartItemsEl = qs("#cartItems");
const cartSubtotalEl = qs("#cartSubtotal");
const checkoutBtn = qs("#checkoutBtn");

// Contador de productos en el carrito
function updateCartCount() {
  qs("#cartCount").textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// Renderizar el carrito
function renderCart() {
  cartItemsEl.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<li>Tu carrito está vacío</li>`;
    cartSubtotalEl.textContent = "0.00";
    updateCartCount();
    return;
  }

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-qty">x${item.quantity}</span>
      <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="btn btn-ghost btn-remove" data-id="${item.id}" aria-label="Eliminar ${item.name}">X</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartSubtotalEl.textContent = subtotal.toFixed(2);
  updateCartCount();
}

// Agregar producto al carrito
function addToCart(productId) {
  const productCard = qs(`.producto-card[data-id="${productId}"]`);
  const name = productCard.querySelector(".producto-nombre").textContent;
  const price = parseFloat(productCard.dataset.price);

  const existing = cart.find((p) => p.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, name, price, quantity: 1 });
  }

  localStorage.setItem("landyshCart", JSON.stringify(cart));
  renderCart();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
  cart = cart.filter((p) => p.id !== productId);
  localStorage.setItem("landyshCart", JSON.stringify(cart));
  renderCart();
}

// Evento botones "Agregar al carrito"
qsa("[data-add-to-cart]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId = btn.dataset.productId;
    addToCart(productId);
  });
});

// Evento botón eliminar
cartItemsEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-remove")) {
    const productId = e.target.dataset.id;
    removeFromCart(productId);
  }
});

// Mostrar / ocultar carrito
cartBtn.addEventListener("click", () => {
  const expanded = !cartEl.hasAttribute("hidden");
  if (expanded) {
    cartEl.setAttribute("hidden", "");
    cartBtn.setAttribute("aria-expanded", "false");
  } else {
    cartEl.removeAttribute("hidden");
    cartBtn.setAttribute("aria-expanded", "true");
    renderCart();
  }
});

// ============================
// MENÚ RESPONSIVO
// ============================
const mobileMenuBtn = qs("#mobileMenuBtn");
const siteNav = qs("#siteNav");

mobileMenuBtn.addEventListener("click", () => {
  const expanded = siteNav.getAttribute("aria-expanded") === "true";
  siteNav.setAttribute("aria-expanded", !expanded);
  siteNav.classList.toggle("open");
});

// ============================
// BÚSQUEDA DE PRODUCTOS
// ============================
const searchForm = qs("#searchForm");
const searchInput = qs("#searchInput");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.toLowerCase();
  qsa(".producto-card").forEach((card) => {
    const name = card.querySelector(".producto-nombre").textContent.toLowerCase();
    const desc = card.querySelector(".producto-desc").textContent.toLowerCase();
    if (name.includes(query) || desc.includes(query)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});

// ============================
// FORMULARIO DE CONTACTO
// ============================
const contactForm = qs("#contactForm");
const formFeedback = qs("#formFeedback");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = qs("#nombre").value.trim();
  const email = qs("#email").value.trim();
  const mensaje = qs("#mensaje").value.trim();

  if (nombre.length < 3) {
    showFeedback("Nombre demasiado corto.");
    return;
  }
  if (!validateEmail(email)) {
    showFeedback("Correo electrónico inválido.");
    return;
  }
  if (mensaje.length < 10) {
    showFeedback("Mensaje demasiado corto.");
    return;
  }

  showFeedback("Mensaje enviado correctamente!", true);
  contactForm.reset();
});

// Feedback visual del formulario
function showFeedback(msg, success = false) {
  formFeedback.textContent = msg;
  formFeedback.hidden = false;
  formFeedback.style.color = success ? "lightgreen" : "tomato";
  setTimeout(() => (formFeedback.hidden = true), 4000);
}

// Validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

// ============================
// ACCESIBILIDAD (SKIP LINK FOCUS)
// ============================
const skipLink = qs(".skip-link");
skipLink.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    qs(skipLink.getAttribute("href")).focus();
  }
});

// ============================
// INICIALIZACIÓN
// ============================
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
