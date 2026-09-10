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

document.addEventListener("DOMContentLoaded", () => {
const contenedor = document.getElementById("contenedorCatalogo");
const filtroCat = document.getElementById("filtroCategoria");
const filtroPrecio = document.getElementById("filtroPrecio");
const labelPrecio = document.getElementById("labelPrecio");
const sinResultados = document.getElementById("sinResultados");

const fmtCLP = (v) => `$${v.toLocaleString("es-CL")}`;

function render(lista) {
    if (!contenedor) return;
    contenedor.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative text-center">
        ${p.oferta ? '<span class="badge bg-danger position-absolute top-0 end-0 m-3">Oferta</span>' : ''}
        <img src="${p.img}" class="card-img-top" style="height: 170px; object-fit: cover;">
        <div class="card-body d-flex flex-column align-items-center p-3">
        <div class="d-flex justify-content-center gap-3 small text-muted mb-2 w-100">
            <span>${p.categoria}</span>
            <span>•</span>
            <span>Stock: ${p.stock}</span>
        </div>
        <h6 class="fw-bold mb-1 text-dark">${p.nombre}</h6>
        <p class="text-success fw-bold fs-5 mb-3">${fmtCLP(p.precio)}</p>
        <div class="mt-auto d-grid gap-2 w-100">
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
    if (!filtroCat || !filtroPrecio) return;
    const cat = filtroCat.value;
    const max = parseInt(filtroPrecio.value, 10);
    labelPrecio.textContent = fmtCLP(max);

    const filtrados = totalProductos.filter((p) => (cat === "todos" || p.categoria === cat) && p.precio <= max);
    render(filtrados);
}

window.agregarCarrito = (id) => {
    const prod = totalProductos.find((p) => p.id === id);

    if (!prod || prod.stock <= 0) {
        mostrarMensaje("No quedan más cupos para este servicio.", "error");
        return;
    }

    prod.stock -= 1;
    localStorage.setItem(clave_stock, JSON.stringify(totalProductos));

    const carrito = JSON.parse(localStorage.getItem(clave_carrito)) || [];
    const itemCarrito = carrito.find((item) => item.id === id);

    if (itemCarrito) {
        itemCarrito.cantidad += 1;
    } else {
        carrito.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        cantidad: 1,
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
    const p = totalProductos.find((item) => item.id === id);
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
        stockModal.textContent = p.stock > 0 ? `${p.stock} cupos` : "Agotado";
        stockModal.className = p.stock > 0 ? "text-success fw-bold" : "text-danger fw-bold";
    }

const btnModalAgregar = document.getElementById("btnDetalleAgregar");
        if (btnModalAgregar) {
        btnModalAgregar.disabled = p.stock <= 0;
        btnModalAgregar.className = p.stock <= 0 ? "btn btn-secondary fw-bold" : "btn btn-success fw-bold";
        btnModalAgregar.textContent = p.stock <= 0 ? "Sin Stock" : "Agregar al Carrito";

        btnModalAgregar.onclick = () => {
            window.agregarCarrito(p.id);
            const pActualizado = totalProductos.find((item) => item.id === id);
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

    if (filtroCat) filtroCat.addEventListener("change", aplicarFiltros);
    if (filtroPrecio) filtroPrecio.addEventListener("input", aplicarFiltros);

    const btnLimpiar = document.getElementById("btnLimpiarFiltros");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
        filtroCat.value = "todos";
        filtroPrecio.value = 170000;
        aplicarFiltros();
});

}

aplicarFiltros();

const btnDiagnostico = document.getElementById("btnDiagnostico");
    if (btnDiagnostico) {
        btnDiagnostico.addEventListener("click", () => {
        const pesoInput = document.getElementById("pesoInput");
        const alturaInput = document.getElementById("alturaInput");
        const nameInput = document.getElementById("floatingName");
        const selectObj = document.getElementById("selectObjetivo");

        const peso = parseFloat(pesoInput.value);
        const estaturaRaw = parseFloat(alturaInput.value);
        const nombre = nameInput.value.trim();

        if (isNaN(peso) || isNaN(estaturaRaw) || estaturaRaw <= 0 || !selectObj.value) {
            alert("Por favor completa tu nombre, estatura, peso y objetivo.");
            return;
        }

        const estaturaM = estaturaRaw > 3 ? estaturaRaw / 100 : estaturaRaw;
        const imc = (peso / (estaturaM * estaturaM)).toFixed(1);

        let clasificacion = "";
        if (imc < 18.5) clasificacion = "Bajo peso";
        else if (imc < 25) clasificacion = "Peso saludable";
        else if (imc < 30) clasificacion = "Sobrepeso";
        else clasificacion = "Obesidad";

        let recomendacionTexto = "Te sugerimos un plan personalizado para optimizar tu composición corporal de forma progresiva.";
        let categoriaRecomendada = "Plan especializado";

        if (selectObj.value === "3") {
            recomendacionTexto = "Te sugerimos iniciar con una evaluación biométrica avanzada para monitorear tu rendimiento deportivo.";
            categoriaRecomendada = "Evaluación";
        } else if (selectObj.value === "2") {
            recomendacionTexto = "Te recomendamos enfocar tu plan en superávit calórico controlado y pautas de nutrición deportiva.";
            categoriaRecomendada = "Plan especializado";
        }

        const modalBody = document.querySelector("#imcModal .modal-body");
        if (modalBody) {
            modalBody.innerHTML = `
            <h4 class="text-dark fw-bold mb-2">Resultado para ${nombre || "Paciente"}</h4>
            <div class="display-4 fw-bold text-success mb-2">${imc}</div>
            <p class="fs-5 text-muted mb-4">Clasificación: <strong class="text-dark">${clasificacion}</strong></p>
            
            <div class="alert alert-light border border-success p-4 rounded-4 shadow-sm text-center">
                <p class="text-dark mb-3 small">${recomendacionTexto}</p>
                <button id="btnVerRecomendados" type="button" class="btn btn-success fw-bold w-100 py-2 shadow-sm">
                Ver planes recomendados
                </button>
            </div>
            `;

            document.getElementById("btnVerRecomendados").addEventListener("click", () => {
            const modalElement = document.getElementById("imcModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }

            if (filtroCat) {
                filtroCat.value = categoriaRecomendada;
                aplicarFiltros();
            }

            const seccionCatalogo = document.getElementById("servicios");
            if (seccionCatalogo) {
                seccionCatalogo.scrollIntoView({ behavior: "smooth" });
            }
            });
        }

        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("imcModal"));
        modal.show();
        });
    }
});