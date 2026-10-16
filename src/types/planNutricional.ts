import type { Comida } from "./comida";
import type { Macro } from "./macro";

export interface PlanNutricional {
    caloriasDiarias: number;
    objetivo: string;
    macros: Macro[];
    comidas: Comida[];
}