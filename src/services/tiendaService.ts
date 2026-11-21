import axios from "axios";
import type { Servicio } from "../types/servicio";
import type { ItemCarrito } from "../types/carrito";
import type {
  Compra,
  EstadoCompra,
  PeriodoReporte,
  ReporteAdmin,
  ServicioSolicitadoReporte,
} from "../types/compra";
import type { Cita } from "../types/cita";
import { StorageUsuario } from "./storageUsuario";
import { api } from "../api/axiosConfig";

interface ItemCarritoBackend {
  id: number;
  servicio: Servicio;
  cantidad: number;
}

interface CarritoBackend {
  id: number;
  items: ItemCarritoBackend[];
}

// Helper para obtener el "Foreign Key" del usuario actual
const getUsuarioId = (): number | null => {
  const sesion = StorageUsuario.getUsuarioSesion();
  return sesion?.id ? Number(sesion.id) : null;
};

const formatearISO = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ---------------------------------------------------------
// SERVICIO DE TIENDA Y REPORTES ADMINISTRATIVOS
// ---------------------------------------------------------
export const TiendaService = {
  // --- TABLA CARRITO ---
  getCarrito: async (): Promise<Servicio[]> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return [];

    try {
      const res = await api.get<CarritoBackend>(`/api/carrito/usuario/${usuarioId}`);
      return (res.data.items || []).map((item) => item.servicio);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      return [];
    }
  },

  getItemsCarrito: async (): Promise<ItemCarrito[]> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return [];

    try {
      const res = await api.get<CarritoBackend>(`/api/carrito/usuario/${usuarioId}`);
      return (res.data.items || []).map((item) => ({
        id: item.id,
        servicio: item.servicio,
        cantidad: Math.max(1, Number(item.cantidad) || 1),
      }));
    } catch (error) {
      console.error("Error al obtener items del carrito:", error);
      return [];
    }
  },

  agregarAlCarrito: async (servicio: Servicio, cantidad: number = 1): Promise<void> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId || !servicio.id) return;

    try {
      await api.post(`/api/carrito/usuario/${usuarioId}/agregar`, null, {
        params: { servicioId: Number(servicio.id), cantidad: Math.max(1, cantidad) },
      });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  },

  actualizarCantidadItem: async (
    servicioId: number | string,
    nuevaCantidad: number,
    itemCarritoId?: number,
  ): Promise<boolean> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return false;

    if (nuevaCantidad <= 0) {
      await TiendaService.removerDelCarrito(servicioId);
      return true;
    }

    try {
      if (itemCarritoId) {
        await api.put(`/api/items-carrito/${itemCarritoId}`, {
          cantidad: nuevaCantidad,
        });
        return true;
      }

      const res = await api.get<CarritoBackend>(`/api/carrito/usuario/${usuarioId}`);
      const itemEncontrado = (res.data.items || []).find(
        (it) => it.servicio.id === Number(servicioId),
      );

      if (itemEncontrado?.id) {
        await api.put(`/api/items-carrito/${itemEncontrado.id}`, {
          cantidad: nuevaCantidad,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error al actualizar cantidad del item:", error);
      return false;
    }
  },

  removerDelCarrito: async (idServicio: number | string): Promise<void> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return;

    try {
      await api.delete(`/api/carrito/usuario/${usuarioId}/remover`, {
        params: { servicioId: Number(idServicio) },
      });
    } catch (error) {
      console.error("Error al remover del carrito:", error);
    }
  },

  vaciarCarrito: async (): Promise<void> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return;

    try {
      await api.delete(`/api/carrito/usuario/${usuarioId}/vaciar`);
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
    }
  },

  // --- TABLA COMPRAS (CLIENTE) ---
  getCompras: async (): Promise<Compra[]> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return [];

    try {
      const res = await api.get<Compra[]>(`/api/compras/usuario/${usuarioId}`);
      return res.data;
    } catch (error) {
      console.error("Error al obtener compras:", error);
      return [];
    }
  },

  registrarCompra: async (compra: Omit<Compra, "id">): Promise<Compra | null> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return null;

    try {
      const res = await api.post<Compra>(`/api/compras/usuario/${usuarioId}`, compra);
      return res.data;
    } catch (error) {
      console.error("Error al registrar compra:", error);
      return null;
    }
  },

  // --- ADMINISTRACIÓN DE COMPRAS Y REPORTES ---
  getTodasLasCompras: async (): Promise<Compra[]> => {
    try {
      const res = await api.get<Compra[]>("/api/compras");
      return res.data;
    } catch (error) {
      console.error("Error al listar todas las compras:", error);
      return [];
    }
  },

  cambiarEstadoCompra: async (
    id: number,
    estado: EstadoCompra,
  ): Promise<{ success: boolean; mensaje: string; compra?: Compra }> => {
    try {
      const res = await api.put<Compra>(`/api/compras/${id}/estado`, null, {
        params: { estado },
      });
      return {
        success: true,
        mensaje: `Compra #${id} actualizada a estado ${estado}.`,
        compra: res.data,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as
          | { mensaje?: string; message?: string }
          | undefined;
        return {
          success: false,
          mensaje:
            data?.mensaje ||
            data?.message ||
            "No fue posible actualizar el estado de la compra.",
        };
      }
      console.error("Error al actualizar estado de compra:", error);
      return {
        success: false,
        mensaje: "Error de conexión al actualizar la compra.",
      };
    }
  },

  getReporteAdmin: async (
    periodo: PeriodoReporte = "historico",
  ): Promise<ReporteAdmin | null> => {
    try {
      const res = await api.get<ReporteAdmin>("/api/compras/reporte", {
        params: { periodo },
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener reporte administrativo:", error);
      return null;
    }
  },

  calcularReporteLocal: (
    compras: Compra[],
    citas: Cita[],
    periodo: PeriodoReporte,
  ): ReporteAdmin => {
    const hoy = new Date();
    let fechaInicio: string | null = null;
    let fechaFin: string | null = null;

    if (periodo === "semana") {
      const ini = new Date(hoy);
      ini.setDate(hoy.getDate() - 6);
      const fin = new Date(hoy);
      fin.setDate(hoy.getDate() + 7);
      fechaInicio = formatearISO(ini);
      fechaFin = formatearISO(fin);
    } else if (periodo === "mes") {
      const ini = new Date(hoy);
      ini.setDate(hoy.getDate() - 29);
      const fin = new Date(hoy);
      fin.setDate(hoy.getDate() + 30);
      fechaInicio = formatearISO(ini);
      fechaFin = formatearISO(fin);
    } else if (periodo === "anio") {
      const year = hoy.getFullYear();
      fechaInicio = `${year}-01-01`;
      fechaFin = `${year}-12-31`;
    }

    const enRango = (fecha?: string) => {
      if (!fechaInicio || !fechaFin) return true;
      if (!fecha) return false;
      return fecha >= fechaInicio && fecha <= fechaFin;
    };

    const comprasFiltradas = compras.filter((c) => enRango(c.fechaCompra));
    const citasFiltradas = citas.filter((c) => enRango(c.fecha));

    const totalCompras = comprasFiltradas.length;
    const comprasActivas = comprasFiltradas.filter((c) => c.estado === "Activo").length;
    const comprasCompletadas = comprasFiltradas.filter((c) => c.estado === "Completado").length;
    const comprasCanceladas = comprasFiltradas.filter((c) => c.estado === "Cancelado").length;

    const comprasValidas = comprasFiltradas.filter((c) => c.estado !== "Cancelado");
    const montoTotalVendido = comprasValidas.reduce(
      (acc, c) => acc + Math.max(0, Number(c.monto) || 0),
      0,
    );
    const ticketPromedio =
      comprasValidas.length > 0
        ? Math.round(montoTotalVendido / comprasValidas.length)
        : 0;

    const totalCitas = citasFiltradas.length;
    const citasProgramadas = citasFiltradas.filter((c) => c.estado === "Programada").length;
    const citasConfirmadas = citasFiltradas.filter((c) => c.estado === "Confirmada").length;
    const citasCompletadas = citasFiltradas.filter((c) => c.estado === "Completada").length;
    const citasCanceladas = citasFiltradas.filter((c) => c.estado === "Cancelada").length;

    const mapa = new Map<
      string,
      { servicioId: number; nombre: string; cantidadVendida: number; montoRecaudado: number }
    >();

    for (const c of comprasValidas) {
      const nombre = (c.nombre || `Servicio #${c.servicio}`).trim();
      const clave = nombre.toLowerCase();
      const actual = mapa.get(clave) ?? {
        servicioId: c.servicio,
        nombre,
        cantidadVendida: 0,
        montoRecaudado: 0,
      };
      actual.cantidadVendida += 1;
      actual.montoRecaudado += Math.max(0, Number(c.monto) || 0);
      mapa.set(clave, actual);
    }

    const totalUnidades = comprasValidas.length;
    const serviciosMasSolicitados: ServicioSolicitadoReporte[] = Array.from(
      mapa.values(),
    )
      .map((item) => ({
        ...item,
        porcentajeVentas:
          totalUnidades > 0
            ? Math.round((item.cantidadVendida * 1000) / totalUnidades) / 10
            : 0,
      }))
      .sort(
        (a, b) =>
          b.cantidadVendida - a.cantidadVendida ||
          b.montoRecaudado - a.montoRecaudado ||
          a.nombre.localeCompare(b.nombre),
      );

    return {
      periodo,
      fechaInicio,
      fechaFin,
      totalOperaciones: totalCompras + totalCitas,
      totalCompras,
      comprasActivas,
      comprasCompletadas,
      comprasCanceladas,
      montoTotalVendido,
      ticketPromedio,
      totalCitas,
      citasProgramadas,
      citasConfirmadas,
      citasCompletadas,
      citasCanceladas,
      serviciosRealizados: comprasCompletadas + citasCompletadas,
      serviciosMasSolicitados,
    };
  },
};