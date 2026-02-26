//datos ejemplos
const productos = [
    { id: 1, nombre: "Laptop", precio: 800 },
    { id: 2, nombre: "Mouse", precio: 25 },
    { id: 3, nombre: "Teclado", precio: 45 }
];

const ordenesEjemplo = [
    { id: 101, cliente: "Ana López", total: 850, fecha: "22/02/2026" },
    { id: 102, cliente: "Juan Perez", total: 1200, fecha: "22/02/2026" },
    { id: 103, cliente: "María Lopez", total: 450, fecha: "21/02/2026" }
];

const clientesEjemplo = [
    { nombre: "Ana" ,apellido: "López", email: "ana@email.com" },
    { nombre: "Juan",apellido: "Perez", email: "juan@email.com" }
];

//funciones para leer datos del localStorage o usar los de ejemplo
function obtenerOrdenes() {
  const ordenesStorage = JSON.parse(localStorage.getItem("ordenes"));
  return ordenesStorage && ordenesStorage.length > 0
    ? ordenesStorage
    : ordenesEjemplo;
}

function obtenerClientes() {
  const clientesStorage = JSON.parse(localStorage.getItem("usuarios"));
  return clientesStorage && clientesStorage.length > 0
    ? clientesStorage
    : clientesEjemplo;
}

//elementos
const areaDinamica = document.getElementById("areaDinamica");
const btnOrdenes = document.getElementById("btnOrdenes");
const btnClientes = document.getElementById("btnClientes");
const btnEnvios = document.getElementById("btnEnvios");

//funciones
function mostrarResumen() {
    const resumen = document.getElementById("resumen");
    resumen.style.display = "resumen";

    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    const envios = JSON.parse(localStorage.getItem("envios")) || [];
    let totalVentas = 0;

    ordenes.forEach(function(orden) {
        totalVentas += orden.total;
    });

        areaDinamica.innerHTML = `
        <div class="card">
            <h3>Total de órdenes</h3>
            <p>${ordenes.length}</p>
        </div>

        <div class="card">
            <h3>Ventas totales</h3>
            <p>$${totalVentas.toFixed(2)}</p>
        </div>

        <div class="card">
            <h3>Envíos pendientes</h3>
            <p>${envios.filter(e => e.estado !== "Entregado").length}</p>
        </div>
    `;
    document.querySelectorAll(".cardejemplo").forEach(card => {
    card.style.display = "none";});
}

function mostrarOrdenes() {
    resumen.style.display = "none";

        const ordenes = obtenerOrdenes();
    areaDinamica.innerHTML = `
        <button id="btnRegresar" class="btn-regresar">← Regresar</button>

        <h2>Órdenes de compra</h2>

        <table class="tabla">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                ${ordenes.map(orden => `
                    <tr>
                        <td>${orden.id}</td>
                        <td>${orden.cliente}</td>
                        <td>$${orden.total}</td>
                        <td>${orden.fecha}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    document.getElementById("btnRegresar")
        .addEventListener("click", mostrarResumen);
}

function mostrarClientes() {
    resumen.style.display = "none";

    const clientes = obtenerClientes();
    areaDinamica.innerHTML = `
        <button id="btnRegresar" class="btn-regresar">← Regresar</button>

        <h2>Clientes Registrados</h2>

        <table class="tabla">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Correo Electrónico</th>
                </tr>
            </thead>
            <tbody>
                ${clientes.map(cliente => `
                    <tr>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.apellido}</td>
                        <td>${cliente.email}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    document.getElementById("btnRegresar")
        .addEventListener("click", mostrarResumen);
}

function mostrarEnvios() {
    const resumen = document.getElementById("resumen");
    resumen.style.display = "none";

    const envios = JSON.parse(localStorage.getItem("envios")) || [];

    if (envios.length === 0) {
        areaDinamica.innerHTML = `
            <button id="btnRegresar" class="btn-regresar">← Regresar</button>
            <p>No hay envíos registrados.</p>
        `;
        document.getElementById("btnRegresar")
            .addEventListener("click", mostrarResumen);
        return;
    }

    areaDinamica.innerHTML = `
        <button id="btnRegresar" class="btn-regresar">← Regresar</button>

        <h2>Envíos</h2>

        <table class="tabla">
            <thead>
                <tr>
                    <th>ID Envío</th>
                    <th>ID Orden</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${envios.map(e => `
                    <tr>
                        <td>${e.idEnvio}</td>
                        <td>${e.ordenId}</td>
                        <td>${e.direccion}</td>
                        <td>${e.telefono}</td>
                        <td>${e.estado}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    document.getElementById("btnRegresar")
        .addEventListener("click", mostrarResumen);
}

//eventos
btnOrdenes.addEventListener("click", mostrarOrdenes);
btnClientes.addEventListener("click", mostrarClientes);
btnCerrar.addEventListener("click", function() {window.location.href = "index.html";});
btnEnvios.addEventListener("click",mostrarEnvios);
// Mostrar resumen al cargar
mostrarResumen();

