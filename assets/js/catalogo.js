const productos = [
    { id: "CN001", nombre: "Primera Consulta Nutricional", categoria: "Consulta", precio: 35000, stock: 8, img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80", duracion: "50 min", desc: "Anamnesis completa, antropometría y plan inicial." },
    { id: "CN002", nombre: "Control Nutricional (Seguimiento)", categoria: "Consulta", precio: 22000, precioOriginal: 25000, oferta: true, stock: 12, img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&q=80", duracion: "30 min", desc: "Seguimiento mensual y ajustes de pauta alimentaria." },
    { id: "CN003", nombre: "Control Quincenal", categoria: "Consulta", precio: 22000, stock: 10, img: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=500&q=80", duracion: "30 min", desc: "Seguimiento intensivo para los dos primeros meses." },
    { id: "CN004", nombre: "Teleconsulta Nutricional", categoria: "Consulta", precio: 20000, stock: 15, img: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=500&q=80", duracion: "30 min", desc: "Atención online por videollamada para pacientes con control previo." },
    { id: "PL001", nombre: "Plan Pérdida de Peso (1 mes)", categoria: "Plan especializado", precio: 59990, precioOriginal: 65000, oferta: true, stock: 6, img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80", duracion: "1 mes", desc: "Incluye 1 consulta, 1 control quincenal y soporte vía WhatsApp." },
    { id: "PL002", nombre: "Plan Pérdida de Peso (3 meses)", categoria: "Plan especializado", precio: 170000, stock: 4, img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80", duracion: "3 meses", desc: "Consulta inicial más 5 controles quincenales y pautas mensuales." },
    { id: "PL003", nombre: "Plan Nutrición Deportiva", categoria: "Plan especializado", precio: 70000, stock: 5, img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80", duracion: "1 mes", desc: "Cálculo de gasto energético, timing nutricional y suplementación." },
    { id: "PL004", nombre: "Plan Diabetes / Hipertensión", categoria: "Plan especializado", precio: 75000, stock: 6, img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&q=80", duracion: "1 mes", desc: "Tratamiento y control adaptado para patologías metabólicas." },
    { id: "EV001", nombre: "Antropometría Completa ISAK", categoria: "Evaluación", precio: 18000, stock: 9, img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80", duracion: "20 min", desc: "Medición de pliegues cutáneos, perímetros corporales e IMC." },
    { id: "EV002", nombre: "Bioimpedanciometría InBody", categoria: "Evaluación", precio: 9990, precioOriginal: 12000, oferta: true, stock: 20, img: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&q=80", duracion: "15 min", desc: "Diagnóstico de masa grasa segmental, agua corporal y masa magra." },
    { id: "TG001", nombre: "Taller: Alimentación Saludable", categoria: "Taller grupal", precio: 15000, stock: 10, img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80", duracion: "90 min", desc: "Lectura crítica de etiquetas y diseño de platos equilibrados." },
    { id: "TG002", nombre: "Taller: Cocina Nutritiva", categoria: "Taller grupal", precio: 16990, precioOriginal: 20000, oferta: true, stock: 8, img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80", duracion: "120 min", desc: "Taller práctico con técnicas de batch cooking y degustación." }
];

const clave_stock = "nutrivida_stock";
const clave_carrito = "nutrivida_carrito";

function obtenerProducto() {
    const guardados = localStorage.getItem(clave_stock);
    if (!guardados) {
        localStorage.setItem(clave_stock, JSON.stringify(productos));
        return productos;
    }
    return JSON.parse(guardados);
}

let totalProductos = obtenerProducto();

document.addEventListener("DOMContentLoaded", () => {
const contenedor = document.getElementById("contenedorCatalogo");
const filtroCat = document.getElementById("filtroCategoria");
const filtroPrecio = document.getElementById("filtroPrecio");
const labelPrecio = document.getElementById("labelPrecio");
const sinResultados = document.getElementById("sinResultados");

const fmtCLP = (v) => `$${v.toLocaleString("es-CL")}`;

function render(lista) {
    contenedor.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach(p => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
        ${p.oferta ? '<span class="badge bg-danger position-absolute top-0 end-0 m-3">Oferta</span>' : ''}
        <img src="${p.img}" class="card-img-top" style="height: 170px; object-fit: cover;">
        <div class="card-body d-flex flex-column p-3">
            <div class="d-flex justify-content-between small text-muted mb-1">
            <span>${p.categoria}</span>
            <span>Stock: ${p.stock}</span>
            </div>
            <h6 class="fw-bold mb-1">${p.nombre}</h6>
            <p class="text-success fw-bold mb-3">${fmtCLP(p.precio)}</p>
            <div class="mt-auto d-grid gap-2">
            <button class="btn btn-outline-success btn-sm" onclick="verDetalle('${p.id}')">Ver Detalle</button>
            <button class="btn ${p.stock <= 0 ? 'btn-secondary' : 'btn-success'} btn-sm" 
                onclick="agregarCarrito('${p.id}')" 
                ${p.stock <= 0 ? 'disabled' : ''}>
                ${p.stock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
            </div>
        </div>
        </div>`;
    contenedor.appendChild(col);
    });
}

function aplicarFiltros() {
    const cat = filtroCat.value;
    const max = parseInt(filtroPrecio.value, 10);
    labelPrecio.textContent = fmtCLP(max);

    const filtrados = totalProductos.filter(p => (cat === "todos" || p.categoria === cat) && p.precio <= max);
    render(filtrados);
}

window.agregarCarrito = (id) => {
    const prod = totalProductos.find(p => p.id === id);

    if (!prod || prod.stock <= 0) {
    mostrarMensaje("No quedan más cupos para este servicio.");
    return;
    }

    prod.stock -= 1;
    localStorage.setItem(clave_stock, JSON.stringify(totalProductos));

    const carrito = JSON.parse(localStorage.getItem(clave_carrito)) || [];
    const itemCarrito = carrito.find(item => item.id === id);

    if (itemCarrito) {
        itemCarrito.cantidad += 1;
    } else {
        carrito.push({
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            cantidad: 1
    });
}

    localStorage.setItem(clave_carrito, JSON.stringify(carrito));
    mostrarMensaje("Producto agregado correctamente.");
    aplicarFiltros();

    const stockModal = document.getElementById("detalleStock");
    if (stockModal) {
    stockModal.textContent = prod.stock > 0 ? `${prod.stock} cupos` : "Agotado";
    stockModal.className = prod.stock > 0 ? "text-success fw-bold" : "text-danger fw-bold";
    }
};

    window.verDetalle = (id) => {
        const p = totalProductos.find(item => item.id === id);
        if (!p) return;

        document.getElementById("detalleTitulo").textContent = p.nombre;
        document.getElementById("detalleImg").src = p.img;
        document.getElementById("detalleCodigo").textContent = `ID: ${p.id}`;
        document.getElementById("detalleCategoria").textContent = p.categoria;
        document.getElementById("detalleDescripcion").textContent = p.desc;
        document.getElementById("detalleDuracion").textContent = p.duracion;
        document.getElementById("detalleModalidad").textContent = p.modalidad || "Presencial / Clínica";
        document.getElementById("detalleProfesional").textContent = p.profesional || "Nutricionista NutriVida";
        document.getElementById("detallePrecio").textContent = fmtCLP(p.precio);

        const stockModal = document.getElementById("detalleStock");
        if (stockModal) {
        if (p.stock > 0) {
            stockModal.textContent = `${p.stock} cupos`;
            stockModal.className = "text-success fw-bold";
        } else {
            stockModal.textContent = "Agotado";
            stockModal.className = "text-danger fw-bold";
        }
        }

        const btnModalAgregar = document.getElementById("btnDetalleAgregar");
        if (btnModalAgregar) {
        btnModalAgregar.disabled = p.stock <= 0;
        btnModalAgregar.className = p.stock <= 0 ? "btn btn-secondary fw-bold" : "btn btn-success fw-bold";
        btnModalAgregar.textContent = p.stock <= 0 ? "Sin Stock" : "Agregar al Carrito";

        btnModalAgregar.onclick = () => {
            window.agregarCarrito(p.id);

            const pActualizado = totalProductos.find(item => item.id === id);
            if (stockModal && pActualizado) {
            stockModal.textContent = pActualizado.stock > 0 ? `${pActualizado.stock} cupos` : "Agotado";
            stockModal.className = pActualizado.stock > 0 ? "text-success fw-bold" : "text-danger fw-bold";
            }
            if (pActualizado && pActualizado.stock <= 0) {
            btnModalAgregar.disabled = true;
            btnModalAgregar.className = "btn btn-secondary fw-bold";
            btnModalAgregar.textContent = "Sin Stock";
            }
        };
        }

        bootstrap.Modal.getOrCreateInstance(document.getElementById("modalDetalleProducto")).show();
    };

    filtroCat.addEventListener("change", aplicarFiltros);
    filtroPrecio.addEventListener("input", aplicarFiltros);
    document.getElementById("btnLimpiarFiltros").addEventListener("click", () => {
        filtroCat.value = "todos";
        filtroPrecio.value = 170000;
        aplicarFiltros();
    });

    aplicarFiltros();
});

function mostrarMensaje(mensaje, tipo = "exito") {
    const notificacion = document.getElementById("liveToast");
    if (!notificacion) {
        alert(mensaje);
        return;
    }

    const cabecera = notificacion.querySelector(".toast-header");
    const titulo = notificacion.querySelector(".toast-header strong");
    const cuerpo = notificacion.querySelector(".toast-body");

    const esExito = tipo === "exito";

    titulo.textContent = esExito ? "Carrito NutriVida" : "Aviso";
    cuerpo.textContent = mensaje;

    cabecera.className = `toast-header text-white border-0 rounded-top-3 ${esExito ? "bg-success" : "bg-danger"}`;

    bootstrap.Toast.getOrCreateInstance(notificacion).show();
}