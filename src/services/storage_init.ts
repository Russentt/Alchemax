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
      const categoriasBase = [
        { id: "CAT-01", nombre: "Evaluación Biométrica", descripcion: "Medición y pesajes", serviciosAsociados: 12 },
        { id: "CAT-02", nombre: "Planes Especializados", descripcion: "Planes personalizados", serviciosAsociados: 8 },
      ];
      localStorage.setItem("db_categorias", JSON.stringify(categoriasBase));
    }

    if (!localStorage.getItem("db_servicios")) {
      const serviciosBase = [
        {
          id: "PROD-101",
          nombre: "Plan Nutricional Deportivo",
          descripcion: "Plan enfocado en ganancia muscular y rendimiento",
          precio: 45000,
          tipo: "plan" as const,
          icono: "🥗",
          categoriaId: "CAT-01",
          categoriaNombre: "Planes Especializados",
          estado: "Activo" as const,
          planNutricional: {
            caloriasDiarias: 2400,
            objetivo: "Aumento de masa muscular magra",
            macros: [
              { nombre: "Proteínas", gramos: 180, porcentaje: 30, color: "success" },
              { nombre: "Carbohidratos", gramos: 280, porcentaje: 50, color: "info" },
              { nombre: "Grasas", gramos: 55, porcentaje: 20, color: "warning" },
            ],
            comidas: [
              {
                id: "com-1",
                tipo: "Desayuno",
                horario: "08:00",
                descripcion: "Avena con claras de huevo, plátano y nueces",
              },
            ],
          },
        },
      ];
      localStorage.setItem("db_servicios", JSON.stringify(serviciosBase));
    }
  },
};
