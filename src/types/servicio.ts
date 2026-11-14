import type { PlanNutricional } from "./planNutricional";

export interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    tipo: "evaluacion" | "plan" | "control";
    icono: string;
    categoriaId: number;
    categoriaNombre?: string;
    estado: "Activo" | "Inactivo";
    planNutricional?: PlanNutricional;
}