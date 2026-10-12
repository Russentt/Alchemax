export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  genero: "masculino" | "femenino" | "otro" | string;
  password?: string;
  rol: "admin" | "usuario";
  fechaNacimiento: string;
}

export interface Cita {
  id: string;
  fecha: string;
  hora: string;
  tipo: string;
  profesional: string;
  estado: "Programada" | "Completada" | "Cancelada";
}

export interface Macro {
  nombre: string;
  gramos: number;
  porcentaje: number;
  color: "success" | "info" | "warning" | "danger";
}

export interface Comida {
  id: string;
  tipo: string;
  horario: string;
  descripcion: string;
}

export interface PlanNutricional {
  caloriasDiarias: number;
  objetivo: string;
  macros: Macro[];
  comidas: Comida[];
}

export interface Metrica {
  id: string;
  fecha: string;
  peso: number;
  grasa: number;
  musculo: number;
}

export interface Examen {
  id: string;
  nombre: string;
  fechaSubida: string;
  estado: "Revisado" | "Pendiente";
}

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

export interface Compra {
  id: string;
  servicioId: string;
  nombre: string;
  fechaCompra: string;
  monto: number;
  estado: "Activo" | "Completado";
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  serviciosAsociados?: number;
}
