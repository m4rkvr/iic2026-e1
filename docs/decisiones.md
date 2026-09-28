# Bitácora de decisiones de diseño

> Esta bitácora es la materia prima del 25 % de la nota que evalúa el
> *rationale*. Se escribe **cuando se decide**, no la noche del 22 de octubre:
> reconstruir una justificación a posteriori se nota, y la pauta lo penaliza.
>
> Formato de cada entrada: **qué se decidió · por qué · qué se descartó**.
> «Porque se veía mejor» no es un rationale válido.

---

## Qué pregunta responde cada entrada

Las revisiones preguntan por decisiones; esta tabla es el atajo entre una y otra.
Las preguntas son las de `docs/checklist-e1.md`.

| Pregunta | Entrada de esta bitácora |
|---|---|
| ¿Cuál es el mensaje y por qué ese y no otro? | [Mensaje: el total plano frente al extremo que crece](#mensaje-el-total-plano-frente-al-extremo-que-crece) · [Las dos reservas van en la bajada](#las-dos-reservas-van-en-la-bajada-no-en-una-nota-al-pie) |
| ¿Por qué la distribución no es un gráfico de barras? | [La distribución no es un gráfico de barras](#la-distribución-no-es-un-gráfico-de-barras) · [La cifra que sostenía «el promedio borra la cola» estaba mal](#la-cifra-que-sostenía-el-promedio-borra-la-cola-estaba-mal) |
| ¿Por qué el eje Y parte en 0? | [Eje Y desde 0 y un solo eje por gráfico](#eje-y-desde-0-y-un-solo-eje-por-gráfico) |
| ¿Qué codifica el sonido, exactamente? | [Tres parámetros sonoros, no volumen](#tres-parámetros-sonoros-no-volumen) · [La sonificación no distingue la década incompleta](#la-sonificación-no-distingue-la-década-incompleta-limitación-abierta) |
| ¿Por qué la escala pentatónica? | [Sonificación cuantizada a escala pentatónica](#sonificación-cuantizada-a-escala-pentatónica) |
| ¿Por qué los puntos de la década en curso están vacíos? | [Los grupos incompletos se marcan y se excluyen del ajuste](#los-grupos-incompletos-se-marcan-y-se-excluyen-del-ajuste) |
| ¿Por qué el mapa agrupa por tramos? | [El mapa agrupa por tramos, no colorea punto a punto](#el-mapa-agrupa-por-tramos-no-colorea-punto-a-punto) |
| ¿Qué filtraste de los datos y por qué? | [Los tres filtros del dataset, y qué sesgo evita cada uno](#los-tres-filtros-del-dataset-y-qué-sesgo-evita-cada-uno) |
| ¿Qué errores encontraron procesando? | [Dos errores que borraban datos en silencio](#dos-errores-que-borraban-datos-en-silencio) |
| ¿Qué descartaron y por qué? | [Descartes generales](#descartes-generales) y el campo **Descartado** de cada entrada |

---

## 2026-09-26 — V1

### Mensaje: el total plano frente al extremo que crece

**Decisión.** El titular no es "hay más ciclones" ni "los ciclones son más
fuertes", sino el contraste entre ambos: el número por temporada es estable y la
proporción que llega a categoría 4–5 no lo es.

**Por qué.** Es lo que los datos sostienen. El conteo por temporada oscila entre
87 y 118 sin tendencia; la proporción de cat. 4–5 pasa de 10,1 % en los 80 a
17,2 % en los 90 y 19,7 % en los 2010. Un titular más fuerte ("los ciclones se
están volviendo más fuertes") no aguanta el dato: la serie se estanca después de
los 90 y la mediana del viento apenas se mueve.

**Descartado.** Un primer titular decía "los ciclones más fuertes se están
volviendo más fuertes". Se cambió al ver la serie completa: describía una
aceleración continua que no existe.

---

### Las dos reservas van en la bajada, no en una nota al pie

**Decisión.** El salto de los 80 a los 90 se atribuye en parte a la mejora
satelital, y la caída de la década en curso a que está incompleta. Ambas cosas
se dicen en la bajada, arriba, antes del primer gráfico.

**Por qué.** Son las dos lecturas erróneas más probables de este gráfico. Si el
lector llega solo a la vista general —que es lo que la pauta pide que funcione
de forma independiente— tiene que llegar con las dos advertencias puestas.

**Descartado.** Recortar la serie a 1990–2019 para que la tendencia se viera
limpia. Es el error que la pauta llama "eje truncado" trasladado al eje temporal:
mejora el gráfico mintiendo.

---

### La distribución no es un gráfico de barras

**Decisión.** Un punto por ciclón, repartido en una banda por década, con caja de
cuartiles detrás.

**Por qué.** El mensaje vive en la cola derecha. Un promedio en barras la borra:
la mediana del viento máximo no se mueve —oscila entre 55 y 60 kt década a
década, sin tendencia— mientras el percentil 90 sube de 114 kt en los 80 a
130 kt en los 2010. Una barra por década mostraría «no pasa nada» justo donde
está el cambio. Lo que crece es el extremo, y solo se ve mostrando la
distribución completa. La pauta además penaliza apoyarse en barras sin
justificación.

**Descartado.** Un violín: suaviza la densidad y con vientos cuantizados en
escalones de 5 kt inventa una continuidad que el dato no tiene.

---

### Jitter determinista, no aleatorio

**Decisión.** La dispersión de los puntos sale de un hash del identificador del
ciclón, no de `Math.random()`.

**Por qué.** Con azar, cada filtro recoloca todos los puntos y el lector pierde
la referencia de dónde estaba mirando. El desplazamiento horizontal es de
±2,5 kt: reparte cada punto dentro de su propio escalón de 5 kt sin moverlo a
otro valor.

---

### El mapa agrupa por tramos, no colorea punto a punto

**Decisión.** Cuatro trazas de líneas, una por tramo de Saffir-Simpson, con
rampa ordinal de un solo tono. Los puntos cada 6 h se dibujan solo para la
trayectoria seleccionada.

**Por qué.** Colorear cada punto por su viento exigía 87.295 marcadores SVG en
un `scattergeo`, que cuelga el navegador. Además los tramos son categorías
ordenadas con significado propio, así que la rampa ordinal las codifica mejor
que un gradiente continuo. La rampa se validó en ambos temas.

**Descartado.** Submuestrear las trayectorias para bajar el número de puntos:
habría adelgazado las cuencas más activas justo donde la densidad es el dato.

---

### Sonificación cuantizada a escala pentatónica

**Decisión.** El tono se cuantiza a una pentatónica mayor de tres octavas en
lugar de mapear la frecuencia de forma continua.

**Por qué.** Un mapeo continuo produce microtonos y el oído pierde el contorno,
que es exactamente la información a transmitir. La pentatónica no tiene
semitonos vecinos, así que ninguna combinación suena disonante por accidente y
el ascenso se oye limpio.

**Además, el tono se normaliza contra el rango observado y no contra [0, 1]
absoluto:** si todas las décadas rondan 10–20 %, un rango fijo aplanaría la
melodía hasta volverla inaudible como tendencia.

---

### Tres parámetros sonoros, no volumen

**Decisión.** Tendencia: tono ← proporción cat. 4–5, ritmo ← número de ciclones,
timbre ← cuenca. Trayectoria: tono ← viento, densidad rítmica ← intensificación,
filtro ← distancia a tierra.

**Por qué.** La pauta exige parámetros efectivos y no solo volumen. El filtro que
se cierra al acercarse a tierra es el que más aporta: el landfall se *oye* antes
de leerse en el mapa.

---

### Eje Y desde 0 y un solo eje por gráfico

**Decisión.** `rangemode: 'tozero'` en la tendencia; ningún gráfico con doble eje;
nada en 3D.

**Por qué.** Los tres errores que la pauta nombra explícitamente. El eje truncado
es especialmente tentador aquí, porque la serie se mueve entre 10 % y 20 % y
recortada se vería mucho más dramática — que es justamente el problema.

---

### Los grupos incompletos se marcan y se excluyen del ajuste

**Decisión.** Una década con menos de 10 temporadas se dibuja con marcador vacío,
lleva asterisco en la etiqueta y queda fuera del cálculo de la pendiente.

**Por qué.** La década en curso siempre cae por falta de datos, no por el
fenómeno. Incluida en el ajuste, arrastra la recta hacia abajo y convierte un
artefacto de cobertura en una "tendencia".

---

## 2026-09-28 — preparación de R1

### La cifra que sostenía «el promedio borra la cola» estaba mal

**Decisión.** Se corrige el número que justificaba no usar barras. La bitácora
decía que la mediana del viento máximo caía de 60 kt (80s) a 55 kt (2020s), «en
dirección contraria al mensaje». Recalculado sobre `data/storms.json`, eso no es
lo que ocurre.

**Por qué.** Las medianas reales por década son 55 · 60 · 55 · 60 · 55 kt: la
mediana **no tiene tendencia**, no va en contra. El argumento sigue en pie, pero
se sostiene en otro dato: el percentil 90 sube de 114 kt (80s) a 125 · 125 ·
130 kt, y entre los ciclones que alcanzan fuerza de huracán (≥ 64 kt) la mediana
pasa de 90 a 100 kt. Es decir: el centro de la distribución está quieto y la
cola derecha se corre. Una barra con el promedio o la mediana por década
mostraría una serie plana justo donde está el cambio.

También se corrige el rango del conteo por temporada: **87–118** en las
temporadas completas (1980–2024). El 83 que figuraba era la temporada 2026, que
está en curso y no es comparable.

**Descartado.** Dejar la cifra anterior y explicarla en la revisión. Un número
que no resiste que alguien lo recalcule desde el repositorio no puede ser la
justificación de una decisión de diseño.

---

### Los tres filtros del dataset, y qué sesgo evita cada uno

**Decisión.** Del CSV de IBTrACS se descartan las ramas secundarias
(`TRACK_TYPE` que contiene `spur`), se conservan solo las horas sinópticas
00/06/12/18 UTC, y el viento es `USA_WIND` con respaldo `WMO_WIND`.

**Por qué.** Cada filtro corrige un sesgo distinto, y el segundo es el que más
importa para este mensaje:

- Las ramas `spur` son trayectorias alternativas de la **misma** tormenta. Sin
  descartarlas, un ciclón se contaría más de una vez.
- Desde ~2010 varias agencias reportan cada 3 h en vez de cada 6. Sin el filtro
  de horas sinópticas, las temporadas recientes aportan el doble de puntos y
  **todo conteo queda sesgado hacia el presente** — es decir, justo en la
  dirección del mensaje. Un sesgo que empuja hacia la conclusión que uno quiere
  sacar es el más peligroso de todos.
- `USA_WIND` cubre mucho más que `WMO_WIND`; se usa como fuente principal y el
  segundo solo como respaldo, asumiendo y documentando la mezcla de agencias.

De 309.724 registros quedan 141.945, que se agregan a 4.827 ciclones.
Implementado en `scripts/preprocess.py:107`, `:118` y `:125`.

**Descartado.** Conservar todos los registros y corregir el sesgo después: la
sobrerrepresentación no es uniforme entre cuencas ni entre décadas, así que no
hay un factor único que la deshaga. Y usar solo `WMO_WIND`, que deja fuera
demasiados ciclones.

**Responde a.** «¿Qué filtraste de los datos y por qué?»

---

### Dos errores que borraban datos en silencio

**Decisión.** El CSV se lee con `keep_default_na=False`, y las ramas se excluyen
en negativo (descartar lo que contiene `spur`) en vez de exigir
`TRACK_TYPE == "main"`.

**Por qué.** Los dos errores que motivaron estos cambios no fallaban: borraban.

- `pandas` interpreta el código de cuenca `"NA"` —Atlántico Norte— como valor
  ausente. Sin `keep_default_na=False` desaparece una cuenca entera sin
  excepción, sin advertencia y sin filas vacías que lo delaten.
- Filtrar por `TRACK_TYPE == "main"` borraba **2025 y 2026 completas**. Esas
  temporadas llegan marcadas `PROVISIONAL` / `US-PROVISIONAL` porque todavía no
  tienen reanálisis: son trayectorias primarias, no ramas secundarias. Por eso
  el filtro se escribe en negativo.

Lo que los hace comparables es que los dos **recortan el dato sin avisar**, y el
segundo recortaba justamente el extremo reciente de la serie, que es donde se
lee la tendencia. De ahí la regla que queda para el resto del proyecto: después
de cada filtro se comprueba cuántas filas quedaron y qué categorías
sobrevivieron, no solo que el script no se caiga.

**Descartado.** Confiar en el comportamiento por defecto de `pandas` para un
dataset con códigos de dos letras. `"NA"`, `"NaN"` y `"None"` son valores
legítimos en datos geográficos.

**Responde a.** «¿Qué errores encontraron procesando?»

---

### La sonificación no distingue la década incompleta (limitación abierta)

**Decisión.** Se deja registrada la limitación y se lleva a R1 como pregunta
abierta. No se corrige antes de la revisión.

**Por qué.** Con los datos actuales, «Escuchar la tendencia» toca
**C3 – C5 – C5 – A5 – A4**, una nota cada 800 ms. La última nota **baja**, y baja
porque la década en curso tiene 7 de 10 temporadas.

El gráfico trata ese grupo de forma distinta en tres lugares: marcador vacío,
asterisco en la etiqueta y exclusión del ajuste. El audio no hace nada de eso:
lo toca como una década cualquiera. Es decir, el canal sonoro está comunicando
un **artefacto de cobertura como si fuera el fenómeno**, y además en la
dirección contraria al mensaje — quien solo escuche se lleva «subió y después
bajó».

No se corrige ahora a propósito. Las tres salidas posibles —excluir la década
del audio, marcarla con otro timbre, o anunciarla— tienen costos distintos, y la
decisión se quiere tomar con la discusión de la revisión y no antes de ella.

**Descartado.** Silenciar la última nota: haría desaparecer una década que sí
existe. Y normalizar el tono contra el rango de las décadas completas: movería
todas las notas para arreglar solo la última.

**Responde a.** «¿Qué codifica el sonido?» y «¿Por qué los puntos de la década
en curso están vacíos?» — es el punto donde las dos preguntas se cruzan.

---

## Descartes generales

| Alternativa | Por qué se descartó |
|---|---|
| Gráfico de torta de ciclones por cuenca | 6 categorías con valores cercanos: comparación de ángulos imprecisa (posición > ángulo) |
| Mapa de calor lat/lon | Oculta la trayectoria, que es la unidad narrativa del dato |
| Animación automática al cargar | Movimiento no solicitado; además compite con la sonificación por la atención |
| Color por cuenca en los tres gráficos | 6-7 hues categóricos simultáneos; la cuenca funciona mejor como filtro que como color |
| Cargar el CSV de NOAA en vivo | 144 MB en el navegador, dependiente de CORS y de que NOAA no cambie la URL |

---

## Plantilla para las próximas entradas

```
## AAAA-MM-DD — V_

### <título de la decisión>

**Decisión.**

**Por qué.** _(anclado en: principios del curso · discusión de revisión ·
feedback de usuarios · evidencia en los datos)_

**Descartado.**
```
