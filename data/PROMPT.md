# Contexto para pegar en una IA

Copia **todo** este archivo en el chat (Claude, ChatGPT, Copilot, Cursor) antes
de pedir un gráfico. Con esto la IA tiene el esquema exacto, las URLs y los seis
errores que cometería si no lo tuviera.

Después de pegarlo, pide algo concreto: *«hazme un gráfico de la proporción de
cat. 4–5 por temporada, con las provisionales marcadas, en Plotly»*.

Si trabajas en el repo con un agente de código (Claude Code, Cursor), no hace
falta pegar nada: dile que lea `data/README.md`, que es la versión larga.

---

```
## Dataset: ciclones tropicales 2000-2026 (IBTrACS v04r01, NOAA NCEI)

Subconjunto filtrado de IBTrACS. 2.741 ciclones, 78.786 observaciones
6-horarias, 7 cuencas, temporadas 2000-2026. Huracán, tifón y ciclón son el
mismo fenómeno con nombre regional distinto; están todos.

### Archivos y URLs (CORS abierto, se pueden fetchear directo)

Base: https://m4rkvr.github.io/iic2026-e1/data/

- csv/observations.csv  78.786 filas - una observación 6-horaria. TABLA BASE.
- csv/storms.csv         2.741 filas - un ciclón, con su punto de máxima intensidad
- csv/seasons.csv          165 filas - agregado por temporada x cuenca
- tracks.json            1.230 ciclones - trayectorias, formato columnar
- storms.json / seasons.json - las mismas tablas que los CSV, mismos nombres de columna
- meta.json - procedencia, filtros y sha256 de cada archivo

storms y seasons son derivables de observations con un groupby. No hay otra
tabla ni otra columna: si necesitas algo que no esté acá, no existe en el dataset.

### Esquema

observations.csv  (clave: sid + iso_time)
  sid           texto    ID IBTrACS, ej "2024279N21265"
  iso_time      texto    ISO 8601 UTC, solo horas 00/06/12/18. Rango 1999-12-09 a 2026-09-24
  season        entero   2000-2026
  basin         texto    NA|EP|WP|NI|SI|SP|SA  (cuenca de origen)
  name          texto    mayúsculas, "SIN NOMBRE" si no tiene
  nature        texto    TS tropical | DS disturbio | MX mixta | ET extratropical | NR no reportada | SS subtropical
  lat           decimal  -61,3 a 70,7
  lon           decimal  -179,8 a 257,4   <-- PUEDE PASAR DE 180
  wind_kt       entero   3-185, viento máximo sostenido
  pres_mb       entero   872-1024, presión central. VACÍO en 709 filas (0,9%)
  sshs          entero   -5 a 5, Saffir-Simpson. LOS NEGATIVOS SON CÓDIGOS, NO NULOS
  dist2land_km  entero   0-4270, distancia a la costa. 0 = en tierra (6.133 filas)
  provisional   bool     true/false

storms.csv  (clave: sid)
  sid, season, basin, name        igual que arriba ("SIN NOMBRE" en 526)
  max_wind        entero   4-185, máximo de wind_kt del ciclón
  min_pres        entero   872-1016, VACÍO en 15 ciclones
  sshs_max        entero   -5 a 5, máximo de sshs
  cat45           bool     sshs_max>=4 OR max_wind>=113. true en 489 (17,8%)
  peak_lat        decimal  posición del máximo viento
  peak_lon        decimal  idem, puede pasar de 180
  start, end      texto    AAAA-MM-DD
  provisional     bool     true en 152 (temporadas 2025-2026)
  n_landfall_pts  entero   0-68, observaciones a <=50 km de la costa
  min_dist2land   entero   0-3817 km
  has_track       bool     si está en tracks.json (= max_wind>=64). true en 1.230

seasons.csv  (clave: season + basin, 165 filas)
  season, basin
  n_storms, n_cat45      enteros
  share_cat45            decimal 0-1 = n_cat45/n_storms
  mean_max_wind, median_max_wind, p90_max_wind   decimales, en nudos
  provisional            bool

tracks.json  {sid: {lat:[...], lon:[...], wind:[...], h:[...], d2l:[...]}}
  Los 5 arrays de un ciclón tienen el mismo largo y orden temporal.
  h = horas desde la primera observación (0, 6, 12, ...). La fecha absoluta
  está en storms.start. d2l = km a tierra.

### Escala sshs (los negativos NO son valores ausentes)

  -5 desconocido   -4 post-tropical   -3 disturbio/onda/baja   -2 subtropical
  -1 depresión tropical (15-32 kt)    0 tormenta tropical (35-60 kt)
   1 cat1 64-80    2 cat2 84-95    3 cat3 98-112    4 cat4 115-135    5 cat5 138-185

Un ciclón cambia de sshs durante su vida: casi todos empiezan y terminan en
negativo. Para clasificar al ciclón completo usa sshs_max o cat45 de storms.csv,
nunca el sshs de una observación suelta.

### Cuencas

  WP Pacífico Noroccidental  770 ciclones (tifón)
  EP Pacífico Nororiental    534 (huracán)
  SI Índico Sur              459 (ciclón tropical)
  NA Atlántico Norte         468 (huracán)
  SP Pacífico Sur            259 (ciclón tropical)
  NI Índico Norte            248 (ciclón severo)
  SA Atlántico Sur             3 (ciclón tropical)

### SEIS ERRORES QUE DEBES EVITAR

1. basin "NA" (Atlántico Norte) se lee como NaN y borra 468 ciclones en
   silencio. En pandas SIEMPRE:
     pd.read_csv(url, keep_default_na=False, na_values=[""])
   En R: na.strings="". d3.autoType no tiene el problema.
   Verifica que basin tenga 7 valores distintos, no 6.

2. lon llega hasta 257,4: los ciclones que cruzan la antimeridiana no están
   normalizados. Plotly scattergeo lo maneja solo. Leaflet, d3.scaleLinear y
   matplotlib necesitan:  ((lon + 180) % 360 + 360) % 360 - 180
   (a cambio, las líneas saltan en la antimeridiana).

3. Las temporadas 2025 y 2026 son PROVISIONALES y 2026 está en curso. En una
   serie temporal el último punto parece una caída y es cobertura incompleta.
   Márcalas o exclúyelas, pero nunca las grafiques como iguales. Números
   firmes: hasta 2024.

4. sshs = -1 es depresión tropical, no un nulo. Filtrar sshs > 0 bota el 79%
   de las observaciones.

5. n_landfall_pts NO cuenta recaladas: cuenta observaciones a <=50 km de la
   costa. Un ciclón paralelo al litoral suma 68 sin tocar tierra.

6. season NO es el año calendario. En el hemisferio sur la temporada empieza en
   el segundo semestre del año anterior: iso_time arranca en 1999-12-09, y en
   168 de los 2.741 ciclones los 4 primeros dígitos del sid no coinciden con su
   season. Agrupa por season, nunca por iso_time.year ni por sid[:4].

### Al agregar

- share_cat45 es una proporción POR CELDA (temporada x cuenca). Para el total
  mundial de una temporada NO promedies proporciones: suma n_cat45 y n_storms y
  divide. Las cuencas son de tamaños muy distintos (WP 28% de los ciclones,
  SA 0,1%).
- min_pres es el mínimo de las observaciones que sí traían presión, así que no
  es comparable entre ciclones con cobertura distinta. Para presión, usa
  pres_mb a nivel de observación.

### Qué dicen y qué no dicen estos datos

- El total por temporada es ESTABLE: 25 temporadas completas (2000-2024), min
  87, mediana 100, max 118. Tendencia +2,3 por década con error estándar 2,4:
  indistinguible de cero.
- La proporción de cat. 4-5 NO muestra tendencia en esta ventana: 17,2% (2000s),
  19,7% (2010s), 16,2% (2020s incompleta). Ajuste por temporada 2000-2024:
  +0,6 puntos por década, error estándar 1,5 (t=0,39). La variación interanual
  (sigma = 5,2 puntos; 10,1% en 2022 vs 29,4% en 2015) es NUEVE VECES la
  pendiente por década. Con 25 temporadas este dato no resuelve una tendencia.
  No afirmes que los ciclones se están intensificando con estos datos.
- Sí soporta: comparaciones entre cuencas, variabilidad interanual, geografía
  del punto de máxima intensidad, tasa de intensificación (desde tracks.json),
  y cercanía a tierra.

### Qué NO contiene

Lluvia, oleaje, marejada, daños, muertes, costos, población, ni fronteras ni
geometrías de países. Lo único geográfico es dist2land_km. Para cruzar con
países hace falta una capa aparte (geoBoundaries, Natural Earth) y hacer el
point-in-polygon.

### Filtros ya aplicados (no los repitas)

De 309.724 filas del CSV original quedan 78.786:
  -1.144    ramas secundarias (TRACK_TYPE con "spur", duplican el evento)
  -141.326  temporadas anteriores a 2000 (homogeneidad de cobertura satelital)
  -82.975   horas no sinópticas (son interpolación de IBTrACS, no reportes)
  -5.493    observaciones sin viento en ninguna columna de agencia
Viento = USA_WIND con respaldo WMO_WIND (mezcla convenciones de promediado
entre agencias: 1 min en EE.UU., 10 min en JMA). Nada fue imputado.

### Restricciones de la entrega (contexto del curso)

Es una tarea de visualización de información. No uses: ejes truncados, dobles
ejes Y, 3D, ni gráficos de torta. No te apoyes solo en barras. Todo gráfico
tiene que poder justificarse por un principio de codificación visual
(posición > longitud > ángulo > color), no por estética.
```
