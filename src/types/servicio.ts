import type { PlanNutricional } from "./planNutricional";

export interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    tipo: "evaluacion" | "plan" | "control";
    icono: string;
    categoriaId: string;
    categoriaNombre?: string;
    estado: "Activo" | "Inactivo";
    planNutricional?: PlanNutricional;
}