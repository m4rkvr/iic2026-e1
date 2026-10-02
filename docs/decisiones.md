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
| ¿Cuál es el mensaje y por qué ese y no otro? | [La ventana parte en 2000](#la-ventana-parte-en-2000-y-eso-le-quita-el-piso-al-mensaje-de-la-v1) ⚠️ · [Mensaje: el total plano frente al extremo que crece](#mensaje-el-total-plano-frente-al-extremo-que-crece) · [Las dos reservas van en la bajada](#las-dos-reservas-van-en-la-bajada-no-en-una-nota-al-pie) |
| ¿Por qué la distribución no es un gráfico de barras? | [La distribución no es un gráfico de barras](#la-distribución-no-es-un-gráfico-de-barras) · [La cifra que sostenía «el promedio borra la cola» estaba mal](#la-cifra-que-sostenía-el-promedio-borra-la-cola-estaba-mal) |
| ¿Por qué el eje Y parte en 0? | [Eje Y desde 0 y un solo eje por gráfico](#eje-y-desde-0-y-un-solo-eje-por-gráfico) |
| ¿Qué codifica el sonido, exactamente? | [Tres parámetros sonoros, no volumen](#tres-parámetros-sonoros-no-volumen) · [La sonificación no distingue la década incompleta](#la-sonificación-no-distingue-la-década-incompleta-limitación-abierta) |
| ¿Por qué la escala pentatónica? | [Sonificación cuantizada a escala pentatónica](#sonificación-cuantizada-a-escala-pentatónica) |
| ¿Por qué los puntos de la década en curso están vacíos? | [Los grupos incompletos se marcan y se excluyen del ajuste](#los-grupos-incompletos-se-marcan-y-se-excluyen-del-ajuste) |
| ¿Por qué el mapa agrupa por tramos? | [El mapa agrupa por tramos, no colorea punto a punto](#el-mapa-agrupa-por-tramos-no-colorea-punto-a-punto) |
| ¿Qué filtraste de los datos y por qué? | [Los tres filtros del dataset, y qué sesgo evita cada uno](#los-tres-filtros-del-dataset-y-qué-sesgo-evita-cada-uno) · [La base de datos se publica como dataset](#la-base-de-datos-se-publica-como-dataset-no-como-insumo-de-esta-página) · [La ventana parte en 2000](#la-ventana-parte-en-2000-y-eso-le-quita-el-piso-al-mensaje-de-la-v1) |
| ¿Qué errores encontraron procesando? | [Dos errores que borraban datos en silencio](#dos-errores-que-borraban-datos-en-silencio) · [El filtro de horas estaba bien, su justificación estaba mal](#el-filtro-de-horas-estaba-bien-su-justificación-estaba-mal) |
| ¿Qué descartaron y por qué? | [Descartes generales](#descartes-generales) y el campo **Descartado** de cada entrada · [La página se rehace en grupo](#la-página-se-rehace-en-grupo-y-la-raíz-queda-en-construcción) |
| ¿Qué suena exactamente al reproducir la tendencia? | [La sonificación no distingue la década incompleta](#la-sonificación-no-distingue-la-década-incompleta-limitación-abierta) |

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

**Por qué.** Cada filtro quita un tipo distinto de registro:

- Las ramas `spur` son trayectorias alternativas de la **misma** tormenta. Sin
  descartarlas, un ciclón se contaría más de una vez.
- Las filas de las 03/09/15/21 h son **interpolación de IBTrACS, no reportes de
  agencia**: conservarlas duplicaría cada reporte con un valor derivado de él.
  _(La primera versión de esta entrada justificaba el filtro con un sesgo hacia
  el presente que no existe; ver [El filtro de horas estaba bien, su
  justificación estaba mal](#el-filtro-de-horas-estaba-bien-su-justificación-estaba-mal).)_
- `USA_WIND` cubre mucho más que `WMO_WIND`; se usa como fuente principal y el
  segundo solo como respaldo, asumiendo y documentando la mezcla de agencias.

De 309.724 registros quedan 78.786, que se agregan a 2.741 ciclones. (Con la
ventana original 1980–2026 eran 141.945 y 4.827; ver [La ventana parte en
2000](#la-ventana-parte-en-2000-y-eso-le-quita-el-piso-al-mensaje-de-la-v1).)
Implementado en `scripts/load()` de `scripts/preprocess.py`.

**Descartado.** Conservar las filas interpoladas y ponderarlas a la mitad: no son
media observación, son cero observaciones; ponderarlas sería inventar una
precisión que el dato no tiene. Y usar solo `WMO_WIND`, que deja fuera demasiados
ciclones.

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

## 2026-10-02 — el repositorio pasa a ser la base de datos, y una corrección

### La base de datos se publica como dataset, no como insumo de esta página

**Decisión.** `data/` deja de ser «los archivos que la página lee» y pasa a ser
una distribución para terceros: las mismas tablas también en CSV
(`data/csv/`), un manual con el diccionario de columnas (`data/README.md`), un
inventario con `sha256` dentro de `meta.json`, y una GitHub Action que verifica
la copia en cada push y la regenera a pedido. Los JSON no cambiaron ni un byte.

**Por qué.** Los JSON estaban optimizados para esta visualización, no para
leerse: `tracks.json` es columnar (`{sid: {lat: [...], lon: [...]}}`) porque
pesa la mitad que un array de objetos, y `h` guarda horas desde el inicio en vez
de una marca de tiempo. Eso es correcto para la página y hostil para cualquiera
que llegue de afuera: ninguna herramienta —pandas, d3.csv, RAWGraphs, Sheets—
consume esa forma sin código intermedio. La tabla punto a punto completa
(141.945 observaciones) ni existía como archivo: estaba implícita dentro del
pipeline.

Publicar el CSV cuesta 11,6 MB en el repositorio —2,0 MB en tránsito, porque
Pages comprime— y elimina ese paso intermedio.

Lo más caro de reproducir no son los datos, son **las cinco trampas**: la cuenca
`NA` que `pandas` borra en silencio, las longitudes que pasan de 180 en los
ciclones que cruzan la antimeridiana, `sshs = -1` que es depresión tropical y no
un nulo, las temporadas provisionales que simulan una caída al final de la
serie, y `n_landfall_pts` que cuenta puntos cerca de la costa y no recaladas.
Dos de ellas ya nos habían costado datos borrados sin aviso (ver «Dos errores
que borraban datos en silencio»). Van documentadas con el número exacto de filas
que afecta cada una.

**Descartado.** Un CSV único y plano con todo junto: obliga a quien solo quiera
la tendencia por temporada a bajar 11,6 MB. Normalizar las longitudes a
−180…180 en el origen: arreglaría los histogramas pero rompería las líneas de
trayectoria, que es el uso principal; se documenta la conversión en una línea y
la decisión queda del lado de quien consume. Y la regeneración mensual
automática, que está escrita en el workflow pero comentada: un commit de bot al
mes ensucia el historial de una entrega evaluada por su proceso.

**Responde a.** «¿Qué filtraste de los datos y por qué?» — la misma pregunta de
antes, ahora con la lista completa en un archivo que cualquiera puede auditar.

---

### La página se rehace en grupo, y la raíz queda en construcción

**Decisión.** La raíz del sitio pasa a ser una página en blanco que dice
«página en construcción», sin CSS ni JS propios. La V1 completa —los tres
gráficos, el cross-filtering, la sonificación— queda congelada en
`versions/v1/` y en el tag `v1`. Lo único que el repositorio ofrece terminado es
la base de datos.

**Por qué.** Lo que cambia no es el dataset: es **de qué se discute primero**.

Con una página terminada en la raíz, el grupo hereda un mensaje ya elegido —«el
total es plano, el extremo crece»— y nueve decisiones de diseño ya tomadas
(pentatónica, jitter determinista, tramos en el mapa, eje desde 0). Cualquier
conversación arranca desde «¿cambiamos esto que ya está?», que es la peor
posición para decidir: discutir una implementación existente no es lo mismo que
discutir qué cuentan los datos. Dejar la página en blanco devuelve esa pregunta
al principio, donde corresponde, y con todo el grupo presente.

Hay una razón de pauta además de una de método. La entrega evalúa el **proceso
iterativo documentado** y pide que todos commiteen: un repositorio donde la
visualización ya está lista el primer día deja al resto del grupo sin un lugar
donde entrar que no sea retocar lo ajeno. La base de datos sí es un lugar donde
entrar —hay once columnas, 141.945 observaciones y cinco trampas documentadas, y
de ahí salen muchas visualizaciones distintas.

Y el reparto de esfuerzo es honesto: lo difícil de reproducir de la V1 no son
los tres gráficos, es el pipeline y las trampas que nos costaron datos borrados
en silencio. Eso se conserva entero y es lo que se comparte.

**Lo que no cambia.** Los filtros, el dataset y las decisiones ya tomadas siguen
registradas y verificables (`scripts/verificar_cifras.py`,
`scripts/verificar_dataset.py`). La V1 no se borra: la pauta acepta versiones
congeladas navegables, y sigue viva en `versions/v1/` como evidencia fechada.
Nada de lo discutido en R1 se pierde por rehacer la página.

**El riesgo que asumimos.** Que la próxima versión salga **peor** que la V1.
Rehacer no es iterar: si la V2 pierde la sonificación multidimensional o el
cross-filtering, es una regresión, y la bitácora va a tener que explicar por qué
se rehízo en vez de corregir. La V1 queda en `versions/v1/` justamente para que
la comparación sea posible y la respuesta no pueda ser evasiva.

**Descartado.** Borrar la V1 del repositorio: perdería la única evidencia fechada
del proceso, que es un 25 % de la nota. Trabajar la página nueva en una rama y
dejar la V1 en la raíz: Pages publica desde `main`, y sobre todo mantendría el
anclaje —el grupo seguiría viendo la página vieja como el punto de partida.
Construir la V2 encima del código de la V1: arrastra sus decisiones sin
discutirlas, que es exactamente lo que se quiere evitar.

**Responde a.** «¿Qué descartaron y por qué?» — y es el punto de partida del
rationale de la evolución V1 → V2.

---

### El filtro de horas estaba bien, su justificación estaba mal

**Decisión.** El filtro no se toca —se siguen conservando solo las horas
sinópticas— pero su justificación se reescribe en los cinco lugares donde
estaba: `README.md`, `data/README.md`, `docs/entrega-e1.md`, el comentario de
`scripts/preprocess.py` y la entrada de arriba. Y se agrega
`scripts/verificar_interpolacion.py`, que imprime la prueba.

**Por qué.** Lo que decía la bitácora: «desde ~2010 varias agencias reportan
cada 3 h en vez de cada 6; sin el filtro, las temporadas recientes aportan el
doble de puntos y todo conteo queda sesgado hacia el presente». Suena razonable
y es falso. Las filas de las 03/09/15/21 h están repartidas casi exactamente
igual en todas las décadas:

| década | filas | sinópticas | intermedias | % intermedias |
|---|---|---|---|---|
| 1980s | 66.479 | 33.508 | 32.971 | 49,6 % |
| 1990s | 74.847 | 37.195 | 37.652 | 50,3 % |
| 2000s | 62.593 | 31.378 | 31.215 | 49,9 % |
| 2010s | 62.521 | 31.601 | 30.920 | 49,5 % |
| 2020s | 42.140 | 21.300 | 20.840 | 49,5 % |

No hay nada reciente en ellas, así que no podían sesgar hacia el presente. El
error vino de leer el patrón de 3 h como un cambio en las prácticas de las
agencias, cuando es algo que hace IBTrACS con todo el registro.

La razón de verdad es mejor que la inventada: **esas filas no son
observaciones**. Dos pruebas, las dos sobre el CSV crudo:

- Las agencias reportan el viento en pasos de 5 kt. En hora sinóptica, el 98,8 %
  de los valores es múltiplo de 5; en las intermedias, solo el 58,8 %. Caen
  fuera de la rejilla en que se reporta.
- Comparando el viento de las 03 h con el promedio de las 00 y las 06 del mismo
  ciclón —124.408 comparaciones—, el 60,1 % coincide exactamente y el 99,9 % cae
  a ≤ 2,5 kt, con mediana de diferencia 0. Son el punto medio de sus vecinos.

Es decir: conservarlas no habría sesgado la serie hacia el presente, habría
duplicado cada reporte con un valor calculado a partir de él. Mismo filtro, otro
argumento — y un argumento que ahora se puede ejecutar en vez de creer.

**Lo que esto enseña del método.** El error sobrevivió a dos escrituras del
`README` y a una de la bitácora porque **era plausible y favorecía la
conclusión**: un sesgo hacia el presente, corregido por nosotros, hacía ver el
trabajo más cuidadoso. Las justificaciones que halagan a quien las escribe son
las que hay que verificar primero. La regla que queda: toda afirmación numérica
de la bitácora tiene que venir con el comando que la reproduce, como ya pasó con
la cifra del p90 en «[La cifra que sostenía «el promedio borra la cola» estaba
mal](#la-cifra-que-sostenía-el-promedio-borra-la-cola-estaba-mal)». Van dos.

**Descartado.** Corregir la frase en silencio: el error estaba commiteado y
fechado, y la pauta evalúa el proceso, no la apariencia de no haberse
equivocado. Y aprovechar el hallazgo para **quitar** el filtro y quedarse con
las 272.715 filas: duplicaría el peso de los CSV con valores interpolados y
haría que cualquier conteo por observación contara dos veces cada reporte.

**Responde a.** «¿Qué errores encontraron procesando?» — es el tercero, y el
único que no borraba datos sino que justificaba mal una decisión correcta.

---

### La ventana parte en 2000, y eso le quita el piso al mensaje de la V1

**Decisión.** El dataset publicado cubre **2000–2026** y no 1980–2026: 2.741
ciclones y 78.786 observaciones en vez de 4.827 y 141.945. `--desde` es un
parámetro, así que la ventana anterior se reproduce con una bandera, pero lo que
el grupo va a usar como punto de partida es la ventana corta.

**Por qué.** Comparabilidad. Desde ~2000 la cobertura satelital y los métodos de
estimación de intensidad son homogéneos en las siete cuencas, así que dos
temporadas cualesquiera se comparan sin corregir nada. La ventana 1980–2026
obligaba a arrastrar una reserva en cada afirmación —«parte del salto puede ser
mejor observación y no más viento»— y esa reserva estaba escrita en la bajada de
la página precisamente porque no se podía resolver con el dato.

Un efecto secundario que vale el recorte: la presión deja de ser un problema.
`pres_mb` faltaba en el 14,5 % de las observaciones en 1980–2026; en 2000–2026
falta en el **0,9 %**, y los ciclones sin ninguna medición de presión bajan de
553 a 15.

**Lo que esto cuesta, y es caro: el mensaje de la V1 no se sostiene con esta
ventana.** No es una opinión, son los números —`scripts/verificar_cifras.py`:

| década | ciclones | cat. 4–5 | proporción |
|---|---|---|---|
| 1980s | 1.033 | 104 | **10,1 %** |
| 1990s | 1.053 | 181 | 17,2 % |
| 2000s | 1.013 | 174 | 17,2 % |
| 2010s | 1.006 | 198 | 19,7 % |
| 2020s (incompleta) | 722 | 117 | 16,2 % |

_(Las dos primeras filas salen de `versions/v1/data/seasons.json`, que conserva
la ventana 1980–2026; las otras tres, de los datos publicados.)_

Todo el contraste de la V1 —«en los 80 uno de cada diez, desde los 90 uno de
cada cinco»— vive en el salto de los 80 a los 90. Dentro de 2000–2024 no hay
tendencia detectable: ajustando la proporción por temporada, la pendiente es
+0,6 puntos por década con error estándar 1,5 (t = 0,39). La variación de una
temporada a otra —σ = 5,2 puntos, de 10,1 % en 2022 a 29,4 % en 2015— es **nueve
veces** la pendiente por década. Con 25 temporadas, este dato no resuelve la
pregunta.

Y el salto de los 80 a los 90 cae exactamente donde cambió la observación
satelital. Es decir: **el contraste más vistoso era también el menos limpio.**
Recortar en 2000 es elegir un dato que sostiene menos y lo sostiene mejor.

**Lo que esta ventana sí sostiene.** El total por temporada es estable (min 87,
mediana 100, max 118 en las 25 temporadas completas; pendiente +2,3 por década
con error estándar 2,4). Las comparaciones entre cuencas son limpias, que es
donde la homogeneidad paga. La variabilidad interanual es grande y real. Y las
trayectorias permiten mirar tasa de intensificación y cercanía a tierra, que no
dependen de comparar décadas.

**Descartado.** Mantener 1980–2026 y seguir advirtiendo la reserva en la bajada:
funciona para un mensaje ya escrito, no para un grupo que va a explorar el dato
desde cero —la reserva habría que repetirla en cada gráfico nuevo que alguien
haga. Y partir en 1990, que es donde la cobertura ya mejora: gana tres
temporadas y mantiene el borde discutible adentro, que es lo que se quería
sacar.

**Responde a.** «¿Qué filtraste de los datos y por qué?» · «¿Cuál es el mensaje
y por qué ese y no otro?» — y obliga a volver sobre la segunda.

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
