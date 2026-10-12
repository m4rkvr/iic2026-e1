# Ciclones tropicales, 2000–2026 — datos y visualización

Entrega **E1** del curso
[InfoVis IIC2026](https://infovis.alessiobellino.com/) · Pontificia Universidad
Católica de Chile.

> **[La página](https://m4rkvr.github.io/iic2026-e1/)** muestra los 1.010
> ciclones que tocaron tierra entre 2000 y 2026, cada uno en el punto donde
> llegó a tierra y coloreado por su categoría. Al elegir uno se ven su
> trayectoria, su viento y su impacto en las personas, y se puede escuchar cómo
> cambió su viento.
>
> La primera versión sigue navegable y sin tocar en
> [`versions/v1/`](versions/v1/) ([en vivo](https://m4rkvr.github.io/iic2026-e1/versions/v1/))
> y en el tag `v1`.

---

## La página

- **Filtros**, abajo a la izquierda: una categoría a la vez —con sus cinco
  ciclones más fuertes numerados— o todas, y la temporada.
- **Clic en un punto**: un panel con el viento máximo, muertes y afectados
  (EM-DAT), duración, horas sobre tierra y la curva del viento con los umbrales
  de cada categoría.
- **Dónde estás**: junto al punto de llegada, un rótulo dice en qué país tocó
  tierra y desde qué cuenca venía. Al acercarse aparece un minimapa arriba a la
  derecha con la zona visible; un clic en él lleva la vista ahí.
- **Moverse**: rueda o `+` / `−` para acercarse, arrastrar para desplazarse,
  «Restablecer» para volver al mundo. `Esc` cierra el panel.

### Cómo suena

| Lo que se oye | Lo que codifica |
|---|---|
| El ritmo de las ráfagas | El viento: de 0,75 ráfagas por segundo a 30 kt hasta 6 por segundo a 185 kt |
| La aspereza del sonido | La categoría: liso en tormenta tropical, más áspero en cada categoría |
| El volumen | Nada: es fijo |

Al elegir un ciclón suenan 3,5 s de su viento máximo; «Reproducir audio» recorre
toda su vida en 7 a 20 s. [`scripts/verificar_sonido.html`](scripts/verificar_sonido.html)
lo mide sobre el código de la página. El porqué está en
[`docs/decisiones.md`](docs/decisiones.md#el-sonido-deja-de-codificar-con-el-volumen).

### Sus datos

La página no lee `data/`: trae sus datos dentro de `index.html`
(`window.__APP__`, 5,4 MB): los ciclones con su trayectoria, las fronteras de
geoBoundaries (`data/geo/`) y las cifras de EM-DAT (`data/emdat_by_sid.json`).
**El script que arma ese bloque no está en el repositorio**: hasta que esté, no
se puede regenerar ni verificar desde `data/`.

---

## Para trabajar sobre los datos

Ciclones tropicales de [IBTrACS v04r01](https://www.ncei.noaa.gov/products/international-best-track-archive)
(NOAA NCEI), filtrados y agregados: **2.741 ciclones**, **78.786 observaciones**
6-horarias, 7 cuencas, temporadas **2000–2026**.

La ventana arranca en 2000 porque desde ahí la cobertura satelital y los métodos
de estimación de intensidad son homogéneos en las siete cuencas: las temporadas
se comparan entre sí sin corregir nada. Con `--desde 1980` se recupera la
ventana de la V1.

**Empieza por [`data/README.md`](data/README.md)** — es el manual de la base de
datos: el diccionario de cada columna con tipos, unidades, rangos y nulos; los
códigos de cuenca, naturaleza y Saffir-Simpson; qué se filtró y por qué; qué
puede y qué no puede sostener esta ventana; y las seis trampas que conviene
conocer **antes** de graficar (la cuenca `NA` que desaparece sola, las longitudes
que pasan de 180, `sshs = -1` que no es un nulo, las temporadas provisionales,
`n_landfall_pts` que no cuenta recaladas, y `season` que no es el año calendario).

**Si vas a hacer los gráficos con una IA**, pégale
[`data/PROMPT.md`](data/PROMPT.md) antes de pedirle nada: es el manual
comprimido a una página, con el esquema exacto y las seis trampas, listo para
copiar en el chat. Con un agente de código basta decirle que lea
`data/README.md`.

Se puede cargar directo desde GitHub, sin clonar ni configurar nada — las dos
rutas mandan `Access-Control-Allow-Origin: *`:

```js
const BASE = "https://m4rkvr.github.io/iic2026-e1/data/";
const storms = await d3.csv(BASE + "csv/storms.csv", d3.autoType);
```

```python
import pandas as pd
# keep_default_na=False: si no, la cuenca "NA" se lee como valor ausente
obs = pd.read_csv("https://m4rkvr.github.io/iic2026-e1/data/csv/observations.csv",
                  keep_default_na=False, na_values=[""], parse_dates=["iso_time"])
```

Los tres CSV se abren tal cual en Sheets, Excel, RAWGraphs, Flourish,
Datawrapper o Tableau — `observations.csv` son 1,0 millón de celdas, bajo el
límite de 10 millones de Sheets.

### Los archivos

| Archivo | Grano | Filas | Peso |
|---|---|---|---|
| `data/csv/observations.csv` | una observación 6-horaria | 78.786 | 6,5 MB |
| `data/csv/storms.csv` · `data/storms.json` | un ciclón | 2.741 | 254 KB · 730 KB |
| `data/csv/seasons.csv` · `data/seasons.json` | temporada × cuenca | 165 | 6,6 KB · 26 KB |
| `data/tracks.json` | trayectorias, formato columnar | 1.230 ciclones | 1,1 MB |
| `data/meta.json` | procedencia, filtros, inventario con `sha256` | — | 2 KB |

Las mismas tablas en dos formatos, **con las columnas llamadas igual en ambos**.
`observations.csv` es la tabla base: las otras dos son un `groupby` de ella.

Para comprobar que una copia es la publicada:

```bash
python3 scripts/verificar_dataset.py   # compara data/ con los sha256 de meta.json
python3 scripts/verificar_cifras.py    # recalcula las cifras citadas en los docs
```

## Regenerar los datos

```bash
pip install pandas

python3 scripts/preprocess.py --source since1980                # lo publicado (2000+)
python3 scripts/preprocess.py --source since1980 --desde 1980   # la ventana de la V1
python3 scripts/preprocess.py --source last3years               # ~10 MB, rápido
python3 scripts/preprocess.py --source ALL --desde 1842         # todo el archivo
```

El CSV crudo queda en `scripts/cache/` (ignorado por git) y se reutiliza en las
corridas siguientes. `--source` elige qué archivo se baja de NOAA y `--desde`
recorta las temporadas; ninguno de los dos cambia el esquema.

La GitHub Action [`.github/workflows/datos.yml`](.github/workflows/datos.yml)
hace lo mismo sin instalar nada: verifica los datos en cada push, y los regenera
desde NOAA cuando se la ejecuta a mano (*Actions → datos → Run workflow*).

## Datos: qué se filtró y por qué

De 309.724 filas leídas quedaron 78.786.

- Se descartan las ramas secundarias (`TRACK_TYPE` con `spur`). **No** se filtra
  por `TRACK_TYPE == "main"`: eso borraría las temporadas recientes completas,
  que llegan marcadas `PROVISIONAL` / `US-PROVISIONAL`.
- Solo temporadas **2000 y posteriores**: homogeneidad de la cobertura satelital,
  que es lo que permite comparar temporadas entre sí.
- Solo horas sinópticas 00/06/12/18 UTC. Las filas de las 03/09/15/21 h son
  interpolación de IBTrACS, no reportes de agencia: conservarlas duplicaría cada
  reporte con un valor derivado de él. Comprobable con
  `python3 scripts/verificar_interpolacion.py`.
- Viento: `USA_WIND` con respaldo `WMO_WIND` (mucha mayor cobertura, a cambio de
  mezclar criterios de agencia).
- Categoría 4–5: `USA_SSHS >= 4`, o viento máximo ≥ 113 kt cuando falta.
- `pandas` necesita `keep_default_na=False`: el código de cuenca `"NA"`
  (Atlántico Norte) se leería como valor ausente y esa cuenca desaparecería
  en silencio.

Las temporadas 2025–2026 son **provisionales** hasta el reanálisis de las
agencias. El detalle completo —cada columna, sus rangos y sus nulos— está en
[`data/README.md`](data/README.md).

## La V1, congelada

Página interactiva y sonificada sobre la intensificación de los ciclones:
tres gráficos enlazados (tendencia, distribución, mapa) con cross-filtering,
navegación por teclado y sonificación multidimensional en Tone.js — tono,
ritmo y timbre codificando variables distintas.

Está entera en [`versions/v1/`](versions/v1/), con su propia copia de los datos
—la ventana **1980–2026**, 4.827 ciclones—, así que sigue funcionando aunque el
esquema o la ventana cambien en la raíz. Su diseño y sus
justificaciones están en [`docs/decisiones.md`](docs/decisiones.md); no se
pierde nada al rehacer la página.

## Correr en local

```bash
python3 -m http.server 8000
# http://localhost:8000                               -> la página
# http://localhost:8000/versions/v1/                  -> la V1
# http://localhost:8000/scripts/verificar_sonido.html -> mide el sonido de la página
```

La página trae sus datos adentro y abre también con doble clic. La V1 y la
verificación del sonido necesitan el servidor: la V1 carga sus datos con
`fetch()` y la verificación abre la página en un iframe, y las dos cosas fallan
con `file://`.

## Estructura

```
index.html              la página: mapa, panel y sonido, con sus datos adentro
data/                   la base de datos
data/README.md          su manual: diccionario, códigos, trampas
data/PROMPT.md          el manual comprimido, para pegarle a una IA
data/csv/               las tablas en CSV (y paises_continente.csv: país → continente)
data/geo/               fronteras de países y regiones (geoBoundaries), para la página
data/emdat_by_sid.json  muertes y afectados por ciclón (EM-DAT), para la página
scripts/preprocess.py   IBTrACS → JSON + CSV
scripts/verificar_cifras.py    recalcula las cifras que se citan
scripts/verificar_dataset.py   compara data/ con los sha256 de meta.json
scripts/verificar_interpolacion.py  prueba que las filas a 3 h son interpoladas
scripts/verificar_sonido.html  mide el sonido de la página: volumen, ráfagas, aspereza
scripts/freeze.sh       congela la versión actual en versions/vN/
docs/entrega-e1.md      plantilla del documento de entrega
docs/checklist-e1.md    estado de la entrega y lo que falta
docs/hoja-observador.md protocolo de thinking aloud
docs/decisiones.md      bitácora de diseño (alimenta el rationale)
docs/capturas/          capturas de antes y después de cada cambio (evidencia por versión)
versions/v1/            la V1 completa y navegable
```

## Publicar en GitHub Pages

El sitio es estático y sin build; todas las rutas son relativas. En
**Settings → Pages**: source `main`, carpeta `/(root)`. El archivo `.nojekyll`
está incluido para que Jekyll no procese `versions/`.

## Declaración de uso de IA

Según la política del curso: el andamiaje de código (pipeline de datos,
estructura de la página, gráficos y sonificación) se construyó con asistencia de
**Claude**. Las decisiones de diseño, su justificación y las iteraciones están
documentadas en [`docs/decisiones.md`](docs/decisiones.md).

## Créditos de datos

Knapp, K. R., H. J. Diamond, J. P. Kossin, M. C. Kruk, C. J. Schreck (2018):
*International Best Track Archive for Climate Stewardship (IBTrACS) Project,
Version 4r01*. NOAA National Centers for Environmental Information.
DOI [10.25921/82ty-9e16](https://doi.org/10.25921/82ty-9e16).

Muertes y afectados: EM-DAT, CRED / UCLouvain, Bruselas, Bélgica —
[www.emdat.be](https://www.emdat.be/). Solo registra los desastres que superan
sus umbrales, así que «sin registros» no significa cero víctimas.

Fronteras de países y regiones: [geoBoundaries](https://www.geoboundaries.org/)
(William & Mary geoLab), licencia CC BY 4.0.
