import type { Servicio } from "../types/servicio";
import type {Compra } from "../types/compra";
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

// ---------------------------------------------------------
// SERVICIO DE TIENDA
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

  agregarAlCarrito: async (servicio: Servicio): Promise<void> => {
    const usuarioId = getUsuarioId();
    if (!usuarioId || !servicio.id) return;

    try {
      await api.post(`/api/carrito/usuario/${usuarioId}/agregar`, null, {
        params: { servicioId: Number(servicio.id), cantidad: 1 },
      });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
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

  // --- TABLA COMPRAS ---

  // --- TABLA COMPRAS ---
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
};