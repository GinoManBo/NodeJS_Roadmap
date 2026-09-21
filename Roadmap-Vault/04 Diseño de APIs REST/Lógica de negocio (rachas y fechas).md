---
tags:
  - en-progreso
area: "04 Diseño de APIs REST"
estado: en-progreso
modulos:
  - "M2 - Habits"
---
# Lógica de negocio (rachas y fechas)

**Estado:** 🟡 En progreso  
**Área:** [[04 Diseño de APIs REST]]

Reglas propias del dominio, no solo guardar y leer.

## Vistos en

### [[M2 - Habits]]
- Modelo con array anidado `checkins`
- Fechas ISO `YYYY-MM-DD`
- Diseñada la regla de racha: ayer suma, si no reinicia

## Qué falta
- Falta implementar `POST /checkin` y `DELETE /checkin`
- Comparar fechas como strings
- Recalcular racha al deshacer
