export interface Compra {
    id: string;
    servicioId: string;
    nombre: string;
    fechaCompra: string;
    monto: number;
    estado: "Activo" | "Completado";
}