import { api } from "../api/axiosConfig";
import type { Servicio } from "../types/index";
import { StorageCategorias } from "./storageCategorias";


const mapearDesdeBackend = (item: any): Servicio => {
  return {
    id: Number(item.id),
    nombre: item.nombre,
    descripcion: item.descripcion,
    precio: Number(item.precio),
    tipo: (item.tipo ? item.tipo.toLowerCase() : "plan") as "evaluacion" | "plan" | "control",
    icono: item.icono || "🥗",
    categoriaId: Number(item.categoria?.id ?? item.categoriaId?.id ?? item.categoriaId ?? 0),
    categoriaNombre: item.categoria?.nombre || item.categoriaNombre || "General",
    estado: item.estado === false ? "Inactivo" : "Activo",
  };
};

const mapearHaciaBackend = (servicio: Omit<Servicio, "id">) => {
  return {
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    precio: Number(servicio.precio),
    tipo: servicio.tipo,
    icono: servicio.icono,
    categoriaId: servicio.categoriaId
  ? { id: Number(servicio.categoriaId) }
  : null,
    categoriaNombre: servicio.categoriaNombre,
    estado: servicio.estado !== "Inactivo",
  };
};

export const StorageServicios = {
  getServicios: async (): Promise<Servicio[]> => {
    try {
      const response = await api.get<any[]>("/api/servicios");
      return response.data.map(mapearDesdeBackend);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      return [];
    }
  },

  crearServicio: async (
    servicio: Omit<Servicio, "id">,
  ): Promise<{ success: boolean; mensaje: string }> => {
    try {
      const servicios = await StorageServicios.getServicios();
      const nombreNormalizado = servicio.nombre.trim().toLowerCase();

      for (const s of servicios) {
        if (s.nombre.trim().toLowerCase() === nombreNormalizado) {
          return { success: false, mensaje: "El nombre del servicio ya existe" };
        }
      }

      const payload = mapearHaciaBackend(servicio);
      const response = await api.post("/api/servicios", payload);

      if (response.status === 201 || response.status === 200) {
        await StorageServicios.actualizarContadorCat();
        return { success: true, mensaje: "Servicio creado exitosamente." };
      }

      return { success: false, mensaje: "No se pudo crear el servicio." };
    } catch (error) {
      console.error("Error al crear servicio:", error);
      return { success: false, mensaje: "Error al conectar con el servidor." };
    }
  },

  updateServicio: async (
    servicioActualizado: Servicio,
  ): Promise<{ success: boolean; mensaje: string }> => {
    try {
      const servicios = await StorageServicios.getServicios();
      const nombreNormalizado = servicioActualizado.nombre.trim().toLowerCase();

      for (const s of servicios) {
        if (
          Number(s.id) !== Number(servicioActualizado.id) &&
          s.nombre.trim().toLowerCase() === nombreNormalizado
        ) {
          return { success: false, mensaje: "Ese nombre ya está en uso" };
        }
      }

      const { id, ...sinId } = servicioActualizado;
      const payload = mapearHaciaBackend(sinId);

      await api.put(`/api/servicios/${id}`, payload);
      await StorageServicios.actualizarContadorCat();

      return { success: true, mensaje: "Servicio actualizado" };
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      return { success: false, mensaje: "Error al actualizar en el servidor." };
    }
  },

  // Cambiar estado del servicio
  toggleEstado: async (id: number): Promise<void> => {
    try {
      await api.put(`/api/servicios/${id}/estado`);
    } catch (error) {
      console.error("Error al cambiar estado del servicio:", error);
    }
  },

  deleteServicio: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/servicios/${id}`);
      await StorageServicios.actualizarContadorCat();
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
    }
  },

  actualizarContadorCat: async (): Promise<void> => {
    try {
      const [servicios, categorias] = await Promise.all([
        StorageServicios.getServicios(),
        StorageCategorias.getCategorias(),
      ]);

      const conteoPorCategoria: Record<number, number> = {};
      for (const s of servicios) {
        const catId = Number(s.categoriaId);
        conteoPorCategoria[catId] = (conteoPorCategoria[catId] || 0) + 1;
      }

      for (const cat of categorias) {
        const nuevoConteo = conteoPorCategoria[Number(cat.id)] || 0;
        if (cat.serviciosAsociados !== nuevoConteo) {
          await StorageCategorias.updateCategoria({
            ...cat,
            serviciosAsociados: nuevoConteo,
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar contador de categorías:", error);
    }
  },
};
