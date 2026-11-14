import type { Usuario } from "../types/index";
import { api } from "../api/axiosConfig";

const SESION_KEY = "db_sesion";

let usuarioActual: Usuario | null = (() => {
  try {
    const raw = localStorage.getItem(SESION_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
})();

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
    if (!usuarioActual) {
      const raw = localStorage.getItem(SESION_KEY);
      if (raw) usuarioActual = JSON.parse(raw);
    }
    return usuarioActual;
  },

  logout: (): void => {
    usuarioActual = null;
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

  login: async (email: string, pass: string): Promise<Usuario | null> => {
    try {
      const response = await api.post<Usuario>("/api/usuarios/login", {
        email: email,
        password: pass,
      });
      if (response.status === 200 && response.data) {
        usuarioActual = response.data;
        localStorage.setItem(SESION_KEY, JSON.stringify(usuarioActual));
        return usuarioActual;
      }
      return null;
    } catch (error) {
      console.error("Error al iniciar sesion: ", error);
      return null;
    }
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
        let correoDuplicado = false;
        for (const u of usuarios) {
          if (
            u.id !== usuarioActualizado.id &&
            u.email.toLowerCase() === usuarioActualizado.email.toLowerCase()
          ) {
            correoDuplicado = true;
            break;
          }
        }

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
        for (const u of usuarios) {
          if (u.email.toLowerCase() === correoBuscar) {
            idObjetivo = u.id;
            break;
          }
        }
      }

      if (!idObjetivo) {
        return { success: false, mensaje: "No se encontró el ID del usuario." };
      }

      const response = await api.put<Usuario>(`/api/usuarios/${idObjetivo}`, usuarioActualizado);

      if (usuarioActual && usuarioActual.id === idObjetivo) {
        usuarioActual = response.data;
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

      if (usuarioActual && usuarioActual.id === id) {
        StorageUsuario.logout();
      }

      return { success: true, mensaje: "Usuario eliminado con éxito." };
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return { success: false, mensaje: "Error al eliminar en el servidor." };
    }
  },
};
