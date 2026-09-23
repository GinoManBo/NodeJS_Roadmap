---
tags:
  - visto
area: "04 Diseño de APIs REST"
estado: visto
modulos:
  - "M2 - Habits"
---
# Lógica de negocio (rachas y fechas)

**Estado:** 🟢 Visto  
**Área:** [[04 Diseño de APIs REST]]

Reglas propias del dominio, no solo guardar y leer.

## Vistos en

### [[M2 - Habits]]
- Modelo con array anidado `checkins`
- Fechas ISO `YYYY-MM-DD`
- Regla de racha: ayer suma, si no reinicia a 1
- `POST /api/habits/:id/checkin` completo y probado con curl
- Separar lógica (`comparison`, `ItWasYesterday`) de la respuesta HTTP (`res` como parámetro explícito)
- Bug: mutar un `Date` con `.setDate()` DESPUÉS de convertirlo a string ya no funciona — un string no tiene métodos de Date
- Bug: `if (valor)` matchea cualquier truthy (2 también), no sustituye a `=== true`

## Qué aprender
- Falta `DELETE /api/habits/:id/checkin` (deshacer) y `DELETE /api/habits/:id`
- Sacar el bloque `best` duplicado a un solo lugar
