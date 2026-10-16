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
      registroId: "reg-comp-1",
      usuarioId: "camila.soto@gmail.com",
      data: {
        id: "comp-1",
        servicioId: "PROD-101",
        nombre: "Evaluación Biométrica Presencial",
        fechaCompra: "10 Oct 2026",
        monto: 35000,
        estado: "Activo" as const,
      },
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
          {
            nombre: "Proteínas",
            gramos: 180,
            porcentaje: 30,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 280,
            porcentaje: 50,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 55,
            porcentaje: 20,
            color: "warning" as const,
          },
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
    {
      id: "PROD-105",
      nombre: "Antropometría Avanzada ISAK",
      descripcion:
        "Medición exhaustiva de pliegues cutáneos, perímetros y diámetros óseos bajo estándar internacional. Ideal para atletas de alto rendimiento.",
      precio: 45000,
      tipo: "evaluacion" as const,
      icono: "📐",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-106",
      nombre: "Test de Calorimetría Indirecta",
      descripcion:
        "Examen de respiración en reposo para determinar con exactitud matemática el gasto energético basal (metabolismo) del paciente.",
      precio: 60000,
      tipo: "evaluacion" as const,
      icono: "🔥",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-107",
      nombre: "Control Biométrico Express",
      descripcion:
        "Pesaje rápido de 15 minutos en máquina InBody para monitorizar la composición corporal mensual, sin consulta nutricional completa.",
      precio: 15000,
      tipo: "evaluacion" as const,
      icono: "⏱️",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-108",
      nombre: "Programa Transición Plant-Based",
      descripcion:
        "Pauta y acompañamiento para adoptar una alimentación vegana o vegetariana asegurando un correcto aporte de macro y micronutrientes (B12, hierro, calcio).",
      precio: 95000,
      tipo: "plan" as const,
      icono: "🌱",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 2100,
        objetivo: "Transición segura a dieta basada en plantas",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 110,
            porcentaje: 20,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 290,
            porcentaje: 55,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 58,
            porcentaje: 25,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-vegan-1",
            tipo: "Almuerzo",
            horario: "13:30",
            descripcion:
              "Bowl de tofu marinado, lentejas rojas, espinaca fresca y semillas de cáñamo.",
          },
        ],
      },
    },
    {
      id: "PROD-109",
      nombre: "Plan Nutrición Materno-Fetal",
      descripcion:
        "Acompañamiento nutricional diseñado específicamente para mujeres en etapa de gestación y lactancia, enfocado en el desarrollo óptimo del bebé.",
      precio: 90000,
      tipo: "plan" as const,
      icono: "🤰",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
    },
    {
      id: "PROD-110",
      nombre: "Asesoría Express: Resolución de Dudas",
      descripcion:
        "Videollamada corta de 15 minutos enfocada exclusivamente en resolver dudas puntuales sobre etiquetado, marcas de supermercado o suplementación.",
      precio: 12000,
      tipo: "control" as const,
      icono: "📱",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-111",
      nombre: "Sesión de Psiconutrición Online",
      descripcion:
        "Consulta enfocada en el comportamiento alimentario, manejo de la ansiedad, alimentación emocional y mejora de la relación con la comida.",
      precio: 35000,
      tipo: "control" as const,
      icono: "🧠",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-112",
      nombre: "Taller Grupal: Lectura de Etiquetado",
      descripcion:
        "Sesión virtual grupal de 1 hora para aprender a interpretar sellos, ingredientes y tablas nutricionales en productos del supermercado.",
      precio: 10000,
      tipo: "control" as const,
      icono: "🏷️",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-113",
      nombre: "Plan Digestivo Integral (FODMAP)",
      descripcion:
        "Protocolo nutricional clínico de eliminación y reintroducción para el tratamiento del Síndrome de Intestino Irritable (SII) y SIBO.",
      precio: 88000,
      tipo: "plan" as const,
      icono: "🦠",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 1900,
        objetivo: "Reducción de sintomatología gastrointestinal",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 120,
            porcentaje: 25,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 215,
            porcentaje: 45,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 63,
            porcentaje: 30,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-sii-1",
            tipo: "Desayuno",
            horario: "08:30",
            descripcion:
              "Pan de masa madre de espelta, huevos revueltos, sin lácteos y sin ajo/cebolla.",
          },
        ],
      },
    },
    {
      id: "PROD-114",
      nombre: "Programa de Inmunonutrición Oncológica",
      descripcion:
        "Intervención clínica especializada para mitigar pérdida de masa muscular y manejar efectos secundarios durante quimioterapia o radioterapia.",
      precio: 110000,
      tipo: "plan" as const,
      icono: "🎗️",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-115",
      nombre: "Plan Soporte Post-Cirugía Bariátrica",
      descripcion:
        "Fases de progresión alimentaria (líquida, papilla, picada, normal) para pacientes sometidos a manga gástrica o bypass.",
      precio: 105000,
      tipo: "plan" as const,
      icono: "🏥",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-116",
      nombre: "Análisis Clínico de Microbiota Intestinal",
      descripcion:
        "Interpretación de test de secuenciación genética de heces para evaluar disbiosis, diversidad bacteriana y su impacto en el metabolismo del paciente.",
      precio: 55000,
      tipo: "evaluacion" as const,
      icono: "🧫",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-117",
      nombre: "Programa Integral de Ayuno Intermitente",
      descripcion:
        "Diseño de protocolos de alimentación restringida en el tiempo (16:8, 14:10) adaptados a tu ritmo circadiano para mejorar la flexibilidad metabólica.",
      precio: 75000,
      tipo: "plan" as const,
      icono: "⏳",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 2000,
        objetivo: "Flexibilidad metabólica y sensibilidad a la insulina",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 150,
            porcentaje: 30,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 175,
            porcentaje: 35,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 77,
            porcentaje: 35,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-ayuno-1",
            tipo: "Ruptura de Ayuno (12:00)",
            horario: "12:00",
            descripcion:
              "Caldo de huesos, seguido de 2 huevos cocidos y medio aguacate para evitar picos de insulina.",
          },
        ],
      },
    },
    {
      id: "PROD-118",
      nombre: "Análisis de Monitoreo Continuo de Glucosa (CGM)",
      descripcion:
        "Sesión de telemedicina para interpretar las curvas de glucosa de tu sensor continuo (FreeStyle Libre, etc.), identificando picos glucémicos y ajustando la dieta.",
      precio: 40000,
      tipo: "control" as const,
      icono: "📉",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-119",
      nombre: "Protocolo Nutricional para SOP y Endometriosis",
      descripcion:
        "Intervención dietética antiinflamatoria enfocada en la regulación hormonal, reducción de andrógenos y manejo del dolor pélvico crónico.",
      precio: 85000,
      tipo: "plan" as const,
      icono: "🌸",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-120",
      nombre: "Plan Nutricional Renal Pre-Diálisis",
      descripcion:
        "Pauta estricta con control milimétrico de proteínas, fósforo, potasio y sodio para pacientes con Enfermedad Renal Crónica (ERC) estadios 1 al 4.",
      precio: 95000,
      tipo: "plan" as const,
      icono: "🫘",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 1800,
        objetivo: "Ralentización de la progresión de la ERC",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 50,
            porcentaje: 11,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 250,
            porcentaje: 55,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 68,
            porcentaje: 34,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-renal-1",
            tipo: "Almuerzo",
            horario: "13:30",
            descripcion:
              "100g de pechuga de pollo, arroz blanco y verduras bajas en potasio (previamente doblemente hervidas).",
          },
        ],
      },
    },
    {
      id: "PROD-121",
      nombre: "Interpretación de Densitometría Ósea (DEXA)",
      descripcion:
        "Análisis clínico de los resultados del escáner DEXA para evaluar densidad mineral ósea y composición corporal exacta, previniendo osteoporosis.",
      precio: 30000,
      tipo: "evaluacion" as const,
      icono: "🦴",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-122",
      nombre: "Plan Nutricional Cardiovascular",
      descripcion:
        "Estrategia dietética enfocada en revertir dislipidemias (colesterol LDL alto, hipertrigliceridemia) y control de la presión arterial (Dieta DASH).",
      precio: 85000,
      tipo: "plan" as const,
      icono: "❤️",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 1900,
        objetivo: "Reducción de riesgo cardiovascular y perfil lipídico",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 95,
            porcentaje: 20,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 235,
            porcentaje: 50,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 63,
            porcentaje: 30,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-cardio-1",
            tipo: "Cena",
            horario: "20:00",
            descripcion:
              "Salmón al horno rico en Omega-3, espárragos al vapor y una copa de vino tinto (opcional, según evaluación clínica).",
          },
        ],
      },
    },
    {
      id: "PROD-123",
      nombre: "Programa de Nutrición Pediátrica",
      descripcion:
        "Abordaje integral para el manejo de la obesidad infantil, neofobia alimentaria (niños selectivos) y curvas de crecimiento en percentiles.",
      precio: 90000,
      tipo: "plan" as const,
      icono: "🧸",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-124",
      nombre: "Nutrición para Deportes de Resistencia",
      descripcion:
        "Periodización nutricional para maratonistas, ciclistas y triatletas. Incluye estrategias de recarga de carbohidratos (Carb-loading) y pauta de hidratación.",
      precio: 115000,
      tipo: "plan" as const,
      icono: "🏃",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 3200,
        objetivo: "Optimización de reservas de glucógeno pre-carrera",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 160,
            porcentaje: 20,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 520,
            porcentaje: 65,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 53,
            porcentaje: 15,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-endurance-1",
            tipo: "Intra-entreno",
            horario: "Durante",
            descripcion:
              "Gel de carbohidratos (30g) cada 45 minutos + bebida isotónica con 500mg de sodio por litro.",
          },
        ],
      },
    },
    {
      id: "PROD-125",
      nombre: "Auditoría Virtual de Despensa",
      descripcion:
        "Sesión por videollamada donde el nutricionista revisa en tiempo real los alimentos de tu cocina, recomendando alternativas más saludables.",
      precio: 25000,
      tipo: "control" as const,
      icono: "🥫",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-126",
      nombre: "Protocolo de Dieta Cetogénica Clínica",
      descripcion:
        "Diseño y monitoreo de dieta Keto bajo estricta supervisión para epilepsia refractaria o pérdida de grasa acelerada con preservación muscular.",
      precio: 95000,
      tipo: "plan" as const,
      icono: "🥑",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 2100,
        objetivo: "Estado de cetosis nutricional estable",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 130,
            porcentaje: 25,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 25,
            porcentaje: 5,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 163,
            porcentaje: 70,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-keto-1",
            tipo: "Almuerzo",
            horario: "14:00",
            descripcion:
              "Costillar de cerdo al horno, ensalada de hojas verdes oscuras con abundante aceite de oliva y aceitunas.",
          },
        ],
      },
    },
    {
      id: "PROD-127",
      nombre: "Plan Nutricional Tiroideo (Hashimoto/Hipotiroidismo)",
      descripcion:
        "Intervención dietética para reducir anticuerpos antitiroideos y mejorar la conversión de T4 a T3, enfatizando selenio, zinc y yodo controlado.",
      precio: 88000,
      tipo: "plan" as const,
      icono: "🦋",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-128",
      nombre: "Lectura de Test de Intolerancias (IgG)",
      descripcion:
        "Consulta para interpretar pruebas de sensibilidad alimentaria mediada por anticuerpos IgG y guiar la posterior dieta de eliminación.",
      precio: 35000,
      tipo: "evaluacion" as const,
      icono: "🩸",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-129",
      nombre: "Nutrición Geriátrica y Prevención de Sarcopenia",
      descripcion:
        "Planes adaptados a adultos mayores, considerando dificultades de masticación/deglución y maximizando la síntesis proteica muscular.",
      precio: 85000,
      tipo: "plan" as const,
      icono: "🧓",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-130",
      nombre: "Coaching de Creación de Hábitos",
      descripcion:
        "Consulta terapéutica para trabajar la adherencia al plan, técnicas de 'habit stacking' y planificación semanal de comidas (Batch Cooking).",
      precio: 30000,
      tipo: "control" as const,
      icono: "📅",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-131",
      nombre: "Test de Nutrigenética Integrativa",
      descripcion:
        "Análisis de ADN mediante muestra de saliva para identificar predisposiciones genéticas hacia el metabolismo de carbohidratos, grasas y vitaminas específicas.",
      precio: 150000,
      tipo: "evaluacion" as const,
      icono: "🧬",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-132",
      nombre: "Programa de Transición Menopáusica",
      descripcion:
        "Pauta enfocada en el manejo de sofocos, prevención de la pérdida de masa ósea y control del aumento de tejido adiposo visceral durante el climaterio.",
      precio: 92000,
      tipo: "plan" as const,
      icono: "⚖️",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 1850,
        objetivo: "Regulación hormonal y preservación de masa ósea",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 130,
            porcentaje: 28,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 185,
            porcentaje: 40,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 66,
            porcentaje: 32,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-meno-1",
            tipo: "Desayuno",
            horario: "08:30",
            descripcion:
              "Yogur griego con semillas de chía, nueces, frutos rojos y suplementación pautada de Vitamina D3+K2.",
          },
        ],
      },
    },
    {
      id: "PROD-133",
      nombre: "Soporte Nutricional en TCA",
      descripcion:
        "Acompañamiento especializado y compasivo para la recuperación de Trastornos de la Conducta Alimentaria (anorexia, bulimia, atracones) en trabajo conjunto con psicología.",
      precio: 105000,
      tipo: "plan" as const,
      icono: "🤝",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-134",
      nombre: "Asesoría Farmacológica y de Suplementación",
      descripcion:
        "Consulta enfocada exclusivamente en revisar tus suplementos actuales, interacciones medicamentosas y pautar ayudas ergogénicas con evidencia (creatina, beta-alanina, etc.).",
      precio: 35000,
      tipo: "control" as const,
      icono: "💊",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-135",
      nombre: "Plicometría Deportiva Básica",
      descripcion:
        "Medición rápida de los 6 pliegues cutáneos principales usando caliper clínico para determinar de forma práctica el porcentaje de grasa corporal.",
      precio: 20000,
      tipo: "evaluacion" as const,
      icono: "📏",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-136",
      nombre: "Protocolo Antiinflamatorio Autoinmune (AIP)",
      descripcion:
        "Fase de eliminación estricta para reducir brotes en enfermedades autoinmunes como Artritis Reumatoide, Lupus o Psoriasis, sanando la permeabilidad intestinal.",
      precio: 98000,
      tipo: "plan" as const,
      icono: "🛡️",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 1950,
        objetivo: "Reducción sistémica de citoquinas inflamatorias",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 125,
            porcentaje: 25,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 220,
            porcentaje: 45,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 65,
            porcentaje: 30,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-aip-1",
            tipo: "Almuerzo",
            horario: "13:45",
            descripcion:
              "Pescado blanco al vapor con jengibre, puré de camote (sin lácteos) y espárragos. (Libre de solanáceas, huevos, semillas y frutos secos).",
          },
        ],
      },
    },
    {
      id: "PROD-137",
      nombre: "Análisis Clínico de Tasa de Sudoración (Sweat Test)",
      descripcion:
        "Protocolo de campo para medir la pérdida neta de líquidos y electrolitos por hora de ejercicio, generando tu pauta de reposición hídrica personalizada.",
      precio: 45000,
      tipo: "evaluacion" as const,
      icono: "💧",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-138",
      nombre: "Plan Nutricional de Apoyo a la Fertilidad",
      descripcion:
        "Estrategia dietética para parejas en etapa preconcepcional o en tratamientos de reproducción asistida (FIV), optimizando la calidad ovocitaria y espermática.",
      precio: 89000,
      tipo: "plan" as const,
      icono: "👶",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
    },
    {
      id: "PROD-139",
      nombre: "Control Antropométrico Guiado a Distancia",
      descripcion:
        "Sesión por videollamada donde el profesional te enseña a tomarte medidas de circunferencia con cinta métrica en casa para un seguimiento objetivo.",
      precio: 18000,
      tipo: "control" as const,
      icono: "💻",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-140",
      nombre: "Dieta Clínica Baja en Histamina",
      descripcion:
        "Tratamiento de 4 a 6 semanas para pacientes con Déficit de DAO (Diamino Oxidasa) o síndrome de activación mastocitaria, previniendo migrañas y urticarias.",
      precio: 90000,
      tipo: "plan" as const,
      icono: "🧠",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 2000,
        objetivo: "Disminución de carga histamínica exógena",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 120,
            porcentaje: 24,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 240,
            porcentaje: 48,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 62,
            porcentaje: 28,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-hist-1",
            tipo: "Cena",
            horario: "20:00",
            descripcion:
              "Pollo fresco (congelado inmediatamente tras la compra y cocinado directo), quinoa y calabacín. Evitar estrictamente fermentados, tomate y palta.",
          },
        ],
      },
    },
    {
      id: "PROD-141",
      nombre: "Evaluación de Dinamometría Clínica",
      descripcion:
        "Medición de la fuerza de prensión manual con dinamómetro digital. Biomarcador clave para evaluar el estado nutricional global, vitalidad y riesgo de sarcopenia.",
      precio: 15000,
      tipo: "evaluacion" as const,
      icono: "✊",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-142",
      nombre: "Programa de Culturismo Natural (Peak Week)",
      descripcion:
        "Planificación avanzada para atletas de fisicoculturismo. Incluye manipulación de agua, sodio y carga/descarga de carbohidratos para puesta a punto en tarima.",
      precio: 130000,
      tipo: "plan" as const,
      icono: "🏆",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 2800,
        objetivo: "Supercompensación de glucógeno y secado muscular",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 210,
            porcentaje: 30,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 420,
            porcentaje: 60,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 31,
            porcentaje: 10,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-peak-1",
            tipo: "Pre-entreno",
            horario: "16:00",
            descripcion:
              "Crema de arroz (100g en seco), aislado de proteína de suero y una pizca de sal rosada para el bombeo muscular.",
          },
        ],
      },
    },
    {
      id: "PROD-143",
      nombre: "Intervención en Crononutrición y Sueño",
      descripcion:
        "Ajuste de los horarios de ingesta y macronutrientes para sincronizar los ritmos circadianos, optimizando la secreción de melatonina y combatiendo el insomnio.",
      precio: 85000,
      tipo: "plan" as const,
      icono: "🌙",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-144",
      nombre: "Educación en Enfermedad Celíaca (Recién Diagnosticados)",
      descripcion:
        "Programa de acompañamiento intensivo para asegurar una dieta 100% libre de gluten, evitando la contaminación cruzada y revirtiendo la atrofia vellositaria.",
      precio: 90000,
      tipo: "plan" as const,
      icono: "🌾",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 2000,
        objetivo: "Sanación de la mucosa intestinal (Libre de Gluten)",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 125,
            porcentaje: 25,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 250,
            porcentaje: 50,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 55,
            porcentaje: 25,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-celiac-1",
            tipo: "Desayuno",
            horario: "08:00",
            descripcion:
              "Arepas de maíz certificadas sin trazas, pechuga de pavo y palta. Asegurar utensilios exclusivos.",
          },
        ],
      },
    },
    {
      id: "PROD-145",
      nombre: "Nutrición Dermatológica Integral",
      descripcion:
        "Abordaje dietético específico para complementar tratamientos dermatológicos de acné quístico, rosácea o psoriasis, controlando el índice glucémico y lácteos.",
      precio: 88000,
      tipo: "plan" as const,
      icono: "✨",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
    },
    {
      id: "PROD-146",
      nombre: "Manejo de Nutrición Enteral Domiciliaria",
      descripcion:
        "Cálculo y monitoreo de fórmulas poliméricas para pacientes alimentados por sonda nasogástrica o gastrostomía (PEG) en su domicilio.",
      precio: 120000,
      tipo: "plan" as const,
      icono: "💉",
      categoriaId: "CAT-04",
      categoriaNombre: "Nutrición Clínica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-147",
      nombre: "Taller Práctico: Batch Cooking y Meal Prep",
      descripcion:
        "Clase online de 90 minutos para aprender a planificar, cocinar y conservar los menús de toda la semana en solo un par de horas el fin de semana.",
      precio: 25000,
      tipo: "control" as const,
      icono: "🍱",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
    {
      id: "PROD-148",
      nombre: "Plan de Recomposición Post-Parto",
      descripcion:
        "Pauta nutricional cuidadosa orientada a la recuperación del peso pre-gestacional, asegurando al mismo tiempo los requerimientos calóricos si hay lactancia exclusiva.",
      precio: 95000,
      tipo: "plan" as const,
      icono: "🤱",
      categoriaId: "CAT-02",
      categoriaNombre: "Planes Especializados",
      estado: "Activo" as const,
      planNutricional: {
        caloriasDiarias: 2300,
        objetivo: "Recuperación post-parto y sostén de lactancia",
        macros: [
          {
            nombre: "Proteínas",
            gramos: 130,
            porcentaje: 23,
            color: "success" as const,
          },
          {
            nombre: "Carbohidratos",
            gramos: 285,
            porcentaje: 50,
            color: "info" as const,
          },
          {
            nombre: "Grasas",
            gramos: 69,
            porcentaje: 27,
            color: "warning" as const,
          },
        ],
        comidas: [
          {
            id: "com-post-1",
            tipo: "Colación",
            horario: "11:00",
            descripcion:
              "Batido de proteína, avena, plátano y crema de maní (alto aporte calórico para la producción de leche).",
          },
        ],
      },
    },
    {
      id: "PROD-149",
      nombre: "Análisis de Hidratación por Refractometría",
      descripcion:
        "Examen rápido de orina mediante refractómetro óptico para determinar la gravedad específica y diagnosticar el nivel de deshidratación celular del paciente.",
      precio: 18000,
      tipo: "evaluacion" as const,
      icono: "🔬",
      categoriaId: "CAT-01",
      categoriaNombre: "Evaluación Biométrica",
      estado: "Activo" as const,
    },
    {
      id: "PROD-150",
      nombre: "Terapia de Alimentación Consciente (Mindful Eating)",
      descripcion:
        "Sesión terapéutica para reconectar con las señales fisiológicas de hambre y saciedad, eliminando las pantallas y distracciones al momento de comer.",
      precio: 35000,
      tipo: "control" as const,
      icono: "🧘",
      categoriaId: "CAT-03",
      categoriaNombre: "Telemedicina y Controles",
      estado: "Activo" as const,
    },
  ],
};
