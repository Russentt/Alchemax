import { SEED_DATA } from "../data/seedData";
import type { PlanNutricional, Examen, Metrica } from "../types/index";

// Estado clínico en memoria (sin localStorage) mientras se incorporan
// endpoints SQL dedicados para pautas, métricas biométricas y exámenes.
let planMemoria: PlanNutricional = structuredClone(SEED_DATA.plan);
let metricasMemoria: Metrica[] = structuredClone(SEED_DATA.metricas);
let examenesMemoria: Examen[] = structuredClone(SEED_DATA.examenes);

export const PlanService = {
  getPlan: (): PlanNutricional => structuredClone(planMemoria),

  updatePlan: (nuevoPlan: PlanNutricional): void => {
    planMemoria = structuredClone(nuevoPlan);
  },

  getMetricas: (): Metrica[] => structuredClone(metricasMemoria),

  addMetrica: (metrica: Metrica): void => {
    metricasMemoria = [metrica, ...metricasMemoria];
  },

  getExamenes: (): Examen[] => structuredClone(examenesMemoria),

  addExamen: (examen: Examen): void => {
    examenesMemoria = [examen, ...examenesMemoria];
  },

  deleteExamen: (id: string): void => {
    examenesMemoria = examenesMemoria.filter((e) => e.id !== id);
  },

  updateEstadoExamen: (id: string, estado: "Pendiente" | "Revisado"): void => {
    examenesMemoria = examenesMemoria.map((ex) =>
      ex.id === id ? { ...ex, estado } : ex,
    );
  },
};
