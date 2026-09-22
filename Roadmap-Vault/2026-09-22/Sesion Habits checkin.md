---
tags:
  - sesion
  - M2-Habits
---
# Sesión 2026-09-22 — Habits: lógica de check-in

Contexto: trabajando en `Habits/app.js`, endpoint `POST /api/habits/:id/checkin`. Objetivo: calcular racha (`streak`) comparando `lastCheckIn` con la fecha de hoy, y actualizar `checkins`.

## Resumen del roadmap al iniciar
- 26 vistos, 1 en progreso, 56 pendientes de 83 nodos (~32%).
- Módulo activo: [[M2 - Habits]], nodo en progreso: [[Lógica de negocio (rachas y fechas)]].

## Intento 1 (función `comparison(iso, habit)`)
Comparaba fechas cortando substrings del string ISO a mano para detectar cambio de año/mes. Problemas:
- `res` fuera de scope (no era un handler de Express).
- Shadowing del parámetro `iso`.
- Sintaxis incompleta (`Number(today.)`).
- Comparar substrings de 3 caracteres no representa años completos.

## Intento 2 (función `comparison(habit)`, sin `iso`)
Simplificó la firma pero mantuvo el problema raíz:
- `new Date().substring(0,10)` — error, `Date` no tiene `.substring` (falta `.toISOString()`).
- `lastcheck` quedó como variable no definida (estaba comentada, no asignada).
- `res` seguía sin pasarse a la función.
- **Bug de fondo, repetido de la sesión anterior en otra máquina**: restar strings de fecha (`today - lastcheck`) da `NaN`, nunca funciona. Hay que convertir a `Date`/timestamp antes de restar (o usar una librería de fechas tipo `date-fns`), así el cambio de año/mes se resuelve solo sin verificación manual.
- Faltaba rama `else` para racha rota o check-in duplicado (request se queda sin respuesta).
- `habit.streak` y `habit.best` nunca se actualizaban en ninguna rama.

## Recomendación pendiente de aplicar
Reescribir `comparison` así, a alto nivel:
1. Normalizar `today` y `habit.lastCheckIn` a objetos `Date` (o `date-fns`).
2. Si `lastCheckIn` es `null` → primer check-in: `streak = 1`, actualizar `checkins`, `lastCheckIn`, `best` si corresponde.
3. Si la diferencia en días es `0` → ya hizo check-in hoy, no duplicar.
4. Si la diferencia es `1` → racha consecutiva: `streak++`, actualizar `best` si supera el máximo.
5. Si la diferencia es `>1` → racha rota: `streak = 1` (o 0, a definir), actualizar `lastCheckIn`/`checkins`.
6. Pasar `res` como parámetro de la función o mover la lógica dentro del handler y que `comparison` solo devuelva el objeto actualizado.

## Próximo paso
Usuario va a reintentar la implementación con este enfoque; pendiente revisión de la siguiente versión.
