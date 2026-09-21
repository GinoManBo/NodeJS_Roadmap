---
tags:
  - modulo
  - en-progreso
fecha: "2026-09-20 en adelante"
---
# M2 - Habits

**Estado:** 🟡 En progreso  
**Fechas:** 2026-09-20 en adelante

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
  - Diseñada la regla de racha: ayer suma, si no reinicia

- [[Datos en memoria (arrays)]]
  - `let habits = []`

- [[nodemon]]
  - `start` ya usa nodemon

- [[Organización de proyectos en carpetas]]
  - Reorganización a `Tasks/` y `Habits/`

- [[Servir un frontend estático]]
  - Segundo frontend

- [[Consumir la API desde fetch]]
  - Reemplazo del hábito optimista con la respuesta real

## Notas y errores aprendidos
- Hecho: GET y POST /api/habits.
- Pendiente: POST y DELETE /api/habits/:id/checkin, DELETE /api/habits/:id.
- Error aprendido: `req.params.id` no existe en POST sin `:id`; el POST debe responder el objeto creado.
