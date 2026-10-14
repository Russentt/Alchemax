import { useEffect, useState, type JSX } from "react";
import AdminStatCard from "../components/admin/AdminStatCard";
import type { Categoria, Servicio } from "../data/types";
import { StorageUsuario } from "../services/storageUsuario";
import { useNavigate } from "react-router";
import { StorageCategorias } from "../services/storageCategorias";
import { StorageServicios } from "../services/storageProductos";
import ModalProducto from "../components/admin/ModalProducto";
import ModalCategoria from "../components/admin/ModalCategoria";
import NutricionistaSidebar from "../components/nutricionista/NutriSidebar";

interface CitaPlan {
    id: string;
    pacienteNombre: string;
    pacienteEmail: string;
    servicioNombre: string;
    fecha: string;
    hora: string;
    estado: "Pendiente" | "Confirmada" | "Completada" | "Cancelada";
}

    export type NutricionistaTab = "dashboard" | "products" | "categories" | "users";
    export default function Nutricionista(): JSX.Element {
    const [activeTab, setActiveTab] = useState<NutricionistaTab>("dashboard");
    const navigate = useNavigate();

    useEffect(() => {
        const sesion = StorageUsuario.getUsuarioSesion();
        console.log("Sesion en Nutricionista:", sesion);

        if (!sesion || sesion.rol !== "nutricionista") {
            navigate("/login");
        }
}, [navigate]);

    const [notificacion, setNotificacion] = useState<{
        texto: string;
        tipo: "info" | "success" | "danger";
    } | null>(null);

    const mostrarNotificacion = (
        texto: string,
        tipo: "info" | "success" | "danger" = "info"
    ) => {
        setNotificacion({ texto, tipo });
        setTimeout(() => setNotificacion(null), 3500);
    };

    // --- Estados de Categorías ---
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
    const [categoriaEliminar, setCategoriaEliminar] = useState<Categoria | null>(null);
    const [modalCrearCategoria, setModalCrearCategoria] = useState(false);

    const cargarCategorias = () => {
        setCategorias(StorageCategorias.getCategorias());
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const handleGuardarCategoria = (
        datos: Omit<Categoria, "id" | "serviciosAsociados">
    ) => {
        if (categoriaEditar) {
        const res = StorageCategorias.updateCategoria({
            ...categoriaEditar,
            ...datos,
        });
        if (!res.success) {
            mostrarNotificacion(res.mensaje, "danger");
            return;
        }
        mostrarNotificacion("Categoría actualizada", "success");
        } else {
        const res = StorageCategorias.crearCategoria(datos);
        if (!res.success) {
            mostrarNotificacion(res.mensaje, "danger");
            return;
        }
        mostrarNotificacion("Categoría creada", "success");
        }

        cargarCategorias();
        setModalCrearCategoria(false);
        setCategoriaEditar(null);
    };

    const EliminarCategoria = () => {
        if (!categoriaEliminar) return;
        StorageCategorias.deleteCategoria(categoriaEliminar.id);
        cargarCategorias();
        mostrarNotificacion(`Categoría "${categoriaEliminar.nombre}" eliminada`, "success");
        setCategoriaEliminar(null);
    };

    // --- Estados de Servicios / Planes ---
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [modalProducto, setModalProducto] = useState(false);
    const [servicioAEditar, setServicioAEditar] = useState<Servicio | null>(null);

    const cargarServicios = () => {
        setServicios(StorageServicios.getServicios());
    };

    useEffect(() => {
        cargarServicios();
    }, []);

    const abrirCrearServicio = () => {
        setServicioAEditar(null);
        setModalProducto(true);
    };

    const abrirEditarServicio = (item: Servicio) => {
        setServicioAEditar(item);
        setModalProducto(true);
    };

    const handleGuardarServicio = (datos: Omit<Servicio, "id" | "estado">) => {
        const categoriaEncontrada = categorias.find((c) => c.id === datos.categoriaId);
        const nombreCategoria = categoriaEncontrada ? categoriaEncontrada.nombre : "General";

        if (servicioAEditar) {
        const res = StorageServicios.updateServicio({
            ...servicioAEditar,
            ...datos,
            categoriaNombre: nombreCategoria,
        });
        if (!res.success) {
            mostrarNotificacion(res.mensaje, "danger");
            return;
        }
        mostrarNotificacion("Servicio actualizado", "success");
        } else {
        const res = StorageServicios.crearServicio({
            ...datos,
            categoriaNombre: nombreCategoria,
            estado: "Activo",
        });
        if (!res.success) {
            mostrarNotificacion(res.mensaje, "danger");
            return;
        }
        mostrarNotificacion("Servicio creado", "success");
        }

        cargarServicios();
        cargarCategorias();
        setModalProducto(false);
        setServicioAEditar(null);
    };

    const handleToggleEstado = (id: string) => {
        StorageServicios.toggleEstado(id);
        cargarServicios();
        mostrarNotificacion("Estado actualizado.", "info");
    };

    // --- Estados de Citas y Planes Adquiridos ---
    const [busquedaCitas, setBusquedaCitas] = useState("");
    const [citas, setCitas] = useState<CitaPlan[]>(() => {
        const citasGuardadas = localStorage.getItem("db_citas");
        if (citasGuardadas) return JSON.parse(citasGuardadas);
        return [
        {
            id: "CITA-101",
            pacienteNombre: "Camila Soto",
            pacienteEmail: "camila.soto@gmail.com",
            servicioNombre: "Plan Nutrición Deportiva",
            fecha: "2026-10-20",
            hora: "10:30",
            estado: "Confirmada",
        },
        {
            id: "CITA-102",
            pacienteNombre: "Ignacio Torres",
            pacienteEmail: "ignacio.t@gmail.com",
            servicioNombre: "Control Mensual",
            fecha: "2026-10-22",
            hora: "15:00",
            estado: "Pendiente",
        },
        ];
    });

    const cambiarEstadoCita = (id: string, nuevoEstado: CitaPlan["estado"]) => {
        const actualizadas = citas.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c));
        setCitas(actualizadas);
        localStorage.setItem("db_citas", JSON.stringify(actualizadas));
        mostrarNotificacion("Estado de la cita modificado.", "info");
    };

    const citasFiltradas = citas.filter((c) => {
    const termino = busquedaCitas.toLowerCase();
    const nombre = (c.pacienteNombre || "").toLowerCase();
    const email = (c.pacienteEmail || "").toLowerCase();
    const plan = (c.servicioNombre || "").toLowerCase();

    return (
        nombre.includes(termino) ||
        email.includes(termino) ||
        plan.includes(termino)
    );
});

    // --- Sub-vistas ---
    const renderDashboard = () => {

        const totalPlanes = servicios.filter(
            (s) => s.estado === "Activo"
        ).length;
        return (
            <>
            <div className="row g-4 mb-4">
                <AdminStatCard
                title="Total Planes Activos"
                value={totalPlanes}
                icon="🛒"
                theme="success"
                />
                <AdminStatCard
                title="Categorías"
                value={categorias.length}
                icon="📁"
                theme="info"
                />
                <AdminStatCard
                title="Citas Programadas"
                value={citas.length}
                icon="📅"
                theme="warning"
                />
            </div>
            <div className="bg-white p-4 rounded-4 shadow-sm border-0">
                <h5 className="fw-bold text-dark mb-3">Agenda del Nutricionista</h5>
                <p className="text-muted mb-0">
                Revisa las compras de tus planes y el estado de las consultas médicas agendadas.
                </p>
            </div>
            </>
        );
};

    const renderProducts = () => (
        <div className="bg-white p-4 rounded-4 shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-dark mb-0">Catálogo de Servicios y Planes</h5>
            <button
            type="button"
            className="btn btn-outline-success btn-sm fw-bold"
            onClick={abrirCrearServicio}
            >
            + Nuevo Producto
            </button>
        </div>

        <div className="table-responsive">
            <table className="table align-middle">
            <thead className="table-light">
                <tr>
                <th>ID</th>
                <th>Nombre del Plan</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                {servicios.length === 0 ? (
                <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                    No hay productos ni planes registrados.
                    </td>
                </tr>
                ) : (
                servicios.map((s) => (
                    <tr key={s.id}>
                    <td className="text-muted small fw-bold">#{s.id}</td>
                    <td className="fw-semibold">
                        <span className="me-2">{s.icono}</span>
                        {s.nombre}
                    </td>
                    <td>
                        <span className="badge bg-secondary-subtle text-secondary">
                        {s.categoriaNombre || "Sin categoría"}
                        </span>
                    </td>
                    <td>${Number(s.precio).toLocaleString("es-CL")}</td>
                    <td>
                        <span
                        className={`badge ${
                            s.estado === "Activo" ? "bg-success" : "bg-secondary"
                        }`}
                        >
                        {s.estado}
                        </span>
                    </td>
                    <td>
                        <button
                        type="button"
                        className="btn btn-sm btn-light text-primary me-2"
                        onClick={() => abrirEditarServicio(s)}
                        >
                        Editar
                        </button>
                        <button
                        type="button"
                        className={`btn btn-sm btn-light ${
                            s.estado === "Activo" ? "text-danger" : "text-success"
                        }`}
                        onClick={() => handleToggleEstado(s.id)}
                        >
                        {s.estado === "Activo" ? "Bajar" : "Activar"}
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        <ModalProducto
            isOpen={modalProducto}
            servicioEditar={servicioAEditar}
            categorias={categorias}
            onClose={() => setModalProducto(false)}
            onSave={handleGuardarServicio}
        />
        </div>
    );

    const renderCategories = () => (
        <div className="bg-white p-4 rounded-4 shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-dark mb-0">Gestión de Categorías</h5>
            <button
            type="button"
            className="btn btn-outline-success btn-sm fw-bold"
            onClick={() => setModalCrearCategoria(true)}
            >
            + Nueva Categoría
            </button>
        </div>

        {notificacion && (
            <div className={`alert alert-${notificacion.tipo} py-2 px-3 small border-0`}>
            {notificacion.texto}
            </div>
        )}

        <div className="table-responsive">
            <table className="table align-middle">
            <thead className="table-light">
                <tr>
                <th>ID Categoría</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Servicios Asociados</th>
                <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                {categorias.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                    No hay categorías registradas.
                    </td>
                </tr>
                ) : (
                categorias.map((cat: Categoria) => (
                    <tr key={cat.id}>
                    <td className="text-muted small fw-bold">#{cat.id}</td>
                    <td className="fw-semibold">{cat.nombre}</td>
                    <td className="text-muted small">{cat.descripcion || "-"}</td>
                    <td>{cat.serviciosAsociados ?? 0}</td>
                    <td>
                        <button
                        type="button"
                        className="btn btn-sm btn-light text-primary me-2"
                        onClick={() => setCategoriaEditar({ ...cat })}
                        >
                        Modificar
                        </button>
                        <button
                        type="button"
                        className="btn btn-sm btn-light text-danger"
                        onClick={() => setCategoriaEliminar(cat)}
                        >
                        Eliminar
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        <ModalCategoria
            isOpen={modalCrearCategoria || Boolean(categoriaEditar)}
            categoriaEditar={categoriaEditar}
            categoriaEliminar={categoriaEliminar}
            onClose={() => {
            setModalCrearCategoria(false);
            setCategoriaEditar(null);
            setCategoriaEliminar(null);
            }}
            onSave={handleGuardarCategoria}
            onDeleteConfirm={EliminarCategoria}
        />
        </div>
    );

    // Vista de Citas y Compras de Planes
    const renderCitas = () => (
        <div className="bg-white p-4 rounded-4 shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-dark mb-0">Citas y Planes Comprados</h5>
            <div className="d-flex gap-2">
            <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Buscar por paciente o plan..."
                value={busquedaCitas}
                onChange={(e) => setBusquedaCitas(e.target.value)}
            />
            </div>
        </div>

        {notificacion && (
            <div
            className={`alert alert-${notificacion.tipo} py-2 px-3 small d-flex justify-content-between align-items-center mb-3 border-0`}
            role="alert"
            >
            <span>{notificacion.texto}</span>
            <button
                type="button"
                className="btn-close small"
                style={{ fontSize: "0.65rem" }}
                aria-label="Cerrar"
                onClick={() => setNotificacion(null)}
            />
            </div>
        )}

        <div className="table-responsive">
            <table className="table align-middle">
            <thead className="table-light">
                <tr>
                <th>ID Cita</th>
                <th>Paciente</th>
                <th>Plan Adquirido</th>
                <th>Fecha y Hora</th>
                <th>Estado</th>
                <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                {citasFiltradas.length === 0 ? (
                <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                    No se encontraron citas o compras registradas.
                    </td>
                </tr>
                ) : (
                citasFiltradas.map((c) => (
                    <tr key={c.id}>
                    <td className="text-muted small fw-bold">#{c.id}</td>
                    <td>
                        <div className="fw-semibold text-dark">{c.pacienteNombre}</div>
                        <small className="text-muted">{c.pacienteEmail}</small>
                    </td>
                    <td>
                        <span className="badge bg-light text-dark border">
                        {c.servicioNombre}
                        </span>
                    </td>
                    <td>
                        <span className="small text-dark fw-medium">{c.fecha}</span>
                        <span className="text-muted small d-block">{c.hora} hrs</span>
                    </td>
                    <td>
                        <span
                        className={`badge ${
                            c.estado === "Confirmada"
                            ? "bg-success-subtle text-success fw-bold"
                            : c.estado === "Pendiente"
                            ? "bg-warning-subtle text-dark"
                            : c.estado === "Completada"
                            ? "bg-primary-subtle text-primary"
                            : "bg-danger-subtle text-danger"
                        }`}
                        >
                        {c.estado}
                        </span>
                    </td>
                    <td>
                        {c.estado === "Pendiente" && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-success me-2"
                            onClick={() => cambiarEstadoCita(c.id, "Confirmada")}
                        >
                            Confirmar
                        </button>
                        )}
                        {c.estado === "Confirmada" && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => cambiarEstadoCita(c.id, "Completada")}
                        >
                            Completar
                        </button>
                        )}
                        {c.estado !== "Cancelada" && c.estado !== "Completada" && (
                        <button
                            type="button"
                            className="btn btn-sm btn-light text-danger"
                            onClick={() => cambiarEstadoCita(c.id, "Cancelada")}
                        >
                            Cancelar
                        </button>
                        )}
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        </div>
    );

    const renderActiveContent = () => {
        switch (activeTab) {
        case "dashboard":
            return renderDashboard();
        case "products":
            return renderProducts();
        case "categories":
            return renderCategories();
        case "users":
            return renderCitas();
        default:
            return renderDashboard();
        }
    };

    return (
        <main className="container-fluid py-4 px-4 px-md-5 bg-light flex-grow-1">
        <div className="row g-4">
            <NutricionistaSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <section className="col-lg-9 col-md-8">
            <div className="bg-dark text-white p-4 rounded-4 shadow-sm mb-4 d-flex justify-content-between align-items-center">
                <div>
                <h3 className="fw-bold mb-1">Panel de Nutrición</h3>
                <p className="mb-0 text-white-50">
                    {activeTab === "dashboard" &&
                    "Métricas generales y control de agenda de consultas."}
                    {activeTab === "products" &&
                    "Administra los planes nutricionales y servicios disponibles."}
                    {activeTab === "categories" &&
                    "Organiza las categorías de tus servicios."}
                    {activeTab === "users" &&
                    "Seguimiento de compras y citas de tus pacientes."}
                </p>
                </div>
                <div className="d-none d-sm-block fs-1">🥗</div>
            </div>

            {renderActiveContent()}
            </section>
        </div>
        </main>
    );

}
