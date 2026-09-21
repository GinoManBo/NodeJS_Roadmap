---
tags:
  - modulo
  - visto
fecha: "2026-09-07 a 2026-09-08"
---
# M0 - Inicio (http y usuarios)

**Estado:** 🟢 Visto  
**Fechas:** 2026-09-07 a 2026-09-08

Primeros pasos: servidor con `http` nativo y luego primera API con Express sobre `usuarios.json`.

## Archivos
- Tasks/server.js (http nativo)
- Tasks/app.js versión inicial
- Tasks/usuarios.json

## Temas abordados

- [[Qué es Node.js y runtime]]
  - Ejecutar archivos con `node archivo.js`
  - Servidor que queda escuchando en un puerto

- [[npm y package.json]]
  - Instalar express
  - package.json y package-lock.json

- [[Módulos CommonJS (require)]]
  - `require('express')`
  - `require('./usuarios.json')` carga JSON como objeto

- [[Módulo http nativo]]
  - `createServer((req, res) => ...)`
  - Enrutar comparando `req.url` con ifs
  - `res.write` y `res.end`
  - Bug típico: typo `res.wirte` rompe la ruta

- [[Setup de app y listen]]
  - `express()`
  - `app.listen(3000)`

- [[Routing básico]]
  - `app.get('/usuarios')`
  - Ruta raíz, ruta de saludo

- [[Parámetros de ruta]]
  - `/usuarios/:id`
  - `Number(req.params.id)`

- [[Respuestas res json send status end]]
  - Comentario `res.send() res.json() res.end()`

- [[Archivo JSON como fuente de datos]]
  - `usuarios.json` leído con require
  - Buscar con `.find`

- [[Manipulación de arrays (find findIndex splice filter)]]
  - `find` por id

- [[Leer errores y stack traces]]
  - Typo `res.wirte`

## Notas y errores aprendidos
- El script `start` apuntaba a server.js mientras se practicaba con app.js; se corrigió a app.js.
- Error aprendido: typo `res.wirte`.
