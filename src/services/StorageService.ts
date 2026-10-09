export interface Usuario {
  nombre: string;
  email: string;
  fechaNacimiento: string; // Formato YYYY-MM-DD
  direccion: string;
}

export interface Cita {
  id: string;
  fecha: string;
  hora: string;
  tipo: string;
  profesional: string;
  estado: "Programada" | "Completada" | "Cancelada";
}

export interface Macro {
  nombre: string;
  gramos: number;
  porcentaje: number;
  color: "success" | "info" | "warning" | "danger";
}

export interface Comida {
  id: string;
  tipo: string;
  horario: string;
  descripcion: string;
}

export interface PlanNutricional {
  caloriasDiarias: number;
  objetivo: string;
  macros: Macro[];
  comidas: Comida[];
}

export interface Metrica {
  id: string;
  fecha: string;
  peso: number;
  grasa: number;
  musculo: number;
}

export interface Examen {
  id: string;
  nombre: string;
  fechaSubida: string;
  estado: "Revisado" | "Pendiente";
}

const SEED_DATA = {
  usuario: {
    nombre: "Camila Andrea Soto",
    email: "camila.soto@email.com",
    fechaNacimiento: "1994-05-12",
    direccion: "Av. Alemania 1234, Depto 5, Temuco",
  },
  citas: [
    {
      id: "c1",
      fecha: "15 Nov 2026",
      hora: "10:30",
      tipo: "Consulta Presencial",
      profesional: "Nut. Andrea Valdés",
      estado: "Programada",
    },
    {
      id: "c2",
      fecha: "15 Oct 2026",
      hora: "11:00",
      tipo: "Control Telemedicina",
      profesional: "Nut. Andrea Valdés",
      estado: "Completada",
    },
  ],
  plan: {
    caloriasDiarias: 1850,
    objetivo: "Recomposición Corporal",
    macros: [
      { nombre: "Proteínas", gramos: 140, porcentaje: 30, color: "info" },
      {
        nombre: "Carbohidratos",
        gramos: 185,
        porcentaje: 40,
        color: "success",
      },
      { nombre: "Grasas", gramos: 61, porcentaje: 30, color: "warning" },
    ],
    comidas: [
      {
        id: "m1",
        tipo: "Desayuno",
        horario: "08:00 - 09:00",
        descripcion:
          "2 huevos revueltos, 2 rebanadas de pan integral, 1/2 palta.",
      },
      {
        id: "m2",
        tipo: "Almuerzo",
        horario: "13:00 - 14:00",
        descripcion:
          "150g pechuga de pollo a la plancha, 1 taza de quinoa, ensalada verde.",
      },
    ],
  },
  metricas: [
    { id: "m1", fecha: "15 Oct 2026", peso: 68.5, grasa: 26.4, musculo: 27.1 },
    { id: "m2", fecha: "15 Sep 2026", peso: 69.8, grasa: 27.5, musculo: 26.8 },
  ],
  examenes: [
    {
      id: "e1",
      nombre: "Perfil Bioquímico y Lipídico",
      fechaSubida: "10 Oct 2026",
      estado: "Revisado",
    },
  ],
};

export const StorageService = {
  initDB: (): void => {
    if (!localStorage.getItem("db_usuario")) {
      localStorage.setItem("db_usuario", JSON.stringify(SEED_DATA.usuario));
      localStorage.setItem("db_citas", JSON.stringify(SEED_DATA.citas));
      localStorage.setItem("db_plan", JSON.stringify(SEED_DATA.plan));
      localStorage.setItem("db_metricas", JSON.stringify(SEED_DATA.metricas));
      localStorage.setItem("db_examenes", JSON.stringify(SEED_DATA.examenes));
    }
  },

  // User Profile CRUD
  getUsuario: (): Usuario =>
    JSON.parse(localStorage.getItem("db_usuario") || "{}"),

  updateUsuario: (usuarioActualizado: Usuario): void => {
    localStorage.setItem("db_usuario", JSON.stringify(usuarioActualizado));
  },

  // Other Collections
  getCitas: (): Cita[] => JSON.parse(localStorage.getItem("db_citas") || "[]"),
  getPlan: (): PlanNutricional =>
    JSON.parse(localStorage.getItem("db_plan") || "{}"),
  getMetricas: (): Metrica[] =>
    JSON.parse(localStorage.getItem("db_metricas") || "[]"),
  getExamenes: (): Examen[] =>
    JSON.parse(localStorage.getItem("db_examenes") || "[]"),

  addExamen: (examen: Examen): void => {
    const examenes = StorageService.getExamenes();
    examenes.push(examen);
    localStorage.setItem("db_examenes", JSON.stringify(examenes));
  },

  cancelarCita: (citaId: string): void => {
    const citas = StorageService.getCitas();
    const updatedCitas = citas.map((c) =>
      c.id === citaId ? { ...c, estado: "Cancelada" as const } : c,
    );
    localStorage.setItem("db_citas", JSON.stringify(updatedCitas));
  },

  addCita: (cita: Cita): void => {
    const citas = StorageService.getCitas();
    citas.unshift(cita); // Adds the newest appointment to the top of the list
    localStorage.setItem("db_citas", JSON.stringify(citas));
  },
};
