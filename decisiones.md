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
| ¿Qué codifica el sonido, exactamente? | **Hoy:** [El ritmo pasa a la categoría](#el-ritmo-pasa-a-la-categoría-y-se-quita-la-leyenda-del-sonido) · Antes: [El sonido deja de codificar con el volumen](#el-sonido-deja-de-codificar-con-el-volumen) · En la V1: [Tres parámetros sonoros, no volumen](#tres-parámetros-sonoros-no-volumen) · [La sonificación no distingue la década incompleta](#la-sonificación-no-distingue-la-década-incompleta-limitación-abierta) |
| ¿Por qué la escala pentatónica? | [Sonificación cuantizada a escala pentatónica](#sonificación-cuantizada-a-escala-pentatónica) |
| ¿Por qué los puntos de la década en curso están vacíos? | [Los grupos incompletos se marcan y se excluyen del ajuste](#los-grupos-incompletos-se-marcan-y-se-excluyen-del-ajuste) |
| ¿Por qué el mapa agrupa por tramos? | [El mapa agrupa por tramos, no colorea punto a punto](#el-mapa-agrupa-por-tramos-no-colorea-punto-a-punto) |
| ¿Qué filtraste de los datos y por qué? | [Los tres filtros del dataset, y qué sesgo evita cada uno](#los-tres-filtros-del-dataset-y-qué-sesgo-evita-cada-uno) · [La base de datos se publica como dataset](#la-base-de-datos-se-publica-como-dataset-no-como-insumo-de-esta-página) · [La ventana parte en 2000](#la-ventana-parte-en-2000-y-eso-le-quita-el-piso-al-mensaje-de-la-v1) |
| ¿Qué errores encontraron procesando? | [Dos errores que borraban datos en silencio](#dos-errores-que-borraban-datos-en-silencio) · [El filtro de horas estaba bien, su justificación estaba mal](#el-filtro-de-horas-estaba-bien-su-justificación-estaba-mal) |
| ¿Qué descartaron y por qué? | [Descartes generales](#descartes-generales) y el campo **Descartado** de cada entrada · [La página se rehace en grupo](#la-página-se-rehace-en-grupo-y-la-raíz-queda-en-construcción) |
| ¿Qué suena exactamente al reproducir la tendencia? | [La sonificación no distingue la década incompleta](#la-sonificación-no-distingue-la-década-incompleta-limitación-abierta) (V1) |
| ¿Cómo sabe el lector qué lugar está mirando? | **Hoy:** [Al abrir se ve el país de quien mira; fuera el minimapa](#al-abrir-se-ve-el-país-de-quien-mira-fuera-el-minimapa) · [El mapa dice dónde estás](#el-mapa-dice-dónde-estás) · [Después de R1: abrir en el ciclón más fuerte](#después-de-r1-abrir-en-el-ciclón-más-fuerte) |

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

## 2026-10-03 a 2026-10-06 — la página nueva (reconstruido desde git)

> Estas dos entradas se escribieron el 2026-10-12 a partir de los commits
> `9742136` a `fc193c8`. Registran **qué** cambió y cuándo. El **porqué** —y lo
> que dijo el profesor en R1— tienen que completarlo quienes tomaron esas
> decisiones: la pauta pide anclar cada cambio en una fuente, y el historial no
> la guarda.

### Del dataset a un mapa de los ciclones que tocaron tierra

**Qué cambió** (03-10 a 05-10, commits `9742136` a `99e7ecf`).

- La raíz deja de estar en construcción: un mapa mundial con un punto por
  ciclón en su primera observación sobre tierra —1.010 ciclones entre 2000 y
  2026—, coloreado por categoría Saffir-Simpson, con filtros por categoría y
  por temporada, y una vista por continente (clic en un continente para
  acercarse, «← Mundo» para volver).
- Clic en un ciclón: su trayectoria, el punto de máximo viento y un panel con
  el viento máximo en km/h, muertes y afectados (EM-DAT), duración, horas sobre
  tierra y la curva del viento con los umbrales de cada categoría.
- Sonido: ruido sintético primero (`9742136`) y una grabación de viento
  después (`1b25338`). En los dos, el volumen y el brillo subían con el viento.
- Datos nuevos: `data/geo/` (fronteras de geoBoundaries CGAZ: 218 países y
  3.224 regiones), `data/emdat_by_sid.json` (muertes y afectados de 644
  ciclones según EM-DAT) y `data/csv/paises_continente.csv` (236 países con su
  continente). La página no lee `data/`: trae sus datos dentro de `index.html`
  (`window.__APP__`, 5,4 MB).
- La bajada pasó por tres versiones hasta «Explora los ciclones tropicales que
  tocaron tierra entre 2000 y 2026: la intensidad de sus vientos y su impacto
  en las personas» (`1887849`).

```bash
python3 - <<'EOF'
import json
for f, o in [("countries", "ADM0"), ("regions", "ADM1")]:
    t = json.load(open(f"data/geo/{f}.topojson"))
    print(f, len(t["objects"][f"geoBoundariesCGAZ_{o}"]["geometries"]))  # 218 · 3224
print("emdat", len(json.load(open("data/emdat_by_sid.json"))))            # 644
EOF
```

**Por qué.** _Pendiente: lo escribe el grupo._ Lo que ya estaba registrado: la
entrada del 02-10 concluyó que la ventana 2000–2026 no sostiene una tendencia
por décadas, y que sí sostiene mirar trayectorias y cercanía a tierra. La
página nueva coincide con eso: no compara décadas, muestra ciclones uno por uno.

**Pendiente que deja.** Ningún script del repositorio genera `window.__APP__`.
Hasta que esté, los datos de la página no se pueden reconstruir ni verificar
desde `data/`, al revés de lo que hace el resto del repositorio.

---

### Después de R1: abrir en el ciclón más fuerte

**Qué cambió** (06-10, commit `fc193c8` «feedback_profe»).

- Título: «Huracanes» → «Los huracanes más fuertes por categoría entre
  2000-2026». Se quitó la bajada.
- Un solo mapa mundial con zoom y arrastre libres: se quitó la vista por
  continente.
- Se quitaron la franja de instrucciones y el botón «Sonido: activado /
  desactivado».
- Al abrir: solo la categoría 5, con su ciclón más fuerte (Patricia, 2015)
  seleccionado y el mapa acercado a su trayectoria.
- Elegir una categoría la deja sola (otro clic vuelve a mostrar todas),
  selecciona su ciclón más fuerte y numera del 1 al 5 los cinco más fuertes con
  pines; el resto de los puntos se aclara según su viento.
- Al seleccionar un ciclón suenan 3,5 s de su viento máximo.

**Qué dijo el profesor y por qué se cambió.** _Pendiente: lo completan quienes
estuvieron en R1._

---

## 2026-10-12 — dos recomendaciones de un ayudante

Consultado por otras recomendaciones, un ayudante propuso dos cambios: que el
sonido deje de depender del volumen, y que el mapa diga dónde está uno al
entrar. Se adoptan los dos; abajo, cómo y por qué. Capturas de antes y después
en `docs/capturas/2026-10-12-*.png`.

### El sonido deja de codificar con el volumen

**Decisión.** El volumen queda fijo. El viento se oye en el **ritmo**: ráfagas
que se aceleran con él, de 0,75 por segundo a 30 kt hasta 6 por segundo a
185 kt (el doble cada ~52 kt). La categoría se oye en el **timbre**: el viento
se vuelve más áspero en cada categoría, con una modulación a 55 Hz cuya
profundidad sube de 0 en tormenta tropical a 100 % en categoría 5. Bajo el
botón de reproducir, una línea dice qué suena. La grabación de viento se
conserva.

**Por qué.**

- El ayudante: sonificar con el volumen es lo peor evaluado del curso; propuso
  timbre o tono. La pauta lo dice con otras palabras: «el tipo de sonido debe
  cambiar con el dato, no solo su intensidad».
- Lo que había era, en la práctica, volumen: la ganancia crecía con el viento
  elevado a 1,6, es decir 28 dB entre 25 y 185 kt (20·log₁₀((185/25)^1,6) =
  27,8). Y el volumen es lo único que el oyente regula con la perilla de su
  equipo: la misma ráfaga suena fuerte en un parlante y débil en otro, así que
  no puede cargar un dato.
- Ritmo y aspereza no se confunden aunque los dos modulan la amplitud, porque
  ocupan bandas que el oído separa. Bajo ~20 Hz una modulación se oye como
  pulso (la fluctuación se percibe más fuerte cerca de 4 Hz); sobre ~20 Hz deja
  de oírse como pulso y se oye como aspereza, que es máxima cerca de 70 Hz
  (Zwicker y Fastl, *Psychoacoustics: Facts and Models*). Las ráfagas van de
  0,75 a 6 Hz; la aspereza está en 55 Hz.
- Por qué el ritmo para el viento y el timbre para la categoría: repiten lo que
  ya hace la curva del panel. Ahí el viento es la altura de la línea —continua—
  y la categoría son las líneas punteadas —escalones—. En el sonido, el ritmo
  cambia de a poco, como la línea, y la aspereza salta justo cuando la curva
  cruza una línea punteada. El oído distingue cambios chicos de tempo, pero
  pocos grados de aspereza: cada parámetro lleva la variable cuya resolución
  puede cargar.
- Medido sobre el código de la página, no sobre una copia
  (`scripts/verificar_sonido.html`): el volumen varía 0,2 dB entre 25 y
  185 kt; las ráfagas medidas coinciden con las esperadas en los ocho vientos
  probados; la aspereza es 0 en tormenta tropical, sube de 0,27 a 0,95 entre
  las categorías 1 y 5, y no cambia dentro de una misma categoría (150 y
  185 kt dan 0,95).

```bash
python3 -m http.server 8000
# http://localhost:8000/scripts/verificar_sonido.html
```

**Descartado.**

- **Tono ← viento**, la otra propuesta del ayudante. La grabación es ruido: no
  tiene una altura que mover. Para tener tono habría que cambiarla por un
  silbido sintético, y se pierde lo que hace legible el sonido: que suena a
  viento.
- **Dejar el volumen como refuerzo** de los otros dos: el oído lo seguiría
  escuchando primero, y es justo lo que la pauta dice que no basta.
- **El orden inverso** (ritmo ← categoría, aspereza ← viento): seis tempos fijos
  suenan a saltos de metrónomo, y la aspereza no tiene resolución para seguir
  un viento que cambia de a 5 kt.

**Limitación abierta.** Seis grados de aspereza no se reconocen de memoria: se
oye «más áspero que recién», no «esto es categoría 4». Y el sonido codifica una
sola variable —el viento— con dos parámetros, mientras la V1 codificaba tres
(viento, intensificación y distancia a tierra). Es una regresión respecto de la
V1. La candidata para recuperarla es tierra/mar, que el panel ya muestra
(«≈ 18 h sobre tierra»). Las dos cosas van a la evaluación con usuarios, donde
la pauta pide preguntar qué cree la persona que codifica el sonido.

**Responde a.** «¿Qué codifica el sonido, exactamente?» — reemplaza la respuesta
de la V1.

---

### El mapa dice dónde estás

**Decisión.** Cuatro cambios para que al entrar se sepa qué lugar se está
mirando:

1. Junto al punto donde el ciclón tocó tierra, un rótulo: «Toca tierra en
   México / desde el Pacífico Nororiental». El panel repite el lugar con la
   región: «Pacífico Nororiental · tocó tierra en México (Jalisco)».
2. Un minimapa arriba a la derecha: el mundo entero, con un recuadro en la zona
   visible. Aparece al acercarse; un clic en él lleva la vista a ese punto.
3. El mapa llena su tarjeta. Antes el dibujo era una franja con la proporción
   del mundo (1000 × 353), y al acercarse se recortaba arriba y abajo.
4. Marcadores y textos mantienen un tamaño legible en pantallas angostas.

**Por qué.**

- El ayudante: la página abre acercada en Patricia y no dice dónde es; uno
  queda perdido hasta que empieza a mover el mapa.
- Las capturas lo confirman (`docs/capturas/2026-10-12-antes-*.png`). En
  escritorio, el único nombre visible al abrir era «Belice», y la trayectoria
  salía cortada por los bordes de la franja. En celular, la franja quedaba
  detrás del panel: se veía solo mar.
- Shneiderman: *overview first*. Desde R1 la página abre en el detalle, y el
  minimapa devuelve la vista general sin deshacer esa decisión: es el patrón
  vista general + detalle, con las dos a la vista a la vez.
- El rótulo va junto al punto de llegada a tierra porque ese punto siempre
  queda a la vista: al abrir, el mapa se encuadra en la trayectoria. Probamos
  ponerlo donde nace el ciclón, y en Patricia quedaba debajo del panel.
- El país no viene en los datos: `ci` es la lista de países afectados según
  EM-DAT y solo existe para 525 de los 1.010 ciclones. Se busca en las
  fronteras que la página ya trae, recorriendo el tramo entre el último punto
  sobre el mar y el primero sobre tierra, porque en 6 h un ciclón puede cruzar
  un país angosto entero. Encuentra lugar para 1.008 de los 1.010, y en 18 el
  tramo corrige el país del primer punto sobre tierra: Iris (2001) toca tierra
  en Belice, no en Guatemala; Bijli (2009), en Bangladesh, no en India.

```js
// En la consola del navegador, con la página abierta:
D.filter(d => d.ci).length   // 525: ciclones con países según EM-DAT
D.filter(lugar).length       // 1008: ciclones con lugar encontrado
D.filter(d => { const a = enTierra(d.k, d.la[d.lp], d.lo[d.lp]), b = lugar(d); return a && b && a.c != b.c }).length  // 18
```

**Descartado.**

- **Abrir en el mundo entero**: resuelve la orientación, pero deshace la
  decisión del 06-10 de abrir en el ciclón más fuerte.
- **Una animación que viaje del mundo al ciclón al cargar**: es el «movimiento
  no solicitado» que ya descartamos para la V1, y ahora competiría además con
  el sonido del máximo, que suena al seleccionar.
- **Rotular todos los océanos y mares**: más texto en un mapa que ya rotula
  países. El rótulo de llegada y el minimapa responden la pregunta a la escala
  en que está el lector.

**Responde a.** «¿Cómo sabe el lector qué lugar está mirando?»

---

## 2026-10-13 — tres ajustes del grupo

Tres cambios pedidos por el grupo después de usar la versión del 12-10. Dos de
ellos revierten partes de esa entrada; se dejan las dos para que el historial
muestre el cambio de criterio.

### Al abrir se ve el país de quien mira; fuera el minimapa

**Decisión.** Al abrir, el encuadre suma a la trayectoria del ciclón de ejemplo
el país de quien mira, y ese país lleva su nombre siempre visible. Se quita el
minimapa de la esquina superior derecha.

**Por qué.**

- Probándola, el grupo igual tenía que alejar el mapa con la rueda para saber
  dónde estaba: el rótulo «Toca tierra en México» dice dónde es el ciclón, pero
  no dónde está eso respecto de uno. La referencia más rápida es el propio país.
- El minimapa resolvía la misma pregunta con un segundo mapa que hay que leer
  aparte, y tapaba una esquina del principal. Con el país propio en el encuadre
  sobra.
- El país sale de la **zona horaria del navegador** (`Intl…timeZone`), no de
  la geolocalización: no pide permiso ni depende de la red. La base tz de IANA
  (`zone.tab`) da el país de cada zona; quien viaja con el reloj en otra zona
  ve esa otra, que es un costo menor.
- La extensión de cada país se calculó una vez desde
  `data/geo/countries.topojson` (geoBoundaries CGAZ) y va como tabla en la
  página (`PAIS` y `TZ`, 17 kB). No se usan las fronteras que la página ya
  trae porque vienen recortadas al encuadre de cada continente: Chile terminaba
  en los 37° S, sin Patagonia. Para no alejar el mapa de más, se toma el
  polígono más grande del país y los que quedan a menos de 8° de lo ya juntado:
  entran Chiloé, Tierra del Fuego y Juan Fernández; no Isla de Pascua.
- Medido en Chromium sin interfaz con la página real (Patricia de ejemplo): con
  `America/Santiago` el mapa abre a ×1,96 con México y Chile completos (en
  celular, ×1,86); `Europe/Madrid`, ×1,57; `Asia/Tokyo`, ×1, porque Japón y
  México quedan en lados opuestos del mapa; `UTC`, sin país, abre como antes
  (×14,9 sobre Patricia).

**Descartado.**

- **Geolocalización del navegador**: más precisa, pero pide permiso al entrar,
  justo cuando la página quiere mostrar el ejemplo.
- **El idioma del navegador** (`es-CL`): describe la lengua, no el lugar.
- **Mantener el minimapa además**: dos respuestas a la misma pregunta.

**Limitación abierta.** Con el encuadre más abierto, el rótulo «Toca tierra en
México» queda cerca del pin n.º 5 (Haití) y se tocan. Y para quien está lejos
del ciclón de ejemplo (Asia, Oceanía) el mapa abre casi en el mundo entero.

### El ritmo pasa a la categoría y se quita la leyenda del sonido

**Decisión.** El ritmo de las ráfagas lo fija la **categoría**: 0,5 ráfagas
por segundo en tormenta tropical, 0,8 en categoría 1, 1,3; 2,1; 3,3 y 5,2 en
categoría 5 (cada una ~1,6 veces la anterior). Dentro de una categoría el viento
lo acelera hasta un 12 %, sin llegar nunca al tempo de la siguiente. Las
ráfagas tienen ahora una calma entre una y otra (el viento baja a 0,15 de su
pico, −18 dB; antes, a 0,3). La aspereza sigue igual. El volumen sigue fijo.
Se quita la línea «Cómo suena» bajo el botón. Al elegir un ciclón, su viento
máximo suena 5 s (antes 3,5), para que una categoría 1 alcance a dar 4 ráfagas.

**Por qué.**

- El grupo quiere que el sonido ejemplifique cómo suena un huracán de esa
  magnitud: una categoría 1 con ráfagas espaciadas, una 5 con ráfagas pegadas.
  Con el ritmo atado al viento la diferencia existía (1,2 por segundo a 64 kt,
  3,2 a 137 kt) pero no se oía como un salto entre categorías, y la calma poco
  profunda (−10 dB) dejaba el ritmo tapado.
- Esto revierte el descarte del 12-10 («seis tempos fijos suenan a saltos de
  metrónomo»). La pendiente de 12 % dentro de cada categoría es el compromiso:
  al reproducir la vida del ciclón el ritmo sigue moviéndose con el viento, y
  salta donde la curva cruza una línea punteada.
- Ritmo y aspereza codifican ahora lo mismo (la categoría). Es redundancia a
  propósito: dos pistas para la variable que el grupo quiere que se oiga.
- Sin leyenda: lo pidió el grupo; además deja intacta la pregunta de la
  evaluación con usuarios («¿qué crees que te decía el sonido?»), que la línea
  contestaba de antemano. `docs/hoja-observador.md` se ajustó.
- La forma de la ráfaga es la misma en todas las categorías, así que su energía
  media no depende del tempo. La ganancia total pasa de 0,7 a 0,78 para
  compensar la calma más honda (√(0,484 / 0,39) = 1,11) y dejar el nivel donde
  estaba. Los armónicos de la ráfaga que caen cerca de 55 Hz (la aspereza)
  pesan menos de 0,2 % del fundamental incluso a 5,2 por segundo.
- Medido con `scripts/verificar_sonido.html` en Chromium sin interfaz: el
  volumen varía 0,4 dB entre 25 y 185 kt; las ráfagas medidas coinciden con las
  esperadas en los ocho vientos (0,50 · 0,53 · 0,83 · 1,38 · 2,23 · 3,50 · 5,37
  · 5,81 por segundo); la aspereza, igual que antes (0,01 en tormenta tropical,
  0,27 a 0,95 entre las categorías 1 y 5). El verificador ahora renderiza 21 s
  en vez de 11: a 0,5 ráfagas por segundo, 10 s son 5 ciclos y el ciclo cortado
  al final movía el volumen medido hasta 0,9 dB; con 20 s baja a 0,4.

**Descartado.**

- **Mover el volumen con la categoría**: el grupo lo descartó de entrada, por
  las razones del 12-10.
- **Ritmo solo por categoría, sin pendiente interna**: al reproducir, el
  sonido quedaría quieto durante días enteros de la curva.

**Responde a.** «¿Qué codifica el sonido, exactamente?» — reemplaza la respuesta
del 12-10.

---

## Descartes generales

| Alternativa | Por qué se descartó |
|---|---|
| Gráfico de torta de ciclones por cuenca | 6 categorías con valores cercanos: comparación de ángulos imprecisa (posición > ángulo) |
| Mapa de calor lat/lon | Oculta la trayectoria, que es la unidad narrativa del dato |
| Animación automática al cargar | Movimiento no solicitado; además compite con la sonificación por la atención |
| Color por cuenca en los tres gráficos | 6-7 hues categóricos simultáneos; la cuenca funciona mejor como filtro que como color |
| Cargar el CSV de NOAA en vivo | 144 MB en el navegador, dependiente de CORS y de que NOAA no cambie la URL |
| Sonificar con el volumen | Lo peor evaluado del curso según el ayudante; la pauta pide que cambie el tipo de sonido, no su intensidad; y el volumen lo regula el oyente con su equipo (ver 2026-10-12) |

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
