export interface ArticleData {
  id: string;
  theme: "success" | "info" | "warning";
  badgeText: string;
  title: string;
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
    date: "Actualizado hace 1 mes",
    readTime: 7,
    content: [
      "Mantener una dieta basada en plantas en el sur de Chile durante el invierno presenta un doble desafío: la baja exposición solar y la limitación en la variedad de vegetales frescos. Para evitar cuadros de anemia y fatiga crónica, es imperativo estructurar estratégicamente la ingesta de hierro y vitamina B12.",
      "El hierro vegetal (no hemo) tiene una tasa de absorción menor que el hierro de origen animal. Fuentes ricas como lentejas, garbanzos, tofu, quinoa y espinacas deben consumirse obligatoriamente junto a fuentes de vitamina C para maximizar su biodisponibilidad en el tracto digestivo.",
      "Por otro lado, la vitamina B12 es inexistente en fuentes vegetales no procesadas. Los pacientes deben asegurar su ingesta a través de leches vegetales fortificadas, levadura nutricional y, como vía más segura, suplementación farmacológica en comprimidos sublinguales o aerosoles. Monitorear estos marcadores en sangre evita daños neurológicos irreversibles y caídas de energía severas durante los meses fríos.",
    ],
  },
};
