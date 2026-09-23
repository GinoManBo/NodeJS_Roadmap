---
tags:
  - modulo
  - en-progreso
fecha: "2026-09-20 a 2026-09-23"
---
# M2 - Habits

**Estado:** 🟡 En progreso  
**Fechas:** 2026-09-20 a 2026-09-23

Segundo sandbox: habit tracker 'Click' (odómetro de racha, regla y plunger). Frontend listo, backend en progreso.

## Archivos
- Habits/public/ (index.html, style.css, script.js)
- Habits/app.js

## Temas abordados

- [[npm y package.json]]
  - `npm init -y`
  - Un package.json por proyecto/carpeta

- [[Métodos HTTP]]
  - POST usado para acciones (`/checkin`)
  - DELETE sobre sub-recurso (`/checkin`)

- [[Códigos de estado HTTP]]
  - 201 al crear un hábito

- [[Setup de app y listen]]
  - Proyecto nuevo desde cero

- [[Routing básico]]
  - Rutas anidadas `/api/habits/:id/checkin`

- [[Parámetros de ruta]]
  - Mismo error repetido en POST /api/habits

- [[Respuestas res json send status end]]
  - Responder el objeto creado, no un mensaje

- [[Archivos estáticos (express.static)]]
  - Segundo frontend, misma técnica

- [[CRUD completo]]
  - GET y POST hechos, resto pendiente

- [[Convenciones de rutas REST]]
  - Sub-recursos: `/api/habits/:id/checkin`

- [[Validación manual de entrada]]
  - Mismo patrón con `name`

- [[Contrato de API frontend backend]]
  - Tabla de contrato documentada antes de programar

- [[Lógica de negocio (rachas y fechas)]]
  - Modelo con array anidado `checkins`
  - Fechas ISO `YYYY-MM-DD`
  - Regla de racha: ayer suma, si no reinicia a 1
  - `POST /api/habits/:id/checkin` completo y probado con curl
  - Separar lógica (`comparison`, `ItWasYesterday`) de la respuesta HTTP (`res` como parámetro explícito)
  - Bug: mutar un `Date` con `.setDate()` DESPUÉS de convertirlo a string ya no funciona — un string no tiene métodos de Date
  - Bug: `if (valor)` matchea cualquier truthy (2 también), no sustituye a `=== true`

- [[Idempotencia]]
  - Segundo check-in mismo día devuelve `409 Conflict`, no duplica racha

- [[Datos en memoria (arrays)]]
  - `let habits = []`

- [[nodemon]]
  - `start` ya usa nodemon

- [[Organización de proyectos en carpetas]]
  - Reorganización a `Tasks/` y `Habits/`

- [[Git y GitHub]]
  - Repo inicializado, remoto `origin` en GitHub
  - Renombrar rama `master` a `main`
  - Error `src refspec main no concuerda`: no existía la rama local
  - `.gitignore` para no subir `node_modules`
  - `git rm -r --cached` para sacar del índice sin borrar del disco
  - Historias sin relación (`--allow-unrelated-histories`)

- [[Servir un frontend estático]]
  - Segundo frontend

- [[Consumir la API desde fetch]]
  - Reemplazo del hábito optimista con la respuesta real

## Notas y errores aprendidos
- Hecho: GET /api/habits, POST /api/habits, POST /api/habits/:id/checkin (con racha, best e idempotencia 409).
- Pendiente: DELETE /api/habits/:id/checkin (deshacer), DELETE /api/habits/:id.
- Error aprendido: `req.params.id` no existe en POST sin `:id`; el POST debe responder el objeto creado.
- Error aprendido: una vez que un `Date` se convierte a string, pierde `.getDate()`/`.setDate()` — restar el día ANTES de convertir.
- Error aprendido: `if (valor)` no es lo mismo que `if (valor === true)` cuando la función puede devolver varios valores truthy distintos (`true`, `2`).
- Bug de frontend (no del usuario): el odómetro usaba `translateY(Nem)` sin fijar el `font-size` de `.strip`, así que el `em` no coincidía con la altura real de cada dígito — corregido.
- Repo Git creado y conectado a GitHub; quedó un rebase interactivo sin terminar.
