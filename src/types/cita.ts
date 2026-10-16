export interface Cita {
    id: string;
    fecha: string;
    hora: string;
    tipo: string;
    profesional: string;
    estado: "Programada" | "Completada" | "Cancelada";
}