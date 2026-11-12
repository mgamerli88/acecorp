// ACE.Corp 3.0 — navegación, cesta y animaciones al desplazarse.
const price = 16;
let quantity = 0;

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const totalValue = document.getElementById("cartTotal");

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
    animateTotal();
  });
  document.getElementById("increase").addEventListener("click", () => {
    quantity += 1;
    renderCart();
    animateTotal();
  });
}

function animateTotal() {
  totalValue.classList.remove("bump");
  // Reflow restarts the short CSS animation after each cart update.
  void totalValue.offsetWidth;
  totalValue.classList.add("bump");
}

document.getElementById("addToCart").addEventListener("click", () => {
  quantity += 1;
  renderCart();
  animateTotal();
  cartItems.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

checkoutButton.addEventListener("click", () => {
  if (quantity > 0) {
    alert(`Esta es una cesta de demostración.\\n\\nProducto: ACE Battlegrounds\\nUnidades: ${quantity}\\nTotal provisional: ${euro(quantity * price)}\\n\\nTodavía no se pueden realizar pedidos ni pagos.`);
  }
});

// Menú móvil.
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

// Animaciones de aparición: los elementos entran cuando se acercan al área visible.
document.documentElement.classList.add("js-motion");
const revealGroups = [
  [".section-heading", "reveal from-left"],
  [".intro-mark", "reveal from-left"],
  [".intro-text", "reveal from-right"],
  [".feature-strip > div", "reveal"],
  [".material-card", "reveal scale-in"],
  [".media-placeholder", "reveal"],
  [".eco-copy", "reveal from-left"],
  [".eco-graphic", "reveal from-right"],
  [".product-card", "reveal from-left"],
  [".cart-card", "reveal from-right"],
  [".footer-main", "reveal"],
  [".partner > div", "reveal from-left"],
  [".partner-logo", "reveal from-right"]
];

const revealElements = [];
revealGroups.forEach(([selector, classes]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add(...classes.split(" "));
    if (element.matches(".feature-strip > div, .material-card")) {
      element.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 90}ms`);
    }
    revealElements.push(element);
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("is-visible"));
}

// Barra de progreso superior.
const progress = document.getElementById("scrollProgress");
let ticking = false;
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollProgress);
    ticking = true;
  }
}, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

// Resalta la sección actual en el menú lateral.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));
}

// Diagnóstico visual de imágenes: si falta un PNG, no queda un hueco roto sin explicación.
document.querySelectorAll("img").forEach(img => {
  const showFallback = () => {
    if (img.dataset.fallbackShown === "true") return;
    img.dataset.fallbackShown = "true";
    img.classList.add("image-missing");
    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.textContent = img.alt || "IMAGEN NO DISPONIBLE";
    img.insertAdjacentElement("afterend", fallback);
  };
  img.addEventListener("error", showFallback, { once: true });
  if (img.complete && img.naturalWidth === 0) showFallback();
});

renderCart();
