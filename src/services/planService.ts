import type { PlanNutricional, Metrica, Examen } from "../data/types";

export const PlanService = {
  getPlan: (): PlanNutricional =>
    JSON.parse(localStorage.getItem("db_plan") || "{}"),
  getMetricas: (): Metrica[] =>
    JSON.parse(localStorage.getItem("db_metricas") || "[]"),
  addMetrica: (metrica: Metrica): void => {
    const metricas = PlanService.getMetricas();
    metricas.unshift(metrica);
    localStorage.setItem("db_metricas", JSON.stringify(metricas));
  },
  getExamenes: (): Examen[] =>
    JSON.parse(localStorage.getItem("db_examenes") || "[]"),
  addExamen: (examen: Examen): void => {
    const examenes = PlanService.getExamenes();
    examenes.unshift(examen);
    localStorage.setItem("db_examenes", JSON.stringify(examenes));
  },
  deleteExamen: (id: string): void => {
    const examenes = PlanService.getExamenes().filter((e) => e.id !== id);
    localStorage.setItem("db_examenes", JSON.stringify(examenes));
  },
};