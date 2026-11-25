# Documentación de Pruebas de Integración y Auditoría del Flujo del Cliente — Alchemax / NutriVida

**Fecha de ejecución:** 25 de noviembre de 2026  
**Entorno verificado:**
- **Frontend:** React 19 + TypeScript + Vite (`http://localhost:5173/Alchemax/`)
- **Backend:** Spring Boot 4 + Spring Security OAuth2 JWT (`http://localhost:8080`)
- **Base de datos:** MySQL / XAMPP (`localhost:3306/alchemax`) verificada en vivo mediante MCP SQL de solo lectura (`mcp_server_mysql`)

---

## 1. Proceso Metodológico Aplicado (Qué se hizo y por qué)

Para asegurar que la solución funcione de extremo a extremo como un producto digital cohesivo (y no únicamente como módulos aislados), la verificación se ejecutó en **4 fases secuenciales**:

1. **Sincronización de ramas y auditoría del esquema SQL (`mcp_server_mysql`)**
   - *Por qué:* Antes de probar el comportamiento en vivo, se verificó que todos los Pull Requests previos estuvieran integrados en `main` (`Alchemax` y `Alchemax-Backend`) y que el esquema real en MySQL tuviera los índices y restricciones de integridad esperados (`uk_cita_slot_activo`, `uk_item_carrito_servicio`, `idx_compra_fecha_compra`, `idx_cita_fecha`).
   - *Hallazgo clave:* Al consultar `SELECT COUNT(*) FROM servicio`, se detectaron **50 servicios activos** en la base de datos. Esto expuso de inmediato una fricción crítica de UX en el catálogo del cliente (`Metodologia.tsx`), que utilizaba un carrusel horizontal de 4 tarjetas por diapositiva (13 desplazamientos manuales) sin buscador, sin ordenamiento y sin modal de detalle clínico.

2. **Pruebas automatizadas de integración en vivo (Frontend + Backend + MySQL)**
   - *Por qué:* Confirmar en tiempo real que cada criterio de la sección **Pruebas de integración** del checklist se cumple sobre el servidor real (sin mocks): autenticación JWT, expiración/renovación, control de acceso por roles (RBAC), aislamiento entre usuarios (IDOR), persistencia del carrito, validaciones de precio en el servidor, conflictos de horario `409 Conflict` y reconciliación de reportes administrativos SQL.

3. **Auditoría profunda y fortalecimiento del Flujo del Cliente (UX, Accesibilidad y Cohesión)**
   - *Por qué:* El recorrido del cliente (*Descubrimiento en Home → Triage y Catálogo en Metodología → Detalle de Prestación → Carrito con Cantidades → Pasarela Webpay Plus → Historial y Agendamiento en Account*) presentaba desconexiones entre páginas que impedían percibirlo como un producto digital unificado.

4. **Verificación de compilación, tipado estricto y lint (`tsc`, `eslint`, `vite build`)**
   - *Por qué:* Garantizar cero regresiones de TypeScript, cumplimiento con las reglas estrictas de React 19 / ESLint y empaquetado de producción limpio.

> **Nota sobre Playwright MCP:** Al invocar `playwright` en esta máquina Linux, el servidor MCP reportó `Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome` porque Google Chrome no está instalado en `/opt/google/chrome/chrome` (solo existe `/usr/bin/firefox`). Para habilitar pruebas interactivas con navegador en Playwright MCP en futuras sesiones, basta con agregar `"--browser", "firefox"` a los argumentos del servidor Playwright MCP (o ejecutar `npx playwright install chrome`). Todas las verificaciones de conectividad del frontend, endpoints REST, JWT y persistencia en MySQL fueron ejecutadas en vivo contra los servidores activos.

---

## 2. Resultados de las Pruebas de Integración en Vivo

Todas las pruebas se ejecutaron contra `http://localhost:5173/Alchemax/`, `http://localhost:8080` y MySQL `alchemax`, limpiando posteriormente los registros temporales creados durante el ensayo:

| # | Escenario de Prueba (Checklist) | Resultado | Evidencia Técnica Observada |
|---|---|---|---|
| **1** | Conexión Frontend, Backend, OpenAPI y Catálogo | ✅ **APROBADA** | Vite respondió `200 OK` con contenedor `#root`; `/v3/api-docs` expuso OpenAPI `3.1.0`; `GET /api/servicios` retornó los `50` servicios activos desde MySQL. |
| **2** | Rechazo de endpoints protegidos sin token válido | ✅ **APROBADA** | `GET /api/auth/me`, `/api/citas`, `/api/compras` y `/api/compras/reporte` sin cabecera `Authorization` devolvieron `401 Unauthorized`. |
| **3** | Inicio de sesión con credenciales incorrectas y correctas (3 roles) | ✅ **APROBADA** | Contraseña incorrecta retornó `401`. Credenciales válidas de `usuario` (`id=2`), `nutricionista` (`id=3`) y `admin` (`id=1`) retornaron JWT HS256 firmado con claims `usuarioId`, `rol` y `orig_iat`. |
| **4** | Persistencia de sesión (`/api/auth/me`) y renovación (`/api/auth/refresh`) | ✅ **APROBADA** | `/api/auth/me` devolvió el perfil vigente sin campo `password`; `/api/auth/refresh` emitió nuevo JWT preservando exactamente `orig_iat` para aplicar el límite máximo de sesión. |
| **5** | Control de acceso por roles (RBAC) y aislamiento entre usuarios (IDOR) | ✅ **APROBADA** | `403 Forbidden` verificado en los 7 casos: paciente consultando `/api/citas`, `/api/compras`, `/api/compras/reporte`, citas/compras/carrito de `usuarioId=1`, y nutricionista intentando acceder al carrito comercial de un paciente (`/api/carrito/usuario/2`). |
| **6** | Flujo de Carrito CRUD: agregar, modificar cantidades (`+ / −`) y remover | ✅ **APROBADA** | `POST /api/carrito/usuario/2/agregar` creó el ítem en `item_carrito`; `PUT /api/items-carrito/{id}` actualizó `cantidad=3` en MySQL; `DELETE /api/carrito/usuario/2/remover` limpió el ítem (`200 OK`). Índice único `uk_item_carrito_servicio` verificado en MySQL. |
| **7** | Agendamiento de Citas, conflicto de horario (`409`) y reglas de estado | ✅ **APROBADA** | Paciente envió `estado: "Confirmada"` en `POST /api/citas` y el backend forzó `Programada` (`201`). Segundo envío para la misma fecha/hora/profesional devolvió `409 Conflict` (respaldado por `uk_cita_slot_activo`). Paciente canceló (`200`), fue bloqueado en `DELETE` (`403`) y Admin eliminó el registro de prueba (`204`). |
| **8** | Registro de Compra blindado en servidor y Reportes Administrativos SQL | ✅ **APROBADA** | Paciente envió `monto: 1`, `nombre: "Nombre Falso"`, `estado: "Completado"` y fecha pasada; el servidor resolvió `Control Telemedicina` (`$25.000`) desde el catálogo y forzó `estado: "Activo"`, ocultando `fotoPerfil`. Admin actualizó a `Completado` (`200`), consultó `/api/compras/reporte` en los 4 períodos (`semana`, `mes`, `anio`, `historico` = `$180.000` consistente con `SUM(monto)` en MySQL) y limpió el registro (`204`). |

---

## 3. Mejoras Implementadas al Flujo del Cliente (Producto Digital Completo)

A partir de la auditoría del recorrido completo del paciente, se resolvieron las **5 brechas principales** detectadas en la experiencia de usuario y su integración:

### 3.1. Catálogo Clínico Buscable, Ordenable, Paginado y con Modal de Detalle (`Metodologia.tsx` y `ServiceDetailModal.tsx`)
- **Problema detectado:** Con 50 servicios activos en la base de datos, el carrusel horizontal anterior ocultaba el catálogo en 13 diapositivas sin buscador ni vista de detalle.
- **Solución implementada:**
  - Buscador en tiempo real por nombre, descripción, tipo o especialidad (`#busqueda-catalogo-cliente`).
  - Selector de ordenamiento (`Destacados`, `Menor a mayor precio`, `Mayor a menor precio`, `Nombre A–Z`) y filtros por categoría con contador de prestaciones disponibles.
  - Grilla responsiva paginada de 8 servicios por página con contador accesible (`aria-live="polite"`).
  - Nuevo componente reutilizable **[ServiceDetailModal.tsx](src/components/ServiceDetailModal.tsx)** accesible (`role="dialog"`, cierre con `Escape`, selector de cantidad `1..10`, cálculo de subtotal en vivo, beneficios incluidos según tipo de prestación y botones `Añadir al carrito` / `Ir al carrito y pagar`), disponible tanto desde `Home.tsx` como desde `Metodologia.tsx`.
  - Integración directa desde la **Calculadora de Triage**: al obtener el diagnóstico IMC, el botón *"Ver plan sugerido en el catálogo ↓"* aplica automáticamente el filtro recomendado sobre el catálogo.

### 3.2. Pasarela de Pago Unificada Webpay Plus en el Carrito (`Carrito.tsx`)
- **Problema detectado:** `Metodologia.tsx` utilizaba `PaymentGatewayModal`, pero `Carrito.tsx` ejecutaba `POST /api/compras` directamente sin mostrar ningún paso de pago ni comprobante, creando dos experiencias contradictorias para el cliente.
- **Solución implementada:** El botón **"🔒 Pagar con Webpay Plus"** en `Carrito.tsx` valida la sesión del paciente, expande las unidades exactas del carrito (`itemsCarrito`) para calcular el monto real y abre `PaymentGatewayModal`. Tras la aprobación de la pasarela, se persiste cada compra en MySQL, se vacía el carrito y el botón **"Ir a mi Portal del Paciente"** redirige directamente a `/account?tab=compras`.

### 3.3. Sincronización en Tiempo Real del Carrito y Badge en la Barra de Navegación (`tiendaService.ts`, `Navbar.tsx`, `Home.tsx`, `Metodologia.tsx`)
- **Problema detectado:** `Navbar.tsx` no mostraba cuántas prestaciones tenía el cliente en el carrito, y `handleAddToCart` en `Home.tsx` y `Metodologia.tsx` no esperaba (`await`) la respuesta del backend antes de mostrar el enlace *"Ir al carrito"*, pudiendo causar una condición de carrera.
- **Solución implementada:**
  - `TiendaService` ahora emite el evento `alchemax:cart-updated` tras cada operación (`agregarAlCarrito`, `actualizarCantidadItem`, `removerDelCarrito`, `vaciarCarrito`) y retorna `Promise<boolean>` en `agregarAlCarrito`.
  - `Navbar.tsx` se suscribe a dicho evento y muestra un indicador numérico en tiempo real (`🛒 Carrito [N]`) con `aria-live="polite"`.
  - Tanto `Home.tsx` como `Metodologia.tsx` esperan (`await`) la confirmación del servidor antes de mostrar el toast de éxito o redirigir al carrito.

### 3.4. Aterrizaje Post-Compra y Limpieza de Peticiones Duplicadas en el Portal del Paciente (`Account.tsx`)
- **Problema detectado:** Tras completar una compra, el cliente aterrizaba en la pestaña genérica `"resumen"` en lugar de ver inmediatamente sus servicios adquiridos para agendar su hora; además, existía un `useEffect` duplicado que consultaba `GET /api/compras/usuario/{id}` dos veces al montar `Account.tsx`.
- **Solución implementada:** Se eliminó el `useEffect` duplicado y se añadió soporte para el parámetro de URL `/account?tab=compras` (válido para todas las pestañas del portal), permitiendo que el paciente pase sin fricción desde el comprobante Webpay a **"Mis Servicios"** y agende su hora con un solo clic.
