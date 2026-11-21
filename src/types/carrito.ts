import type { Servicio } from "./servicio";

export interface ItemCarrito {
  id?: number;
  servicio: Servicio;
  cantidad: number;
}
