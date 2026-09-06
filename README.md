# NutriVida - Portal Clínico y Dietético

NutriVida es la digitalización integral de una clínica de nutrición y dietética establecida en Temuco (2016). Este proyecto marca la transición de un modelo de gestión tradicional (sin presencia web ni agendamiento en línea) a un ecosistema digital completo, diseñado para dar soporte a las 4 nutricionistas del centro y a su flujo de más de 60 pacientes semanales.

El sistema provee una interfaz de aterrizaje pública y un entorno privado de "Portal del Paciente", optimizando la retención mediante el acceso a métricas de evolución, pautas alimentarias y gestión de exámenes médicos.

## Características Principales

*   **Interfaz Clínica (UI/UX):** Diseño limpio y orgánico basado en tonos verdes, blancos y grises, enfocado en la accesibilidad y la lectura sin fatiga visual.
*   **Naveajción Inteligente:** Barra de navegación con lógica de ocultamiento automático (auto-hide) al hacer scroll hacia abajo, reapareciendo mediante detección de cursor en escritorio o scroll inverso en dispositivos táctiles.
*   **Gestión de Modales Nativos:** Sistema de ventanas modales en JavaScript puro con bloqueo automático de scroll en el documento (`body-scroll lock`) para enfocar la atención del usuario.
*   **Portal del Paciente (Dashboard):** Área privada responsiva con menú lateral que consolida la próxima cita, métricas de peso corporal, objetivos actuales y un gestor de descarga de documentos (pautas y recetarios).
*   **Flujo de Autenticación:** Vistas dedicadas para el registro detallado de pacientes (incluyendo datos demográficos y clínicos básicos) y el inicio de sesión.

## Stack Tecnológico

El proyecto está construido bajo una arquitectura *Frontend* pura y estática, priorizando la velocidad de carga y la compatibilidad universal:

*   **HTML5:** Estructura semántica.
*   **CSS3:** Sistema de variables nativas (Custom Properties), Flexbox, CSS Grid y prevención de inversiones de color no deseadas (`color-scheme`).
*   **JavaScript (ES6):** Lógica de interacción en Vanilla JS, sin dependencias externas pesadas, operando la manipulación del DOM y los *event listeners*.
*   **Bootstrap 5.3.8:** Framework base para el sistema de cuadrículas, utilidades de espaciado y componentes responsivos (tarjetas, formularios, collapse).

## Estructura del Proyecto

El repositorio sigue un patrón de organización estándar para proyectos web estáticos:

```text
/
├── index.html               # Landing page, servicios y formulario de evaluación
├── pages/                   # Vistas secundarias[cite: 9]
│   ├── account.html         # Dashboard privado del paciente[cite: 9]
│   ├── login.html           # Interfaz de inicio de sesión[cite: 9]
│   └── register.html        # Formulario de alta de nuevos pacientes[cite: 9]
└── assets/                  # Recursos estáticos[cite: 9]
    ├── cs/                 [cite: 9]
    │   └── style.css        # Hoja de estilos global y sobrescritura de Bootstrap[cite: 9]
    ├── js/                 [cite: 9]
    │   ├── script.js        # Lógica global (Navbar inteligente, modales)[cite: 9]
    │   ├── login.js         # Validaciones futuras para inicio de sesión[cite: 9]
    │   └── register.js      # Validaciones futuras para registro[cite: 9]
    └── img/                [cite: 9]
        └── Favicon.png      # Icono del sitio[cite: 9]
