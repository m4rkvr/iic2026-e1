# Bitácora de decisiones de diseño

> Esta bitácora es la materia prima del 25 % de la nota que evalúa el
> *rationale*. Se escribe **cuando se decide**, no la noche del 22 de octubre:
> reconstruir una justificación a posteriori se nota, y la pauta lo penaliza.
>
> Formato de cada entrada: **qué se decidió · por qué · qué se descartó**.
> «Porque se veía mejor» no es un rationale válido.

---

## 2026-09-26 — V1

### Mensaje: el total plano frente al extremo que crece

**Decisión.** El titular no es "hay más ciclones" ni "los ciclones son más
fuertes", sino el contraste entre ambos: el número por temporada es estable y la
proporción que llega a categoría 4–5 no lo es.

**Por qué.** Es lo que los datos sostienen. El conteo por temporada oscila entre
83 y 118 sin tendencia; la proporción de cat. 4–5 pasa de 10,1 % en los 80 a
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
la mediana del viento máximo pasa de 60 kt en los 80 a 55 kt en los 2020, es
decir, en la dirección contraria al mensaje. Lo que crece es el extremo, y solo
se ve mostrando la distribución completa. La pauta además penaliza apoyarse en
barras sin justificación.

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
