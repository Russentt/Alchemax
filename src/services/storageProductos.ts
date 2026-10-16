import type { Servicio } from "../types/index";
import { StorageCategorias } from "./storageCategorias";

export const StorageServicios = {
  // Obtener los servicios y productos
  getServicios: (): Servicio[] => {
    return JSON.parse(localStorage.getItem("db_servicios") || "[]");
  },

  crearServicio: (
    servicio: Omit<Servicio, "id">,
  ): { success: boolean; mensaje: string } => {
    const servicios = StorageServicios.getServicios();

    const existe = servicios.some(
      (s) =>
        s.nombre.trim().toLowerCase() === servicio.nombre.trim().toLowerCase(),
    );

    if (existe) {
      return { success: false, mensaje: "EL nombre servicio ya existe" };
    }

    const nuevoServicio: Servicio = {
      ...servicio,
      id: `PROD-${Date.now()}`,
    };

    servicios.push(nuevoServicio);
    localStorage.setItem("db_servicios", JSON.stringify(servicios));

    StorageServicios.actualizarContadorCat(servicios);

    return { success: true, mensaje: "Servicio creado exitosamente." };
  },

  updateServicio: (
    servicioActualizado: Servicio,
  ): { success: boolean; mensaje: string } => {
    const servicios = StorageServicios.getServicios();

    const existeNombre = servicios.some(
      (s) =>
        s.id !== servicioActualizado.id &&
        s.nombre.trim().toLowerCase() ===
          servicioActualizado.nombre.trim().toLowerCase(),
    );

    if (existeNombre) {
      return { success: false, mensaje: "Ese nombre ya está en uso" };
    }

    const nuevosServicios = servicios.map((s) =>
      s.id === servicioActualizado.id ? servicioActualizado : s,
    );

    localStorage.setItem("db_servicios", JSON.stringify(nuevosServicios));
    StorageServicios.actualizarContadorCat(nuevosServicios);

    return { success: true, mensaje: "Servicio actualizado" };
  },

  // Cambiar estado del servicio
  toggleEstado: (id: string): void => {
    const servicios = StorageServicios.getServicios();
    const actualizados = servicios.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          estado: (s.estado === "Activo" ? "Inactivo" : "Activo") as
            | "Activo"
            | "Inactivo",
        };
      }
      return s;
    });
    localStorage.setItem("db_servicios", JSON.stringify(actualizados));
  },

  deleteServicio: (id: string): void => {
    const servicios = StorageServicios.getServicios();
    const filtrados = servicios.filter((s) => s.id !== id);
    localStorage.setItem("db_servicios", JSON.stringify(filtrados));

    StorageServicios.actualizarContadorCat(filtrados);
  },

  actualizarContadorCat: (
    servicios: Servicio[] = StorageServicios.getServicios(),
  ): void => {
    const categorias = StorageCategorias.getCategorias();
    const conteoPorCategoria = servicios.reduce(
      (acc, s) => {
        acc[s.categoriaId] = (acc[s.categoriaId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const categoriasActualizadas = categorias.map((cat) => {
      return {
        ...cat,
        serviciosAsociados: conteoPorCategoria[cat.id] || 0,
      };
    });
    localStorage.setItem(
      "db_categorias",
      JSON.stringify(categoriasActualizadas),
    );
  },
};
