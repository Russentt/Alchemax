import { api } from "../api/axiosConfig";
import { SEED_DATA } from "../data/seedData";
import type { Servicio } from "../types";
import { StorageCategorias } from "./storageCategorias";
import { StorageServicios } from "./storageProductos";
import { StorageUsuario } from "./storageUsuario";

export const StorageInit = {
  initDB: async (): Promise<void> => {
    
    try {
      const usuariosBackend = await StorageUsuario.getUsuarios();
      if (usuariosBackend.length === 0) {
        for (const user of SEED_DATA.usuarios) {
          try {
            await api.post("/api/usuarios", user);
          } catch (postError) {
            console.error(`Error al sembrar usuario ${user.email}:`, postError);
          }
        }
      }
    } catch (error) {
      console.error("Error al verificar usuarios en el backend:", error);
    }

    try {
      const categoriasBackend = await StorageCategorias.getCategorias();
      if (categoriasBackend.length === 0) {
        for (const cat of SEED_DATA.categorias) {
          try {
            const { id, ...categoriaSinId } = cat;
            await api.post("/api/categorias", {
              ...categoriaSinId,
              serviciosAsociados: cat.serviciosAsociados ?? 0,
            });
          } catch (postError) {
            console.error(`Error al sembrar categoría ${cat.nombre}:`, postError);
          }
        }
      }
    } catch (error) {
      console.error("Error al verificar categorías en el backend:", error);
    }

    try {
      const serviciosBackend = await StorageServicios.getServicios();
      if (serviciosBackend.length === 0) {
        const categoriasActuales = await StorageCategorias.getCategorias();

        for (const serv of SEED_DATA.servicios) {
          try {
            const catMatch =
              categoriasActuales.find(
                (c) =>
                  c.nombre.trim().toLowerCase() ===
                  (serv.categoriaNombre || "").trim().toLowerCase(),
              ) || categoriasActuales[0];

            await StorageServicios.crearServicio({
              nombre: serv.nombre,
              descripcion: serv.descripcion,
              precio: Number(serv.precio),
              tipo: (serv.tipo?.toLowerCase() || "plan") as "evaluacion" | "plan" | "control",
              icono: serv.icono || "🥗",
              categoriaId: catMatch ? Number(catMatch.id) : 0,
              categoriaNombre: catMatch ? catMatch.nombre : serv.categoriaNombre,
              estado: (serv as { estado?: string }).estado === "Inactivo" ? "Inactivo" : "Activo",
            });
          } catch (postError) {
            console.error(`Error al sembrar servicio ${serv.nombre}:`, postError);
          }
        }
      }
    } catch (error) {
      console.error("Error al verificar servicios en el backend:", error);
    }

    if (!localStorage.getItem("db_citas")) {
      localStorage.setItem("db_citas", JSON.stringify(SEED_DATA.citas));
    }
    if (!localStorage.getItem("db_plan")) {
      localStorage.setItem("db_plan", JSON.stringify(SEED_DATA.plan));
    }
    if (!localStorage.getItem("db_metricas")) {
      localStorage.setItem("db_metricas", JSON.stringify(SEED_DATA.metricas));
    }
    if (!localStorage.getItem("db_examenes")) {
      localStorage.setItem("db_examenes", JSON.stringify(SEED_DATA.examenes));
    }
  },
};