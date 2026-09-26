/* ============================================================================
   state.js — estado central compartido y notificaciones.

   Los tres graficos y el panel de detalle leen de aqui, nunca uno del otro. Es
   lo que hace posible el cross-filtering sin que cada grafico tenga que conocer
   a los otros dos: quien cambia algo llama a set(), y cada vista se redibuja
   sola con el estado nuevo.
   ========================================================================== */

const State = (() => {
  const state = {
    basin: 'ALL',          // codigo de cuenca o 'ALL'
    granularity: 'decade', // 'season' | 'decade'
    group: null,           // clave del grupo seleccionado (temporada o decada)
    sid: null,             // ciclon seleccionado
    sound: false,          // el usuario activo el sonido
    playing: null,         // 'trend' | 'track' | null
  };

  const listeners = new Set();

  function set(patch) {
    let changed = false;
    for (const [k, v] of Object.entries(patch)) {
      if (state[k] !== v) { state[k] = v; changed = true; }
    }
    if (changed) emit(Object.keys(patch));
    return changed;
  }

  function emit(keys = []) {
    for (const fn of listeners) fn(state, keys);
  }

  return {
    get: () => state,
    set,
    emit,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    /** Ciclones visibles: cuenca activa y, si hay grupo elegido, ese grupo. */
    visibleStorms() {
      let list = stormsFor(state.basin);
      if (state.group !== null) {
        const inGroup = state.granularity === 'decade'
          ? (s) => decadeOf(s.season) === state.group
          : (s) => s.season === state.group;
        list = list.filter(inGroup);
      }
      return list;
    },

    /** Los que tienen trayectoria: son los unicos navegables y sonificables. */
    navigableStorms() {
      return this.visibleStorms()
        .filter((s) => s.has_track)
        .sort((a, b) => b.max_wind - a.max_wind);
    },

    selectedStorm() {
      if (!state.sid) return null;
      return DATA.storms.find((s) => s.sid === state.sid) || null;
    },

    /** Mueve la seleccion delta posiciones dentro de los navegables. */
    step(delta) {
      const list = this.navigableStorms();
      if (!list.length) return;
      const i = list.findIndex((s) => s.sid === state.sid);
      const next = i === -1
        ? 0
        : (i + delta + list.length) % list.length;
      set({ sid: list[next].sid });
    },
  };
})();
