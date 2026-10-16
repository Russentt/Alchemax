export interface Examen {
    id: string;
    nombre: string;
    fechaSubida: string;
    estado: "Revisado" | "Pendiente";
}