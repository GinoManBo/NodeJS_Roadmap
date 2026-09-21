---
tags:
  - modulo
  - visto
fecha: "2026-09-19 a 2026-09-20"
---
# M1 - Tasks

**Estado:** 🟢 Visto  
**Fechas:** 2026-09-19 a 2026-09-20

Primer sandbox completo: app de tareas. Frontend 'Sheet' armado por Claude, backend escrito por el usuario.

## Archivos
- Tasks/public/ (index.html, style.css, script.js)
- Tasks/app.js (5 rutas)

## Temas abordados

- [[npm y package.json]]
  - Script `start`
  - devDependencies con nodemon

- [[Métodos HTTP]]
  - GET, POST, PATCH, DELETE en un CRUD real

- [[Códigos de estado HTTP]]
  - 200 ok, 201 creado, 204 sin contenido
  - 400 dato inválido, 404 no encontrado
  - Orden correcto `res.status(x).json(...)`

- [[Body headers y JSON]]
  - Qué es el body (analogía de la carta)
  - Header `Content-Type: application/json`
  - `req.body` gracias a `express.json()`
  - Contrato de nombres entre frontend y backend

- [[Setup de app y listen]]
  - Estructura mínima de app.js

- [[Routing básico]]
  - `app.post`, `app.patch`, `app.delete`
  - Orden de parámetros `(req, res)`

- [[Parámetros de ruta]]
  - `find` y `findIndex` con el id
  - Error: `req.params` no existe en rutas sin `:id` (POST)

- [[Respuestas res json send status end]]
  - `res.status(204).end()` sin body
  - `status()` antes de `json()`, nunca después

- [[Middleware concepto y orden]]
  - `express.json()` antes de las rutas
  - `express.static` antes de las rutas API

- [[Archivos estáticos (express.static)]]
  - Carpeta `public`
  - `index.html` se sirve en `/`

- [[CRUD completo]]
  - Las 5 rutas de tasks funcionando con el frontend

- [[Convenciones de rutas REST]]
  - `/api/tasks` y `/api/tasks/:id`

- [[Validación manual de entrada]]
  - `!text || !text.trim()`
  - Devolver 400

- [[Contrato de API frontend backend]]
  - Nombres de campos deben coincidir (`text`)
  - El frontend lee la respuesta completa del POST

- [[Datos en memoria (arrays)]]
  - `let tasks = []` y `nextId`
  - Por qué `nextId` y no `tasks.length`

- [[Manipulación de arrays (find findIndex splice filter)]]
  - `findIndex` + `splice` para borrar
  - Diferencia entre `delete objeto.prop` y sacar del array

- [[Probar con curl]]
  - `curl -X POST -H ... -d ...`
  - Aislar si el bug es de backend o frontend

- [[Leer errores y stack traces]]
  - `Cannot access 'task' before initialization` (usar antes de declarar)
  - `Cannot set properties of undefined` (validar antes de usar)
  - Validar existencia antes de operar

- [[nodemon]]
  - devDependency `nodemon`

- [[Servir un frontend estático]]
  - Frontend en `public/`

- [[Consumir la API desde fetch]]
  - POST con `JSON.stringify({ text })`
  - Comprobación `res.ok`
  - UI optimista y estados de error

## Notas y errores aprendidos
- Errores aprendidos: usar variable antes de declararla, validar existencia antes de operar, orden `status().json()`, `task[id]` vs `task`, parámetros `(res, req)` invertidos, `delete` de propiedades vs `splice`.
