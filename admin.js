//datos ejemplos
const productos = [
    { id: 1, nombre: "Laptop", precio: 800 },
    { id: 2, nombre: "Mouse", precio: 25 },
    { id: 3, nombre: "Teclado", precio: 45 }
];

const ordenes = [
    { id: 101, cliente: "Ana López", total: 850, fecha: "22/02/2026" },
    { id: 102, cliente: "Juan Perez", total: 1200, fecha: "22/02/2026" },
    { id: 103, cliente: "María Lopez", total: 450, fecha: "21/02/2026" }
];

const clientes = [
    { nombre: "Ana" ,apellido: "López", email: "ana@email.com" },
    { nombre: "Juan",apellido: "Perez", email: "juan@email.com" }
];

//elementos
const areaDinamica = document.getElementById("areaDinamica");
const btnOrdenes = document.getElementById("btnOrdenes");
const btnClientes = document.getElementById("btnClientes");

//funciones
function mostrarResumen() {
    const resumen = document.getElementById("resumen");
    resumen.style.display = "none";

    let totalVentas = 0;

    ordenes.forEach(function(orden) {
        totalVentas += orden.total;
    });

    areaDinamica.innerHTML = `
        <div class="card">
            <h3>Total de productos</h3>
            <p>${productos.length}</p>
        </div>

        <div class="card">
            <h3>Ventas del día</h3>
            <p>$${totalVentas}</p>
        </div>
    `;
}

function mostrarOrdenes() {
    resumen.style.display = "none";
    
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

//eventos
btnOrdenes.addEventListener("click", mostrarOrdenes);
btnClientes.addEventListener("click", mostrarClientes);

// Mostrar resumen al cargar
mostrarResumen();

