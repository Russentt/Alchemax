# Portal Clínico NutriVida

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)
[![Deployment](https://img.shields.io/badge/Deployment-GitHub_Pages-brightgreen.svg)](https://pages.github.com/)

NutriVida es una aplicación web frontend modular y de alto rendimiento diseñada para servicios de nutrición clínica. Construida como una Single Page Application (SPA) _serverless_, simula un ecosistema full-stack completo operando exclusivamente en el navegador. Al aislar la lógica de datos en una capa de servicios que interactúa con las APIs nativas de `localStorage` y `sessionStorage`, NutriVida ofrece una experiencia de usuario de nivel de producción —incluyendo autenticación, e-commerce y gestión de pacientes— manteniendo un 100% de compatibilidad con entornos de alojamiento estático como GitHub Pages.

## 🚀 Características Principales

- **Motor de Triage Clínico:** Calculadora biométrica interactiva que procesa los datos del usuario (peso, estatura, objetivos) para calcular el IMC y recomendar dinámicamente el plan clínico más adecuado.
- **Base de Datos Relacional Simulada:** Capa de servicios modular (`tiendaService`, `storageUsuario`) que emula una API REST backend, gestionando colecciones independientes para usuarios, citas, métricas y compras.
- **Portal del Paciente (Dashboard):** Panel interactivo con múltiples pestañas donde los usuarios pueden gestionar su información personal, revisar planes nutricionales activos, observar su evolución biométrica y simular la descarga de documentos clínicos.
- **Flujo de Checkout Seguro:** Carrito de compras funcional que convierte el estado volátil de selección en compras persistentes asignadas a la cuenta del usuario, integrando validación de sesión y redireccionamiento automático.
- **Asistente Virtual ("Vida"):** Chatbot de soporte integrado basado en expresiones regulares (NLP simulado) que proporciona asistencia instantánea, detalles de precios y ayuda de navegación sin dependencias de APIs externas.
- **Sistema de Notificaciones Toast:** Feedback de interfaz no bloqueante que reemplaza las alertas nativas del navegador, garantizando una experiencia de usuario moderna, accesible y altamente visible.

## 🏗️ Arquitectura y Tecnologías

Este proyecto se adhiere estrictamente a los principios de _Clean Code_ y a la separación modular de responsabilidades. Los componentes de la interfaz de usuario están completamente desacoplados de la lógica de mutación de datos, preparando el código fuente para una transición fluida hacia un backend distribuido real (ej. Spring Boot o Flask) en el futuro.

- **Core:** React 18 (Componentes Funcionales, Hooks), TypeScript (Tipado Estricto).
- **Enrutamiento:** React Router DOM (Manejo de rutas dinámicas, rutas protegidas y restauración global de scroll).
- **Estilos:** Bootstrap 5 (Clases utilitarias, grilla responsiva), CSS Modules personalizados.
- **Almacenamiento:** Web Storage API (`localStorage` para persistencia de datos y `sessionStorage` para estados volátiles de autenticación).

## 📂 Estructura del Proyecto

La arquitectura del repositorio refleja la división de servicios modulares:

```text
alchemax/
├── public/                 # Recursos estáticos e íconos
├── src/
│   ├── assets/             # Imágenes de marca y favicons
│   ├── components/         # Elementos UI reutilizables (Navbar, Footer, Chatbot, Cards)
│   ├── data/               # Definiciones de tipos e inicialización de datos de prueba
│   ├── pages/              # Vistas principales de las rutas (Home, Account, Carrito, Metodologia)
│   ├── services/           # Capa de simulación de backend (tiendaService, storageUsuario, citasService)
│   ├── App.tsx             # Componente raíz y configuración del Router
│   └── main.tsx            # Punto de entrada de la aplicación
├── eslint.config.js        # Configuración del linter
├── tsconfig.json           # Opciones del compilador de TypeScript
└── package.json            # Dependencias del proyecto y scripts de ejecución
```

## 💻 Guía de Instalación

### Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (v18.0.0 o superior) y `npm` en tu entorno local.

### Instalación y Ejecución

1. Clonar el repositorio:

   ```bash
   git clone [https://github.com/russentt/alchemax.git](https://github.com/russentt/alchemax.git)
   cd alchemax
   ```

2. Instalar las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir el navegador e ingresar a la URL local proporcionada en la terminal (usualmente `http://localhost:5173`).

## 🗺️ Roadmap e Implementaciones Futuras

Las siguientes características están programadas para los próximos _sprints_, diseñadas para escalar las capacidades de la aplicación manteniendo las restricciones de alojamiento estático:

- **[ ] CMS Administrativo:** Una ruta protegida (`/admin`) para que el equipo clínico gestione globalmente todas las citas de los pacientes, edite el catálogo de servicios y apruebe documentos médicos.
- **[ ] Visualización de Datos (Gráficos):** Integración de librerías como `Chart.js` o `Recharts` para renderizar gráficos de líneas interactivos en el portal del paciente, ilustrando tendencias de peso y grasa corporal a lo largo del tiempo.
- **[ ] Búsqueda y Filtrado Avanzado:** Algoritmos de búsqueda en tiempo real y filtros por categorías para los componentes del Blog y el Catálogo de Servicios.
- **[ ] Sistema de Exportación/Importación de Estado:** Una utilidad de respaldo de base de datos que permita a los usuarios y administradores serializar toda la instancia de `localStorage` en un archivo `.json` descargable, protegiendo los datos de sesión contra el borrado de caché del navegador.

## 👥 Equipo de Desarrollo

Desarrollado como proyecto académico de ingeniería de software para la asignatura DSY1104.

- **Equipo:** Colo Colo
- **Integrantes:** Ignacio Battistoni, Lucas Ortiz, Cristopher Rojas
