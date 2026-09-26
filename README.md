# Los ciclones no son más; los fuertes son más frecuentes

Visualización de información **interactiva y sonificada** sobre la
intensificación de los ciclones tropicales, construida sobre
[IBTrACS v04r01](https://www.ncei.noaa.gov/products/international-best-track-archive)
(NOAA NCEI).

Entrega **E1** del curso
[InfoVis IIC2026](https://infovis.alessiobellino.com/) · Pontificia Universidad
Católica de Chile.

---

## Correr en local

La página carga sus datos con `fetch()`, así que **necesita un servidor**:
abrir `index.html` con doble clic (`file://`) falla por CORS.

```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

Los JSON ya vienen en `data/`, así que esto basta para verla funcionando.

## Regenerar los datos

```bash
# rápido, 3 temporadas (~10 MB de descarga)
python3 scripts/preprocess.py --source last3years

# la serie completa 1980–2026 (~144 MB de descarga, ~6 s de proceso)
python3 scripts/preprocess.py --source since1980

# todo el archivo histórico, desde 1842 (~332 MB)
python3 scripts/preprocess.py --source ALL
```

Requiere `pandas`. El CSV crudo queda en `scripts/cache/` (ignorado por git) y
se reutiliza en las corridas siguientes. **La página no cambia entre una fuente
y otra**: la granularidad por defecto y los textos se adaptan a lo que haya.

Salidas en `data/` (con `since1980`, ~3,3 MB en total):

| Archivo | Qué contiene |
|---|---|
| `seasons.json` | agregados por temporada y cuenca |
| `storms.json` | una fila por ciclón, con su punto de máxima intensidad |
| `tracks.json` | trayectorias 6-horarias de los ciclones de ≥ 64 kt |
| `meta.json` | fuente, fecha de descarga y filtros aplicados |

## Publicar en GitHub Pages

El sitio es estático y sin build. Todas las rutas son relativas, así que
funciona igual en la raíz o bajo `/<repo>/`.

```bash
git init && git add -A && git commit -m "V1: la idea completa funcionando"
git tag v1
gh repo create <nombre> --public --source=. --push
```

Luego en **Settings → Pages**: source `main`, carpeta `/(root)`.
El archivo `.nojekyll` ya está incluido para que Jekyll no procese `versions/`.

## Estructura

```
index.html              la página
css/style.css           roles de color, grilla, tema claro/oscuro
js/data.js              carga los JSON y deriva los agregados
js/state.js             estado central compartido (cross-filtering)
js/charts.js            los tres gráficos (Plotly)
js/sonify.js            sonificación (Tone.js)
js/main.js              arranque y conexión entre todo
scripts/preprocess.py   IBTrACS → JSON livianos
scripts/freeze.sh       congela la versión actual en versions/vN/
docs/entrega-e1.md      plantilla del documento de entrega
docs/hoja-observador.md protocolo de thinking aloud
docs/decisiones.md      bitácora de diseño (alimenta el rationale)
versions/               copias navegables de cada versión
```

## Cómo se usa la página

| | |
|---|---|
| Clic en una década | filtra la distribución y el mapa |
| Clic en un ciclón | abre su detalle y resalta su trayectoria |
| <kbd>←</kbd> <kbd>→</kbd> | recorren los ciclones de la selección |
| <kbd>espacio</kbd> | reproduce la trayectoria seleccionada |
| <kbd>Esc</kbd> | limpia la selección |

El sonido arranca apagado: los navegadores exigen un gesto del usuario antes de
abrir el contexto de audio.

## Sonificación

No es decorativa — cada parámetro audible codifica una variable distinta:

**Escuchar la tendencia** · tono ← proporción de cat. 4–5 · ritmo ← número de
ciclones · timbre ← cuenca seleccionada

**Reproducir trayectoria** · tono ← viento · densidad rítmica ← tasa de
intensificación · corte del filtro ← distancia a tierra (el ciclón "se apaga"
al tocar tierra)

## Datos: qué se filtró y por qué

- Se descartan las ramas secundarias (`TRACK_TYPE` con `spur`). **No** se filtra
  por `TRACK_TYPE == "main"`: eso borraría las temporadas recientes completas,
  que llegan marcadas `PROVISIONAL` / `US-PROVISIONAL`.
- Solo horas sinópticas 00/06/12/18 UTC. Desde ~2010 algunas agencias interpolan
  a 3 h; sin este filtro las temporadas recientes aportarían el doble de puntos.
- Viento: `USA_WIND` con respaldo `WMO_WIND` (mucha mayor cobertura).
- Categoría 4–5: `USA_SSHS >= 4`, o viento máximo ≥ 113 kt cuando falta.
- `pandas` necesita `keep_default_na=False`: el código de cuenca `"NA"`
  (Atlántico Norte) se leería como valor ausente y esa cuenca desaparecería
  en silencio.

Las temporadas recientes son **provisionales** hasta el reanálisis de las
agencias; la página lo advierte y las marca en la tabla.

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
