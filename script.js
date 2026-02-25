const container = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");

let products = [];
let filteredProducts = [];
let currentFilter = "all"; // valor del filtro de navegación

/* ===== CARGAR PRODUCTOS DESDE JSON ===== */
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;

    // Opcional: Sincronizar stock con inventario guardado (si se implementara persistencia de inventario)
    // const savedInventory = JSON.parse(localStorage.getItem('inventory'));
    // if(savedInventory) { ... actualizar products ... }

    filteredProducts = [...products];
    renderProducts(filteredProducts);
  })
  .catch((error) => {
    container.innerHTML = "Error cargando productos";
    console.error(error);
  });

/* ===== MOSTRAR PRODUCTOS ===== */
function renderProducts(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No hay productos</p>";
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="product-name">
        ${product.name}
      </div>

      <div class="product-description">
        ${product.description}
      </div>

      <div class="product-price">
        $${product.price}
      </div>

      <div class="product-stock">
        Disponibles: ${product.stock}
      </div>

      <div class="product-actions" style="margin-top: 10px; display: flex; gap: 5px; justify-content: center;">
         <input type="number" id="qty-${product.id}" value="1" min="1" max="${product.stock}" style="width: 50px; padding: 5px;">
         <button onclick="addToCart(${product.id})" style="background-color: #28a745; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Agregar</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Función global para conectar el botón con la clase Cart
// Modificado por: Roger Ramirez (RR)
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const qtyInput = document.getElementById(`qty-${productId}`);
  const quantity = parseInt(qtyInput.value);

  if (quantity > 0) {
    myCart.addItem(product, quantity);
  } else {
    alert("Por favor ingrese una cantidad válida.");
  }
}

// Inicializar eventos del carrito al cargar
// Modificado por: Roger Ramirez (RR)
document.addEventListener("DOMContentLoaded", () => {
  myCart.updateCartIcon();

  // Configurar modales
  const cartModal = document.getElementById("cart-modal");
  const invoiceModal = document.getElementById("invoice-modal");

  // Botones para abrir modal
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      cartModal.style.display = "block";
      myCart.renderCart();
    });
  }

  // Botones de cerrar (X)
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", () => {
      cartModal.style.display = "none";
      invoiceModal.style.display = "none";
    });
  });

  // Botones dentro del modal carrito
  const clearBtn = document.getElementById("clear-cart-btn");
  if (clearBtn) clearBtn.addEventListener("click", () => myCart.clearCart());

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn)
    checkoutBtn.addEventListener("click", () => myCart.checkout());

  // Botones dentro del modal factura
  const confirmBtn = document.getElementById("confirm-purchase-btn");
  if (confirmBtn)
    confirmBtn.addEventListener("click", () => myCart.confirmPurchase());

  const backCartBtn = document.getElementById("back-to-cart-btn");
  if (backCartBtn) {
    backCartBtn.addEventListener("click", () => {
      invoiceModal.style.display = "none";
      cartModal.style.display = "block";
    });
  }

  // Cerrar modales al hacer click fuera
  window.onclick = function (event) {
    if (event.target == cartModal) {
      cartModal.style.display = "none";
    }
    if (event.target == invoiceModal) {
      // invoiceModal.style.display = "none";
    }
  };
});

/* ===== FILTROS Y BUSCADOR ===== */

// Aplica el filtro de categoría y la búsqueda de texto
function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();

  // comienza por aplicar el filtro de categoría
  if (currentFilter === "all") {
    filteredProducts = [...products];
  } else if (currentFilter === "ofertas") {
    filteredProducts = products.filter((p) => Number(p.price) < 100);
  } else {
    filteredProducts = products.filter(
      (p) => p.category && p.category.toLowerCase().trim() === currentFilter,
    );
  }

  // si hay texto en el buscador, filtra también por nombre/descripcion
  if (query !== "") {
    filteredProducts = filteredProducts.filter((p) => {
      const name = p.name ? p.name.toLowerCase() : "";
      const desc = p.description ? p.description.toLowerCase() : "";
      return name.includes(query) || desc.includes(query);
    });
  }

  renderProducts(filteredProducts);
}

// manejador para los botones de nav

document.querySelectorAll(".nav span").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter.toLowerCase().trim();

    if (filter === "all") {
      filteredProducts = [...products];
    } else if (filter === "ofertas") {
      filteredProducts = products.filter((p) => Number(p.price) < 100);
    } else {
      filteredProducts = products.filter(
        (p) => p.category && p.category.toLowerCase().trim() === filter,
      );
    }

    renderProducts(filteredProducts);
  });
});

function crearEnvio(orden, datosEnvio) {
  if (!orden) {
    alert("No existe una orden válida");
    return null;
  }

  const envio = {
    idEnvio: Date.now(),
    ordenId: orden.id,
    direccion: datosEnvio.direccion,
    telefono: datosEnvio.telefono,
    metodo: datosEnvio.metodo || "Entrega a domicilio",
    estado: "En preparación"
  };

  const envios = JSON.parse(localStorage.getItem("envios")) || [];
  envios.push(envio);
  localStorage.setItem("envios", JSON.stringify(envios));

  console.log("Envío creado:", envio);
  return envio;
}
// manejador del campo de búsqueda

searchInput.addEventListener("input", () => {
  applyFilters();
});
