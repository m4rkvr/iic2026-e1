/* ============================================================================
   data.js — carga los JSON generados por scripts/preprocess.py y deriva los
   agregados que los graficos consumen.

   Los archivos se piden con rutas RELATIVAS: GitHub Pages sirve el sitio bajo
   /<repo>/, asi que una ruta absoluta funcionaria en local y fallaria publicada.
   ========================================================================== */

const DATA = {
  seasons: null,   // [{season, basin, n_storms, n_cat45, share_cat45, ...}]
  storms: null,    // [{sid, season, basin, name, max_wind, cat45, ...}]
  tracks: null,    // {sid: {lat[], lon[], wind[], h[], d2l[]}}
  meta: null,
};

const FILES = ['seasons', 'storms', 'tracks', 'meta'];

async function loadData() {
  const results = await Promise.all(
    FILES.map(async (name) => {
      const res = await fetch(`data/${name}.json`);
      if (!res.ok) {
        throw new Error(`No se pudo cargar data/${name}.json (HTTP ${res.status}). ` +
          `¿Ejecutaste "python3 scripts/preprocess.py"?`);
      }
      return res.json();
    })
  );
  FILES.forEach((name, i) => { DATA[name] = results[i]; });
  return DATA;
}

/* --------------------------------------------------------------- helpers --- */

const decadeOf = (season) => Math.floor(season / 10) * 10;
const decadeLabel = (d) => `${d}s`;

/** Nombre legible de la cuenca; cae al codigo si meta no lo tiene. */
function basinName(code) {
  return (DATA.meta && DATA.meta.basin_names && DATA.meta.basin_names[code]) || code;
}

/** Codigos de cuenca presentes en los datos, ordenados por numero de ciclones. */
function basinsPresent() {
  const counts = new Map();
  for (const s of DATA.storms) counts.set(s.basin, (counts.get(s.basin) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([code]) => code);
}

/** Ciclones que pasan el filtro de cuenca activo. */
function stormsFor(basin) {
  return basin === 'ALL' ? DATA.storms : DATA.storms.filter((s) => s.basin === basin);
}

/**
 * Agrega los ciclones por temporada o por decada.
 *
 * La agregacion se hace aqui, en el cliente, y no en el preprocesador: asi el
 * conmutador temporada/decada no necesita un segundo archivo de datos y
 * responde sin ir a la red.
 *
 * Importante: share_cat45 de un grupo se recalcula desde los ciclones, NO como
 * promedio de los share_cat45 de cada temporada. Promediar proporciones daria
 * el mismo peso a una temporada de 5 ciclones que a una de 40.
 */
function aggregate(basin, granularity) {
  const storms = stormsFor(basin);
  const key = granularity === 'decade'
    ? (s) => decadeOf(s.season)
    : (s) => s.season;

  const groups = new Map();
  for (const s of storms) {
    const k = key(s);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(s);
  }

  const out = [];
  for (const [k, list] of [...groups.entries()].sort((a, b) => a[0] - b[0])) {
    const winds = list.map((s) => s.max_wind).sort((a, b) => a - b);
    const nCat45 = list.filter((s) => s.cat45).length;
    const seasons = [...new Set(list.map((s) => s.season))].sort();
    out.push({
      key: k,
      label: granularity === 'decade' ? decadeLabel(k) : String(k),
      seasons,
      storms: list,
      n_storms: list.length,
      n_cat45: nCat45,
      share_cat45: nCat45 / list.length,
      median_wind: Math.round(quantile(winds, 0.5) * 10) / 10,
      p90_wind: Math.round(quantile(winds, 0.9) * 10) / 10,
      max_wind: winds[winds.length - 1],
      provisional: list.some((s) => s.provisional),
      // Una decada con menos de 10 temporadas no es comparable con las llenas:
      // la ultima siempre esta en curso y cae por falta de datos, no por el
      // fenomeno. Se marca para no leer ese descenso como una senal.
      incomplete: granularity === 'decade' && seasons.length < 10,
      n_seasons: seasons.length,
    });
  }
  return out;
}

/** Cuantil por interpolacion lineal sobre un array ya ordenado. */
function quantile(sorted, q) {
  if (!sorted.length) return NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/** Puntos por temporada, para dibujar la dispersion detras de la linea. */
function seasonPoints(basin) {
  return aggregate(basin, 'season');
}

/**
 * Granularidad por defecto. Con last3years solo existe una decada, asi que
 * agrupar por decada daria un unico punto y la tendencia — el mensaje — seria
 * invisible. Se exige un minimo de 3 grupos para que la linea diga algo.
 */
function defaultGranularity() {
  const decades = new Set(DATA.storms.map((s) => decadeOf(s.season)));
  return decades.size >= 3 ? 'decade' : 'season';
}

/** Ajuste lineal por minimos cuadrados: devuelve la pendiente por decada. */
function trendSlopePerDecade(rows) {
  const usable = rows.filter((r) => !r.incomplete);
  const pts = (usable.length >= 2 ? usable : rows).map((r) => [
    Array.isArray(r.seasons) && r.seasons.length
      ? r.seasons.reduce((a, b) => a + b, 0) / r.seasons.length
      : r.key,
    r.share_cat45,
  ]);
  const n = pts.length;
  if (n < 2) return null;
  const mx = pts.reduce((a, p) => a + p[0], 0) / n;
  const my = pts.reduce((a, p) => a + p[1], 0) / n;
  let num = 0, den = 0;
  for (const [x, y] of pts) { num += (x - mx) * (y - my); den += (x - mx) ** 2; }
  if (den === 0) return null;
  return (num / den) * 10;   // por decada, no por año
}
