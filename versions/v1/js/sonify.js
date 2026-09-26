/* ============================================================================
   sonify.js — sonificacion con Tone.js.

   La pauta pide que el sonido use parametros efectivos (tono, ritmo, timbre) y
   no solo volumen, y que enriquezca la exploracion en vez de decorarla. Aqui
   cada parametro audible codifica una variable distinta de los datos:

   Escuchar la tendencia (vista general)
     tono    <- share_cat45 del grupo      (el contorno ascendente ES el mensaje)
     ritmo   <- n_storms del grupo         (mas ciclones = mas subdivisiones)
     timbre  <- cuenca seleccionada        (onda distinta por cuenca)

   Reproducir trayectoria (detalle)
     tono    <- viento en cada punto
     ritmo   <- tasa de intensificacion    (se acelera cuando el ciclon crece)
     timbre  <- distancia a tierra         (el filtro se cierra al tocar tierra)

   Los tonos se cuantizan a una escala pentagonal: cualquier mapeo continuo de
   frecuencia produce microtonos y el oido pierde el contorno, que es justo la
   informacion que se quiere transmitir.
   ========================================================================== */

const Sonify = (() => {
  // Pentatonica mayor sobre 3 octavas. Sin semitonos vecinos: no hay disonancia
  // accidental y el contorno ascendente/descendente se oye limpio.
  const SCALE = [
    'C3', 'D3', 'E3', 'G3', 'A3',
    'C4', 'D4', 'E4', 'G4', 'A4',
    'C5', 'D5', 'E5', 'G5', 'A5',
  ];

  // Una onda por cuenca: el timbre identifica la cuenca sin ocupar el tono.
  const BASIN_WAVE = {
    ALL: 'triangle', NA: 'sine', EP: 'triangle', WP: 'square',
    NI: 'sawtooth', SI: 'sine', SP: 'triangle', SA: 'sawtooth',
  };

  let ready = false;
  let synth = null;      // voz principal (tono)
  let filter = null;     // timbre: corte variable
  let click = null;      // percusion del ritmo
  let started = false;   // Tone.start() ya se llamo
  let timers = [];       // setTimeout pendientes, para poder cancelar
  let onProgress = null;
  let onDone = null;

  /**
   * Construye la cadena de audio. Debe ejecutarse dentro de un gesto del
   * usuario: los navegadores bloquean el AudioContext hasta que hay uno.
   */
  async function init() {
    if (ready) return true;
    if (typeof Tone === 'undefined') return false;
    await Tone.start();
    started = true;

    filter = new Tone.Filter({ type: 'lowpass', frequency: 8000, rolloff: -24 });
    const reverb = new Tone.Reverb({ decay: 1.6, wet: 0.18 });
    filter.connect(reverb);
    reverb.toDestination();

    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.2, sustain: 0.3, release: 0.5 },
      volume: -10,
    }).connect(filter);

    click = new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 3,
      envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
      volume: -22,
    }).toDestination();

    ready = true;
    return true;
  }

  /** Cuantiza un valor normalizado [0,1] a un grado de la escala. */
  function toNote(norm) {
    const i = Math.round(Math.max(0, Math.min(1, norm)) * (SCALE.length - 1));
    return SCALE[i];
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function stop() {
    clearTimers();
    if (synth) synth.releaseAll();
    if (filter) filter.frequency.cancelScheduledValues(Tone.now());
    if (onProgress) onProgress(0);
    const done = onDone;
    onProgress = null; onDone = null;
    if (done) done();
  }

  /**
   * Recorre los grupos de la vista general: una nota por grupo, mas un patron
   * de clicks cuya densidad sigue el numero de ciclones.
   */
  function playTrend(rows, basin, hooks = {}) {
    stop();
    if (!ready || !rows.length) return;
    onProgress = hooks.onProgress || null;
    onDone = hooks.onDone || null;

    synth.set({ oscillator: { type: BASIN_WAVE[basin] || 'triangle' } });
    filter.frequency.value = 9000;

    // El tono se normaliza contra el rango observado, no contra [0,1] absoluto:
    // si todos los grupos rondan 20-35 %, un rango fijo aplanaria la melodia
    // hasta volverla inaudible como tendencia.
    const shares = rows.map((r) => r.share_cat45);
    const lo = Math.min(...shares);
    const hi = Math.max(...shares);
    const span = hi - lo || 1;

    const maxStorms = Math.max(...rows.map((r) => r.n_storms));
    const STEP = 800;   // ms por grupo

    rows.forEach((row, i) => {
      const at = i * STEP;
      later(() => {
        // Tono: posicion relativa dentro del rango observado.
        synth.triggerAttackRelease(toNote((row.share_cat45 - lo) / span), 0.55);

        // Ritmo: entre 1 y 4 subdivisiones segun el numero de ciclones.
        const ticks = Math.max(1, Math.round((row.n_storms / maxStorms) * 4));
        for (let t = 0; t < ticks; t++) {
          later(() => click.triggerAttackRelease('C2', 0.05),
                Math.round((t * STEP) / ticks));
        }
        if (hooks.onStep) hooks.onStep(i, row);
        if (onProgress) onProgress((i + 1) / rows.length);
      }, at);
    });

    later(() => stop(), rows.length * STEP + 400);
  }

  /**
   * Recorre una trayectoria punto por punto. Es la escucha "de cerca": el mismo
   * dato que el mapa muestra en color, en el tiempo.
   */
  function playTrack(track, hooks = {}) {
    stop();
    if (!ready || !track || !track.wind.length) return;
    onProgress = hooks.onProgress || null;
    onDone = hooks.onDone || null;

    synth.set({ oscillator: { type: 'triangle' } });

    const winds = track.wind;
    const lo = Math.min(...winds);
    const hi = Math.max(...winds);
    const span = hi - lo || 1;

    // Ritmo base: una trayectoria larga no puede durar minutos, asi que el paso
    // se comprime para que cualquier ciclon se escuche en ~6-9 s.
    const base = Math.max(90, Math.min(220, 7000 / winds.length));

    let at = 0;
    for (let i = 0; i < winds.length; i++) {
      const w = winds[i];
      const prev = i > 0 ? winds[i - 1] : w;
      const d2l = track.d2l[i];

      // El paso se acorta cuando el ciclon se esta intensificando: la prisa se
      // oye antes de que el ojo la lea en la pendiente.
      const rising = Math.max(0, w - prev);
      const step = base * (1 - Math.min(0.4, rising / 40));

      const idx = i;
      later(() => {
        // Timbre: cerca de tierra el filtro se cierra y el ciclon "se apaga".
        // d2l = -1 significa dato ausente; se trata como mar abierto.
        const near = d2l >= 0 && d2l < 200;
        const cutoff = near ? 400 + (d2l / 200) * 6000 : 8000;
        filter.frequency.rampTo(cutoff, 0.08);

        synth.triggerAttackRelease(toNote((w - lo) / span), 0.22);
        if (hooks.onStep) hooks.onStep(idx, w, d2l);
        if (onProgress) onProgress((idx + 1) / winds.length);
      }, Math.round(at));

      at += step;
    }

    later(() => stop(), Math.round(at) + 500);
  }

  return {
    init,
    stop,
    playTrend,
    playTrack,
    get ready() { return ready; },
    get started() { return started; },
    get available() { return typeof Tone !== 'undefined'; },
  };
})();
