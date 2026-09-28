# Checklist E1 — estado y lo que falta

**Entrega: jueves 22 de octubre de 2026, 23:59.**
Última actualización: 2026-09-26 · quedan **25 días**.

---

## 🔴 Urgente — esta semana

| | Tarea | Por qué urge |
|---|---|---|
| ☐ | **Inscribir al grupo en la planilla de horarios** | El plazo era "hasta el jueves" y el anuncio es previo al 18-09, así que **probablemente venció el 24-09**. Escríbele a Francisco Maureira el lunes explicando la situación. No lo dejes pasar: sin bloque no hay revisiones, y las inasistencias cuestan 1,5 puntos individuales. |
| ☐ | **Enviar el formulario inicial** (dataset + idea del mensaje) | Hay **prioridad por orden de registro**: si otro grupo registra "ciclones tropicales / intensificación" antes, pierdes la idea y hay que cambiar de dataset a 25 días de la entrega. |
| ☐ | **Confirmar integrantes y número de grupo** | Van en la portada del documento. Si el grupo tiene más gente, **todos deben commitear en el repo**: un historial con un solo autor en un trabajo grupal se nota. |

> El bloque de horario se elige **una sola vez** y se mantiene todo el semestre
> (mismo día, hora y trío de ayudantes) para las tres revisiones.

---

## ✅ Lo que ya está

| Ítem | Estado |
|---|---|
| V1 funcionando, publicada en GitHub Pages | ✅ https://m4rkvr.github.io/iic2026-e1/ |
| Repositorio público con historial | ✅ https://github.com/m4rkvr/iic2026-e1 |
| Tag `v1` verificable | ✅ |
| Versión navegable congelada | ✅ `/versions/v1/` |
| Dataset procesado y documentado | ✅ IBTrACS v04r01, 4.827 ciclones 1980–2026 |
| Mensaje principal definido | ✅ el total plano frente al extremo que crece |
| Sonificación multidimensional | ✅ tono + ritmo + timbre (no solo volumen) |
| Interacción más allá del Plotly por defecto | ✅ cross-filtering, teclado, estado compartido |
| Sin ejes truncados / dobles ejes / 3D | ✅ |
| No se apoya solo en barras | ✅ y está justificado |
| Bitácora de decisiones iniciada | ✅ `docs/decisiones.md`, 9 entradas |
| Plantilla del documento | ✅ `docs/entrega-e1.md` |
| Protocolo de thinking aloud | ✅ `docs/hoja-observador.md` |

**Esto cubre bien el 15 % de "implementación final" y el punto de partida del
25 % de proceso iterativo. El resto — el 85 % — es trabajo de las próximas
semanas, y casi nada de él es código.**

---

## ❌ Lo que falta, por peso en la nota

### Proceso iterativo documentado — 25 %
- ☐ **V2** (tras R1) — commit + tag `v2` + `bash scripts/freeze.sh v2`
- ☐ **V3** (tras R2 + usuarios) — commit + tag `v3` + freeze
- ☐ **V4** (tras R3) — commit + tag `v4` + freeze
- ☐ Capturas de pantalla de cada versión
- ☐ Video corto por versión mostrando interacción **y sonificación**

> "Cuatro versiones creadas con cuatro commits la noche anterior a la entrega no
> son un proceso: son una escenografía, y se penalizará fuertemente."
> **Commitea seguido, con fechas reales.** Ya tienes historial desde el 26-09.

### Rationale de la evolución — 25 %
- ☐ Por cada versión: qué cambió (≤8 líneas), por qué (≤12), qué se descartó (≤5)
- ☐ Cada justificación anclada en: principio del curso · discusión de revisión · feedback de usuarios · evidencia en los datos
- ☐ Escribir en `docs/decisiones.md` **el día que se decide**, no al final

> "Porque se veía mejor" no es un rationale válido.

### Revisiones R1, R2, R3 — 15 %
- ☐ **R1** (docente) — llegar con la V1 corriendo + 2–3 preguntas de diseño concretas
- ☐ **R2** (entre pares, presencial y supervisada)
- ☐ **R3** (docente) — última antes de la V4
- ☐ Registrar en el documento: qué dijeron, qué adoptamos, **qué descartamos y por qué**

> Iterar no es obedecer. Descartar una sugerencia con argumentos puntúa;
> aceptarlas todas sin criterio, no.

### Implementación final — 15 %
- ✅ Funciona en GitHub Pages
- ✅ Coherencia entre mensaje y forma
- ☐ Que siga siendo cierto en la V4 (revisar al final, no asumir)

### Feedback al otro grupo — 10 %
- ☐ El proyecto evaluado (≤5 líneas)
- ☐ El feedback dado (≤12 líneas), **específico y anclado en principios**
- ☐ Lo que nos llevamos (≤5 líneas)

> Se evalúa la **calidad de lo que das**, no solo lo que recibes. Prepara la R2
> como evaluador: llega habiendo mirado el proyecto del otro grupo.

### Evaluación con usuarios — 10 %
- ☐ **Al menos una ronda** de thinking aloud (idealmente dos: V2→V3 y V3→V4)
- ☐ Conseguir a alguien **externo al grupo** y agendarlo (no improvisar)
- ☐ Bitácora de 3 columnas: tiempo · **cita literal** · acciones
- ☐ Preguntarle explícitamente qué cree que codifica el sonido
- ☐ Marcar qué heurísticas de Zuk–Carpendale fallaron
- ☐ Las 3 preguntas de cierre
- ☐ Que el hallazgo **se vea reflejado** en la versión siguiente

---

## ⚠️ Modificador individual — puede hacerte reprobar

> "La nota es grupal; tu comprensión, individual… la nota grupal recibe un
> modificador individual: puede subir si demuestras dominio, y puede bajar
> significativamente — **hasta ser reprobatorio** — si no demuestras un mínimo
> de competencia sobre tu propio proyecto."

Se evalúa en **R1 y R3**, mediante las notas de observación de los ayudantes y
la autoevaluación. En la sala están el profesor **y un trío de 3 ayudantes**, y
**le preguntan a cada integrante**. La revisión es rápida: no hay tiempo para
pensar las respuestas ahí.

### Penalizaciones de asistencia
| Situación | Costo |
|---|---|
| No llegar al horario asignado | **−1,0** individual |
| Inasistencia injustificada | **−1,5** individual |
| Faltar a 2 revisiones de una misma entrega | **máximo 4,0** individual |

### Preguntas que todos deben poder responder sin dudar

Este proyecto se construyó con asistencia de IA, y la pauta dice explícitamente
que "la parte difícil ya no es mérito". Justamente por eso el dominio individual
es lo que se evalúa. Cada integrante debería poder explicar:

1. **¿Cuál es el mensaje y por qué ese y no otro?** — El conteo por temporada
   oscila entre 87 y 118 sin tendencia; la proporción de cat. 4–5 pasa de 10,1 %
   en los 80 a 19,7 % en los 2010. El titular original decía "los ciclones más
   fuertes se están volviendo más fuertes" y se cambió porque la serie se
   estanca después de los 90.
2. **¿Por qué la distribución no es un gráfico de barras?** — Porque la mediana
   del viento **no se mueve** (55 · 60 · 55 · 60 · 55 kt por década) mientras el
   percentil 90 sube de 114 a 130 kt. Lo que crece es la cola derecha, y una
   barra con el promedio la borra.
3. **¿Por qué el eje Y parte en 0?** — La serie se mueve entre 10 % y 20 %:
   truncada se vería mucho más dramática. Es el error que la pauta nombra.
4. **¿Qué codifica el sonido, exactamente?** — Tendencia: tono ← % cat. 4–5,
   ritmo ← nº de ciclones, timbre ← cuenca. Trayectoria: tono ← viento, densidad
   rítmica ← intensificación, filtro ← distancia a tierra.
5. **¿Por qué la escala pentatónica?** — Un mapeo continuo de frecuencia produce
   microtonos y el oído pierde el contorno, que es la información a transmitir.
6. **¿Por qué los puntos de la década en curso están vacíos?** — Tiene 7 de 10
   temporadas: cae por falta de datos, no por el fenómeno. Por eso también queda
   fuera del cálculo de la pendiente.
7. **¿Qué filtraste de los datos y por qué?** — Ramas `spur`, horas sinópticas
   (desde ~2010 se interpola a 3 h y sesgaría hacia el presente), viento
   `USA_WIND` con respaldo `WMO_WIND`.
8. **Los dos errores que encontramos procesando** — `pandas` lee la cuenca `"NA"`
   (Atlántico Norte) como valor ausente; y filtrar por `TRACK_TYPE == "main"`
   borraba 2025–2026 completas porque llegan marcadas `PROVISIONAL`.
9. **¿Qué descartaron y por qué?** — Ver `docs/decisiones.md` § descartes.

---

## 📄 Entregable final

- ☐ PDF con la **estructura exacta** de las 11 secciones (`docs/entrega-e1.md`)
- ☐ Portada: número de grupo, integrantes, **3 enlaces**
  - ✅ GitHub Pages: https://m4rkvr.github.io/iic2026-e1/
  - ✅ Repositorio: https://github.com/m4rkvr/iic2026-e1
  - ☐ **Video** (YouTube u otra plataforma pública): grabación de pantalla **con audio**, mostrando interacción y sonificación
- ☐ Respetar los límites de líneas (exceder no suma)
- ☐ Subir **solo por el formulario de Google**

> Enviarla por correo, por mensaje o como enlace suelto **descuenta un punto**.
> Atraso: **−0,5 por día o fracción**, acumulable. Pasados 4 días, nota 1,0.

---

## 🗓 Ruta sugerida (25 días)

| Semana | Foco |
|---|---|
| **27 sep – 3 oct** | Inscripción al bloque + formulario inicial. Preparar R1: 2–3 preguntas de diseño. Repartir entre los integrantes quién domina qué parte. |
| **4 – 10 oct** | **R1** → V2. Agendar al usuario externo para el thinking aloud. |
| **11 – 17 oct** | **R2** (llegar preparado como evaluador) + evaluación con usuarios → V3. |
| **18 – 21 oct** | **R3** → V4. Grabar el video. Redactar el PDF. |
| **22 oct** | Subir por el formulario **temprano**. No a las 23:58. |

---

## Preguntas sugeridas para R1

Son las dudas reales que quedaron abiertas en la V1:

1. En el mapa, 2.208 trayectorias superpuestas hacen ilegible la rampa de
   intensidad. ¿Conviene facetar por cuenca, o filtrar por defecto a una década?
2. La sonificación de la tendencia recorre 5 décadas en ~4 segundos. ¿Alcanza
   para que alguien reconozca el contorno ascendente, o hay que repetirlo?
3. El marcador vacío para la década incompleta, ¿comunica lo que queremos, o
   hace falta algo más explícito?
