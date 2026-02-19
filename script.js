const container = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");

let products = [];
let filteredProducts = [];

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

/* ===== BUSCADOR ===== */
searchInput.addEventListener("input", e => {
  const text = e.target.value.toLowerCase();

  filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(text) ||
    product.description.toLowerCase().includes(text)
  );

  renderProducts(filteredProducts);
});

/* ===== FILTROS ===== */
document.querySelectorAll(".nav span").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    if (filter === "all") {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(p => p.category === filter);
    }

    renderProducts(filteredProducts);
  });
});

