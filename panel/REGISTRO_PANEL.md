# Registro del panel táctil (E2, prototipo físico)

Bitácora del panel desde el primer pedido (3 de noviembre de 2026) hasta la versión por
continentes (7 de noviembre de 2026). Horas en hora de Chile (UTC−3).

## 1. Qué es el panel

Una tablet acostada sobre la mesa muestra círculos. Encima va un cartón con agujeros
que calzan con esos círculos. Al tocar la pantalla a través de un agujero, la tablet
envía el número del agujero al computador. El computador muestra un ciclón y hace
sonar su viento día a día, con el mismo sonido de la página principal: más agudo y con
más silbido cuanto más fuerte es el viento, sin cambiar el volumen.

Es una adaptación del **artefacto 08 «Panel táctil»** del Physical Viz Toolkit del curso.

## 2. Fuentes del curso utilizadas

| Fuente | Qué se tomó |
|---|---|
| Physical Viz Toolkit, IIC2026 — <https://infovis.alessiobellino.com/physicalkit.html> | Principios generales del kit, la Base A2 (soporte cenital) y el uso de marcadores ArUco del prototipo `fisico/` |
| Artefacto 08 «Panel táctil» del toolkit (`physicalkit/artefactos/08-panel/`) | La mecánica completa: tablet con círculos, cartón con agujeros, toque por `pointerdown`, la función `enviarNumero()` y el evento `{tipo:"panel", accion:"press", id, numero, marcador, valor}` enviado con `Protobject.Core.send(...).to("index.html")`. También la puesta en marcha: «+ Conectar tablet», QR, pantalla completa y calcar los círculos antes de cortar |
| Artefacto 03 «Dado» del toolkit | El formato de `config.js` (`Protobject.setProduction(true)` + `Protobject.initialize([...])`), usado en todas las versiones |
| Sitio del curso — <https://infovis.alessiobellino.com/> | Cápsulas 25 (mantra de Shneiderman), 27–28 (sonificación) y 07–10 (Lie Factor, área vs. radio), aplicadas al diseño de la pantalla |
| Documentación de Protobject — <https://framework.protobject.com> | API de `Protobject.Core.send/onReceived`, ArUco y NFC |
| Ejemplos del autor de Protobject (repositorio `bellinux/demo.pframework`) | Confirmar que el `config.js` del panel sigue el mismo patrón que los ejemplos oficiales (página `main` con `debug: "master"` y página secundaria con `debug: "local"`) |

**Otras fuentes**

- **Datos:**
  - IBTrACS v04r01 (NOAA NCEI): trayectorias y viento.
  - EM-DAT (CRED / UCLouvain): muertes y afectados.
  - geoBoundaries CGAZ: fronteras para el mapa.
- **Código y servicios:**
  - qrcode-generator 1.4.4 (Kazuhiko Arase, servido desde cdnjs): genera el código QR.
  - ntfy.sh (<https://docs.ntfy.sh>): canal de mensajes de la versión final.
- **Medidas de la plantilla:** especificaciones de Apple del iPad de 8.ª generación (2160 × 1620 px a 264 ppi, es decir, 207,8 × 155,9 mm).

## 3. Versiones del panel

### v1 — 6 categorías (3-nov, ~02:15)

- **Qué hace:** la tablet muestra 6 círculos, TT y categorías 1 a 5, con los colores de la página. Al tocar uno, el computador muestra el ciclón más fuerte de esa categoría y suena su viento. Si se repite el toque, pasa al siguiente del top 5.
- **Datos:** `datos.js` guarda el top 5 por categoría: por viento máximo y, a igual viento, por más muertes.
- **Archivos:** `sensor.html`, `index.html`, `config.js`, `datos.js`, `sonido.js`.
- **Problema:** en el teléfono la pantalla quedaba negra. El script declaraba `const Z` y `const p`, y la librería de Protobject (`p.js`) ya declara una variable global `var Z`. Ese choque de nombres es un error de sintaxis que impide que corra todo el script.

### v2 — botones en el HTML, como el kit (3-nov, ~02:30)

- **Cambio:** los 6 botones quedan escritos en el HTML con `data-num`, la función `enviarNumero()` es la del kit y el código queda aislado dentro de una función.
- **Pantalla vertical:** en el teléfono en vertical, los círculos se reordenan en 2 × 3.
- **Resultado:** los círculos se ven, pero los toques no llegan al computador.

### v3 — escucha después de `config.js` y mensajes de estado (3-nov, ~02:40)

- **Cambio:** en `index.html`, `Protobject.Core.onReceived` se registra después de cargar `config.js`.
- **Diagnóstico:** las dos pantallas muestran el estado: «Enviado: n» en la tablet y «Panel: mensaje recibido» en el computador.

### v4 — mapa con 8 regiones (`panel-mapa/`, 3-nov, ~03:05)

- **Tablet:** un mapa con 8 regiones (EE. UU. y Canadá, México y Centroamérica, Caribe, Índico Norte, Asia oriental, Sudeste asiático, Oceanía, África suroriental).
- **Toques:** el número de toques seguidos sobre una región (1 a 5) es la categoría.
- **Computador:** muestra el ciclón más fuerte de esa categoría en esa región.
- **Plantilla:** `plantilla_ipad8_A4.pdf`, a tamaño real para el iPad de 8.ª generación, con agujeros de 20 mm.

### v5 — «Más mortales de 2025» (7-nov, 18:00)

- **Cambio:** las mismas 8 regiones, ahora con un solo dato por región: el ciclón de 2025 con más muertes según EM-DAT.
- **Pantalla:** mapa con círculos de área proporcional a las muertes y una lista ordenada.
- **Subida:** el grupo la subió dentro de `panel/`.
- **Problema:** la tablet no conectaba. Se probaron tres arreglos, todos sin éxito en la tablet real:
  - Mensaje solo con campos ASCII (sin tildes) y envío inmediato al tocar.
  - Datos de las regiones escritos dentro del propio `sensor.html`.
  - Botones en el HTML y errores visibles en ambas pantallas.

  Aun escaneando el QR de Protobject, la tablet decía «no hay conexión».

### v6 — 7 continentes, QR propio (7-nov, versión actual)

**Datos**
- **Continentes:** América del Norte, América del Sur, Europa, África, Asia, Oceanía y Antártida.
- **Temporada:** se elige automáticamente la que tiene registro en EM-DAT en más continentes. Es **2015**, con 5 de 7. Ningún ciclón tropical llega a la Antártida, y en 2015 ninguno tocó tierra en América del Sur.
- **Criterio:** por continente se toma el ciclón con más muertes y, a igual muertes, el que tiene más afectados.

**Conexión** (el cambio principal)
- **Canal principal:**
  - El computador genera una «sala» y muestra **su propio código QR**, que abre `sensor.html?sala=XXXXX`.
  - Cada toque se publica por HTTPS en ntfy.sh, en el tema `iic2026-panel-XXXXX`, y el computador está suscrito a ese mismo tema.
  - No depende de WebRTC, que es lo que Protobject usa para conectar los dispositivos y lo que fallaba en la red del grupo.
- **Canal Protobject** (opcional, como en el kit):
  - Si Protobject carga y la tablet entra por su botón «+», también funciona.
  - Cada mensaje lleva un identificador `t`, para que el computador no lo cuente dos veces si llega por los dos canales.
- **Formato del mensaje:** es el mismo del kit (`tipo, accion, id, numero, marcador, valor`).

**Pantalla del computador**
- Mapa con círculos de área proporcional a las muertes.
- Lista ordenada por muertes, con los afectados de cada ciclón.
- Detalle del ciclón elegido, con su sonido.
- Notas cuando el dato puede inducir a error. Por ejemplo, las muertes de Joaquin ocurrieron sobre todo en Bahamas y en el mar, no en Portugal.

**Archivos regenerables**
- `scripts/construir_panel.py` regenera `datos.js`, `mapa.png` y `plantilla_ipad8_A4.pdf`.
- Agujeros de 25 mm.

## 4. Datos de la versión actual (temporada 2015)

| # | Continente | Ciclón | Muertes | Afectados | Tocó tierra en |
|---|---|---|---|---|---|
| 1 | América del Norte | Patricia | 14 | 15.000 | México |
| 2 | América del Sur | — | — | — | ningún ciclón tocó tierra |
| 3 | Europa | Joaquin | 58* | 7.510 | Portugal |
| 4 | África | Chedza | 89 | 174.007 | Mozambique (según el cálculo de la página) |
| 5 | Asia | Koppu | 51 | 2.898.590 | Filipinas |
| 6 | Oceanía | Marcia | 1 | 6.000 | Australia |
| 7 | Antártida | — | — | — | los ciclones tropicales no llegan |

\* EM-DAT cuenta las muertes de todo el evento.

**Limitaciones de estos datos**

- La página solo incluye ciclones que **tocaron tierra**. Pam (2015), que devastó Vanuatu pasando entre las islas, no aparece porque su centro no tocó tierra.
- El continente se asigna por el lugar de llegada a tierra que calcula la página, no por dónde ocurrieron las muertes.

## 5. Commits en GitHub (m4rkvr/iic2026-e1) desde el primer pedido

| Commit | Fecha (hora Chile) | Rama | Mensaje | Qué pasó |
|---|---|---|---|---|
| `6cc86fa` | 3-nov 02:19 | `e2` | prueba sobre panel traspaso físico | Se sube la v1 en la **raíz** de la rama `e2`. Su `index.html` reemplaza al de la página E1 en esa rama. GitHub Pages publica `main`, así que no se veía |
| `b00545f` | 3-nov 02:25 | `main` | ajuste carpeta, panel trapaso fisico | Se sube la v1 a `main`, en la carpeta `panel/` |
| `7b04c1c` | 3-nov 02:36 | `main` | cambio, no se veían las categorías en la pantalla | v2: botones en el HTML (arregla la pantalla negra) |
| `323f575` | 3-nov 02:43 | `main` | modificación conexión | v3: escucha después de `config.js` y mensajes de estado |
| `f689d55` | 3-nov 03:09 | `main` | prueba disposición con mapa por región | v4: carpeta `panel-mapa/` con las 8 regiones |
| `8f25ea6` | 7-nov 17:03 | `main` | Carpeta registro fotografico modelo fisico E2 | Fotos del prototipo (`Registro fotográfico/*.heic`) |
| `7fe8000` | 7-nov 17:49 | `main` | Agregó boceto maqueta | `Registro fotográfico/Boceto_PasadoR1.jpg` |
| `47984c6` | 7-nov 17:58 | `main` | Se agrega panel para imprimir del prototipo 1 | `Registro fotográfico/plantilla_panel_protipoR1.pdf`: es la plantilla de la v4, idéntica byte a byte |
| `9017b22` | 7-nov 18:07 | `main` | Panel con reducción de datos | v5 (más mortales de 2025) subida dentro de `panel/`. Reemplaza la v3 |
| `1ab43f1` | 7-nov 18:18 | `main` | Renovación por conexión con el sensor anterior | `panel/sensor.html` con las regiones escritas dentro y el aviso «Sin conexión» (incluye el envío solo ASCII) |
| `2997370` | 7-nov 18:28 | `main` | Arreglo conexión sensor | `panel/sensor.html` e `index.html` con botones en el HTML y errores visibles. Siguió sin conectar |

La v6 (esta carpeta) todavía no está en GitHub. Desde la sesión de Claude no se puede
hacer push al repositorio (error 403), así que la sube el grupo.

## 6. Archivos generados, en orden cronológico

| Fecha (Chile) | Archivo | Para qué | ¿Está en GitHub? |
|---|---|---|---|
| 3-nov ~00:30 | `fisico/` (`index.html`, `sensor.html`, `config.js`, `datos.js`, `sonido.js`, `mapa_A3.pdf`, `fichas_A4.pdf`, `README.md`), `scripts/construir_fisico.py` | Primer prototipo físico: mapa de cartón, fichas de año con ArUco y teléfono cenital | No |
| 3-nov ~02:15 | `panel/` v1 (`sensor.html`, `index.html`, `config.js`, `datos.js`, `sonido.js`) | Panel de 6 categorías | Sí (`b00545f`, y `6cc86fa` en `e2`) |
| 3-nov ~02:30 | `panel/sensor.html` v2, `panel/index.html` | Botones en el HTML y vista vertical | Sí (`7b04c1c`) |
| 3-nov ~02:40 | `panel/sensor.html` v3, `panel/index.html` v3 | Escucha después de `config.js` y estados | Sí (`323f575`) |
| 3-nov ~03:05 | `panel-mapa/` (`sensor.html`, `index.html`, `config.js`, `datos.js`, `sonido.js`, `mapa.png`), `scripts/construir_panel_mapa.py` | 8 regiones; toques = categoría | Sí (`f689d55`), salvo el script |
| 3-nov ~03:10 | `panel-mapa/plantilla_ipad8_A4.pdf` | Plantilla del cartón a tamaño real | Sí, como `Registro fotográfico/plantilla_panel_protipoR1.pdf` (`47984c6`) |
| 7-nov ~18:00 | `mortales-2025/` (`index.html`, `sensor.html`, `datos.js`, `config.js`, `sonido.js`, `mapa.png`) | Más mortales de 2025 por región | Sí, dentro de `panel/` (`9017b22`) |
| 7-nov ~18:10 | `sensor.html` (solo ASCII, envío inmediato, regiones dentro del archivo) | Intento de arreglar la conexión | Sí (`1ab43f1`) |
| 7-nov ~18:25 | `sensor.html` e `index.html` (botones en el HTML, errores visibles) | Diagnóstico de la conexión | Sí (`2997370`) |
| 7-nov ~18:45 | `panel/` v6 (`index.html`, `sensor.html`, `config.js`, `datos.js`, `sonido.js`, `mapa.png`, `plantilla_ipad8_A4.pdf`, `REGISTRO_PANEL.md`), `scripts/construir_panel.py` | 7 continentes, temporada 2015, QR propio | No, pendiente de subir |

## 7. Lo aprendido sobre la conexión

1. **Pantalla negra = error de script.** No se debe usar nombres de variables globales cortos (`Z`, `p`, `$`), porque `p.js` de Protobject los puede ocupar. Conviene escribir los botones en el HTML y el código dentro de una función.
2. **El orden de carga importa.** La escucha (`onReceived`) se registra después de `config.js`.
3. **Protobject conecta los dispositivos con WebRTC**, mediante PeerJS. En algunas redes, como las de una universidad o un teléfono con datos móviles, esa conexión no se establece aunque el QR se escanee bien. La v6 agrega un canal por HTTPS común (ntfy.sh), que funciona donde funciona cualquier página web. Mantiene Protobject como canal opcional para seguir el kit.
4. **El canal ntfy.sh es público.** Cualquiera que conozca el nombre de la sala podría enviar un toque. Para un prototipo de clase no es un problema, porque solo viajan números del 1 al 7. Si molestara, el botón «Nuevo código» cambia la sala.
