const clave_stock = "nutrivida_stock";
const clave_carrito = "nutrivida_carrito";

document.addEventListener("DOMContentLoaded", () => {
    const cuerpoCarrito = document.getElementById("cuerpoCarrito");
    const totalCompra = document.getElementById("totalCompra");
    const btnVaciar = document.getElementById("btnVaciar");
    const btnFinalizar = document.getElementById("btnFinalizar");

    //reutilizar funcion de moneda
    const fmtCLP = (v) => `$${v.toLocaleString("es-CL")}`;

    function renderCarrito() {
        //leer carrito actualizado
        let carrito = JSON.parse(localStorage.getItem(clave_carrito)) || [];
        cuerpoCarrito.innerHTML = "";
        let total = 0;

        //si está vacio, enviar mensaje
        if (carrito.length === 0) {
            cuerpoCarrito.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        Tu carrito está vacío. ¡Revisa nuestro catálogo!
                    </td>
                </tr>`;
            totalCompra.textContent = "$0";
            return;
        }

        //recorrer producto y generar fila
        carrito.forEach((item) => {
            const cant = Number(item.cantidad) || 1;
            const precio = Number(item.precio) || 0;
            const subtotal = precio * cant;
            total += subtotal;

            cuerpoCarrito.innerHTML += `
                <tr>
                    <td class="fw-semibold">${item.nombre}</td>
                    <td>${fmtCLP(precio)}</td>
                    <td>${cant}</td>
                    <td class="fw-bold text-success">${fmtCLP(subtotal)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarItem('${item.id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        // se imprime
        totalCompra.textContent = fmtCLP(total);
    }

    //eliminar producto y colocar stock
    window.eliminarItem = (id) => {
        let carrito = JSON.parse(localStorage.getItem(clave_carrito)) || [];
        let stockProductos = JSON.parse(localStorage.getItem(clave_stock)) || [];

        //buscar el producto exacto en el carrito
        const itemIndex = carrito.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            const itemEliminado = carrito[itemIndex];

            //devolver la cantidad al stock del catálogo
            const productoCat = stockProductos.find(p => p.id === id);
            if (productoCat) {
                productoCat.stock += itemEliminado.cantidad;
            }

            //borrar el producto del arreglo del carrito
            carrito.splice(itemIndex, 1);

            //guardar los cambios de ambos arreglos en el LocalStorage
            localStorage.setItem(clave_carrito, JSON.stringify(carrito));
            localStorage.setItem(clave_stock, JSON.stringify(stockProductos));
            renderCarrito();
        }
    };
    if (btnVaciar) {
        btnVaciar.addEventListener("click", () => {
            let carrito = JSON.parse(localStorage.getItem(clave_carrito)) || [];
            if (carrito.length === 0) {
                mostrarMensaje("Tu carrito ya está vacío.", "error");
                return;
            }

            mostrarConfirmacion("¿Estás seguro de que deseas vaciar el carrito?", () => {
                let stockProductos = JSON.parse(localStorage.getItem(clave_stock)) || [];
                carrito.forEach(itemCarrito => {
                    const productoCat = stockProductos.find(p => p.id === itemCarrito.id);
                    if (productoCat) {
                        productoCat.stock += itemCarrito.cantidad;
                    }
                });

                //limpiar carrito y guardarlo en el localstorage
                localStorage.setItem(clave_carrito, JSON.stringify([]));
                localStorage.setItem(clave_stock, JSON.stringify(stockProductos));

                renderCarrito();
                mostrarMensaje("El carrito ha sido vaciado correctamente.", "exito");
            });
        });
    }
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {   
            //IMPORTANTE Modificar texto para que no se vea feo y poder colocarlo mejor... 
            let carrito = JSON.parse(localStorage.getItem(clave_carrito)) || [];
            
            if (carrito.length === 0) {
                mostrarMensaje("Tu carrito está vacío. Agrega productos desde el catálogo para comprar.", "error");
                return;
            }
            
            //dar anuncio que todo salió con exito
            mostrarMensaje("¡Compra realizada con éxito! Gracias por preferir NutriVida.");
            
            // Limpiar el carrito de compras
            //actualizar el stock restante con la compra existosa 
            localStorage.setItem(clave_carrito, JSON.stringify([]));
            renderCarrito();
            
            // Retornar a la página principal
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1800); 
        });
    }
    renderCarrito();

    
});

function mostrarMensaje(mensaje, tipo = "exito") {
let contenedor = document.getElementById("AlertaFlotanteMensaje");

if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "AlertaFlotanteMensaje";
    contenedor.className = "position-fixed top-0 start-50 translate-middle-x p-3";
    contenedor.style.zIndex = "9999";
    contenedor.style.width = "90%";
    contenedor.style.maxWidth = "500px";
    contenedor.style.marginTop = "5px";
    document.body.appendChild(contenedor);
}

const esExito = tipo === "exito";
const claseAlerta = esExito ? "alert-success border-success-subtle" : "alert-danger border-danger-subtle";
const icono = esExito ? "✅" : "⚠️";

contenedor.innerHTML = `
    <div class="alert ${claseAlerta} alert-dismissible fade show shadow-lg border-2 rounded-3 d-flex align-items-center gap-2 mb-0" role="alert">
    <span class="fs-4">${icono}</span>
    <div class="fw-semibold small flex-grow-1">
        ${mensaje}
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
`;

clearTimeout(window.timerAlertaMensaje);
window.timerAlertaMensaje = setTimeout(() => {
    const alertEl = contenedor.querySelector(".alert");
    if (alertEl) {
        alertEl.classList.remove("show");
        setTimeout(() => alertEl.remove(), 200);
    }
    }, 3500);
}

function mostrarConfirmacion(mensaje, callbackAceptar) {
let contenedor = document.getElementById("AlertaFlotanteMensaje");

if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "AlertaFlotanteMensaje";
    contenedor.className = "position-fixed top-0 start-50 translate-middle-x p-3";
    contenedor.style.zIndex = "9999";
    contenedor.style.width = "90%";
    contenedor.style.maxWidth = "500px";
    contenedor.style.marginTop = "5px";
    document.body.appendChild(contenedor);
}

clearTimeout(window.timerAlertaMensaje);

contenedor.innerHTML = `
    <div class="alert alert-warning border-warning-subtle shadow-lg border-2 rounded-3 p-3 mb-0" role="alert">
        <div class="d-flex align-items-center gap-2 mb-3">
            <span class="fs-4">⚠️</span>
            <div class="fw-semibold small flex-grow-1 text-dark">
                ${mensaje}
            </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
            <button type="button" id="btnCancelarConf" class="btn btn-sm btn-outline-secondary">Cancelar</button>
            <button type="button" id="btnAceptarConf" class="btn btn-sm btn-danger fw-bold">Sí, vaciar</button>
        </div>
    </div>
`;

document.getElementById("btnCancelarConf").onclick = () => {
    contenedor.innerHTML = "";
};

document.getElementById("btnAceptarConf").onclick = () => {
    contenedor.innerHTML = "";
    callbackAceptar();
};
}