import axios from "axios";
import type { Usuario } from "../types/index";
import { api } from "../api/axiosConfig";
import { AuthTokenStore } from "../utils/authToken";

interface AuthResponseBackend {
  token: string;
  id: number;
  nombre: string;
  email: string;
  rol: Usuario["rol"];
  genero?: string;
  fechaNacimiento?: string;
  pesoActual?: number;
  objetivoPrincipal?: string;
  fotoPerfil?: string;
}

export interface ActualizarPerfilPropioPayload {
  nombre?: string;
  email?: string;
  genero?: string;
  fechaNacimiento?: string;
  pesoActual?: number;
  objetivoPrincipal?: string;
  fotoPerfil?: string;
  passwordActual?: string;
  nuevaPassword?: string;
}

const ALLOWED_ROLES = new Set<Usuario["rol"]>([
  "admin",
  "usuario",
  "nutricionista",
]);

const sanitizeSessionUser = (raw: unknown): Usuario | null => {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Record<string, unknown>;

  if (
    typeof candidate.email !== "string" ||
    typeof candidate.nombre !== "string" ||
    typeof candidate.rol !== "string" ||
    !ALLOWED_ROLES.has(candidate.rol as Usuario["rol"])
  ) {
    return null;
  }

  const sanitized: Usuario = {
    id: typeof candidate.id === "number" ? candidate.id : undefined,
    nombre: candidate.nombre,
    email: candidate.email.trim().toLowerCase(),
    rol: candidate.rol as Usuario["rol"],
    genero: typeof candidate.genero === "string" ? candidate.genero : "otro",
    fechaNacimiento:
      typeof candidate.fechaNacimiento === "string"
        ? candidate.fechaNacimiento
        : "",
    pesoActual:
      typeof candidate.pesoActual === "number"
        ? candidate.pesoActual
        : undefined,
    objetivoPrincipal:
      typeof candidate.objetivoPrincipal === "string"
        ? candidate.objetivoPrincipal
        : undefined,
    fotoPerfil:
      typeof candidate.fotoPerfil === "string"
        ? candidate.fotoPerfil
        : undefined,
  };

  return sanitized;
};

const readStoredSession = (): Usuario | null => {
  if (!AuthTokenStore.getToken()) {
    AuthTokenStore.clear();
    return null;
  }

  const raw = AuthTokenStore.getUserRaw();
  if (!raw) return null;

  try {
    const parsed = sanitizeSessionUser(JSON.parse(raw));
    if (parsed) return parsed;
    AuthTokenStore.clear();
    return null;
  } catch {
    AuthTokenStore.clear();
    return null;
  }
};

const persistAuthSession = (usuario: Usuario, token?: string): void => {
  if (token) {
    AuthTokenStore.setToken(token);
  }
  AuthTokenStore.setUserRaw(JSON.stringify(usuario));
};

let usuarioActual: Usuario | null = readStoredSession();

export const StorageUsuario = {
  getUsuarios: async (): Promise<Usuario[]> => {
    try {
      const response = await api.get<Usuario[]>("/api/usuarios");
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios", error);
      return [];
    }
  },

  getUsuarioSesion: (): Usuario | null => {
    if (!AuthTokenStore.getToken()) {
      usuarioActual = null;
      return null;
    }
    if (!usuarioActual) {
      usuarioActual = readStoredSession();
    }
    return usuarioActual;
  },

  getPerfilActual: async (): Promise<Usuario | null> => {
    if (!AuthTokenStore.getToken()) {
      usuarioActual = null;
      return null;
    }

    try {
      const response = await api.get<Usuario>("/api/auth/me");
      const safeUser = sanitizeSessionUser(response.data);
      if (safeUser) {
        usuarioActual = safeUser;
        persistAuthSession(safeUser);
        return safeUser;
      }
      return usuarioActual;
    } catch {
      return usuarioActual;
    }
  },

  logout: (): void => {
    usuarioActual = null;
    AuthTokenStore.clear();
  },

  registrarUsuario: async (
    nuevoUsuario: Omit<Usuario, "id">,
  ): Promise<{ success: boolean; mensaje: string; usuario?: Usuario }> => {
    try {
      const payload: Omit<Usuario, "id"> = {
        ...nuevoUsuario,
        nombre: nuevoUsuario.nombre.trim(),
        email: nuevoUsuario.email.trim().toLowerCase(),
        rol: "usuario",
      };

      const response = await api.post<AuthResponseBackend>(
        "/api/auth/register",
        payload,
      );

      if (response.status === 201 || response.status === 200) {
        const safeUser = sanitizeSessionUser(response.data);
        return {
          success: true,
          mensaje: "Usuario registrado con éxito.",
          usuario: safeUser ?? undefined,
        };
      }

      return { success: false, mensaje: "No se pudo completar el registro." };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 409) {
          return {
            success: false,
            mensaje: "No fue posible crear la cuenta con el correo indicado.",
          };
        }
        if (status === 400) {
          return {
            success: false,
            mensaje: "Revisa los datos ingresados e inténtalo nuevamente.",
          };
        }
        if (status === 429) {
          return {
            success: false,
            mensaje:
              "Demasiados intentos. Espera unos momentos antes de reintentar.",
          };
        }
      }

      console.error("Error al registrar usuario.");
      return {
        success: false,
        mensaje: "No se pudo conectar con el servidor. Inténtalo más tarde.",
      };
    }
  },

  crearUsuarioAdmin: async (
    nuevoUsuario: Omit<Usuario, "id">,
  ): Promise<{ success: boolean; mensaje: string; usuario?: Usuario }> => {
    try {
      const payload: Omit<Usuario, "id"> = {
        ...nuevoUsuario,
        nombre: nuevoUsuario.nombre.trim(),
        email: nuevoUsuario.email.trim().toLowerCase(),
      };

      const response = await api.post<Usuario>("/api/usuarios", payload);
      if (response.status === 201 || response.status === 200) {
        return {
          success: true,
          mensaje: "Usuario registrado con éxito.",
          usuario: sanitizeSessionUser(response.data) ?? response.data,
        };
      }

      return { success: false, mensaje: "No se pudo registrar el usuario." };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return {
          success: false,
          mensaje: "Datos inválidos o correo ya registrado.",
        };
      }
      console.error("Error al crear usuario desde administración.");
      return {
        success: false,
        mensaje: "Error al conectar con el servidor.",
      };
    }
  },

  login: async (
    email: string,
    pass: string,
    _rememberMe = false,
  ): Promise<Usuario | null> => {
    void _rememberMe;
    try {
      const response = await api.post<AuthResponseBackend>("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: pass,
      });

      if (response.status === 200 && response.data?.token) {
        const safeUser = sanitizeSessionUser(response.data);
        if (!safeUser) {
          return null;
        }
        usuarioActual = safeUser;
        persistAuthSession(safeUser, response.data.token);
        return usuarioActual;
      }
      return null;
    } catch {
      console.error("Error al iniciar sesión.");
      return null;
    }
  },

  actualizarPerfilPropio: async (
    payload: ActualizarPerfilPropioPayload,
  ): Promise<{ success: boolean; mensaje: string; usuario?: Usuario }> => {
    try {
      const response = await api.put<AuthResponseBackend>(
        "/api/auth/me",
        payload,
      );
      const safeUser = sanitizeSessionUser(response.data);
      if (safeUser) {
        usuarioActual = safeUser;
        persistAuthSession(safeUser, response.data.token);
        return {
          success: true,
          mensaje: "Perfil actualizado con éxito.",
          usuario: safeUser,
        };
      }
      return { success: false, mensaje: "Respuesta inválida del servidor." };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMsg = (
          error.response?.data as { message?: string; mensaje?: string } | undefined
        );
        if (error.response?.status === 400) {
          return {
            success: false,
            mensaje:
              serverMsg?.message ||
              serverMsg?.mensaje ||
              "La contraseña actual o los datos ingresados no son válidos.",
          };
        }
        if (error.response?.status === 409) {
          return {
            success: false,
            mensaje: "El correo electrónico ya está en uso por otra cuenta.",
          };
        }
      }
      console.error("Error al actualizar perfil propio.");
      return {
        success: false,
        mensaje: "Error al actualizar el perfil en el servidor.",
      };
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
        const correoDuplicado = usuarios.some(
          (u) =>
            u.id !== usuarioActualizado.id &&
            u.email.toLowerCase() === usuarioActualizado.email.toLowerCase(),
        );

        if (correoDuplicado) {
          return {
            success: false,
            mensaje: "Correo inválido o ya registrado.",
          };
        }
      }

      let idObjetivo = usuarioActualizado.id;
      if (!idObjetivo) {
        const correoBuscar = (
          emailOriginal || usuarioActualizado.email
        ).toLowerCase();
        idObjetivo = usuarios.find(
          (u) => u.email.toLowerCase() === correoBuscar,
        )?.id;
      }

      if (!idObjetivo) {
        return { success: false, mensaje: "No se encontró el ID del usuario." };
      }

      const response = await api.put<Usuario>(
        `/api/usuarios/${idObjetivo}`,
        usuarioActualizado,
      );

      if (usuarioActual && usuarioActual.id === idObjetivo) {
        const safeUser = sanitizeSessionUser(response.data);
        if (safeUser) {
          usuarioActual = safeUser;
          persistAuthSession(safeUser);
        }
      }

      return { success: true, mensaje: "Usuario actualizado con éxito." };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return {
        success: false,
        mensaje: "Error al actualizar en el servidor.",
      };
    }
  },

  deleteUsuario: async (
    id: number,
  ): Promise<{ success: boolean; mensaje: string }> => {
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
