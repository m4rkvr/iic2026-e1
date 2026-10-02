# Checklist E1 — estado y lo que falta

**Entrega: jueves 22 de octubre de 2026, 23:59.**
Última actualización: 2026-10-02 · quedan **20 días**.

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

La raíz del sitio quedó **en construcción** el 02-10: la página se rehace en
grupo a partir de la base de datos (ver
[decisiones](decisiones.md#la-página-se-rehace-en-grupo-y-la-raíz-queda-en-construcción)).
Por eso esta tabla separa lo que es de la **V1 congelada** de lo que es de la
**base de datos**, que son dos entregables distintos.

| Ítem | Estado |
|---|---|
| Repositorio público con historial | ✅ https://github.com/m4rkvr/iic2026-e1 |
| Base de datos publicada y documentada | ✅ IBTrACS v04r01, ventana **2000–2026**: 2.741 ciclones, 78.786 observaciones · `data/README.md` + `data/PROMPT.md` |
| Datos en CSV y JSON, cargables por URL | ✅ `data/csv/` · `Access-Control-Allow-Origin: *` |
| Datos verificables sin confiar en nadie | ✅ `verificar_dataset.py` (sha256) · `verificar_cifras.py` |
| CI que verifica y regenera los datos | ✅ `.github/workflows/datos.yml` |
| Tag `v1` verificable | ✅ |
| V1 navegable congelada | ✅ `/versions/v1/` ([en vivo](https://m4rkvr.github.io/iic2026-e1/versions/v1/)) |
| Sonificación multidimensional | ✅ **en la V1** · tono + ritmo + timbre. Por rehacer |
| Interacción más allá del Plotly por defecto | ✅ **en la V1** · cross-filtering, teclado, estado compartido. Por rehacer |
| Sin ejes truncados / dobles ejes / 3D | ✅ **en la V1** |
| No se apoya solo en barras | ✅ **en la V1**, y está justificado |
| Mensaje principal | 🔴 **el de la V1 ya no se sostiene**: con la ventana 2000–2026 no hay tendencia detectable en la proporción de cat. 4–5 (+0,6 pp/década, EE 1,5). Hay que redefinirlo en grupo sobre el dato nuevo |
| Bitácora de decisiones | ✅ `docs/decisiones.md`, 16 entradas (3 son errores propios documentados) |
| Plantilla del documento | ✅ `docs/entrega-e1.md` |
| Protocolo de thinking aloud | ✅ `docs/hoja-observador.md` |

**Ojo con lo que esto implica para la nota.** El 25 % de proceso iterativo tiene
su punto de partida cubierto y fechado, y la base de datos está terminada. Pero
el 15 % de "implementación final" **ya no está cubierto por la raíz del sitio**:
depende de la página que el grupo construya en los próximos 20 días. La V1 es la
red de seguridad —existe, funciona y está fechada—, no el entregable final.

---

## ❌ Lo que falta, por peso en la nota

### Proceso iterativo documentado — 25 %
- ☐ **V2** (tras R1) — commit + tag `v2` + `bash scripts/freeze.sh v2`.
  Es la página nueva construida en grupo sobre `data/`, no un retoque de la V1
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
- ☐ **R1** (docente) — llegar con la V1 corriendo + 2–3 preguntas de diseño concretas.
  **Ojo:** la V1 ya no está en la raíz. Abre
  `https://m4rkvr.github.io/iic2026-e1/versions/v1/` antes de entrar — la raíz
  dice «página en construcción»
- ☐ **R2** (entre pares, presencial y supervisada)
- ☐ **R3** (docente) — última antes de la V4
- ☐ Registrar en el documento: qué dijeron, qué adoptamos, **qué descartamos y por qué**

> Iterar no es obedecer. Descartar una sugerencia con argumentos puntúa;
> aceptarlas todas sin criterio, no.

### Implementación final — 15 %
- ☐ **Construir la página nueva** sobre `data/` — la raíz está en construcción
  desde el 02-10 y esta parte de la nota depende de ella
- ☐ Que funcione en GitHub Pages (la V1 ya lo hace, desde `/versions/v1/`)
- ☐ Coherencia entre mensaje y forma — con el mensaje que el grupo redefina
- ☐ Que siga siendo cierto en la V4 (revisar al final, no asumir)
- ☐ No perder lo que la V1 ya tenía: sonificación multidimensional, interacción
  más allá del Plotly por defecto, nada de ejes truncados ni 3D. Si la V2 pierde
  algo de eso, es una **regresión** y hay que justificarla en la bitácora

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

1. **¿Cuál es el mensaje y por qué ese y no otro?** — **Pregunta abierta: hay
   que llegar a R1 con una respuesta del grupo.** Lo que se puede decir hoy: el
   conteo por temporada oscila entre 87 y 118 sin tendencia (pendiente +2,3 por
   década, EE 2,4). La proporción de cat. 4–5 **no** tiene tendencia detectable
   en la ventana publicada (2000–2024: +0,6 pp/década, EE 1,5, t = 0,39), y la
   variación interanual —10,1 % en 2022 contra 29,4 % en 2015— es nueve veces la
   pendiente por década. La V1 afirmaba un aumento apoyándose en el salto de los
   80 (10,1 %) a los 90 (17,2 %), que es justo donde cambió la observación
   satelital: por eso la ventana se recortó a 2000 y el mensaje volvió a estar
   abierto.
2. **¿Por qué la distribución no es un gráfico de barras?** — Porque la mediana
   del viento **no se mueve** (55 · 60 · 55 kt en 2000s · 2010s · 2020s) y el
   p90 tampoco mucho (125 · 130 · 125 kt): lo que hay es dispersión, no un
   promedio que se corra. Una barra con el promedio borra justamente eso. _(En
   la ventana 1980–2026 de la V1 el p90 iba de 114 a 130 kt.)_
3. **¿Por qué el eje Y parte en 0?** — La serie se mueve entre 10 % y 20 %:
   truncada se vería mucho más dramática. Es el error que la pauta nombra.
4. **¿Qué codifica el sonido, exactamente?** — Tendencia: tono ← % cat. 4–5,
   ritmo ← nº de ciclones, timbre ← cuenca. Trayectoria: tono ← viento, densidad
   rítmica ← intensificación, filtro ← distancia a tierra.
5. **¿Por qué la escala pentatónica y no frecuencia continua?** — Un mapeo
   continuo de frecuencia produce microtonos y el oído pierde el contorno, que
   es la información a transmitir.
6. **¿Por qué los puntos de la década en curso están vacíos?** — Tiene 7 de 10
   temporadas: cae por falta de datos, no por el fenómeno. Por eso también queda
   fuera del cálculo de la pendiente.
7. **¿Por qué el mapa agrupa por tramos en vez de colorear punto a punto?** —
   Colorear punto a punto exigía 87.295 marcadores SVG y cuelga el navegador; y
   los tramos de Saffir-Simpson son categorías *ordenadas*, así que una rampa
   ordinal de un solo tono las codifica mejor que un gradiente continuo.
8. **¿Qué filtraron de los datos y por qué?** — Ramas `spur` (duplican el mismo
   evento), solo horas sinópticas (las filas de las 03/09/15/21 h son
   interpolación de IBTrACS, no reportes: el 99,9 % cae a ≤ 2,5 kt del promedio
   de sus vecinos), **temporadas 2000+** (desde ahí la cobertura satelital es
   homogénea en las siete cuencas) y viento `USA_WIND` con respaldo `WMO_WIND`.
   De 309.724 registros quedan 78.786, en 2.741 ciclones.
9. **¿Qué errores encontraron procesando los datos?** — Tres. `pandas` lee la
   cuenca `"NA"` (Atlántico Norte) como valor ausente; filtrar por
   `TRACK_TYPE == "main"` borraba 2025–2026 completas porque llegan marcadas
   `PROVISIONAL`; y el filtro de horas estaba **bien justificado al revés** —
   decíamos que evitaba un sesgo hacia el presente, y las filas interpoladas son
   ~50 % en todas las décadas. Los tres están en la bitácora, con el comando que
   los reproduce.
10. **¿Qué descartaron y por qué?** — Ver `docs/decisiones.md` § descartes.
11. **¿Qué suena exactamente al reproducir la tendencia?** — C3 – C5 – C5 – A5 –
    A4, una nota cada 800 ms. La última baja porque la década está incompleta:
    el sonido no tiene el equivalente del marcador vacío. Es una limitación
    conocida, registrada en la bitácora, y una de las preguntas que llevamos a R1.

> Cada una de estas preguntas tiene su entrada en `docs/decisiones.md`; la tabla
> del inicio de esa bitácora lleva de la pregunta a la entrada de un clic.

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

1. **La ventana.** Partir en 2000 da temporadas comparables pero deja el dato
   sin tendencia que mostrar; partir en 1980 recupera el contraste 10 % → 17 %
   pero el salto cae donde cambió la observación satelital. ¿Cuál de los dos
   problemas es el aceptable en una visualización de divulgación?
2. En el mapa, 1.230 trayectorias superpuestas hacen ilegible la rampa de
   intensidad. ¿Conviene facetar por cuenca, o filtrar por defecto a una década?
3. La sonificación de la tendencia recorre las décadas en ~4 segundos. ¿Alcanza
   para que alguien reconozca el contorno ascendente, o hay que repetirlo?
4. El marcador vacío para la década incompleta, ¿comunica lo que queremos, o
   hace falta algo más explícito?
