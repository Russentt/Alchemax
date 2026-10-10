export const SEED_DATA = {
  usuarios: [
    {
      id: "u-1",
      nombre: "Administrador",
      email: "admin@duoc.cl",
      password: "admin123",
      genero: "otro",
      fechaNacimiento: "1990-01-01",
      rol: "admin" as const,
    },
    {
      id: "u-2",
      nombre: "Camila Andrea Soto",
      email: "camila.soto@email.com",
      password: "user123",
      genero: "femenino",
      fechaNacimiento: "1994-05-12",
      rol: "usuario" as const,
    },
  ],
  citas: [
    {
      id: "c1",
      fecha: "15 Nov 2026",
      hora: "10:30",
      tipo: "Consulta Presencial",
      profesional: "Nut. Andrea Valdés",
      estado: "Programada" as const,
    },
    {
      id: "c2",
      fecha: "15 Oct 2026",
      hora: "11:00",
      tipo: "Control Telemedicina",
      profesional: "Nut. Andrea Valdés",
      estado: "Completada" as const,
    },
  ],
  plan: {
    caloriasDiarias: 1850,
    objetivo: "Recomposición Corporal",
    macros: [
      {
        nombre: "Proteínas",
        gramos: 140,
        porcentaje: 30,
        color: "info" as const,
      },
      {
        nombre: "Carbohidratos",
        gramos: 185,
        porcentaje: 40,
        color: "success" as const,
      },
      {
        nombre: "Grasas",
        gramos: 61,
        porcentaje: 30,
        color: "warning" as const,
      },
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
      estado: "Revisado" as const,
    },
  ],
  compras: [
    {
      id: "comp-1",
      servicioId: "srv-01",
      nombre: "Evaluación Biométrica Presencial",
      fechaCompra: "10 Oct 2026",
      monto: 35000,
      estado: "Activo" as const,
    },
  ],
};
