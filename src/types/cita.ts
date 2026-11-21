export type EstadoCita =
  | "Programada"
  | "Confirmada"
  | "Completada"
  | "Cancelada";

export interface CitaUsuarioRef {
  id: number;
  nombre?: string;
  email?: string;
}

export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  tipo: string;
  profesional: string;
  estado: EstadoCita;
  usuario?: CitaUsuarioRef | null;
  pacienteNombre?: string;
  pacienteEmail?: string;
}
