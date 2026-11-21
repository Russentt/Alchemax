export interface Compra {
  id: number;
  servicio: number;
  nombre: string;
  fechaCompra: string;
  monto: number;
  estado: "Activo" | "Completado";
}
