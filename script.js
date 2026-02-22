const container = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");

let products = [];
let filteredProducts = [];
let currentFilter = "all"; // valor del filtro de navegación

/* ===== CARGAR PRODUCTOS DESDE JSON ===== */
fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = data;
    filteredProducts = [...products];
    renderProducts(filteredProducts);
  })
  .catch(error => {
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

  list.forEach(product => {
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
    `;

    container.appendChild(card);
  });
}

/* ===== FILTROS Y BUSCADOR ===== */

// Aplica el filtro de categoría y la búsqueda de texto
function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();

  // comienza por aplicar el filtro de categoría
  if (currentFilter === "all") {
    filteredProducts = [...products];
  } else if (currentFilter === "ofertas") {
    filteredProducts = products.filter(p => Number(p.price) < 100);
  } else {
    filteredProducts = products.filter(p =>
      p.category && p.category.toLowerCase().trim() === currentFilter
    );
  }

  // si hay texto en el buscador, filtra también por nombre/descripcion
  if (query !== "") {
    filteredProducts = filteredProducts.filter(p => {
      const name = p.name ? p.name.toLowerCase() : "";
      const desc = p.description ? p.description.toLowerCase() : "";
      return name.includes(query) || desc.includes(query);
    });
  }

  renderProducts(filteredProducts);
}

// manejador para los botones de nav

document.querySelectorAll(".nav span").forEach(btn => {
  btn.addEventListener("click", () => {

    const filter = btn.dataset.filter.toLowerCase().trim();

    if (filter === "all") {
      filteredProducts = [...products];
    }
    else if (filter === "ofertas") {
      filteredProducts = products.filter(p => Number(p.price) < 100);
    }
    else {
      filteredProducts = products.filter(p =>
        p.category &&
        p.category.toLowerCase().trim() === filter
      );
    }

    renderProducts(filteredProducts);
  });
});

// manejador del campo de búsqueda

searchInput.addEventListener("input", () => {
  applyFilters();
});
