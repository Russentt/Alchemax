import { api } from "../api/axiosConfig";
import { SEED_DATA } from "../data/seedData";
import { StorageUsuario } from "./storageUsuario";

type CompraInicial = (typeof SEED_DATA.compras)[number];
type CompraPersistida = CompraInicial | CompraInicial["data"];

export const StorageInit = {
  initDB: async (): Promise<void> => {

    try {
      // Consultamos los usuarios existentes en MySQL a través de Spring Boot
      const usuariosBackend = await StorageUsuario.getUsuarios();

      if (usuariosBackend.length > 0) {
        // Si el backend ya tiene usuarios, actualizamos localStorage con los datos de MySQL
        localStorage.setItem("db_usuarios", JSON.stringify(usuariosBackend));
      } else {
        for (const user of SEED_DATA.usuarios) {
          try {
            await api.post("/api/usuarios", user);
          } catch (postError) {
            console.error(`Error al sembrar usuario ${user.email}:`, postError);
          }
        }
        const usuariosGuardados = await StorageUsuario.getUsuarios();
        localStorage.setItem("db_usuarios", JSON.stringify(usuariosGuardados));
      }
    } catch (error) {
      console.warn("No se pudo conectar con el backend. Usando respaldo local.", error);
      if (!localStorage.getItem("db_usuarios")) {
        localStorage.setItem("db_usuarios", JSON.stringify(SEED_DATA.usuarios));
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

    const comprasGuardadas = localStorage.getItem("db_compras");
    if (!comprasGuardadas) {
      localStorage.setItem("db_compras", JSON.stringify(SEED_DATA.compras));
    } else {
      const compras = JSON.parse(comprasGuardadas) as CompraPersistida[];
      const comprasMigradas = compras.map((compra) => {
        if ("data" in compra) {
          return compra;
        }

        return (
          SEED_DATA.compras.find(
            (compraSemilla) => compraSemilla.data.id === compra.id,
          ) ?? compra
        );
      });

      if (comprasMigradas.some((compra, index) => compra !== compras[index])) {
        localStorage.setItem("db_compras", JSON.stringify(comprasMigradas));
      }
    }

    if (!localStorage.getItem("db_categorias")) {
      localStorage.setItem("db_categorias", JSON.stringify(SEED_DATA.categorias));
    }

    if (!localStorage.getItem("db_servicios")) {
      localStorage.setItem("db_servicios", JSON.stringify(SEED_DATA.servicios));
    }
  },
};
