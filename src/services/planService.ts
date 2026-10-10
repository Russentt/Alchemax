import type { PlanNutricional, Metrica, Examen } from "../data/types";

export const PlanService = {
  getPlan: (): PlanNutricional =>
    JSON.parse(localStorage.getItem("db_plan") || "{}"),

  getMetricas: (): Metrica[] =>
    JSON.parse(localStorage.getItem("db_metricas") || "[]"),

  getExamenes: (): Examen[] =>
    JSON.parse(localStorage.getItem("db_examenes") || "[]"),

  addExamen: (examen: Examen): void => {
    const examenes = PlanService.getExamenes();
    examenes.push(examen);
    localStorage.setItem("db_examenes", JSON.stringify(examenes));
  },
};
