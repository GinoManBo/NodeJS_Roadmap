---
tags:
  - visto
area: "03 Express"
estado: visto
modulos:
  - "M0 - Inicio (http y usuarios)"
  - "M1 - Tasks"
  - "M2 - Habits"
---
# Parámetros de ruta

**Estado:** 🟢 Visto  
**Área:** [[03 Express]]

Segmentos dinámicos de la URL (`:id`).

## Vistos en

### [[M0 - Inicio (http y usuarios)]]
- `/usuarios/:id`
- `Number(req.params.id)`

### [[M1 - Tasks]]
- `find` y `findIndex` con el id
- Error: `req.params` no existe en rutas sin `:id` (POST)

### [[M2 - Habits]]
- Mismo error repetido en POST /api/habits
