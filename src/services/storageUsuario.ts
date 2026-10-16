import type { Usuario } from "../types/index";

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

  updateUsuario: (
    usuarioActualizado: Usuario,
    emailOriginal?: string,
  ): { success: boolean; mensaje: string } => {
    const usuarios = StorageUsuario.getUsuarios();
    const sesionActual = StorageUsuario.getUsuarioSesion();

    const correoBuscar = (emailOriginal || usuarioActualizado.email).toLowerCase();

    // Validar si intentó cambiar a un correo que ya tiene otra persona
    if (
      emailOriginal &&
      emailOriginal.toLowerCase() !== usuarioActualizado.email.toLowerCase()
    ) {
      const correoDuplicado = usuarios.some(
        (u) => u.email.toLowerCase() === usuarioActualizado.email.toLowerCase(),
      );

      if (correoDuplicado) {
        return {
          success: false,
          mensaje: "Correo invalido, intenta con otro.",
        };
      }
    }

    // Actualizar la lista mapeando por el correo de búsqueda
    const usuariosNuevos = usuarios.map((u) => {
      if (u.email.toLowerCase() === correoBuscar) {
        return { ...u, ...usuarioActualizado };
      }
      return u;
    });

    localStorage.setItem("db_usuarios", JSON.stringify(usuariosNuevos));

    // Si la sesión activa pertenecía a este usuario, actualizar también la sesion
    if (sesionActual && sesionActual.email.toLowerCase() === correoBuscar) {
      localStorage.setItem(
        "db_sesion",
        JSON.stringify({ ...sesionActual, ...usuarioActualizado }),
      );
    }

    return { success: true, mensaje: "Usuario actualizado con éxito." };
  },

  deleteUsuario: (email: string): void => {
    const usuarios = StorageUsuario.getUsuarios();
    const filtrados = usuarios.filter(
      (u) => u.email.toLowerCase() !== email.toLowerCase(),
    );
    localStorage.setItem("db_usuarios", JSON.stringify(filtrados));
  },
};
