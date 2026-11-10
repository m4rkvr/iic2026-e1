# Cambios: de «Ciclones por continente, 2015» a «Máximos por sector, 2000-2026»

- **Versión anterior:** `panel/index.html` en GitHub (commit `2fc871b`, 7-nov-2026, «Cambio panel, md bitácora e2»). Es la versión 6 del panel táctil.
- **Versión nueva:** `index (11).html`, adjuntado el 10-nov-2026.

Para comparar las dos, abrí ambas en un navegador y revisé el código. También contrasté las cifras de la nueva con los datos de la página principal (IBTrACS v04r01 + EM-DAT).

## 1. Resumen

La versión anterior era la **pantalla de un prototipo físico**. Una tablet bajo un cartón con agujeros se conectaba por QR. Cada continente mostraba un solo ciclón de una sola temporada (2015), y al elegirlo sonaba su viento.

La versión nueva es una **visualización estática e independiente**. Para cada sector muestra el ciclón con más muertes y el que afectó a más personas en todo el período 2000-2026. Se puede alternar entre muertes, afectados o ambos. No tiene conexión con la tablet ni sonido.

## 2. Comparación general

| Aspecto | Antes (panel v6) | Ahora (Máximos por sector) |
|---|---|---|
| Título | «El ciclón con más muertes de cada continente, 2015» | «Los ciclones más letales por sector, 2000-2026» |
| Período | Una temporada, 2015, la que tenía registros en más continentes | Todo el período, 2000-2026 |
| Divisiones | 7 continentes | 8 sectores: se separa **América Central** de América del Norte, y el Caribe cuenta con América del Norte |
| Qué ciclón representa a cada división | Uno: el de más muertes y, si empatan, el de más afectados | Dos: el de más muertes y el de más afectados, que pueden ser distintos (por ejemplo, Nargis y Bilis en Asia) |
| Cómo se asigna el ciclón a cada división | Por el país donde tocó tierra, calculado por la página | «Al sector con más países afectados; con empate no se asigna» (nota al pie) |
| Métricas | Muertes, con afectados como dato secundario | Selector: **Muertes / Afectados / Ambos** |
| Mapa | Imagen `mapa.png` de fondo con círculos en SVG encima | Mapa vectorial (SVG) dentro del mismo archivo, con la Antártida dibujada de forma esquemática |
| Tamaño de los círculos | Área proporcional a las muertes (radio ∝ √valor) | El mismo principio, aplicado a muertes o a afectados. En «Ambos», dos círculos superpuestos |
| Lista | Ordenada por muertes, con barra roja y los afectados en texto | Ordenada por la métrica elegida (en «Ambos», por muertes), con barras roja y naranja |
| Detalle del ciclón | Tarjeta con categoría, país, muertes, afectados, viento, duración y notas | No hay tarjeta. La categoría y el viento van en la lista y en el texto emergente del mapa |
| Sonido | Sí: el viento del ciclón día a día, con volumen fijo | No |
| Conexión con la tablet | QR propio (canal ntfy.sh) y Protobject opcional | No hay. Es una página sola |
| Interacción | Clic o toque en el mapa, la lista o el panel de cartón | Selector de métrica, y resaltado vinculado: al pasar el cursor por el mapa o la lista se marca el mismo sector en los dos |
| Accesibilidad | Básica | Mejor: `role="img"` y `aria-label` en el mapa, `<title>` en cada burbuja, foco visible y filas navegables con teclado (`tabindex`) |
| Modo oscuro | No | Sí (`prefers-color-scheme: dark`) |
| Tipografía | Inter / system-ui | Pide Manrope y Fraunces, que no se cargan (ver §5) |
| Archivos | 9 archivos (`index.html`, `sensor.html`, `config.js`, `datos.js`, `sonido.js`, `mapa.png`, plantilla, registro) | 1 archivo autocontenido de 227 KB, con los datos y el mapa dentro |

## 3. Cambios en los datos

### Antes (temporada 2015, un ciclón por continente)

| Continente | Ciclón | Muertes | Afectados |
|---|---|---|---|
| África | Chedza | 89 | 174.007 |
| Europa | Joaquin | 58 | 7.510 |
| Asia | Koppu | 51 | 2.898.590 |
| América del Norte | Patricia | 14 | 15.000 |
| Oceanía | Marcia | 1 | 6.000 |
| América del Sur | ningún ciclón tocó tierra | — | — |
| Antártida | no llegan ciclones tropicales | — | — |

### Ahora (2000-2026, máximo de cada métrica por sector)

| Sector | Más muertes | Más afectados |
|---|---|---|
| Asia | Nargis 2008 · 138.375 | Bilis 2006 · 29.675.680 |
| América del Norte | Jeanne 2004 · 2.782 | Irma 2017 · 10.138.842 |
| América Central | Stan 2005 · 1.629 | Eta 2020 · 7.152.272 |
| África | Freddy 2023 · 1.412 | Freddy 2023 · 3.827.533 |
| Oceanía | Guba 2008 · 172 | Harold 2020 · 485.120 |
| Europa | Leslie 2018 · 2 | Leslie 2018 · 88 |
| América del Sur | sin registros | sin registros |
| Antártida | sin registros | sin registros |

**Verificación.** Las 14 cifras coinciden con los datos de la página (IBTrACS v04r01 + EM-DAT). «América del Sur: sin registros» también es correcto. Dos ciclones sí llegaron a Brasil, uno en 2004 (Catarina) y otro en 2011, pero ninguno tiene registro en EM-DAT.

**Qué cambia en el mensaje.** Antes se comparaban continentes dentro de un mismo año. Ahora se comparan los peores casos de 27 años. La escala cambia mucho: Nargis tiene más de 138 mil muertes, mientras que en la versión de 2015 el máximo era 89. Además, el problema de Joaquin, cuyas muertes ocurrieron en Bahamas aunque tocó tierra en Portugal, desaparece porque ahora Europa queda representada por Leslie.

## 4. Lo que se eliminó

- **La conexión con la tablet:** el QR, la sala, el canal ntfy.sh, Protobject (`p.js` y `config.js`) y los estados «Canal / Último toque». Si este archivo reemplaza a `panel/index.html`, **la tablet deja de controlar la pantalla**, porque no hay nada que escuche sus toques.
- **El sonido** (`sonido.js`, el botón «Activar sonido» y el recorrido día a día). Era la parte sonificada del proyecto.
- **La tarjeta de detalle** (duración, país y región de llegada a tierra) y las notas de advertencia, como la de Joaquin.
- **El canal de error visible** en pantalla.

## 5. Puntos a revisar en la versión nueva

1. **Afectados y muertes de otro ciclón en la misma fila.** Es el punto más importante. En los modos «Muertes» y «Afectados», bajo cada fila aparece la otra métrica del sector, pero de otro ciclón, y se lee como si fuera del mismo:
   - La fila de **Nargis** dice «29.675.680 afectados», que son los de **Bilis**. Nargis tuvo 2.471.000.
   - La de **Jeanne** muestra 10.138.842, que son los de **Irma**. Jeanne tuvo 374.103.
   - Lo mismo pasa con **Stan**, que muestra los afectados de Eta (Stan tuvo 2.523.849), y con **Guba**, que muestra los de Harold (Guba tuvo 162.140).
   - En el modo «Afectados», **Bilis** aparece con 138.375 muertes, que son las de Nargis. Bilis tuvo 877.

   El modo «Ambos» sí lo aclara, con líneas «Muertes: … / Afectados: …». En los otros dos modos conviene quitar esa línea o poner el nombre del ciclón al que pertenece.
2. **Dos escalas en la misma fila (modo «Ambos»).** La barra roja se mide contra el máximo de muertes y la naranja contra el de afectados. Por eso en Asia ambas barras se ven del mismo largo aunque representan magnitudes que no se pueden comparar. Habría que aclararlo o separar las barras visualmente.
3. **Las fuentes no cargan.** El CSS pide Manrope y Fraunces, pero no hay ninguna etiqueta que las cargue (por ejemplo, de Google Fonts). Se ven Segoe UI o Georgia, según el sistema.
4. **El título dice «más letales»,** pero la mitad de la visualización trata de afectados. Algo como «Los ciclones con más muertes y más afectados por sector» describiría mejor lo que muestra.
5. **El año en la lista.** En «Ambos», la fila muestra solo el año del evento con más muertes («Asia · 2008»). El de afectados (2006) aparece solo en la línea de abajo.
6. **El criterio de asignación** («sector con más países afectados») no es el mismo de la página principal, que usa el país de llegada a tierra. Con estos datos el resultado coincide, pero conviene decirlo en la bitácora para que no parezca una contradicción entre las dos visualizaciones.

## 6. Si se quiere usar con el panel físico

Para que la tablet vuelva a controlar esta visualización, hay que hacer tres cosas:

1. **Agregar la conexión de la v6** a esta página: el QR, la sala y la suscripción a ntfy.sh, y opcionalmente Protobject.
2. **Ajustar la tablet:** esta versión tiene 8 sectores y la anterior 7 continentes, así que habría que agregar el círculo de **América Central** en `sensor.html` y en la plantilla del cartón.
3. **Definir qué hace un toque:** por ejemplo, resaltar el sector como hoy hace el cursor, cambiar de métrica con toques repetidos, o hacer sonar el ciclón.

## Fuentes

- **Datos:** IBTrACS v04r01 (NOAA NCEI) y EM-DAT (CRED / UCLouvain), los mismos de la página principal (`m4rkvr.github.io/iic2026-e1`).
- **Versión anterior:** `panel/index.html` y `panel/REGISTRO_PANEL.md`, commit `2fc871b` del repositorio `m4rkvr/iic2026-e1`.
- **Versión nueva:** `index (11).html`, adjunto del 10-nov-2026.
