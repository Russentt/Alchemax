export interface ArticleData {
  id: string;
  theme: "success" | "info" | "warning";
  badgeText: string;
  title: string;
  description: string;
  date: string;
  readTime: number;
  content: string[];
}

export const articlesDatabase: Record<string, ArticleData> = {
  "probioticos-insulina": {
    id: "probioticos-insulina",
    theme: "success",
    badgeText: "Artículo Destacado",
    title:
      "Impacto de los probióticos en la absorción intestinal y resistencia a la insulina",
    description:
      "Una revisión de 12 semanas analizando la cepa Lactobacillus reuteri y su modulación directa sobre el metabolismo de la glucosa.",
    date: "Actualizado hace 2 días",
    readTime: 6,
    content: [
      "La microbiota intestinal no solo regula la digestión; actúa como un órgano endocrino secundario. Estudios clínicos enfocados en la cepa Lactobacillus reuteri (específicamente la variante GMNL-263) han demostrado su alta efectividad para reducir la resistencia a la insulina y mitigar la formación de esteatosis hepática en modelos metabólicos.",
      "La permeabilidad intestinal juega un rol fundamental en la inflamación sistémica de bajo grado. La ingesta oral de esta cepa específica ha probado mejorar significativamente la secreción de incretinas y la liberación de insulina dependiente de la glucosa en sujetos humanos tolerantes.",
      "En el contexto epidemiológico de La Araucanía, donde las tasas de síndrome metabólico son prevalentes, la modulación del metabolismo de la glucosa mediante intervenciones probióticas dirigidas se presenta como un agente terapéutico complementario prometedor para el tratamiento preventivo de la diabetes tipo 2.",
    ],
  },
  "termogenesis-adaptativa": {
    id: "termogenesis-adaptativa",
    theme: "success",
    badgeText: "Metabolismo",
    title: "¿Por qué el déficit calórico extremo arruina tu metabolismo basal?",
    description:
      "Analizamos la termogénesis adaptativa y cómo el cuerpo reduce el gasto energético espontáneo (NEAT) cuando restringimos calorías de forma agresiva.",
    date: "Actualizado hace 1 semana",
    readTime: 4,
    content: [
      "Restringir calorías de forma agresiva sin supervisión clínica desencadena un mecanismo evolutivo de supervivencia conocido como termogénesis adaptativa. El cuerpo interpreta la escasez prolongada de energía como una amenaza directa a la supervivencia y comienza a reducir activamente su tasa metabólica para conservar reservas.",
      "Uno de los primeros impactos se observa en el NEAT (Termogénesis por Actividad Sin Ejercicio). El sistema nervioso central disminuye sutilmente la actividad espontánea, lo que resulta en una caída drástica del gasto calórico diario. A nivel hormonal, la leptina (responsable de la saciedad) cae más rápido que el peso corporal, mientras que la grelina (la hormona del hambre) aumenta sostenidamente.",
      "Si el déficit extremo se prolonga, el cuerpo prioriza la preservación de grasa e inicia el catabolismo muscular, descomponiendo tejido magro para obtener energía. Dado que el músculo exige más energía para mantenerse que la grasa, esta pérdida muscular reduce de forma permanente la Tasa Metabólica Basal (TMB), asegurando un efecto rebote rápido al retomar la ingesta habitual.",
    ],
  },
  "creatina-neuroproteccion": {
    id: "creatina-neuroproteccion",
    theme: "info",
    badgeText: "Deporte y Rendimiento",
    title: "Creatina monohidratada: más allá del rendimiento muscular",
    description:
      "Nuevos metaanálisis demuestran beneficios cognitivos, neuroprotectores y de modulación glucémica en adultos que no necesariamente realizan alta competición deportiva.",
    date: "Actualizado hace 2 semanas",
    readTime: 5,
    content: [
      "La creatina monohidratada es ampliamente reconocida por optimizar la resíntesis de ATP en el tejido muscular, pero su impacto en el sistema nervioso central está redefiniendo su uso clínico. La suplementación sostenida de dosis altas (hasta 10 g/día) puede aumentar el contenido de creatina cerebral entre un 5% y un 15%.",
      "Ensayos clínicos doble ciego demuestran que este incremento otorga efectos neuroprotectores sustanciales y mejora las funciones cognitivas y ejecutivas. Los sujetos evaluados exhiben tiempos de reacción significativamente más rápidos, mayor atención sostenida y un mejor control psicomotor en escenarios de alta exigencia mental.",
      "Estos descubrimientos sugieren que la suplementación con creatina no debe limitarse a atletas de alta competencia. Adultos que enfrentan fatiga mental crónica o buscan modulación cognitiva preventiva pueden obtener beneficios neurológicos directos de su inclusión dietética diaria.",
    ],
  },
  "dieta-vegetariana-invierno": {
    id: "dieta-vegetariana-invierno",
    theme: "warning",
    badgeText: "Nutrición Basada en Plantas",
    title: "Planificación segura de dietas vegetarianas en invierno",
    description:
      "Estrategias clave para asegurar la biodisponibilidad de Hierro no hemo, Zinc y Vitamina B12 durante los meses de menor exposición solar.",
    date: "Actualizado hace 1 mes",
    readTime: 7,
    content: [
      "Mantener una dieta basada en plantas en el sur de Chile durante el invierno presenta un doble desafío: la baja exposición solar y la limitación en la variedad de vegetales frescos. Para evitar cuadros de anemia y fatiga crónica, es imperativo estructurar estratégicamente la ingesta de hierro y vitamina B12.",
      "El hierro vegetal (no hemo) tiene una tasa de absorción menor que el hierro de origen animal. Fuentes ricas como lentejas, garbanzos, tofu, quinoa y espinacas deben consumirse obligatoriamente junto a fuentes de vitamina C para maximizar su biodisponibilidad en el tracto digestivo.",
      "Por otro lado, la vitamina B12 es inexistente en fuentes vegetales no procesadas. Los pacientes deben asegurar su ingesta a través de leches vegetales fortificadas, levadura nutricional y, como vía más segura, suplementación farmacológica en comprimidos sublinguales o aerosoles. Monitorear estos marcadores en sangre evita daños neurológicos irreversibles y caídas de energía severas durante los meses fríos.",
    ],
  },
  "hipertrofia-periodizacion": {
    id: "hipertrofia-periodizacion",
    theme: "info",
    badgeText: "Deporte y Rendimiento",
    title: "Sincronización de macronutrientes en rutinas de hipertrofia",
    description:
      "Cómo estructurar la ingesta de proteínas e hidratos de carbono alrededor de sesiones de levantamiento de pesas para maximizar la síntesis proteica muscular.",
    date: "Actualizado hace 3 días",
    readTime: 6,
    content: [
      "En esquemas de entrenamiento orientados a la hipertrofia, como las rutinas divididas o el trabajo intenso en saco pesado, el balance nitrogenado positivo es la piedra angular del crecimiento. La ventana anabólica no es tan restrictiva como se creía en los años 90, pero la distribución diaria de la proteína sí dicta el ritmo de recuperación.",
      "La literatura actual sugiere fraccionar la ingesta proteica en 4 a 5 comidas diarias, aportando entre 0.4 y 0.55 g/kg de peso corporal por comida. Consumir carbohidratos de alto índice glucémico post-entrenamiento no solo repone el glucógeno hepático y muscular, sino que genera un pico de insulina que frena el catabolismo inducido por el estrés mecánico del levantamiento.",
      "Suplementar con proteína de suero aislada (Whey Isolate) combinada con leucina asegura que se alcance el umbral necesario para activar la vía mTOR, responsable directa de la creación de nuevas fibras musculares, especialmente tras estímulos de sobrecarga progresiva intensa.",
    ],
  },
  "rendimiento-cognitivo-pantallas": {
    id: "rendimiento-cognitivo-pantallas",
    theme: "warning",
    badgeText: "Neuro-nutrición",
    title:
      "Soporte nutricional para la fatiga del sistema nervioso en alta concentración",
    description:
      "Intervenciones dietéticas para mantener los tiempos de reacción y la toma de decisiones en entornos de alta exigencia visual y cognitiva sostenida.",
    date: "Actualizado hace 5 días",
    readTime: 5,
    content: [
      "El rendimiento en tareas que requieren atención focalizada constante y toma de decisiones en fracciones de segundo genera un desgaste acelerado de neurotransmisores. La fatiga del sistema nervioso central (SNC) disminuye drásticamente la capacidad de procesamiento visual y motriz tras 90 minutos de actividad continua.",
      "La hidratación juega un papel silencioso pero crítico. Una deshidratación de apenas el 2% del peso corporal ralentiza la sinapsis neuronal, aumentando la latencia en las respuestas motoras. El consumo de electrolitos balanceados junto con tirosina (precursor de la dopamina) ayuda a sostener el estado de alerta sin generar los picos de ansiedad asociados a las altas dosis de cafeína aislada.",
      "Adicionalmente, el aporte de ácidos grasos Omega-3 (DHA/EPA) mejora la fluidez de las membranas neuronales. Reducir la ingesta de azúcares simples durante estas sesiones previene la hipoglicemia reactiva, estabilizando los niveles de energía y permitiendo mantener el control y la rotación estratégica en tareas complejas.",
    ],
  },
};
