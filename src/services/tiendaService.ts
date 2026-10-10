import type { Servicio, Compra } from "../data/types";

export const TiendaService = {
  getCarrito: (): Servicio[] =>
    JSON.parse(localStorage.getItem("db_carrito") || "[]"),

  agregarAlCarrito: (servicio: Servicio): void => {
    const carrito = TiendaService.getCarrito();
    if (!carrito.some((item) => item.id === servicio.id)) {
      carrito.push(servicio);
      localStorage.setItem("db_carrito", JSON.stringify(carrito));
    }
  },

  removerDelCarrito: (id: string): void => {
    const carrito = TiendaService.getCarrito();
    const updated = carrito.filter((item) => item.id !== id);
    localStorage.setItem("db_carrito", JSON.stringify(updated));
  },

  vaciarCarrito: (): void => {
    localStorage.setItem("db_carrito", JSON.stringify([]));
  },

  getCompras: (): Compra[] =>
    JSON.parse(localStorage.getItem("db_compras") || "[]"),

  registrarCompra: (compra: Compra): void => {
    const compras = TiendaService.getCompras();
    compras.unshift(compra);
    localStorage.setItem("db_compras", JSON.stringify(compras));
  },
};
