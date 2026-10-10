import { SEED_DATA } from "../data/seedData";

export const StorageInit = {
  initDB: (): void => {
    if (!localStorage.getItem("db_usuarios")) {
      localStorage.setItem("db_usuarios", JSON.stringify(SEED_DATA.usuarios));
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
  },
};
