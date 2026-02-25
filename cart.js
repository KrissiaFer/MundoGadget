/* 
  Autor: Roger Ramirez (RR)
  Descripción: Clase principal para el manejo del carrito de compras, persistencia en Storage y generación de facturas.
  Fecha: 23/02/2026
*/

class CartItems {
    constructor() {
        // Inicializa el carrito recuperando datos de localStorage o como array vacío
        this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    }

    /* =========================================
       Gestión de Datos y Persistencia
       ========================================= */

    // Guarda el estado actual del carrito en LocalStorage
    save() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.updateCartIcon();
    }

    // Calcula el total general del carrito
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /* =========================================
       Operaciones del Carrito (CRUD)
       ========================================= */

    // Agrega un producto o incrementa su cantidad si ya existe
    addItem(product, quantity) {
        const existingItem = this.cart.find((item) => item.id === product.id);

        if (existingItem) {
            // Validar stock antes de incrementar
            if (existingItem.quantity + quantity <= product.stock) {
                existingItem.quantity += quantity;
                this.showNotification(`Se agregaron ${quantity} unidades más de "${product.name}".`, "success");
            } else {
                this.showNotification(`No hay suficiente stock. Máximo disponible: ${product.stock}`, "error");
                return;
            }
        } else {
            // Validar stock inicial
            if (quantity <= product.stock) {
                this.cart.push({ ...product, quantity });
                this.showNotification(`"${product.name}" agregado al carrito.`, "success");
            } else {
                this.showNotification("No hay suficiente stock disponible.", "error");
                return;
            }
        }
        this.save();
    }

    // Actualiza la cantidad de un producto específico
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find((item) => item.id === productId);
        if (!item) return;

        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        if (newQuantity <= item.stock) {
            item.quantity = newQuantity;
            this.showNotification(`Cantidad actualizada: ${newQuantity}`, "info");
            this.save();
            this.renderCart();
        } else {
            this.showNotification(`Stock insuficiente. Solo quedan ${item.stock} unidades.`, "error");
            this.renderCart(); // Reestablece el valor visual al máximo permitido
        }
    }

    // Elimina un producto del carrito
    removeItem(productId) {
        this.cart = this.cart.filter((item) => item.id !== productId);
        this.save();
        this.renderCart();
        this.showNotification("Producto eliminado del carrito.", "info");
    }

    // Vacía todo el carrito
    clearCart() {
        if(this.cart.length === 0) return;
        this.cart = [];
        this.save();
        this.renderCart();
        this.showNotification("El carrito ha sido vaciado.", "info");
    }

    /* =========================================
       Interfaz Gráfica (Renderizado)
       ========================================= */

    // Actualiza el contador rojo en el icono del carrito
    updateCartIcon() {
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? "block" : "none"; // Ocultar si es 0
        }
    }

    // Muestra los productos dentro del modal
    renderCart() {
        const cartContainer = document.getElementById("cart-items-container");
        const cartTotal = document.getElementById("cart-total");

        if (!cartContainer) return;

        cartContainer.innerHTML = "";

        if (this.cart.length === 0) {
            cartContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: #666;">Your cart is empty 🛒</div>';
            if (cartTotal) cartTotal.textContent = "0.00";
            return;
        }

        this.cart.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            
            // Estructura HTML del item en el carrito
            itemElement.innerHTML = `
                <div class="cart-item-image" style="margin-right: 15px;">
                    <img src="${item.image}" alt="${item.name}" 
                         style="width: 60px; height: 60px; object-fit: contain; border-radius: 4px; border: 1px solid #eee;">
                </div>
                <div class="cart-item-info" style="flex-grow: 1;">
                    <h4 style="margin: 0;">${item.name}</h4>
                    <p style="margin: 5px 0; color: #666; font-size: 0.9em;">Precio: $${item.price}</p>
                    <p style="margin: 0; font-weight: bold; color: #333;">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <input type="number" 
                           min="1" 
                           max="${item.stock}" 
                           value="${item.quantity}" 
                           onchange="myCart.updateQuantity(${item.id}, parseInt(this.value))"
                           style="width: 50px; text-align: center; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                    <button class="remove-btn" onclick="myCart.removeItem(${item.id})">
                        🗑️
                    </button>
                </div>
            `;
            cartContainer.appendChild(itemElement);
        });

    if (cartTotal) cartTotal.textContent = this.getTotal().toFixed(2);
}

crearOrdenCompra() {
    const carrito = [...this.cart];
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (carrito.length === 0) return null;

    const orden = {
        id: Date.now(),
        usuario: usuario ? usuario.email : "Invitado",
        productos: carrito,
        total: this.getTotal(),
        fecha: new Date().toLocaleString(),
        estado: "Pendiente"
    };

    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    ordenes.push(orden);
    localStorage.setItem("ordenes", JSON.stringify(ordenes));

    return orden;
}

    /* =========================================
       Facturación y Checkout
       ========================================= */

    // Prepara y muestra la factura (Paso 1 del checkout)
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification("El carrito está vacío, agrega productos primero.", "error");
            return;
        }

        const invoiceContent = document.getElementById("invoice-content");
        if (!invoiceContent) return;

        const total = this.getTotal();
        const tax = total * 0.13; // IVA 13%
        const finalTotal = total + tax;
        const date = new Date();

        // Generación de la tabla de factura
        let html = `
            <div style="font-family: monospace; padding: 10px;">
                <h3 style="text-align: center; margin-bottom: 20px;">FACTURA DE COMPRA</h3>
                <p><strong>Fecha:</strong> ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
                <hr style="border: 0; border-top: 1px dashed #ccc; margin: 10px 0;">
                <table style="width: 100%; font-size: 0.9em;">
                    <thead>
                        <tr style="background: #f9f9f9;">
                            <th style="padding: 5px; text-align: left;">Cant.</th>
                            <th style="padding: 5px; text-align: left;">Producto</th>
                            <th style="padding: 5px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.cart.forEach((item) => {
            html += `
                <tr>
                    <td style="padding: 5px;">${item.quantity}</td>
                    <td style="padding: 5px;">${item.name}</td>
                    <td style="padding: 5px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
                <hr style="border: 0; border-top: 1px dashed #ccc; margin: 10px 0;">
                <div style="text-align: right; line-height: 1.6;">
                    <p>Subtotal: $${total.toFixed(2)}</p>
                    <p>IVA (13%): $${tax.toFixed(2)}</p>
                    <p style="font-size: 1.2em; font-weight: bold; margin-top: 5px;">TOTAL: $${finalTotal.toFixed(2)}</p>
                </div>
            </div>
        `;

        invoiceContent.innerHTML = html;

        // Cambio de modal
        document.getElementById("cart-modal").style.display = "none";
        document.getElementById("invoice-modal").style.display = "block";
    }

confirmarCompra() {
    const orden = this.crearOrdenCompra();
    if (!orden) {
        this.showNotification("No se pudo crear la orden", "error");
        return;
    }

    const direccion = document.getElementById("direccion")?.value;
    const telefono = document.getElementById("telefono")?.value;

    if (!direccion || !telefono) {
        alert("Completa los datos de envío");
        return;
    }

    // Crear ENVÍO
    const envio = {
        idEnvio: Date.now(),
        ordenId: orden.id,
        direccion,
        telefono,
        metodo: "Entrega a domicilio",
        estado: "En preparación"
    };

    const envios = JSON.parse(localStorage.getItem("envios")) || [];
    envios.push(envio);
    localStorage.setItem("envios", JSON.stringify(envios));

    console.log("ORDEN:", orden);
    console.log("ENVÍO:", envio);

    // Vaciar carrito SOLO aquí
    this.clearCart();

    document.getElementById("invoice-modal").style.display = "none";
    this.showNotification("¡Orden y envío creados correctamente!", "success");
}

    /* =========================================
       Sistema de Notificaciones (Toast)
       ========================================= */
       
    showNotification(message, type = "success") {
        const container = document.getElementById("notification-container");
        if (!container) return;

        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        
        const icon = type === "success" ? "✅" : (type === "error" ? "❌" : "ℹ️");
        
        notification.innerHTML = `
            <span style="font-size: 1.2em;">${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Instancia única del carrito
const myCart = new CartItems();
