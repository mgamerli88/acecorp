const price = 16;
let quantity = 0;

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

function euro(value) {
  return value.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function renderCart() {
  cartCount.textContent = quantity;
  cartTotal.textContent = euro(quantity * price);
  checkoutButton.disabled = quantity === 0;

  if (quantity === 0) {
    cartItems.innerHTML = '<div class="cart-empty"><span>＋</span><p>Tu cesta está vacía.</p><small>Añade el producto para empezar.</small></div>';
    return;
  }

  cartItems.innerHTML = `
    <div class="cart-row">
      <div><strong>ACE Battlegrounds</strong><small>${euro(price)} / unidad</small></div>
      <div class="quantity">
        <button type="button" id="decrease" aria-label="Quitar una unidad">−</button>
        <strong>${quantity}</strong>
        <button type="button" id="increase" aria-label="Añadir una unidad">+</button>
      </div>
    </div>`;
  document.getElementById("decrease").addEventListener("click", () => {
    quantity = Math.max(0, quantity - 1);
    renderCart();
  });
  document.getElementById("increase").addEventListener("click", () => {
    quantity += 1;
    renderCart();
  });
}

document.getElementById("addToCart").addEventListener("click", () => {
  quantity += 1;
  renderCart();
  cartItems.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

checkoutButton.addEventListener("click", () => {
  if (quantity > 0) {
    alert(`Esta es una cesta de demostración.\\n\\nProducto: ACE Battlegrounds\\nUnidades: ${quantity}\\nTotal provisional: ${euro(quantity * price)}\\n\\nTodavía no se pueden realizar pedidos ni pagos.`);
  }
});

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

document.querySelectorAll(".nav-link, .brand, .mobile-brand, .footer-brand, .back-top").forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => observer.observe(section));

renderCart();
