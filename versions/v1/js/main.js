/* ============================================================================
   main.js — arranque y conexion entre estado, graficos y sonido.

   El cross-filtering funciona en una sola direccion: cualquier interaccion
   escribe en State, y un unico render() redibuja lo que haga falta. Ningun
   grafico llama a otro.
   ========================================================================== */

(() => {
  'use strict';

  let trackCursor = null;   // indice del punto que se esta escuchando

  /* ------------------------------------------------------------ arranque --- */

  async function boot() {
    try {
      await loadData();
    } catch (err) {
      fatal(err.message);
      return;
    }

    if (typeof Plotly === 'undefined') {
      fatal('No se pudo cargar Plotly.js desde el CDN. Revisa tu conexión: ' +
            'la página necesita la librería para dibujar los gráficos.');
      return;
    }

    fillBasins();
    fillMeta();
    State.set({ granularity: defaultGranularity() });

    State.subscribe(render);
    wireControls();
    wireKeyboard();

    window.addEventListener('resize', debounce(Charts.resizeAll, 150));

    render(State.get(), ['init']);

    // Los eventos de Plotly solo existen una vez que el div fue dibujado: el
    // metodo .on lo agrega Plotly, no el DOM. Por eso va despues del render.
    wirePlotEvents();
  }

  function fatal(msg) {
    document.querySelector('.wrap').insertAdjacentHTML('afterbegin',
      `<div class="notice" role="alert"><strong>No se pudo iniciar.</strong> ${msg}</div>`);
  }

  function fillBasins() {
    const sel = document.getElementById('basin');
    for (const code of basinsPresent()) {
      const n = DATA.storms.filter((s) => s.basin === code).length;
      sel.insertAdjacentHTML('beforeend',
        `<option value="${code}">${basinName(code)} (${n})</option>`);
    }
  }

  function fillMeta() {
    const m = DATA.meta;
    document.getElementById('meta-source').innerHTML =
      `<a href="${m.source_url}" target="_blank" rel="noopener">${m.dataset}</a>, ` +
      `${m.provider} · DOI ${m.doi}.<br>` +
      `Archivo <code>${m.source_file}</code>, descargado el ${m.downloaded_utc}.<br>` +
      `Temporadas ${m.seasons[0]}–${m.seasons[1]} · ` +
      `${m.n_storms.toLocaleString('es-CL')} ciclones · ` +
      `${m.rows_kept.toLocaleString('es-CL')} de ` +
      `${m.rows_read.toLocaleString('es-CL')} registros conservados.`;

    document.getElementById('meta-filters').innerHTML =
      m.filters.map((f) => `<li>${f}</li>`).join('') +
      `<li>categoría 4–5: ${m.cat45_rule}</li>`;

    // IBTrACS marca como provisionales las temporadas sin reanalisis. Afecta la
    // lectura del extremo reciente de la serie, asi que se dice arriba.
    if (m.provisional_seasons && m.provisional_seasons.length) {
      const el = document.getElementById('provisional-notice');
      const ss = m.provisional_seasons.join(', ');
      el.innerHTML =
        `<strong>Las temporadas ${ss} son provisionales.</strong> ` +
        `IBTrACS las publica antes del reanálisis de las agencias ` +
        `(${m.n_provisional.toLocaleString('es-CL')} de ` +
        `${m.n_storms.toLocaleString('es-CL')} ciclones), así que sus ` +
        `intensidades pueden cambiar. El último tramo de la serie se lee con esa ` +
        `reserva; en la tabla van marcadas <span class="badge">prov.</span>`;
      el.hidden = false;
    }
  }

  /* -------------------------------------------------------------- render --- */

  function render(st, keys = []) {
    const rows = aggregate(st.basin, st.granularity);
    const seasons = seasonPoints(st.basin);

    // Cuando cambia la cuenca o la granularidad, un grupo o ciclon seleccionado
    // puede haber dejado de existir: se limpia antes de dibujar.
    if (st.group !== null && !rows.some((r) => r.key === st.group)) {
      State.set({ group: null });
      return;
    }
    const sel = State.selectedStorm();
    if (sel && st.basin !== 'ALL' && sel.basin !== st.basin) {
      State.set({ sid: null });
      return;
    }

    Charts.trend(rows, seasons, st.granularity, st.group);
    Charts.trendTable(rows, st.granularity);
    Charts.distribution(rows, st.sid);
    Charts.map(State.visibleStorms(), st.sid, trackCursor);

    Charts.legend('trend-legend', [
      { color: Charts.tokens().s1, label: st.granularity === 'decade'
          ? 'promedio de la década · puntos claros = temporadas'
          : 'proporción de la temporada' },
    ]);
    Charts.legend('map-legend', Charts.mapLegendItems());
    Charts.legend('dist-legend', [
      { color: Charts.tokens().s2, label: 'categoría 4–5 (≥ 113 kt)' },
      { color: Charts.tokens().s1, label: 'categoría 0–3' },
    ]);

    renderStats(rows, st);
    renderDetail(st);
    renderScopes(rows, st);

    document.getElementById('clear').disabled = (st.group === null && st.sid === null);
    document.getElementById('play-trend').disabled = !st.sound || rows.length < 2;
  }

  function renderStats(rows, st) {
    const storms = State.visibleStorms();
    const cat45 = storms.filter((s) => s.cat45).length;
    const slope = trendSlopePerDecade(rows);
    const winds = storms.map((s) => s.max_wind).sort((a, b) => a - b);

    const tiles = [
      ['Ciclones en la selección', storms.length.toLocaleString('es-CL'), ''],
      ['En categoría 4–5', cat45.toLocaleString('es-CL'),
        storms.length ? ` (${(100 * cat45 / storms.length).toFixed(0)} %)` : ''],
      ['Viento máximo observado', winds.length ? winds[winds.length - 1] : '—', ' kt'],
      ['Mediana del viento máximo', winds.length ? quantile(winds, 0.5).toFixed(0) : '—', ' kt'],
    ];

    // La pendiente es la cifra que sostiene el mensaje: se muestra solo cuando
    // hay grupos suficientes para que un ajuste lineal signifique algo.
    if (slope !== null && rows.length >= 3) {
      const pp = (slope * 100);
      tiles.push(['Tendencia cat. 4–5',
        `${pp >= 0 ? '+' : ''}${pp.toFixed(1)}`, ' pp por década']);
    }

    document.getElementById('stats').innerHTML = tiles.map(([k, v, u]) => `
      <div class="stat">
        <dt>${k}</dt>
        <dd>${v}<span class="unit">${u}</span></dd>
      </div>`).join('');
  }

  function renderScopes(rows, st) {
    const scope = st.basin === 'ALL' ? 'todas las cuencas' : basinName(st.basin);
    const groups = rows.length;
    document.getElementById('trend-scope').textContent =
      `${scope} · ${groups} ${st.granularity === 'decade' ? 'décadas' : 'temporadas'}`;

    const withTrack = State.visibleStorms().filter((s) => s.has_track).length;
    document.getElementById('map-scope').textContent =
      `${withTrack} trayectoria${withTrack === 1 ? '' : 's'} · ${scope}` +
      (st.group !== null ? ` · ${rows.find((r) => r.key === st.group)?.label ?? ''}` : '');
  }

  function renderDetail(st) {
    const body = document.getElementById('detail-body');
    const nav = document.getElementById('detail-nav');
    const s = State.selectedStorm();
    const list = State.navigableStorms();

    if (!s) {
      nav.textContent = list.length ? `${list.length} con trayectoria` : '';
      body.innerHTML = `<p class="empty">
        Elige una trayectoria en el mapa, o una marca en la distribución,
        para escucharla y ver sus cifras.</p>`;
      return;
    }

    const i = list.findIndex((x) => x.sid === s.sid);
    nav.textContent = i >= 0 ? `${i + 1} de ${list.length}` : '';

    const cat = s.sshs_max === null ? '—'
      : s.sshs_max >= 1 ? `categoría ${s.sshs_max}`
      : s.sshs_max === 0 ? 'tormenta tropical' : 'depresión / no tropical';

    const days = Math.round(
      (new Date(s.end) - new Date(s.start)) / 86400000) + 1;

    body.innerHTML = `
      <p style="font-size:1.15rem;font-weight:650;margin-top:0.2rem">
        ${s.name}
        ${s.provisional ? '<span class="badge">provisional</span>' : ''}
      </p>
      <p class="small secondary" style="margin-top:0.1rem">
        ${basinName(s.basin)} · temporada ${s.season} ·
        ${s.start} a ${s.end} (${days} d)
      </p>
      <dl>
        <dt>Viento máximo</dt><dd>${s.max_wind} kt</dd>
        <dt>Presión mínima</dt><dd>${s.min_pres ? s.min_pres + ' mb' : 'sin dato'}</dd>
        <dt>Escala Saffir-Simpson</dt><dd>${cat}</dd>
        <dt>Distancia mínima a tierra</dt>
        <dd>${s.min_dist2land === null ? 'sin dato' : s.min_dist2land + ' km'}</dd>
        <dt>Puntos en tierra o al borde</dt><dd>${s.n_landfall_pts}</dd>
      </dl>
      ${s.has_track ? `
        <div class="control" style="margin-top:1rem">
          <button type="button" class="primary" id="play-track"
                  ${st.sound ? '' : 'disabled'}>
            ${st.playing === 'track' ? '■ Detener' : '▶ Reproducir trayectoria'}
          </button>
          ${st.sound ? '' : '<span class="small muted">activa el sonido arriba</span>'}
        </div>
        <div class="progress"><i id="track-progress"></i></div>
      ` : `<p class="small muted" style="margin-top:0.9rem">
             Este ciclón no superó 64 kt, así que no tiene trayectoria cargada.
           </p>`}
    `;

    const btn = document.getElementById('play-track');
    if (btn) btn.addEventListener('click', toggleTrackPlayback);
  }

  /* ------------------------------------------------------------ controles --- */

  function wireControls() {
    document.getElementById('basin').addEventListener('change', (e) => {
      Sonify.stop();
      State.set({ basin: e.target.value, group: null, sid: null, playing: null });
    });

    const setGran = (g) => {
      Sonify.stop();
      document.getElementById('gran-season')
        .setAttribute('aria-pressed', String(g === 'season'));
      document.getElementById('gran-decade')
        .setAttribute('aria-pressed', String(g === 'decade'));
      State.set({ granularity: g, group: null, playing: null });
    };
    document.getElementById('gran-season').addEventListener('click', () => setGran('season'));
    document.getElementById('gran-decade').addEventListener('click', () => setGran('decade'));

    document.getElementById('clear').addEventListener('click', () => {
      Sonify.stop();
      trackCursor = null;
      State.set({ group: null, sid: null, playing: null });
    });

    document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    document.getElementById('play-trend').addEventListener('click', toggleTrendPlayback);

    // Tema: la preferencia del sistema es el punto de partida, el boton la pisa.
    const stored = localStorage.getItem('e1-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const isDark = cur === 'dark' ||
        (!cur && matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('e1-theme', next);
      // Plotly no relee el CSS: hay que volver a dibujar con los tokens nuevos.
      State.emit(['theme']);
      Charts.relayoutAll();
    });

    // Los botones de granularidad reflejan el default elegido segun los datos.
    const g = State.get().granularity;
    document.getElementById('gran-season').setAttribute('aria-pressed', String(g === 'season'));
    document.getElementById('gran-decade').setAttribute('aria-pressed', String(g === 'decade'));
  }

  function wirePlotEvents() {
    // Tendencia: clic en un grupo lo filtra; clic en el mismo lo desfiltra.
    document.getElementById('plot-trend').on('plotly_click', (ev) => {
      const pt = ev.points[0];
      if (!pt || !pt.customdata) return;
      const key = pt.customdata[2];
      Sonify.stop();
      State.set({ group: State.get().group === key ? null : key, playing: null });
    });

    // Distribucion y mapa: clic en una marca selecciona su ciclon.
    for (const id of ['plot-dist', 'plot-map']) {
      document.getElementById(id).on('plotly_click', (ev) => {
        const pt = ev.points[0];
        const sid = pt && pt.customdata;
        if (typeof sid !== 'string') return;
        Sonify.stop();
        trackCursor = null;
        State.set({ sid: State.get().sid === sid ? null : sid, playing: null });
      });
    }
  }

  function wireKeyboard() {
    document.addEventListener('keydown', (e) => {
      // No secuestrar el teclado mientras se escribe en un control.
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') { e.preventDefault(); Sonify.stop(); State.step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); Sonify.stop(); State.step(-1); }
      else if (e.key === 'Escape') {
        Sonify.stop(); trackCursor = null;
        State.set({ group: null, sid: null, playing: null });
      } else if (e.key === ' ' || e.code === 'Space') {
        // El espacio sobre un boton debe activarlo, no reproducir.
        if (tag === 'BUTTON') return;
        e.preventDefault();
        if (State.get().sid) toggleTrackPlayback(); else toggleTrendPlayback();
      }
    });
  }

  /* --------------------------------------------------------------- sonido --- */

  async function toggleSound() {
    const btn = document.getElementById('sound-toggle');
    const st = State.get();

    if (st.sound) {
      Sonify.stop();
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = '🔇 Sonido';
      localStorage.setItem('e1-sound', '0');
      State.set({ sound: false, playing: null });
      return;
    }

    if (!Sonify.available) {
      btn.disabled = true;
      btn.textContent = '🔇 Sonido no disponible';
      return;
    }

    // Tone.start() solo funciona dentro de un gesto del usuario: por eso vive
    // aqui y no en el arranque de la pagina.
    const ok = await Sonify.init();
    if (!ok) { btn.disabled = true; btn.textContent = '🔇 Sonido no disponible'; return; }

    btn.setAttribute('aria-pressed', 'true');
    btn.textContent = '🔊 Sonido';
    localStorage.setItem('e1-sound', '1');
    State.set({ sound: true });
  }

  function toggleTrendPlayback() {
    const st = State.get();
    if (!st.sound) return;
    if (st.playing === 'trend') { Sonify.stop(); State.set({ playing: null }); return; }

    Sonify.stop();
    const rows = aggregate(st.basin, st.granularity);
    State.set({ playing: 'trend' });
    document.getElementById('play-trend').textContent = '■ Detener';

    Sonify.playTrend(rows, st.basin, {
      onStep: (i, row) => {
        // El grupo que suena se resalta en el grafico: lo que se oye y lo que se
        // ve apuntan al mismo dato.
        State.set({ group: row.key });
      },
      onDone: () => {
        document.getElementById('play-trend').textContent = '▶ Escuchar la tendencia';
        State.set({ playing: null });
      },
    });
  }

  function toggleTrackPlayback() {
    const st = State.get();
    if (!st.sound || !st.sid) return;
    const track = DATA.tracks[st.sid];
    if (!track) return;

    if (st.playing === 'track') {
      Sonify.stop(); trackCursor = null;
      State.set({ playing: null });
      return;
    }

    Sonify.stop();
    State.set({ playing: 'track' });

    const bar = document.getElementById('track-progress');
    Sonify.playTrack(track, {
      onStep: (i) => {
        trackCursor = i;
        // Solo se reposiciona el marcador del cursor. Un Plotly.react completo
        // por nota redibujaria miles de trayectorias y congelaria la pagina.
        Charts.moveCursor(st.sid, i);
      },
      onProgress: (p) => { if (bar) bar.style.width = `${p * 100}%`; },
      onDone: () => {
        trackCursor = null;
        State.set({ playing: null });
      },
    });
  }

  /* -------------------------------------------------------------- utiles --- */

  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
