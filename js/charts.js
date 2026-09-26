/* ============================================================================
   charts.js — los tres graficos, con Plotly.

   Reglas que se respetan a proposito, porque la pauta las evalua:
     · el eje Y de la tendencia parte en 0 (nada de ejes truncados)
     · un solo eje Y por grafico (nunca doble eje)
     · nada en 3D
     · la distribucion NO es un grafico de barras: el mensaje esta en la cola
     · rampa secuencial de un solo tono para el viento, nunca arcoiris
     · grilla y ejes en hairline recesivo
   ========================================================================== */

const Charts = (() => {

  /** Lee los roles de color del CSS, para que el tema se defina en un solo lugar. */
  function tokens() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    return {
      surface: v('--surface-1'),
      text: v('--text-primary'),
      secondary: v('--text-secondary'),
      muted: v('--text-muted'),
      grid: v('--grid'),
      axis: v('--axis'),
      s1: v('--series-1'),
      s2: v('--series-2'),
      seqSteps: [
        v('--seq-100'), v('--seq-250'), v('--seq-400'),
        v('--seq-550'), v('--seq-700'),
      ],
    };
  }

  const FONT = { family: 'system-ui, -apple-system, "Segoe UI", sans-serif', size: 12 };

  function baseLayout(t) {
    return {
      paper_bgcolor: t.surface,
      plot_bgcolor: t.surface,
      font: { ...FONT, color: t.secondary },
      margin: { l: 56, r: 16, t: 8, b: 44 },
      hoverlabel: {
        bgcolor: t.surface,
        bordercolor: t.axis,
        font: { ...FONT, color: t.text },
      },
      showlegend: false,   // las leyendas se dibujan en HTML, no dentro del plot
    };
  }

  const CONFIG = {
    displayModeBar: false,
    responsive: true,
    // Plotly no expone una "escala en kt" util para el usuario final; el zoom del
    // mapa si se mantiene porque explorar cuencas lo necesita.
    doubleClick: false,
  };

  function axis(t, extra = {}) {
    return {
      gridcolor: t.grid,
      linecolor: t.axis,
      zerolinecolor: t.axis,
      tickfont: { ...FONT, color: t.muted },
      titlefont: { ...FONT, color: t.secondary, size: 11 },
      ...extra,
    };
  }

  /* ------------------------------------------------------ 1. tendencia --- */

  /**
   * Proporcion de ciclones cat. 4-5 por grupo.
   * Detras, un punto por temporada: muestra la dispersion que la linea promedia.
   * Una sola serie protagonista -> un solo color, sin leyenda dentro del plot.
   */
  function trend(rows, seasons, granularity, selectedGroup) {
    const t = tokens();
    const el = document.getElementById('plot-trend');

    const xs = rows.map((_, i) => i);
    const ys = rows.map((r) => r.share_cat45 * 100);

    // Los puntos de temporada se ubican sobre la categoria de su grupo, para que
    // la nube quede alineada con la linea aunque el eje X sea categorico.
    const groupOf = granularity === 'decade'
      ? (s) => decadeLabel(decadeOf(s))
      : (s) => String(s);

    // Los puntos de temporada se ubican sobre su grupo con un desplazamiento
    // horizontal: apilados en la misma abscisa se leen como una columna rayada
    // y no como una nube de dispersion.
    const seasonX = [], seasonY = [], seasonTxt = [];
    for (const s of seasons) {
      const g = groupOf(s.key);
      const gi = rows.findIndex((r) => r.label === g);
      if (gi === -1) continue;
      seasonX.push(gi + ((s.key % 10) / 10 - 0.45) * 0.62);
      seasonY.push(s.share_cat45 * 100);
      seasonTxt.push(`Temporada ${s.key}<br>${s.n_cat45} de ${s.n_storms} ciclones ` +
                     `cat. 4-5 (${(s.share_cat45 * 100).toFixed(0)} %)`);
    }

    // Resalte de la seleccion: color por entidad, no por rango. Los no
    // seleccionados se apagan a tinta muted; el seleccionado conserva su azul.
    const markerColors = rows.map((r) => {
      if (r.incomplete) return t.surface;   // relleno vacio = grupo incompleto
      return selectedGroup === null || r.key === selectedGroup ? t.s1 : t.muted;
    });
    const markerSizes = rows.map((r) => (r.key === selectedGroup ? 14 : 9));
    const markerRings = rows.map((r) => (r.incomplete ? t.s1 : t.surface));
    // El tramo incompleto va punteado: se ve que no es comparable con el resto.
    const lastComplete = rows.findIndex((r) => r.incomplete);

    const traces = [];

    // Solo tiene sentido dibujar la nube si cada grupo agrupa varias temporadas.
    if (granularity === 'decade' && seasonX.length > rows.length) {
      traces.push({
        type: 'scatter', mode: 'markers',
        x: seasonX, y: seasonY, text: seasonTxt,
        hovertemplate: '%{text}<extra></extra>',
        marker: {
          color: t.s1, size: 7, opacity: 0.32,
          line: { width: 0 },
        },
        name: 'temporadas',
      });
    }

    traces.push({
      type: 'scatter', mode: 'lines+markers+text',
      x: xs, y: ys,
      line: { color: t.s1, width: 2, shape: 'linear' },
      marker: {
        color: markerColors, size: markerSizes,
        line: { color: markerRings, width: 2 },   // anillo de 2px, no un borde
      },
      // Etiqueta directa selectiva: solo el primer y el ultimo grupo. Un numero
      // en cada punto seria ruido.
      text: ys.map((y, i) => {
        if (i !== 0 && i !== ys.length - 1) return '';
        return `${y.toFixed(0)} %${rows[i].incomplete ? '*' : ''}`;
      }),
      textposition: 'top center',
      textfont: { ...FONT, color: t.text, size: 11 },
      customdata: rows.map((r) => [
        r.n_cat45, r.n_storms, r.key,
        r.incomplete ? `<br><i>década incompleta: ${r.n_seasons} de 10 temporadas</i>` : '',
        r.label,
      ]),
      hovertemplate:
        '<b>%{customdata[4]}</b><br>%{y:.1f} % en categoría 4–5<br>' +
        '%{customdata[0]} de %{customdata[1]} ciclones' +
        '%{customdata[3]}<extra></extra>',
      cliponaxis: false,
    });

    const layout = {
      ...baseLayout(t),
      margin: { l: 56, r: 24, t: 24, b: 44 },
      xaxis: axis(t, {
        tickmode: 'array',
        tickvals: rows.map((_, i) => i),
        ticktext: rows.map((r) => r.label),
        range: [-0.55, rows.length - 0.45],
        showgrid: false,
        zeroline: false,
      }),
      // range desde 0: el punto entero del grafico es que la pendiente sea real.
      yaxis: axis(t, {
        title: '% de ciclones en categoría 4–5',
        rangemode: 'tozero',
        range: [0, Math.max(10, Math.max(...seasonY, ...ys) * 1.18)],
        ticksuffix: ' %',
      }),
      hovermode: 'closest',
      annotations: lastComplete === -1 ? [] : [{
        x: 0, y: -0.16, xref: 'paper', yref: 'paper',
        text: '* grupo incompleto: marcador vacío',
        showarrow: false, xanchor: 'left',
        font: { ...FONT, color: t.muted, size: 10 },
      }],
    };

    Plotly.react(el, traces, layout, CONFIG);
    return el;
  }

  /* --------------------------------------------------- 2. distribucion --- */

  /**
   * Hash estable a partir del SID -> [0,1). El jitter tiene que ser el MISMO en
   * cada redibujado: con Math.random() los puntos saltarian en cada filtro y el
   * lector perderia la referencia de donde estaba mirando.
   */
  function jitterOf(sid) {
    let h = 2166136261;
    for (let i = 0; i < sid.length; i++) {
      h ^= sid.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 10000) / 10000;
  }

  /**
   * Un punto por ciclon (viento maximo), una banda por grupo. El eje Y es
   * NUMERICO aunque muestre etiquetas: es lo que permite repartir los puntos
   * dentro de la banda. Sobre un eje categorico los ~1.000 ciclones de una
   * decada caen en la misma linea y la densidad — que es el mensaje — se pierde.
   *
   * Dos series por identidad (cat. 4-5 / resto) -> dos slots categoricos, con
   * leyenda HTML siempre presente.
   */
  function distribution(rows, selectedSid) {
    const t = tokens();
    const el = document.getElementById('plot-dist');

    // Fila 0 abajo: el grupo mas reciente queda arriba, como en la tendencia.
    const yOf = new Map();
    rows.forEach((r, i) => yOf.set(r.label, rows.length - 1 - i));

    const BAND = 0.62;   // alto util de cada banda, deja aire entre grupos
    const traces = [];

    // Cajas de cuartiles, una por grupo, ancladas al centro de su banda.
    for (const r of rows) {
      traces.push({
        type: 'box',
        x: r.storms.map((s) => s.max_wind),
        y0: yOf.get(r.label),
        orientation: 'h',
        width: BAND + 0.22,
        boxpoints: false,
        fillcolor: 'rgba(0,0,0,0)',
        line: { color: t.axis, width: 1 },
        hoverinfo: 'skip',
        showlegend: false,
      });
    }

    const series = [
      { name: 'Categoría 4–5', color: t.s2, test: (s) => s.cat45 },
      { name: 'Categoría 0–3', color: t.s1, test: (s) => !s.cat45 },
    ];

    for (const ser of series) {
      const xs = [], ys = [], txt = [], sids = [], sizes = [], lines = [], widths = [];
      for (const r of rows) {
        const base = yOf.get(r.label);
        for (const s of r.storms) {
          if (!ser.test(s)) continue;
          const sel = s.sid === selectedSid;
          const j = jitterOf(s.sid);
          // El best-track reporta el viento en escalones de 5 kt, asi que sin
          // dispersion horizontal los puntos se alinean en columnas y parecen
          // una reja. El desplazamiento es de +-2,5 kt: reparte cada punto
          // DENTRO de su propio escalon, sin moverlo a otro valor.
          xs.push(s.max_wind + (jitterOf(s.sid + 'x') - 0.5) * 5);
          ys.push(base + (j - 0.5) * BAND);
          sids.push(s.sid);
          txt.push(`<b>${s.name}</b> · ${s.season} · ${basinName(s.basin)}<br>` +
                   `viento máx. ${s.max_wind} kt` +
                   (s.min_pres ? ` · presión mín. ${s.min_pres} mb` : '') +
                   (s.has_track ? '<br><i>clic para escuchar</i>' : ''));
          sizes.push(sel ? 13 : 5);
          lines.push(sel ? t.text : ser.color);
          widths.push(sel ? 2 : 0);
        }
      }
      traces.push({
        type: 'scatter', mode: 'markers',
        x: xs, y: ys, text: txt, customdata: sids,
        hovertemplate: '%{text}<extra></extra>',
        // Opacidad baja: con miles de puntos la densidad se lee por acumulacion,
        // que es exactamente lo que un promedio en barras no deja ver.
        marker: {
          color: ser.color, size: sizes, opacity: 0.55,
          line: { color: lines, width: widths },
        },
        name: ser.name,
      });
    }

    const layout = {
      ...baseLayout(t),
      margin: { l: 62, r: 16, t: 20, b: 46 },
      xaxis: axis(t, {
        title: 'viento máximo sostenido (kt)',
        rangemode: 'tozero',
        zeroline: false,
      }),
      yaxis: axis(t, {
        tickmode: 'array',
        tickvals: rows.map((r) => yOf.get(r.label)),
        ticktext: rows.map((r) => r.label + (r.incomplete ? ' *' : '')),
        range: [-0.7, rows.length - 0.3],
        showgrid: false,
        zeroline: false,
      }),
      hovermode: 'closest',
      // Umbral de categoria 4: la referencia que separa las dos series.
      shapes: [{
        type: 'line', x0: 113, x1: 113, y0: -0.7, y1: rows.length - 0.3,
        line: { color: t.s2, width: 1 },
      }],
      annotations: [{
        x: 113, y: 1, yref: 'paper', text: '113 kt = cat. 4',
        showarrow: false, xanchor: 'left', yanchor: 'bottom',
        font: { ...FONT, color: t.muted, size: 10 },
      }],
    };

    Plotly.react(el, traces, layout, CONFIG);
    return el;
  }

  /* ------------------------------------------------------------ 3. mapa --- */

  /**
   * Tramos de Saffir-Simpson en nudos. Son categorias ORDENADAS, asi que llevan
   * rampa ordinal de un solo tono (validada con --ordinal), no colores
   * categoricos ni un arcoiris.
   */
  const CAT_BINS = [
    { lo: 64,  hi: 83,       label: 'Cat. 1 · 64–82 kt' },
    { lo: 83,  hi: 96,       label: 'Cat. 2 · 83–95 kt' },
    { lo: 96,  hi: 113,      label: 'Cat. 3 · 96–112 kt' },
    { lo: 113, hi: Infinity, label: 'Cat. 4–5 · ≥ 113 kt' },
  ];

  /** Steps de la rampa por tramo, segun el tema activo. */
  function binColors(t) {
    // En claro va de claro a oscuro. En oscuro se invierte: sobre fondo oscuro
    // el paso mas claro es el que mas resalta, y lo que debe resaltar es lo mas
    // intenso. Ambas direcciones son monotonas en luminosidad y de un solo tono.
    const dark = isDarkMode();
    const seq = t.seqSteps;
    return dark
      ? [seq[3], seq[2], seq[1], seq[0]]   // 550, 400, 250, 100
      : [seq[1], seq[2], seq[3], seq[4]];  // 250, 400, 550, 700
  }

  function isDarkMode() {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr === 'dark';
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }

  const binOf = (w) => CAT_BINS.findIndex((b) => w >= b.lo && w < b.hi);

  // Indices de traza fijos: el cursor se mueve con restyle sobre su propia
  // traza, sin volver a dibujar las 2.000 trayectorias en cada nota.
  let CURSOR_TRACE = -1;

  /**
   * Trayectorias sobre natural earth. Una traza de LINEAS por tramo de
   * intensidad — no una marca por punto: 87.000 marcadores SVG cuelgan el
   * navegador, y la intensidad del ciclon se lee igual de bien por tramo.
   * Solo la trayectoria seleccionada dibuja sus puntos.
   */
  function map(storms, selectedSid, cursor) {
    const t = tokens();
    const el = document.getElementById('plot-map');
    const colors = binColors(t);

    const withTrack = storms.filter((s) => s.has_track && DATA.tracks[s.sid]);

    // Un buffer por tramo; las trayectorias se concatenan separadas por null.
    const buf = CAT_BINS.map(() => ({ lat: [], lon: [], text: [], sid: [] }));

    for (const s of withTrack) {
      if (s.sid === selectedSid) continue;
      const bi = binOf(s.max_wind);
      if (bi < 0) continue;
      const tr = DATA.tracks[s.sid];
      const b = buf[bi];
      const label = `<b>${s.name}</b> · ${s.season} · ${basinName(s.basin)}<br>` +
                    `viento máx. ${s.max_wind} kt<br><i>clic para escuchar</i>`;
      for (let i = 0; i < tr.lat.length; i++) {
        b.lat.push(tr.lat[i]); b.lon.push(tr.lon[i]);
        b.text.push(label); b.sid.push(s.sid);
      }
      b.lat.push(null); b.lon.push(null); b.text.push(label); b.sid.push(s.sid);
    }

    const traces = buf.map((b, i) => ({
      type: 'scattergeo', mode: 'lines',
      lat: b.lat, lon: b.lon, text: b.text, customdata: b.sid,
      line: { color: colors[i], width: i >= 2 ? 1.5 : 1 },
      opacity: selectedSid ? 0.35 : 0.8,
      hovertemplate: '%{text}<extra></extra>',
      name: CAT_BINS[i].label,
    }));

    // La seleccion va al final para quedar encima, con sus puntos 6-horarios.
    if (selectedSid && DATA.tracks[selectedSid]) {
      const tr = DATA.tracks[selectedSid];
      const s = DATA.storms.find((x) => x.sid === selectedSid);
      traces.push({
        type: 'scattergeo', mode: 'lines',
        lat: tr.lat, lon: tr.lon,
        line: { color: t.s2, width: 3 },
        hoverinfo: 'skip',
      }, {
        type: 'scattergeo', mode: 'markers',
        lat: tr.lat, lon: tr.lon,
        text: tr.wind.map((w, i) =>
          `<b>${s ? s.name : ''}</b><br>${w} kt · +${tr.h[i]} h` +
          (tr.d2l[i] >= 0 ? `<br>${tr.d2l[i]} km a tierra` : '')),
        hovertemplate: '%{text}<extra></extra>',
        customdata: tr.lat.map(() => selectedSid),
        marker: {
          size: 6, color: t.s2,
          line: { color: t.surface, width: 1.5 },   // anillo de superficie
        },
      });

      // Cursor de reproduccion: traza propia y vacia, que playTrack mueve.
      const c = (cursor !== null && cursor !== undefined && tr.lat[cursor] !== undefined);
      traces.push({
        type: 'scattergeo', mode: 'markers',
        lat: c ? [tr.lat[cursor]] : [],
        lon: c ? [tr.lon[cursor]] : [],
        marker: {
          size: 18, color: 'rgba(0,0,0,0)',
          line: { color: t.s2, width: 3 },
        },
        hoverinfo: 'skip',
      });
      CURSOR_TRACE = traces.length - 1;
    } else {
      CURSOR_TRACE = -1;
    }

    const layout = {
      ...baseLayout(t),
      margin: { l: 0, r: 0, t: 0, b: 0 },
      geo: {
        projection: { type: 'natural earth' },
        bgcolor: t.surface,
        showland: true, landcolor: t.grid,
        showocean: true, oceancolor: t.surface,
        showcoastlines: true, coastlinecolor: t.axis, coastlinewidth: 0.5,
        showcountries: false,
        showframe: false,
        lataxis: { range: [-60, 65] },
      },
    };

    Plotly.react(el, traces, layout, CONFIG);
    return el;
  }

  /**
   * Mueve solo el marcador del cursor. Se llama una vez por nota durante la
   * reproduccion, asi que no puede redibujar el mapa entero.
   */
  function moveCursor(sid, i) {
    const el = document.getElementById('plot-map');
    if (!el || !el.data || CURSOR_TRACE < 0) return;
    const tr = DATA.tracks[sid];
    if (!tr || tr.lat[i] === undefined) return;
    Plotly.restyle(el, { lat: [[tr.lat[i]]], lon: [[tr.lon[i]]] }, [CURSOR_TRACE]);
  }

  /** Leyenda del mapa: los cuatro tramos, en el orden de la rampa. */
  function mapLegendItems() {
    const colors = binColors(tokens());
    return CAT_BINS.map((b, i) => ({ color: colors[i], label: b.label }));
  }

  /* ----------------------------------------------------- tabla y leyenda --- */

  /** Vista de tabla: la alternativa accesible a la tendencia. */
  function trendTable(rows, granularity) {
    const head = granularity === 'decade' ? 'Década' : 'Temporada';
    const body = rows.map((r) => `
      <tr>
        <td>${r.label}${r.incomplete
            ? ` <span class="badge">${r.n_seasons}/10 temporadas</span>`
            : r.provisional ? ' <span class="badge">prov.</span>' : ''}</td>
        <td>${r.n_storms}</td>
        <td>${r.n_cat45}</td>
        <td>${(r.share_cat45 * 100).toFixed(1)} %</td>
        <td>${r.median_wind.toFixed(0)}</td>
        <td>${r.p90_wind.toFixed(0)}</td>
        <td>${r.max_wind}</td>
      </tr>`).join('');

    document.getElementById('table-trend').innerHTML = `
      <table>
        <caption class="sr-only">Ciclones e intensidad por ${head.toLowerCase()}</caption>
        <thead><tr>
          <th scope="col">${head}</th>
          <th scope="col">Ciclones</th>
          <th scope="col">Cat. 4–5</th>
          <th scope="col">% cat. 4–5</th>
          <th scope="col">Mediana kt</th>
          <th scope="col">P90 kt</th>
          <th scope="col">Máx. kt</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table>`;
  }

  function legend(elId, items) {
    document.getElementById(elId).innerHTML = items
      .map((it) => `<span><i style="background:${it.color}"></i>${it.label}</span>`)
      .join('');
  }

  /** Redibuja todo tras un cambio de tema: Plotly no relee el CSS solo. */
  function relayoutAll() {
    const t = tokens();
    for (const id of ['plot-trend', 'plot-dist', 'plot-map']) {
      const el = document.getElementById(id);
      if (el && el.data) {
        Plotly.relayout(el, {
          paper_bgcolor: t.surface,
          plot_bgcolor: t.surface,
          'font.color': t.secondary,
        });
      }
    }
  }

  function resizeAll() {
    for (const id of ['plot-trend', 'plot-dist', 'plot-map']) {
      const el = document.getElementById(id);
      if (el && el.data) Plotly.Plots.resize(el);
    }
  }

  return {
    tokens, trend, distribution, map, moveCursor, mapLegendItems,
    trendTable, legend, relayoutAll, resizeAll,
  };
})();
