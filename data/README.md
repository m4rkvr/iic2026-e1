# La base de datos

Ciclones tropicales, **2000–2026**: **2.741 ciclones**, **78.786 observaciones**
6-horarias, 7 cuencas. Derivada de
[IBTrACS v04r01](https://www.ncei.noaa.gov/products/international-best-track-archive)
(NOAA NCEI) con `scripts/preprocess.py`.

La página de la raíz está en construcción: **esta base de datos es el punto de
partida para la visualización que se va a construir**. La primera versión, que
usaba la ventana 1980–2026, quedó congelada en
[`../versions/v1/`](../versions/v1/).

**Esto no es IBTrACS crudo.** Es un subconjunto filtrado y agregado: 15 de las
174 columnas originales, una cuarta parte de las filas, y cuatro decisiones de
limpieza que cambian los números. Están todas en
[«Qué se filtró»](#qué-se-filtró-y-por-qué) y en `meta.json`. Si tu análisis
depende de algo que filtramos, parte del CSV original — no de aquí.

> **Si vas a usar una IA para hacer los gráficos**, pégale
> [`PROMPT.md`](PROMPT.md) antes de pedirle nada. Es este manual comprimido a una
> página: el esquema, las trampas y las URLs, en un formato que se puede copiar
> entero en el chat. Sin eso, el error más probable es que te invente columnas
> que no existen o que haga desaparecer el Atlántico Norte.

Se puede usar libremente citando la fuente (ver [Cita](#cita)).

---

## Los archivos

Los mismos datos en dos formatos. **Las columnas se llaman igual en ambos**: no
hay traducción entre el JSON y el CSV.

| Archivo | Grano | Filas | Peso |
|---|---|---|---|
| `csv/observations.csv` | una observación 6-horaria | 78.786 | 6,5 MB |
| `csv/storms.csv` · `storms.json` | un ciclón | 2.741 | 254 KB · 730 KB |
| `csv/seasons.csv` · `seasons.json` | temporada × cuenca | 165 | 6,6 KB · 26 KB |
| `tracks.json` | trayectorias, formato columnar | 1.230 ciclones | 1,1 MB |
| `meta.json` | procedencia, filtros, inventario con `sha256` | — | 2 KB |

- **`observations.csv` es la tabla base.** De ella se derivan las otras dos:
  `storms` es un `groupby(sid)` y `seasons` un `groupby(season, basin)`. Si vas
  a hacer tu propio pipeline, parte de aquí y olvídate del resto.
- **`tracks.json` no tiene equivalente CSV a propósito.** Es el subconjunto de
  `observations` con los ciclones de ≥ 64 kt, en formato columnar
  (`{sid: {lat: [...], lon: [...]}}`) porque pesa la mitad que un array de
  objetos. Para trayectorias en CSV, filtra `observations.csv` por `sid`.
- `seasons` y `storms` existen en los dos formatos porque son chicos y es gratis.

---

## Cargarla sin descargar nada

Las dos rutas sirven y las dos mandan `Access-Control-Allow-Origin: *`, así que
funcionan desde cualquier página, Observable o notebook:

```
https://m4rkvr.github.io/iic2026-e1/data/<archivo>                     ← GitHub Pages (recomendada)
https://raw.githubusercontent.com/m4rkvr/iic2026-e1/main/data/<archivo> ← raw de GitHub
```

Pages es preferible: manda el `Content-Type` correcto y comprime en tránsito
(los 6,5 MB del CSV viajan como 1,1 MB). El `raw` manda todo como `text/plain`,
lo que no molesta a `fetch` ni a `d3.csv`, pero sí a algunas librerías
quisquillosas.

**Si vas a iterar sobre la visualización, clona o baja los archivos una vez.**
Pedirle 6,5 MB a GitHub en cada recarga del navegador es lento y es abusar de un
CDN ajeno.

### d3 / JS en el navegador

```js
const BASE = "https://m4rkvr.github.io/iic2026-e1/data/";

// d3.autoType convierte números, fechas ISO y true/false solo.
const seasons = await d3.csv(BASE + "csv/seasons.csv", d3.autoType);
const storms  = await d3.csv(BASE + "csv/storms.csv",  d3.autoType);

// Sin d3:
const tracks = await fetch(BASE + "tracks.json").then((r) => r.json());
```

### pandas (local, Colab, Jupyter)

```python
import pandas as pd

BASE = "https://m4rkvr.github.io/iic2026-e1/data/"

# keep_default_na=False es obligatorio: la cuenca "NA" (Atlántico Norte) se
# leería como valor ausente y esa cuenca desaparecería en silencio. Ver trampas.
obs = pd.read_csv(BASE + "csv/observations.csv",
                  keep_default_na=False, na_values=[""],
                  parse_dates=["iso_time"])

storms = pd.read_csv(BASE + "csv/storms.csv",
                     keep_default_na=False, na_values=[""],
                     parse_dates=["start", "end"])
```

### Observable

```js
storms = d3.csv("https://m4rkvr.github.io/iic2026-e1/data/csv/storms.csv", d3.autoType)
```

### Herramientas sin código

Los tres CSV se abren tal cual en Excel, Google Sheets, RAWGraphs, Flourish,
Datawrapper o Tableau. `observations.csv` son 78.786 filas = 1,0 millón de
celdas: cabe de sobra en Sheets (límite 10 millones).

---

## Diccionario de datos

### `csv/observations.csv` — 78.786 filas

Una fila por ciclón y hora sinóptica. Clave: `sid` + `iso_time`.

| Columna | Tipo | Unidad / dominio | Nulos | Notas |
|---|---|---|---|---|
| `sid` | texto | ID IBTrACS, p. ej. `2024279N21265` (Milton, 2024) | 0 | único por ciclón, estable entre versiones de IBTrACS. **Los 4 primeros dígitos no siempre son la `season`**: ver trampa 6 |
| `iso_time` | texto | ISO 8601 UTC, `1999-12-09` a `2026-09-24` | 0 | solo 00/06/12/18 h. **Empieza en 1999**, ver trampa 6 |
| `season` | entero | 2000–2026 | 0 | temporada, no año calendario: en el hemisferio sur una temporada cruza el año nuevo |
| `basin` | texto | 7 códigos, ver abajo | 0 | cuenca de **origen** |
| `name` | texto | mayúsculas | 0 | `SIN NOMBRE` cuando el origen trae `NOT_NAMED`/`UNNAMED` |
| `nature` | texto | 6 códigos, ver abajo | 0 | naturaleza del sistema en ese punto |
| `lat` | decimal | grados, −61,3 a 70,7 | 0 | |
| `lon` | decimal | grados, −179,8 a **257,4** | 0 | **ojo:** puede pasar de 180, ver trampas |
| `wind_kt` | entero | nudos, 3–185 | 0 | viento máximo sostenido. `USA_WIND`, con respaldo `WMO_WIND` |
| `pres_mb` | entero | milibares, 872–1024 | 709 (0,9 %) | presión central mínima |
| `sshs` | entero | −5 a 5, ver abajo | 0 | **−1 no es «ausente»**, es depresión tropical |
| `dist2land_km` | entero | km, 0–4270 | 0 | distancia a la costa más cercana; `0` = en tierra (6.133 filas) |
| `provisional` | booleano | `true`/`false` | 0 | el ciclón aún no pasó por reanálisis |

### `csv/storms.csv` · `storms.json` — 2.741 filas

Una fila por ciclón, con su punto de máxima intensidad. Clave: `sid`.

| Columna | Tipo | Unidad / dominio | Nulos | Notas |
|---|---|---|---|---|
| `sid` `season` `basin` `name` | | igual que arriba | 0 | `name` = `SIN NOMBRE` en 526 |
| `max_wind` | entero | nudos, 4–185 | 0 | máximo de `wind_kt` del ciclón |
| `min_pres` | entero | mb, 872–1016 | 15 | mínimo de `pres_mb`; ver la nota de abajo |
| `sshs_max` | entero | −5 a 5 | 0 | máximo de `sshs` |
| `cat45` | booleano | | 0 | `sshs_max >= 4` **o** `max_wind >= 113`. 489 ciclones (17,8 %) |
| `peak_lat` `peak_lon` | decimal | grados | 0 | posición en el momento de máximo viento |
| `start` `end` | texto | `AAAA-MM-DD` | 0 | primera y última observación |
| `provisional` | booleano | | 0 | 152 ciclones (temporadas 2025–2026) |
| `n_landfall_pts` | entero | 0–68 | 0 | observaciones con `dist2land_km <= 50`; **no** es el número de recaladas |
| `min_dist2land` | entero | km, 0–3817 | 0 | lo más cerca de tierra que estuvo |
| `has_track` | booleano | | 0 | si está en `tracks.json` (= `max_wind >= 64`). 1.230 ciclones |

**`min_pres` no es comparable entre ciclones.** Es el mínimo de las
observaciones que *sí* traían presión, y las agregaciones ignoran los nulos. Un
ciclón con presión en 3 de sus 40 observaciones y otro con 40 de 40 dan un
`min_pres` que no mide lo mismo. En esta ventana el problema es chico —solo el
0,9 % de las observaciones no tiene presión, y 15 ciclones quedan sin ninguna—
pero si vas a graficar presión, grafica `pres_mb` a nivel de observación.

### `csv/seasons.csv` · `seasons.json` — 165 filas

Agregado por temporada y cuenca. Clave: `season` + `basin`.

| Columna | Tipo | Notas |
|---|---|---|
| `season` `basin` | | la clave |
| `n_storms` | entero | ciclones con origen en esa cuenca y temporada |
| `n_cat45` | entero | cuántos de ellos con `cat45 = true` |
| `share_cat45` | decimal | `n_cat45 / n_storms`, 0–1 (4 decimales) |
| `mean_max_wind` `median_max_wind` `p90_max_wind` | decimal | nudos, sobre la distribución de `max_wind` |
| `provisional` | booleano | si algún ciclón de la celda es provisional |

**Cuidado al agregar:** `share_cat45` es una proporción por celda. Para el total
mundial de una temporada **no promedies las proporciones** — suma `n_cat45` y
`n_storms` y divide. Las cuencas tienen tamaños muy distintos (WP aporta el 27 %
de las observaciones, SA el 0,08 %).

### `tracks.json` — 1.230 ciclones

```json
{ "1999343S11123": {
    "lat":  [-10.6, -11.1, -11.6, -12.6, ...],   // grados
    "lon":  [121.8, 121.1, 120.8, 120.2, ...],   // grados (puede pasar de 180)
    "wind": [25, 25, 25, 25, ...],               // nudos
    "h":    [0, 6, 12, 18, ...],                 // horas desde la primera observación
    "d2l":  [128, 109, 149, 259, ...]            // km a tierra (-1 si faltara; hoy no ocurre)
} }
```

Los cinco arrays de un ciclón tienen el mismo largo y el mismo orden temporal.
`h` reemplaza la marca de tiempo porque pesa menos; la fecha absoluta está en
`storms.start`.

### Códigos

**`basin`** — cuenca de origen:

| Código | Cuenca | Observaciones | Ciclones | ≥ 64 kt | cat. 4–5 | Nombre local |
|---|---|---|---|---|---|---|
| `WP` | Pacífico Noroccidental | 21.224 | 770 | 391 | 190 | tifón |
| `SI` | Índico Sur | 17.812 | 459 | 234 | 91 | ciclón tropical |
| `EP` | Pacífico Nororiental | 14.533 | 534 | 236 | 89 | huracán |
| `NA` | Atlántico Norte | 13.570 | 468 | 202 | 60 | huracán |
| `SP` | Pacífico Sur | 7.241 | 259 | 115 | 44 | ciclón tropical |
| `NI` | Índico Norte | 4.345 | 248 | 51 | 15 | ciclón severo |
| `SA` | Atlántico Sur | 61 | 3 | 1 | 0 | ciclón tropical |

Huracán, tifón y ciclón son **el mismo fenómeno** con nombre regional distinto.
No se filtró ninguno.

**`nature`** — naturaleza del sistema:
`TS` tropical (58.247) · `DS` disturbio (9.845) · `MX` mixta (4.753) ·
`ET` extratropical (2.880) · `NR` no reportada (2.268) · `SS` subtropical (793)

**`sshs`** — escala Saffir-Simpson según IBTrACS. Los negativos **no** son
valores ausentes:

| Valor | Significado | Viento en estos datos | n |
|---|---|---|---|
| `-5` | desconocido | 3–80 kt | 6.573 |
| `-4` | post-tropical | 15–100 kt | 2.567 |
| `-3` | disturbio, onda, baja | 10–80 kt | 11.679 |
| `-2` | subtropical | 15–65 kt | 890 |
| `-1` | depresión tropical | 15–32 kt | 15.841 |
| `0` | tormenta tropical | 35–60 kt | 24.767 |
| `1` | categoría 1 | 64–80 kt | 7.161 |
| `2` | categoría 2 | 84–95 kt | 3.467 |
| `3` | categoría 3 | 98–112 kt | 2.589 |
| `4` | categoría 4 | 115–135 kt | 2.699 |
| `5` | categoría 5 | 138–185 kt | 553 |

Un ciclón **cambia de `sshs` a lo largo de su vida**: casi todos empiezan y
terminan en negativo. Para clasificar al ciclón completo usa `sshs_max` o
`cat45` de `storms`, no el `sshs` de un punto cualquiera.

**Fuerza máxima que alcanza cada ciclón** — el 55 % nunca llega a huracán:

| | depresión <34 kt | tormenta 34–63 | cat. 1 | cat. 2 | cat. 3 | cat. 4 | cat. 5 |
|---|---|---|---|---|---|---|---|
| ciclones | 329 | 1.182 | 376 | 189 | 176 | 339 | 150 |
| | 12,0 % | 43,1 % | 13,7 % | 6,9 % | 6,4 % | 12,4 % | 5,5 % |

---

## Qué se filtró y por qué

El CSV de origen (`since1980`) trae 309.724 filas y 174 columnas. Quedan 78.786
filas y 15 columnas:

| Paso | Filas | Pierde |
|---|---|---|
| leídas del CSV | 309.724 | |
| − ramas secundarias (`TRACK_TYPE` con `spur`) | 308.580 | −1.144 |
| − sin tiempo o posición válida | 308.580 | 0 |
| − **temporadas anteriores a 2000** | 167.254 | −141.326 |
| − horas no sinópticas | 84.279 | −82.975 |
| − sin viento en ninguna de las dos columnas | **78.786** | −5.493 |

1. **Ramas secundarias** (`TRACK_TYPE` con `spur`): duplican el mismo evento.
   No se filtró por `TRACK_TYPE == "main"`, que habría borrado las temporadas
   recientes completas — llegan marcadas `PROVISIONAL`/`US-PROVISIONAL`, que es
   trayectoria primaria sin reanálisis, no una rama secundaria.
2. **Temporadas anteriores a 2000.** Es la ventana del proyecto, y es una
   decisión de comparabilidad: desde ~2000 la cobertura satelital y los métodos
   de estimación de intensidad son homogéneos en las siete cuencas, así que las
   temporadas se comparan entre sí sin corregir nada. Antes de 2000 —y sobre
   todo antes de 1990— parte de cualquier aumento en las categorías altas es
   mejor observación y no más viento. Con `--desde 1980` se recupera la ventana
   anterior; **cuesta que las comparaciones entre décadas dejen de ser limpias.**
   Lo que esta ventana *no* permite está en [Qué puede y qué no puede
   sostener](#qué-puede-y-qué-no-puede-sostener-esta-ventana).
3. **Horas no sinópticas**: solo 00/06/12/18 UTC. Las filas de las 03/09/15/21 h
   **son interpolación de IBTrACS, no reportes de agencia**, y están en todo el
   registro (~50 % de las filas en cada década). Tres señales: el 98,8 % de los
   vientos en hora sinóptica son múltiplos de 5 kt —así reportan las agencias—
   contra el 58,8 % de los intermedios; y el 99,9 % de los valores intermedios
   cae a ≤ 2,5 kt del promedio de sus dos vecinos, con mediana de diferencia 0.
   Conservarlos duplicaría cada reporte con un valor derivado de él.
   La prueba, sobre el CSV crudo: `python3 scripts/verificar_interpolacion.py`.
4. **Observaciones sin viento** (`wind` nulo o ≤ 0): 5.493.

Y las dos decisiones que no quitan filas pero sí cambian los valores:

5. **Viento** = `USA_WIND` con respaldo `WMO_WIND` (6.573 filas rescatadas por
   el respaldo). `USA_WIND` cubre mucho más, pero mezcla criterios de agencia
   (promediado a 1 minuto vs. 10 minutos según quién reporte): **las
   comparaciones entre cuencas arrastran ese sesgo**.
6. **Categoría 4–5** = `sshs_max >= 4` **o** `max_wind >= 113 kt`. La segunda
   condición cubre los ciclones sin `USA_SSHS`, mayoritariamente fuera del
   Atlántico y el Pacífico oriental.

**Nada se imputó.** Los nulos se rellenaron desde una segunda columna *medida*
(`WMO_*`), se eliminó la fila cuando faltaba lo que la define (viento), o se
dejaron como nulos declarados (`pres_mb`). No hay medias, ni interpolación
temporal, ni presión estimada desde el viento.

La lista viva está en `meta.json` → `filters`, junto a la fecha de descarga.

---

## Qué puede y qué no puede sostener esta ventana

Los números, recalculables con `python3 scripts/verificar_cifras.py`:

**El total por temporada es estable.** 25 temporadas completas (2000–2024): min
87, mediana 100, max 118 ciclones. La tendencia es +2,3 por década con error
estándar 2,4 — indistinguible de cero.

**La proporción que llega a categoría 4–5 no muestra tendencia en esta
ventana.** Por década: 17,2 % (2000s) · 19,7 % (2010s) · 16,2 % (2020s, aún
incompleta). Ajustando por temporada 2000–2024 la pendiente es +0,6 puntos por
década con error estándar 1,5 (t = 0,39): **no se distingue de cero**. La
variación de una temporada a otra —σ = 5,2 puntos, de 10,1 % en 2022 a 29,4 % en
2015— es nueve veces más grande que la pendiente por década. Con 25 temporadas,
este dato **no resuelve** una tendencia en la intensificación.

Es un cambio respecto de la V1, que con la ventana 1980–2026 mostraba el salto
de ~11 % en los 80 a ~17 % desde los 90. Ese salto está justo en el borde donde
cambió la observación satelital, que es la razón de recortar en 2000: **el
contraste más vistoso era también el menos limpio.**

Lo que esta ventana sí sostiene, y la de 1980 no tan bien:

- **Comparaciones entre cuencas**, que es donde la homogeneidad importa: el
  Pacífico Noroccidental concentra el 28 % de los ciclones y el 39 % de los
  cat. 4–5; el Índico Norte tiene 248 ciclones y solo 15 cat. 4–5.
- **La variabilidad interanual**, que es grande y real: 2015 casi triplica a
  2022. Eso sí se puede mostrar, y es más honesto que una línea de tendencia.
- **Geografía e intensificación**: dónde alcanzan su máximo (`peak_lat`,
  `peak_lon`), cuánto se intensifican entre observaciones consecutivas
  (`tracks.json`), y qué tan cerca de tierra lo hacen (`dist2land_km`).
- **Exposición a recaladas**: 6.133 observaciones ocurren con el ciclón en
  tierra.

---

## Trampas conocidas

Las seis que nos costaron tiempo. Vale la pena leerlas antes de graficar.

**1. La cuenca `NA` desaparece sola.** El Atlántico Norte se codifica `NA`, y
pandas lo interpreta como valor ausente: se borran 13.570 observaciones y 468
ciclones sin un solo mensaje de error. Lo mismo hace `read.csv` en R. Se arregla
con `keep_default_na=False, na_values=[""]` (pandas) o `na.strings=""` (R).
`d3.autoType` **no** tiene este problema: deja `"NA"` como texto.
**Verifica siempre que `basin` tenga 7 valores distintos, no 6.**

**2. `lon` pasa de 180** (hasta 257,4). IBTrACS no normaliza la longitud de los
ciclones que cruzan la antimeridiana, y así se publica aquí. Es *bueno* para
dibujar líneas: la trayectoria sigue continua en vez de saltar de un borde al
otro del mapa. Plotly `scattergeo` lo envuelve bien solo. Pero Leaflet, un
`scaleLinear` de d3 o un `plt.scatter` pondrán esos 1.674 puntos fuera de la
proyección. Si tu herramienta necesita −180…180:

```js
const lonNorm = ((lon + 180) % 360 + 360) % 360 - 180;
```

y acepta que las líneas salten en la antimeridiana (o córtalas ahí a mano).

**3. Las temporadas 2025–2026 son provisionales** y 2026 además está en curso.
152 ciclones con `provisional = true`. En cualquier serie temporal, el último
punto va a parecer una caída: **es cobertura incompleta, no una tendencia.**
Márcalo o exclúyelo, pero no lo grafiques como si fuera igual a los demás.
Los números firmes van hasta 2024.

**4. `sshs = -1` no es un nulo**, es una depresión tropical (ver tabla). Si
filtras `sshs > 0` estás botando el 79 % de las observaciones; si lo tratas como
ausente, estás inventando huecos.

**5. `n_landfall_pts` no cuenta recaladas.** Cuenta observaciones a ≤ 50 km de
la costa, así que un ciclón que se arrastra paralelo al litoral puede sumar 68 sin
tocar tierra nunca. Para recaladas de verdad hay que detectar cruces de la línea
de costa — no está hecho.

**6. `season` no es el año del calendario, y el `sid` tampoco.** En el hemisferio
sur una temporada empieza en el segundo semestre del año anterior: la temporada
2000 del Índico Sur arranca el **9 de diciembre de 1999**. Consecuencias
concretas en estos datos:

- `iso_time` empieza en `1999-12-09`, no en `2000-01-01` (97 observaciones de
  3 ciclones, los tres del Índico Sur).
- Los 4 primeros dígitos del `sid` son el año en que el ciclón se formó, que
  **en 168 de los 2.741 ciclones no coincide con su `season`**. Si extraes el
  año con `sid[:4]`, esos 168 se te van al año anterior.

Agrupa siempre por `season`, nunca por `iso_time.year` ni por `sid[:4]`.

Y dos menores: `pres_mb` falta en el 0,9 % de las observaciones (no imputes sin
decirlo), y el viento mezcla convenciones de agencia, así que una diferencia
entre cuencas puede ser de método y no de clima.

---

## Qué NO contiene

Lluvia, oleaje, marejada, daños, muertes, costos, población expuesta, ni
fronteras ni geometrías de países. Lo único «geográfico» es `dist2land_km`, que
viene calculado por IBTrACS.

El mapa de la V1 no usaba ninguna capa de fronteras: dibujaba las costas con el
topojson de Natural Earth que Plotly ya trae. Si quieres cruzar los ciclones con
unidades administrativas (recaladas por país, por región), ahí sí necesitas una
capa aparte — [geoBoundaries](https://www.geoboundaries.org/) o Natural Earth — y
hacer el point-in-polygon tú.

---

## Regenerar y verificar

```bash
pip install pandas

python3 scripts/preprocess.py --source since1980                # lo publicado (2000+)
python3 scripts/preprocess.py --source since1980 --desde 1980   # la ventana de la V1
python3 scripts/preprocess.py --source last3years               # ~10 MB, rápido
python3 scripts/preprocess.py --source ALL --desde 1842         # todo el archivo

python3 scripts/verificar_cifras.py                 # recalcula las cifras citadas
python3 scripts/verificar_dataset.py                # compara data/ con los sha256
python3 scripts/verificar_interpolacion.py          # prueba el filtro de horas
```

El CSV crudo queda en `scripts/cache/` (fuera del repo) y se reutiliza. `--source`
elige qué archivo se baja de NOAA; `--desde` recorta las temporadas. Ninguno de
los dos cambia el esquema.

`meta.json` → `files` trae el `sha256`, el peso y las filas de cada archivo, para
comparar tu copia con la publicada sin bajarla de nuevo:

```bash
sha256sum data/csv/observations.csv
python3 -c "import json;print(*json.load(open('data/meta.json'))['files'],sep='\n')"
```

La GitHub Action `.github/workflows/datos.yml` hace las dos cosas: verifica que
los datos del repo cuadren con sus hashes en cada push, y regenera todo desde
NOAA cuando se la ejecuta a mano.

---

## Cita

> Knapp, K. R., H. J. Diamond, J. P. Kossin, M. C. Kruk, C. J. Schreck (2018):
> *International Best Track Archive for Climate Stewardship (IBTrACS) Project,
> Version 4r01*. NOAA National Centers for Environmental Information.
> DOI [10.25921/82ty-9e16](https://doi.org/10.25921/82ty-9e16).

Si usas **esta** versión filtrada, cita IBTrACS como fuente y enlaza
`https://github.com/m4rkvr/iic2026-e1` para que se pueda auditar qué se filtró.
