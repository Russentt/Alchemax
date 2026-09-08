const clave_stock = "nutrivida_stock";
const clave_carrito = "nutrivida_carrito";

document.addEventListener("DOMContentLoaded", () => {
    const cuerpoCarrito = document.getElementById("cuerpoCarrito");
    const totalCompra = document.getElementById("totalCompra");
    const btnVaciar = document.getElementById("btnVaciar");
    const btnFinalizar = document.getElementById("btnFinalizar");

    //reutilizar funcion de moenda
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
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            cuerpoCarrito.innerHTML += `
                <tr>
                    <td class="fw-semibold">${item.nombre}</td>
                    <td>${fmtCLP(item.precio)}</td>
                    <td>${item.cantidad}</td>
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
            if (carrito.length === 0) return;

            if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
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
            }
        });
    }
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {   
            //IMPORTANTE Modificar texto para que no se vea feo y poder colocarlo mejor... 
            let carrito = JSON.parse(localStorage.getItem(clave_carrito)) || [];
            
            if (carrito.length === 0) {
                alert("Tu carrito está vacío. Agrega productos desde el catálogo para comprar.");
                return;
            }
            
            //dar anuncio que todo salió con exito
            alert("¡Compra realizada con éxito! Gracias por preferir NutriVida.");
            
            // Limpiar el carrito de compras
            //actualizar el stock restante con la compra existosa 
            localStorage.setItem(clave_carrito, JSON.stringify([]));
            
            // Retornar a la página principal
            window.location.href = "../index.html"; 
        });
    }
    renderCarrito();
});