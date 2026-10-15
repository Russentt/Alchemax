export const SEED_DATA = {
  usuarios: [
    {
      id: "u-1",
      nombre: "Administrador",
      email: "admin@gmail.com",
      password: "admin123",
      genero: "otro",
      fechaNacimiento: "1990-01-01",
      rol: "admin" as const,
    },
    {
      id: "u-2",
      nombre: "Camila Andrea Soto",
      email: "camila.soto@gmail.com",
      password: "user123",
      genero: "femenino",
      fechaNacimiento: "1994-05-12",
      rol: "usuario" as const,
    },
    {
      id: "u-3",
      nombre: "Michael Jackson",
      email: "michael@gmail.com",
      password: "nutri123",
      genero: "masculino",
      fechaNacimiento: "1958-08-29",
      rol: "nutricionista" as const,
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
  categorias: [
    {
      id: "CAT-01",
      nombre: "Evaluación Biométrica",
      descripcion: "Medición y pesajes presenciales",
      serviciosAsociados: 1,
    },
    {
      id: "CAT-02",
      nombre: "Planes Especializados",
      descripcion: "Planes personalizados y deportivos",
      serviciosAsociados: 1,
    },
    {
      id: "CAT-03",
      nombre: "Telemedicina y Controles",
      descripcion: "Consultas y seguimiento virtual",
      serviciosAsociados: 1,
    },
    {
      id: "CAT-04",
      nombre: "Nutrición Clínica",
      descripcion: "Tratamiento de patologías crónicas y metabólicas",
      serviciosAsociados: 1,
    },
  ],
  // Servicios base vinculados a sus categorías
  servicios: [
    {
      id: "PROD-101",
      nombre: "Evaluación Biométrica Inicial",
      descripcion:
        "Análisis InBody, revisión de exámenes y diagnóstico metabólico presencial.",
      precio: 35000,
      tipo: "evaluacion" as const,
      icono: "⚖️",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-102",
      nombre: "Plan Nutricional Deportivo",
      descripcion:
        "Pauta estructurada para recomposición corporal y rendimiento físico. Incluye 2 controles.",
      precio: 120000,
      tipo: "plan" as const,
      icono: "🏋️",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 2400,
        objetivo: "Aumento de masa muscular magra",
        macros: [
          { nombre: "Proteínas", gramos: 180, porcentaje: 30, color: "success" as const },
          { nombre: "Carbohidratos", gramos: 280, porcentaje: 50, color: "info" as const },
          { nombre: "Grasas", gramos: 55, porcentaje: 20, color: "warning" as const },
        ],
        comidas: [
          {
            id: "com-1",
            tipo: "Desayuno",
            horario: "08:00",
            descripcion: "Avena con claras de huevo, plátano y nueces",
          },
        ],
      },
    },
    {
      id: "PROD-103",
      nombre: "Control Telemedicina",
      descripcion:
        "Ajuste de pauta y seguimiento de progreso mediante videollamada de 30 minutos.",
      precio: 25000,
      tipo: "control" as const,
      icono: "💻",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-104",
      nombre: "Plan Nutricional Clínico",
      descripcion:
        "Diseñado para patologías específicas (Resistencia a la insulina, hipertensión, celiaquía).",
      precio: 85000,
      tipo: "plan" as const,
      icono: "🩺",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
  ],
};

