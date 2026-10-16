import type { Servicio } from "../types/servicio";
import type {Compra } from "../types/compra";
import { StorageUsuario } from "./storageUsuario";

// ---------------------------------------------------------
// ESTRUCTURA RELACIONAL (Modelos Internos)
// ---------------------------------------------------------
// Definimos cómo se verá cada "fila" en nuestras tablas globales
interface FilaTabla<T> {
  registroId: string; // Primary Key: ID único del registro
  usuarioId: string;  // Foreign Key: Identificador del usuario (email)
  data: T;            // Payload: El objeto Servicio o Compra
}

// Helper para generar una "Primary Key" aleatoria simple
const generarId = () => Math.random().toString(36).substring(2, 9);

// Helper para obtener el "Foreign Key" del usuario actual
const getUsuarioId = (): string | null => {
  const sesion = StorageUsuario.getUsuarioSesion();
  return sesion ? sesion.email.toLowerCase() : null;
};

// ---------------------------------------------------------
// SERVICIO DE TIENDA
// ---------------------------------------------------------
export const TiendaService = {
  // --- TABLA CARRITO ---

  getCarrito: (): Servicio[] => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return [];

    // SELECT * FROM db_carrito
    const tabla: FilaTabla<Servicio>[] = JSON.parse(localStorage.getItem("db_carrito") || "[]");

    // WHERE usuarioId = ? (Extraemos solo la "data" para no romper el front-end)
    return tabla
      .filter((fila) => fila.usuarioId === usuarioId)
      .map((fila) => fila.data);
  },

  agregarAlCarrito: (servicio: Servicio): void => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return;

    const tabla: FilaTabla<Servicio>[] = JSON.parse(localStorage.getItem("db_carrito") || "[]");

    // Validar que ESTE usuario no tenga ya ESTE servicio en su carrito
    const yaExiste = tabla.some(
      (fila) => fila.usuarioId === usuarioId && fila.data.id === servicio.id
    );

    if (!yaExiste) {
      // INSERT INTO db_carrito ...
      const nuevaFila: FilaTabla<Servicio> = {
        registroId: generarId(),
        usuarioId: usuarioId,
        data: servicio,
      };
      tabla.push(nuevaFila);
      localStorage.setItem("db_carrito", JSON.stringify(tabla));
    }
  },

  removerDelCarrito: (idServicio: string): void => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return;

    const tabla: FilaTabla<Servicio>[] = JSON.parse(localStorage.getItem("db_carrito") || "[]");

    // DELETE FROM db_carrito WHERE usuarioId = ? AND data.id = ?
    // En arreglos, "borrar" significa filtrar y conservar todos los que NO cumplan esa condición
    const nuevaTabla = tabla.filter(
      (fila) => !(fila.usuarioId === usuarioId && fila.data.id === idServicio)
    );
    localStorage.setItem("db_carrito", JSON.stringify(nuevaTabla));
  },

  vaciarCarrito: (): void => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return;

    const tabla: FilaTabla<Servicio>[] = JSON.parse(localStorage.getItem("db_carrito") || "[]");

    // DELETE FROM db_carrito WHERE usuarioId = ?
    const nuevaTabla = tabla.filter((fila) => fila.usuarioId !== usuarioId);
    localStorage.setItem("db_carrito", JSON.stringify(nuevaTabla));
  },

  // --- TABLA COMPRAS ---

  getCompras: (): Compra[] => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return [];

    const tabla: FilaTabla<Compra>[] = JSON.parse(localStorage.getItem("db_compras") || "[]");

    return tabla
      .filter((fila) => fila.usuarioId === usuarioId)
      .map((fila) => fila.data);
  },

  registrarCompra: (compra: Compra): void => {
    const usuarioId = getUsuarioId();
    if (!usuarioId) return;

    const tabla: FilaTabla<Compra>[] = JSON.parse(localStorage.getItem("db_compras") || "[]");

    const nuevaFila: FilaTabla<Compra> = {
      registroId: generarId(),
      usuarioId: usuarioId,
      data: compra,
    };

    // Usamos unshift para que la compra más nueva quede al inicio del array
    tabla.unshift(nuevaFila);
    localStorage.setItem("db_compras", JSON.stringify(tabla));
  },
};