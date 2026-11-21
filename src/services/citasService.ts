import { api } from "../api/axiosConfig";
import type { Cita, EstadoCita } from "../types/index";

const ESTADOS_VALIDOS = new Set<EstadoCita>([
  "Programada",
  "Confirmada",
  "Completada",
  "Cancelada",
]);

interface CitaBackendResponse {
  id: number;
  fecha?: string;
  hora?: string;
  tipo?: string;
  profesional?: string;
  estado?: string;
  usuario?: {
    id: number;
    nombre?: string;
    email?: string;
  } | null;
  pacienteNombre?: string;
  pacienteEmail?: string;
}

const mapearDesdeBackend = (raw: CitaBackendResponse): Cita => {
  const estadoNormalizado: EstadoCita =
    raw.estado && ESTADOS_VALIDOS.has(raw.estado as EstadoCita)
      ? (raw.estado as EstadoCita)
      : "Programada";

  return {
    id: Number(raw.id),
    fecha: raw.fecha ?? "",
    hora: raw.hora ?? "",
    tipo: raw.tipo ?? "Consulta Presencial",
    profesional: raw.profesional ?? "Staff NutriVida",
    estado: estadoNormalizado,
    usuario: raw.usuario
      ? {
          id: Number(raw.usuario.id),
          nombre: raw.usuario.nombre,
          email: raw.usuario.email,
        }
      : null,
    pacienteNombre: raw.pacienteNombre ?? raw.usuario?.nombre,
    pacienteEmail: raw.pacienteEmail ?? raw.usuario?.email,
  };
};

export interface NuevaCitaPayload {
  fecha: string;
  hora: string;
  tipo: string;
  profesional: string;
  estado?: EstadoCita;
  usuarioId?: number;
  pacienteNombre?: string;
  pacienteEmail?: string;
}

export const CitasService = {
  getCitas: async (): Promise<Cita[]> => {
    try {
      const response = await api.get<CitaBackendResponse[]>("/api/citas");
      return response.data.map(mapearDesdeBackend);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      return [];
    }
  },

  getCitasPorUsuario: async (usuarioId: number): Promise<Cita[]> => {
    try {
      const response = await api.get<CitaBackendResponse[]>(
        `/api/citas/usuario/${usuarioId}`,
      );
      return response.data.map(mapearDesdeBackend);
    } catch (error) {
      console.error("Error al obtener citas del usuario:", error);
      return [];
    }
  },

  addCita: async (
    cita: NuevaCitaPayload,
  ): Promise<{ success: boolean; mensaje: string; cita?: Cita }> => {
    try {
      const payload = {
        fecha: cita.fecha,
        hora: cita.hora,
        tipo: cita.tipo,
        profesional: cita.profesional,
        estado: cita.estado ?? "Programada",
        usuario: cita.usuarioId ? { id: Number(cita.usuarioId) } : null,
        pacienteNombre: cita.pacienteNombre,
        pacienteEmail: cita.pacienteEmail,
      };

      const response = await api.post<CitaBackendResponse>(
        "/api/citas",
        payload,
      );
      if (response.status === 200 || response.status === 201) {
        return {
          success: true,
          mensaje: "Cita registrada con éxito.",
          cita: mapearDesdeBackend(response.data),
        };
      }

      return { success: false, mensaje: "No se pudo registrar la cita." };
    } catch (error) {
      console.error("Error al crear cita:", error);
      return {
        success: false,
        mensaje: "Error al conectar con el servidor.",
      };
    }
  },

  updateCita: async (
    id: number,
    cita: NuevaCitaPayload,
  ): Promise<{ success: boolean; mensaje: string; cita?: Cita }> => {
    try {
      const payload = {
        fecha: cita.fecha,
        hora: cita.hora,
        tipo: cita.tipo,
        profesional: cita.profesional,
        estado: cita.estado ?? "Programada",
        usuario: cita.usuarioId ? { id: Number(cita.usuarioId) } : null,
        pacienteNombre: cita.pacienteNombre,
        pacienteEmail: cita.pacienteEmail,
      };

      const response = await api.put<CitaBackendResponse>(
        `/api/citas/${id}`,
        payload,
      );
      return {
        success: true,
        mensaje: "Cita actualizada con éxito.",
        cita: mapearDesdeBackend(response.data),
      };
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      return {
        success: false,
        mensaje: "No se pudo actualizar la cita.",
      };
    }
  },

  cambiarEstado: async (
    id: number,
    estado: EstadoCita,
  ): Promise<{ success: boolean; mensaje: string; cita?: Cita }> => {
    try {
      const response = await api.put<CitaBackendResponse>(
        `/api/citas/${id}/estado`,
        null,
        { params: { estado } },
      );
      return {
        success: true,
        mensaje: `Cita marcada como ${estado}.`,
        cita: mapearDesdeBackend(response.data),
      };
    } catch (error) {
      console.error("Error al cambiar estado de la cita:", error);
      return {
        success: false,
        mensaje: "No se pudo actualizar el estado de la cita.",
      };
    }
  },

  cancelarCita: async (
    citaId: number,
  ): Promise<{ success: boolean; mensaje: string; cita?: Cita }> => {
    return CitasService.cambiarEstado(citaId, "Cancelada");
  },

  deleteCita: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/api/citas/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      return false;
    }
  },
};
