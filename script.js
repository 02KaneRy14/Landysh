/* ====================================
   LANDYSH — script.js
==================================== */

// ============================
// UTILIDADES
// ============================
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

// ============================
// CARRITO
// ============================
let cart = JSON.parse(localStorage.getItem("landyshCart")) || [];

const cartBtn = qs("#cartBtn");
const cartEl = qs("#cart");
const cartItemsEl = qs("#cartItems");
const cartSubtotalEl = qs("#cartSubtotal");

// Contador
function updateCartCount() {
  const countEl = qs("#cartCount");
  if (countEl) {
    countEl.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  }
}

// Render
function renderCart() {
  if (!cartItemsEl || !cartSubtotalEl) return;

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
    li.innerHTML = `
      <span>${item.name}</span>
      <span>x${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="btn-remove" data-id="${item.id}">X</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartSubtotalEl.textContent = subtotal.toFixed(2);
  updateCartCount();
}

// Agregar
function addToCart(productId) {
  const productCard = qs(`.producto-card[data-id="${productId}"]`);
  if (!productCard) return;

  const name = productCard.querySelector(".producto-nombre").textContent;
  const price = parseFloat(productCard.dataset.price);

  const existing = cart.find(p => p.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, name, price, quantity: 1 });
  }

  localStorage.setItem("landyshCart", JSON.stringify(cart));
  renderCart();
}

// Eliminar
function removeFromCart(productId) {
  cart = cart.filter(p => p.id !== productId);
  localStorage.setItem("landyshCart", JSON.stringify(cart));
  renderCart();
}

// Botones agregar
qsa("[data-add-to-cart]").forEach(btn => {
  btn.addEventListener("click", () => {
    addToCart(btn.dataset.productId);
  });
});

// Botón eliminar
if (cartItemsEl) {
  cartItemsEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-remove")) {
      removeFromCart(e.target.dataset.id);
    }
  });
}

// Abrir / cerrar carrito
if (cartBtn && cartEl) {
  cartBtn.addEventListener("click", () => {
    const abierto = !cartEl.hasAttribute("hidden");

    if (abierto) {
      cartEl.setAttribute("hidden", "");
      cartBtn.setAttribute("aria-expanded", "false");
    } else {
      cartEl.removeAttribute("hidden");
      cartBtn.setAttribute("aria-expanded", "true");
      renderCart();
    }
  });
}

// ============================
// MENÚ HAMBURGUESA
// ============================
const mobileMenuBtn = qs("#mobileMenuBtn");
const siteNav = qs("#siteNav");

if (mobileMenuBtn && siteNav) {
  mobileMenuBtn.addEventListener("click", () => {
    siteNav.classList.toggle("active");
  });
}

// ============================
// BÚSQUEDA
// ============================
const searchForm = qs("#searchForm");
const searchInput = qs("#searchInput");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = searchInput.value.toLowerCase();

    qsa(".producto-card").forEach(card => {
      const name = card.querySelector(".producto-nombre").textContent.toLowerCase();
      const desc = card.querySelector(".producto-desc").textContent.toLowerCase();

      card.style.display =
        name.includes(query) || desc.includes(query)
          ? ""
          : "none";
    });
  });
}

// ============================
// FORMULARIO
// ============================
const contactForm = qs("#contactForm");
const formFeedback = qs("#formFeedback");

if (contactForm && formFeedback) {
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
      showFeedback("Correo inválido.");
      return;
    }

    if (mensaje.length < 10) {
      showFeedback("Mensaje demasiado corto.");
      return;
    }

    showFeedback("Mensaje enviado!", true);
    contactForm.reset();
  });
}

// Feedback
function showFeedback(msg, success = false) {
  if (!formFeedback) return;

  formFeedback.textContent = msg;
  formFeedback.hidden = false;
  formFeedback.style.color = success ? "lightgreen" : "tomato";

  setTimeout(() => {
    formFeedback.hidden = true;
  }, 4000);
}

// Email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
