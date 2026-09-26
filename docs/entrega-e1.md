# Entrega 1 — Visualización de información interactiva y sonificada

> **Plantilla de trabajo.** Sigue la estructura exacta que pide la pauta
> ([e1.html](https://infovis.alessiobellino.com/e1.html)), en el orden exacto.
> Los límites de líneas son los de la pauta y se respetan: exceder no suma.
> Se entrega como **PDF**, por el **formulario de Google** del curso — ninguna
> otra vía es válida, y enviarla por correo o como enlace suelto descuenta un punto.
>
> **Fecha límite: jueves 22 de octubre de 2026, 23:59.**
> Descuento de 0,5 por cada día o fracción de atraso; pasados 4 días, nota 1,0.

---

## 1. Portada

| | |
|---|---|
| **Grupo** | _(número)_ |
| **Integrantes** | _(nombres completos)_ |
| **GitHub Pages** | `https://<usuario>.github.io/<repo>/` |
| **Repositorio** | `https://github.com/<usuario>/<repo>` |
| **Video** | _(YouTube u otra plataforma pública, pantalla + audio)_ |

---

## 2. Contexto general

### Mensaje principal _(máx. 10 líneas)_

Desde 1980 el mundo registra alrededor de 100 ciclones tropicales por temporada
y esa cifra casi no se mueve. Lo que cambió es la composición: en los años 80
uno de cada diez alcanzaba categoría 4 o 5; desde los 90 son cerca de uno de
cada cinco. La visualización sostiene ese contraste —el total plano frente al
extremo que crece— y deja explorar dónde ocurre, en qué cuenca y con qué
trayectoria. Dos reservas se muestran en la propia página en vez de esconderse:
parte del salto de los 80 a los 90 refleja mejores satélites y no solo ciclones
más fuertes, y la década en curso aparece más baja porque está incompleta.

### Origen y procesamiento de los datos _(máx. 8 líneas)_

IBTrACS v04r01 (NOAA NCEI, DOI 10.25921/82ty-9e16), archivo
`ibtracs.since1980.list.v04r01.csv` (144 MB), procesado por
`scripts/preprocess.py`. Se descartan las ramas secundarias (`TRACK_TYPE` con
`spur`) y se conservan solo las horas sinópticas 00/06/12/18 UTC, porque desde
~2010 algunas agencias interpolan a 3 h y sin ese filtro las temporadas
recientes aportarían el doble de puntos. El viento es `USA_WIND` con respaldo
`WMO_WIND`. De 309.724 registros quedan 141.945, agregados a 4.827 ciclones
(774 en categoría 4–5) y 2.208 trayectorias de ≥ 64 kt, en 4 JSON de ~3,3 MB.

> **Nota de implementación que vale la pena registrar:** `pandas` interpreta el
> código de cuenca `"NA"` (Atlántico Norte) como valor ausente. Sin
> `keep_default_na=False` se pierde toda esa cuenca en silencio.

---

## 3. V1 — la idea completa

| Campo | Contenido |
|---|---|
| **Versión** | V1 |
| **Fecha** | _(YYYY-MM-DD)_ |
| **Commit / tag** | `v1` → _(hash corto)_ |

**Evidencia visual y sonora:** _(capturas + enlace al video corto mostrando la
interacción y la sonificación)_

### Qué cambió _(máx. 8 líneas)_

Punto de partida. Se implementan los tres niveles de Shneiderman (vista general
→ filtrado → detalle bajo demanda) con cross-filtering entre los tres gráficos,
la sonificación en sus dos modos, navegación por teclado, vista de tabla, tema
claro/oscuro y el pipeline de datos reproducible.

### Por qué _(máx. 12 líneas)_

_(A completar tras R1. Para la V1 la justificación es de forma, no de cambio:
ver `docs/decisiones.md`, que ya registra por qué la distribución no es un
gráfico de barras, por qué el eje parte en 0, por qué el mapa agrupa por tramos
ordinales en vez de colorear punto a punto, y por qué la sonificación cuantiza
a una escala pentatónica.)_

### Qué se descartó _(máx. 5 líneas)_

_(Ver `docs/decisiones.md` § descartes.)_

---

## 4. R1 — revisión con el equipo docente

- **Fecha:** _(…)_
- **Estado presentado:** _(qué versión se mostró funcionando)_
- **Preguntas de diseño que llevamos** _(2–3 concretas)_:
  1. _(…)_
  2. _(…)_
- **Qué dijo el equipo docente:** _(…)_
- **Qué adoptamos y por qué:** _(…)_
- **Qué descartamos y por qué:** _(iterar no es obedecer — cada sugerencia se
  adopta o se descarta con argumentos)_

---

## 5. V2 — primera iteración

_(Mismos campos que la V1: versión · fecha · commit/tag · evidencia ·
qué cambió ≤8 · por qué ≤12 · qué se descartó ≤5)_

---

## 6. R2 — revisión entre pares

- **Fecha:** _(…)_
- **Grupo con el que trabajamos:** _(…)_
- **Preguntas que llevamos:** _(…)_
- **Feedback que recibimos:** _(…)_
- **Qué adoptamos / descartamos y por qué:** _(…)_

---

## 7. V3 — segunda iteración

_(Mismos campos.)_

---

## 8. R3 — revisión con el equipo docente

_(Mismos campos que R1.)_

---

## 9. V4 — versión final

_(Mismos campos.)_

---

## 10. Feedback al otro grupo

> La calidad del feedback que damos —especificidad, anclaje en los principios
> del curso, tono constructivo— es parte de la nota (10 %).

### El proyecto evaluado _(máx. 5 líneas)_

_(Identificación del grupo, su mensaje, el estado en que lo observamos.)_

### Feedback dado _(máx. 12 líneas)_

_(Observaciones específicas, ancladas en principios del curso. No "se ve raro"
sino "con 12 categorías la comparación de ángulos es imprecisa: percepción de
posición > ángulo".)_

### Lo que nos llevamos _(máx. 5 líneas)_

_(Errores que reconocimos en nuestro propio proyecto al mirar el ajeno, ideas
que adaptamos, decisiones que nos confirmó.)_

---

## 11. Evaluación con usuarios (thinking aloud)

> Mínimo una ronda; idealmente dos (entre V2–V3 y entre V3–V4).
> El protocolo completo y la hoja en blanco están en
> [`hoja-observador.md`](hoja-observador.md).

### Ronda 1

- **Fecha · duración · perfil del pensador:** _(persona externa al grupo)_
- **Bitácora:** _(tabla de tres columnas — tiempo · cita literal · acciones)_
- **Heurísticas de Zuk–Carpendale que fallaron:** _(…)_
- **Las tres preguntas de cierre:**
  1. ¿Dónde se atascó más tiempo? _(…)_
  2. ¿Qué hipótesis fue equivocada? _(…)_
  3. ¿Qué cambio concreto sale de esta sesión? _(…)_
- **Efecto en el proceso:** _(qué versión recogió este hallazgo y cómo)_

### Ronda 2 _(opcional pero recomendada)_

_(Misma estructura.)_

---

## Checklist previo a la entrega

Copiada de la pauta. Todo marcado antes de exportar el PDF.

- [ ] El ciclo de diseño es visible en las versiones
- [ ] Los tipos de visualización son adecuados para la pregunta
- [ ] No hay errores comunes sin justificar (ejes truncados, dobles ejes, 3D)
- [ ] Se aplican principios de jerarquía, resalte y tipografía
- [ ] Hay coherencia entre el mensaje y la forma
- [ ] La interacción es coherente con Shneiderman, o se justifica la alternativa
- [ ] La sonificación es multidimensional (más allá del volumen)
- [ ] La visualización no se basa únicamente en barras, o se justifica
- [ ] El resultado está alineado y ordenado en la página
- [ ] Asistimos a las revisiones con la versión funcionando y preguntas concretas
- [ ] El feedback al otro grupo fue específico y anclado en principios
- [ ] Cada versión tiene commit/tag y evidencia visual y sonora
- [ ] Los tres enlaces de la portada funcionan (Pages, repo, video)
- [ ] El PDF se sube **por el formulario**, con tiempo de sobra
