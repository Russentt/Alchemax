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
    const sesionActual = StorageUsuario.getUsuarioSesion();

    // Usamos el email de la sesión activa como referencia por si el usuario decidió cambiar su correo
    const emailReferencia = sesionActual
      ? sesionActual.email.toLowerCase()
      : usuarioActualizado.email.toLowerCase();

    let usuarioFusionado: Usuario = usuarioActualizado;

    const usuariosNuevos = usuarios.map((u) => {
      // Buscamos por ID (si existe) o por el email original de referencia
      const coincideId =
        u.id && usuarioActualizado.id && u.id === usuarioActualizado.id;
      const coincideEmail = u.email.toLowerCase() === emailReferencia;

      if (coincideId || coincideEmail) {
        // Fusionamos los datos antiguos con los nuevos (incluyendo la nueva password si se ingresó)
        usuarioFusionado = { ...u, ...usuarioActualizado };
        return usuarioFusionado;
      }
      return u;
    });

    // 1. Guardamos la lista actualizada en la base de datos general
    localStorage.setItem("db_usuarios", JSON.stringify(usuariosNuevos));

    // 2. Si el usuario editado es el que tiene la sesión iniciada, actualizamos su sesión activa
    if (
      sesionActual &&
      (sesionActual.email.toLowerCase() === emailReferencia ||
        (sesionActual.id && sesionActual.id === usuarioActualizado.id))
    ) {
      localStorage.setItem(
        "db_sesion",
        JSON.stringify({ ...sesionActual, ...usuarioFusionado }),
      );
    }
  },
};
