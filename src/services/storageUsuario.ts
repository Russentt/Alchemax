import type { Usuario } from "../data/types";

export const StorageUsuario = {
  getUsuarios: (): Usuario[] =>
    JSON.parse(localStorage.getItem("db_usuarios") || "[]"),

  getUsuarioSesion: (): Usuario | null => {
    const sesion = localStorage.getItem("db_sesion");
    return sesion ? JSON.parse(sesion) : null;
  },

  registrarUsuario: (
    nuevoUsuario: Usuario,
  ): { success: boolean; mensaje: string } => {
    const usuarios = StorageUsuario.getUsuarios();

    const existe = usuarios.some(
      (u) => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase(),
    );

    if (existe) {
      return {
        success: false,
        mensaje: "El correo ya se encuentra registrado.",
      };
    }

    usuarios.push(nuevoUsuario);
    localStorage.setItem("db_usuarios", JSON.stringify(usuarios));
    return { success: true, mensaje: "Usuario registrado con éxito." };
  },

  login: (email: string, pass: string): Usuario | null => {
    const usuarios = StorageUsuario.getUsuarios();
    const usuarioValido = usuarios.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === pass,
    );

    if (usuarioValido) {
      localStorage.setItem("db_sesion", JSON.stringify(usuarioValido));
      return usuarioValido;
    }
    return null;
  },

  logout: (): void => {
    localStorage.removeItem("db_sesion");
  },

  updateUsuario: (usuarioActualizado: Usuario): void => {
    const usuarios = StorageUsuario.getUsuarios();
    const usuariosNuevos = usuarios.map((u) =>
      u.email.toLowerCase() === usuarioActualizado.email.toLowerCase()
        ? { ...u, ...usuarioActualizado }
        : u,
    );

    localStorage.setItem("db_usuarios", JSON.stringify(usuariosNuevos));

    const sesionActual = StorageUsuario.getUsuarioSesion();
    if (
      sesionActual &&
      sesionActual.email.toLowerCase() ===
        usuarioActualizado.email.toLowerCase()
    ) {
      localStorage.setItem("db_sesion", JSON.stringify(usuarioActualizado));
    }
  },
};
