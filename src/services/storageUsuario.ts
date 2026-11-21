import axios from "axios";
import type { Usuario } from "../types/index";
import { api } from "../api/axiosConfig";

const SESION_KEY = "db_sesion";
const LEGACY_SESSION_KEY = "session_user";
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
    ...(candidate as unknown as Usuario),
    email: candidate.email.trim().toLowerCase(),
  };

  // Never persist plaintext passwords in web storage
  delete sanitized.password;
  return sanitized;
};

const readStoredSession = (): Usuario | null => {
  const storages: Storage[] = [sessionStorage, localStorage];

  for (const storage of storages) {
    try {
      const raw = storage.getItem(SESION_KEY);
      if (!raw) continue;
      const parsed = sanitizeSessionUser(JSON.parse(raw));
      if (parsed) return parsed;
      storage.removeItem(SESION_KEY);
    } catch {
      try {
        storage.removeItem(SESION_KEY);
      } catch {
        // Ignore storage errors
      }
    }
  }

  return null;
};

const persistSession = (usuario: Usuario, rememberMe: boolean): void => {
  const serialized = JSON.stringify(usuario);
  try {
    sessionStorage.removeItem(SESION_KEY);
    localStorage.removeItem(SESION_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_KEY);

    if (rememberMe) {
      localStorage.setItem(SESION_KEY, serialized);
    } else {
      sessionStorage.setItem(SESION_KEY, serialized);
    }
  } catch {
    // Keep session in memory if web storage is unavailable
  }
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
    if (!usuarioActual) {
      usuarioActual = readStoredSession();
    }
    return usuarioActual;
  },

  logout: (): void => {
    usuarioActual = null;
    try {
      localStorage.removeItem(SESION_KEY);
      sessionStorage.removeItem(SESION_KEY);
      sessionStorage.removeItem(LEGACY_SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  registrarUsuario: async (
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
            mensaje: "Demasiados intentos. Espera unos momentos antes de reintentar.",
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

  login: async (
    email: string,
    pass: string,
    rememberMe = false,
  ): Promise<Usuario | null> => {
    try {
      const response = await api.post<Usuario>("/api/usuarios/login", {
        email: email.trim().toLowerCase(),
        password: pass,
      });

      if (response.status === 200 && response.data) {
        const safeUser = sanitizeSessionUser(response.data);
        if (!safeUser) {
          return null;
        }
        usuarioActual = safeUser;
        persistSession(safeUser, rememberMe);
        return usuarioActual;
      }
      return null;
    } catch {
      console.error("Error al iniciar sesión.");
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
        const correoBuscar = (
          emailOriginal || usuarioActualizado.email
        ).toLowerCase();
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

      const response = await api.put<Usuario>(
        `/api/usuarios/${idObjetivo}`,
        usuarioActualizado,
      );

      if (usuarioActual && usuarioActual.id === idObjetivo) {
        const safeUser = sanitizeSessionUser(response.data);
        if (safeUser) {
          usuarioActual = safeUser;
          const isPersistedLocally = Boolean(localStorage.getItem(SESION_KEY));
          persistSession(safeUser, isPersistedLocally);
        }
      }

      return { success: true, mensaje: "Usuario actualizado con éxito." };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return { success: false, mensaje: "Error al actualizar en el servidor." };
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
