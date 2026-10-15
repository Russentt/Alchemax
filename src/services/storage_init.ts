import { SEED_DATA } from "../data/seedData";
import { StorageUsuario } from "./storageUsuario";

export const StorageInit = {
  initDB: (): void => {


    if (!localStorage.getItem("db_usuarios")) {
      localStorage.setItem("db_usuarios", JSON.stringify(SEED_DATA.usuarios));
    } else {

      const usuarios = StorageUsuario.getUsuarios();
      const adminSEED = SEED_DATA.usuarios.find((u) => u.rol === "admin");

      if (adminSEED) {
        const existeAdmin = usuarios.some(
          (u) =>
            u.email.toLowerCase() === adminSEED.email.toLowerCase() ||
            u.rol === "admin"
        );

        if (!existeAdmin) {
          usuarios.unshift(adminSEED);
          localStorage.setItem("db_usuarios", JSON.stringify(usuarios));
        }
      }
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
    if (!localStorage.getItem("db_compras")) {
      localStorage.setItem("db_compras", JSON.stringify(SEED_DATA.compras));
    }
    if (!localStorage.getItem("db_categorias")) {
      localStorage.setItem("db_categorias", JSON.stringify(SEED_DATA.categorias));
    }

    if (!localStorage.getItem("db_servicios")) {
      localStorage.setItem("db_servicios", JSON.stringify(SEED_DATA.servicios));
    }
  },
};
