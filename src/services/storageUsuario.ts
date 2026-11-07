import type { Usuario } from "../types/index";
import { api } from "../api/axiosConfig";

const SESION_KEY = "db_sesion";

export const StorageUsuario = {
  getUsuarios: async (): Promise<Usuario[]> => {
    try {
      const response = await api.get<Usuario[]>("/api/usuarios");
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios", error)
      return [];
    }
  },

  getUsuarioSesion: (): Usuario | null => {
    const sesion = localStorage.getItem(SESION_KEY);
    return sesion ? JSON.parse(sesion) : null;
  },

  logout: (): void => {
    localStorage.removeItem(SESION_KEY);
  },

  registrarUsuario: async (
    nuevoUsuario: Omit<Usuario, "id">,
  ): Promise<{ success: boolean; mensaje: string; usuario?: Usuario }> => {
    try {
      
      const response = await api.post<Usuario>("/api/usuarios", nuevoUsuario);

      if (response.status === 201 || response.status === 200) {
        return {
          success: true,
          mensaje: "Usuario registrado con éxito.",
          usuario: response.data,
        };
      }

      return { success: false, mensaje: "No se pudo registrar el usuario." };
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      const mensajeError =
        error.response?.data?.message || "Error al conectar con el servidor.";
      return { success: false, mensaje: mensajeError };
    }
  },

  login: async (email: string, pass: string): Promise <Usuario | null> => {
    const usuarios = await StorageUsuario.getUsuarios();
    const usuarioValido = usuarios.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === pass,
    );

    if (usuarioValido) {
      localStorage.setItem(SESION_KEY, JSON.stringify(usuarioValido));
      return usuarioValido;
    }
    return null;
  },

  updateUsuario: async (
    usuarioActualizado: Usuario,
    emailOriginal?: string,
  ): Promise<{ success: boolean; mensaje: string }> => {
    try {
      const usuarios = await StorageUsuario.getUsuarios();

      if (
        emailOriginal &&
        emailOriginal.toLowerCase() !== usuarioActualizado.email.toLowerCase()
      ) {
        const correoDuplicado = usuarios.some(
          (u) =>
            u.id !== usuarioActualizado.id &&
            u.email.toLowerCase() === usuarioActualizado.email.toLowerCase(),
        );

        if (correoDuplicado) {
          return {
            success: false,
            mensaje: "Correo invalido.",
          };
        }
      }

      let idObjetivo = usuarioActualizado.id;
      if (!idObjetivo) {
        const correoBuscar = (emailOriginal || usuarioActualizado.email).toLowerCase();
        const coincidencia = usuarios.find((u) => u.email.toLowerCase() === correoBuscar);
        idObjetivo = coincidencia?.id;
      }

      if (!idObjetivo) {
        return { success: false, mensaje: "No se encontró el ID del usuario." };
      }

      const response = await api.put<Usuario>(`/api/usuarios/${idObjetivo}`, usuarioActualizado);

      const sesionActual = StorageUsuario.getUsuarioSesion();
      if (sesionActual && sesionActual.id === idObjetivo) {
        localStorage.setItem(SESION_KEY, JSON.stringify(response.data));
      }

      return { success: true, mensaje: "Usuario actualizado con éxito." };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return { success: false, mensaje: "Error al actualizar en el servidor." };
    }
  },

  deleteUsuario: async (id: number): Promise<{ success: boolean; mensaje: string }> => {
    try {
      await api.delete(`/api/usuarios/${id}`);

      const sesionActual = StorageUsuario.getUsuarioSesion();
      if (sesionActual && sesionActual.id === id) {
        StorageUsuario.logout();
      }

      return { success: true, mensaje: "Usuario eliminado con éxito." };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return { success: false, mensaje: "Error al eliminar en el servidor." };
    }
  },
};
