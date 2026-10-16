import type { Cita } from "../types/index";

export const CitasService = {
  getCitas: (): Cita[] => JSON.parse(localStorage.getItem("db_citas") || "[]"),

  addCita: (cita: Cita): void => {
    const citas = CitasService.getCitas();
    citas.unshift(cita);
    localStorage.setItem("db_citas", JSON.stringify(citas));
  },

  cancelarCita: (citaId: string): void => {
    const citas = CitasService.getCitas();
    const updatedCitas = citas.map((c) =>
      c.id === citaId ? { ...c, estado: "Cancelada" as const } : c,
    );
    localStorage.setItem("db_citas", JSON.stringify(updatedCitas));
  },
};
