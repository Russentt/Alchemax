import type { Cita } from "../types/index";

const ESTADOS_ACTIVOS = new Set(["Programada", "Confirmada"]);

interface DatosReservaCita {
  fecha: string;
  hora: string;
  profesional: string;
}

const fechaLocalISO = (fecha: Date): string => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

export const obtenerFechaMinimaCita = (): string => fechaLocalISO(new Date());

const obtenerMinutosHora = (hora: string): number | null => {
  const coincidencia = /^(\d{2}):(\d{2})$/.exec(hora);
  if (!coincidencia) return null;

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  if (horas > 23 || minutos > 59) return null;
  return horas * 60 + minutos;
};

const normalizarFechaCita = (fecha: string): string | null => {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(fecha);
  if (!coincidencia) return null;

  const anio = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const dia = Number(coincidencia[3]);
  const fechaUTC = new Date(0);
  fechaUTC.setUTCFullYear(anio, mes - 1, dia);
  if (
    fechaUTC.getUTCFullYear() !== anio ||
    fechaUTC.getUTCMonth() !== mes - 1 ||
    fechaUTC.getUTCDate() !== dia
  ) {
    return null;
  }
  return `${coincidencia[1]}-${coincidencia[2]}-${coincidencia[3]}`;
};

const normalizarHoraCita = (hora: string): string | null => {
  const coincidencia = /^(\d{2}:\d{2})(?::\d{2})?$/.exec(hora);
  if (!coincidencia || obtenerMinutosHora(coincidencia[1]) === null) return null;
  return coincidencia[1];
};

export const validarFechaHoraReserva = (
  fecha: string,
  hora: string,
  ahora: Date = new Date(),
): string | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return "Debes seleccionar una fecha y una hora válidas.";
  }
  const fechaNormalizada = normalizarFechaCita(fecha);
  const minutos = obtenerMinutosHora(hora);

  if (!fechaNormalizada || minutos === null) {
    return "Debes seleccionar una fecha y una hora válidas.";
  }
  if (fechaNormalizada < fechaLocalISO(ahora)) {
    return "No puedes agendar una cita en una fecha pasada.";
  }
  if (minutos < 8 * 60 || minutos > 20 * 60) {
    return "El horario de atención clínica es de 08:00 a 20:00 hrs.";
  }

  if (fechaNormalizada === fechaLocalISO(ahora)) {
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    if (minutos <= minutosActuales) {
      return "No puedes agendar una cita en una hora que ya pasó.";
    }
  }
  return null;
};

const citaActivaEnHorario = (cita: Cita, reserva: DatosReservaCita) =>
  ESTADOS_ACTIVOS.has(cita.estado) &&
  normalizarFechaCita(cita.fecha) === normalizarFechaCita(reserva.fecha) &&
  normalizarHoraCita(cita.hora) === normalizarHoraCita(reserva.hora);

export const validarConflictosReserva = (
  reserva: DatosReservaCita,
  citasDelPaciente: Cita[],
  agendaCompleta: Cita[] = [],
): string | null => {
  if (citasDelPaciente.some((cita) => citaActivaEnHorario(cita, reserva))) {
    return "Ya tienes otra cita activa en esa fecha y hora, aunque sea con otro profesional.";
  }

  const profesionalNormalizado = reserva.profesional.trim().toLocaleLowerCase("es-CL");
  const conflictoProfesional = agendaCompleta.some(
    (cita) =>
      citaActivaEnHorario(cita, reserva) &&
      cita.profesional.trim().toLocaleLowerCase("es-CL") === profesionalNormalizado,
  );
  if (conflictoProfesional) {
    return "El profesional seleccionado ya tiene una cita activa en esa fecha y hora.";
  }

  return null;
};

export const perteneceCitaAPaciente = (
  cita: Cita,
  usuarioId?: number,
  email?: string,
): boolean => {
  const emailNormalizado = email?.trim().toLocaleLowerCase("es-CL");
  const emailCita = (cita.pacienteEmail ?? cita.usuario?.email)
    ?.trim()
    .toLocaleLowerCase("es-CL");

  if (usuarioId !== undefined && cita.usuario?.id !== undefined) {
    return cita.usuario.id === usuarioId;
  }
  return Boolean(emailNormalizado) && emailCita === emailNormalizado;
};