#!/usr/bin/env python3
"""IBTrACS v04r01 -> JSON livianos para la visualizacion E1.

Uso:
    python3 scripts/preprocess.py                        # last3years (10 MB, rapido)
    python3 scripts/preprocess.py --source since1980     # 144 MB, serie completa
    python3 scripts/preprocess.py --source ALL           # 332 MB, 1842-presente

El CSV crudo se guarda en scripts/cache/ (ignorado por git) y se reutiliza.
Fuente: NOAA NCEI, IBTrACS v04r01, DOI 10.25921/82ty-9e16
"""

import argparse
import json
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

BASE_URL = (
    "https://www.ncei.noaa.gov/data/"
    "international-best-track-archive-for-climate-stewardship-ibtracs/"
    "v04r01/access/csv/ibtracs.{source}.list.v04r01.csv"
)

# Solo las columnas que la visualizacion usa. El CSV completo trae 174.
USECOLS = [
    "SID", "SEASON", "BASIN", "NAME", "ISO_TIME", "NATURE",
    "LAT", "LON", "WMO_WIND", "WMO_PRES",
    "USA_WIND", "USA_PRES", "USA_SSHS",
    "DIST2LAND", "LANDFALL", "TRACK_TYPE",
]

BASIN_NAMES = {
    "NA": "Atlantico Norte",
    "EP": "Pacifico Nororiental",
    "WP": "Pacifico Noroccidental",
    "NI": "Indico Norte",
    "SI": "Indico Sur",
    "SP": "Pacifico Sur",
    "SA": "Atlantico Sur",
}

# Umbral Saffir-Simpson categoria 4 (>= 113 kt). Respaldo cuando USA_SSHS falta.
CAT45_WIND_KT = 113
# Fuerza de huracan/tifon: define que trayectorias se incluyen en tracks.json.
DEFAULT_MIN_WIND = 64
# Un ciclon se considera "en tierra o al borde" bajo este umbral.
LANDFALL_DIST_KM = 50


def download(source: str, cache_dir: Path) -> Path:
    """Descarga el CSV si no esta en cache y devuelve su ruta."""
    url = BASE_URL.format(source=source)
    cache_dir.mkdir(parents=True, exist_ok=True)
    dest = cache_dir / f"ibtracs.{source}.list.v04r01.csv"

    if dest.exists() and dest.stat().st_size > 0:
        mb = dest.stat().st_size / 1e6
        print(f"  cache: {dest.name} ({mb:.1f} MB) — se reutiliza")
        return dest

    print(f"  descargando {url}")
    tmp = dest.with_suffix(".partial")
    try:
        with urllib.request.urlopen(url, timeout=120) as resp:
            total = int(resp.headers.get("Content-Length", 0))
            done = 0
            with open(tmp, "wb") as fh:
                while chunk := resp.read(1 << 20):
                    fh.write(chunk)
                    done += len(chunk)
                    if total:
                        pct = 100 * done / total
                        print(f"\r  {done/1e6:7.1f} / {total/1e6:.1f} MB "
                              f"({pct:5.1f}%)", end="", file=sys.stderr)
            print(file=sys.stderr)
    except Exception:
        tmp.unlink(missing_ok=True)
        raise
    tmp.rename(dest)
    return dest


def load(csv_path: Path) -> pd.DataFrame:
    """Lee el CSV y aplica los filtros de calidad."""
    # La fila 1 (indice 0 tras el header) son las unidades, no datos.
    # keep_default_na=False es obligatorio: la cuenca del Atlantico Norte se
    # codifica "NA" y pandas la leeria como valor ausente, borrando ~15% de los
    # datos sin avisar.
    df = pd.read_csv(
        csv_path,
        usecols=USECOLS,
        skiprows=[1],
        keep_default_na=False,
        na_values=[" ", "", "-999", "-1049"],
        low_memory=False,
    )
    rows_read = len(df)

    # Se descartan solo las ramas secundarias ("*_spur"), que duplican el mismo
    # evento. Cuidado: filtrar por TRACK_TYPE == "main" borraria las temporadas
    # recientes completas, porque llegan marcadas PROVISIONAL / US-PROVISIONAL
    # (trayectoria primaria, aun sin reanalisis) — no son ramas secundarias.
    df = df[~df["TRACK_TYPE"].str.contains("spur", case=False, na=False)]
    df["provisional"] = df["TRACK_TYPE"].str.contains("PROVISIONAL", na=False)

    df["ISO_TIME"] = pd.to_datetime(df["ISO_TIME"], errors="coerce")
    for col in ("LAT", "LON"):
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=["ISO_TIME", "LAT", "LON", "BASIN", "SEASON"])

    # Horas sinopticas. IBTrACS interpola a 3 h desde ~2010 en algunas agencias;
    # sin este filtro las temporadas recientes aportan el doble de puntos y
    # cualquier conteo por punto queda sesgado hacia el presente.
    df = df[df["ISO_TIME"].dt.hour.isin([0, 6, 12, 18])]

    # USA_WIND cubre mucho mas que WMO_WIND; se documenta la mezcla de agencias.
    for col in ("USA_WIND", "WMO_WIND", "USA_PRES", "WMO_PRES",
                "USA_SSHS", "DIST2LAND", "LANDFALL"):
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df["wind"] = df["USA_WIND"].fillna(df["WMO_WIND"])
    df["pres"] = df["USA_PRES"].fillna(df["WMO_PRES"])

    df = df.dropna(subset=["wind"])
    df = df[df["wind"] > 0]

    return df, rows_read


def build_storms(df: pd.DataFrame) -> pd.DataFrame:
    """Una fila por ciclon, con su punto de maxima intensidad."""
    df = df.sort_values(["SID", "ISO_TIME"])

    # idxmax sobre wind da el punto de intensidad maxima de cada ciclon.
    peak_idx = df.groupby("SID")["wind"].idxmax()
    peak = df.loc[peak_idx].set_index("SID")

    grouped = df.groupby("SID")
    storms = pd.DataFrame({
        "season": grouped["SEASON"].first(),
        "basin": grouped["BASIN"].first(),
        "name": grouped["NAME"].first(),
        "max_wind": grouped["wind"].max(),
        "min_pres": grouped["pres"].min(),
        "sshs_max": grouped["USA_SSHS"].max(),
        "start": grouped["ISO_TIME"].min(),
        "end": grouped["ISO_TIME"].max(),
        "min_dist2land": grouped["DIST2LAND"].min(),
        "n_points": grouped["wind"].size(),
        "provisional": grouped["provisional"].any(),
    })
    storms["peak_lat"] = peak["LAT"]
    storms["peak_lon"] = peak["LON"]
    storms["peak_time"] = peak["ISO_TIME"]

    # LANDFALL es la distancia al proximo cruce de costa: 0 significa en tierra.
    landfalls = df.assign(onland=df["DIST2LAND"] <= LANDFALL_DIST_KM)
    storms["n_landfall_pts"] = landfalls.groupby("SID")["onland"].sum()

    # USA_SSHS >= 4 es el criterio primario; el viento cubre los huecos.
    storms["cat45"] = (
        (storms["sshs_max"] >= 4) | (storms["max_wind"] >= CAT45_WIND_KT)
    )

    # Ciclones sin nombre asignado aparecen como NOT_NAMED/UNNAMED en el origen.
    storms["name"] = storms["name"].fillna("SIN NOMBRE").replace(
        {"NOT_NAMED": "SIN NOMBRE", "UNNAMED": "SIN NOMBRE"}
    )
    return storms


def build_seasons(storms: pd.DataFrame) -> list:
    """Agregados por (temporada, cuenca). La decada se agrupa despues en JS."""
    g = storms.groupby(["season", "basin"])
    out = []
    for (season, basin), grp in g:
        winds = grp["max_wind"]
        out.append({
            "season": int(season),
            "basin": basin,
            "n_storms": int(len(grp)),
            "n_cat45": int(grp["cat45"].sum()),
            "share_cat45": round(float(grp["cat45"].mean()), 4),
            "mean_max_wind": round(float(winds.mean()), 1),
            "median_max_wind": round(float(winds.median()), 1),
            "p90_max_wind": round(float(winds.quantile(0.90)), 1),
            "provisional": bool(grp["provisional"].any()),
        })
    return sorted(out, key=lambda r: (r["season"], r["basin"]))


def build_tracks(df: pd.DataFrame, storms: pd.DataFrame, min_wind: int) -> dict:
    """Trayectorias 6-horarias, solo de los ciclones que sostienen el mensaje.

    Formato columnar: pesa cerca de la mitad que un array de objetos, porque no
    repite los nombres de campo en cada punto.
    """
    keep = storms.index[storms["max_wind"] >= min_wind]
    sub = df[df["SID"].isin(keep)].sort_values(["SID", "ISO_TIME"])

    tracks = {}
    for sid, grp in sub.groupby("SID"):
        tracks[sid] = {
            "lat": [round(v, 1) for v in grp["LAT"]],
            "lon": [round(v, 1) for v in grp["LON"]],
            "wind": [int(v) for v in grp["wind"]],
            # Horas desde el inicio del ciclon: mas compacto que un ISO string.
            "h": [int(v) for v in
                  (grp["ISO_TIME"] - grp["ISO_TIME"].iloc[0])
                  .dt.total_seconds() // 3600],
            "d2l": [int(v) if pd.notna(v) else -1 for v in grp["DIST2LAND"]],
        }
    return tracks


def write_json(path: Path, obj) -> float:
    """Escribe JSON compacto y devuelve el tamano en KB."""
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, ensure_ascii=False, separators=(",", ":"))
    return path.stat().st_size / 1024


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--source", default="last3years",
                    choices=["last3years", "since1980", "ALL",
                             "NA", "EP", "WP", "NI", "SI", "SP", "SA"],
                    help="archivo IBTrACS a usar (default: last3years)")
    ap.add_argument("--min-wind", type=int, default=DEFAULT_MIN_WIND,
                    help=f"viento min. en kt para incluir trayectoria "
                         f"(default: {DEFAULT_MIN_WIND})")
    args = ap.parse_args()

    root = Path(__file__).resolve().parent.parent
    data_dir = root / "data"
    data_dir.mkdir(exist_ok=True)

    print(f"IBTrACS v04r01 — fuente: {args.source}")
    csv_path = download(args.source, root / "scripts" / "cache")

    print("  leyendo y filtrando…")
    df, rows_read = load(csv_path)
    print(f"  {rows_read:,} filas leidas -> {len(df):,} tras filtros")

    storms = build_storms(df)
    seasons = build_seasons(storms)
    tracks = build_tracks(df, storms, args.min_wind)

    storms_out = []
    for sid, r in storms.iterrows():
        storms_out.append({
            "sid": sid,
            "season": int(r["season"]),
            "basin": r["basin"],
            "name": r["name"],
            "max_wind": int(r["max_wind"]),
            "min_pres": int(r["min_pres"]) if pd.notna(r["min_pres"]) else None,
            "sshs_max": int(r["sshs_max"]) if pd.notna(r["sshs_max"]) else None,
            "cat45": bool(r["cat45"]),
            "peak_lat": round(float(r["peak_lat"]), 1),
            "peak_lon": round(float(r["peak_lon"]), 1),
            "start": r["start"].strftime("%Y-%m-%d"),
            "end": r["end"].strftime("%Y-%m-%d"),
            "provisional": bool(r["provisional"]),
            "n_landfall_pts": int(r["n_landfall_pts"]),
            "min_dist2land": (int(r["min_dist2land"])
                              if pd.notna(r["min_dist2land"]) else None),
            "has_track": sid in tracks,
        })
    storms_out.sort(key=lambda r: (r["season"], r["sid"]))

    meta = {
        "dataset": "IBTrACS v04r01",
        "source_file": f"ibtracs.{args.source}.list.v04r01.csv",
        "source_url": BASE_URL.format(source=args.source),
        "provider": "NOAA NCEI",
        "doi": "10.25921/82ty-9e16",
        "downloaded_utc": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        "rows_read": int(rows_read),
        "rows_kept": int(len(df)),
        "n_storms": len(storms_out),
        "n_tracks": len(tracks),
        "n_provisional": int(storms["provisional"].sum()),
        "provisional_seasons": sorted(
            int(x) for x in storms.loc[storms["provisional"], "season"].unique()
        ),
        "seasons": [int(storms["season"].min()), int(storms["season"].max())],
        "filters": [
            "se descartan ramas secundarias (TRACK_TYPE con 'spur')",
            "hora sinoptica 00/06/12/18 UTC (se descarta interpolacion a 3 h)",
            "viento = USA_WIND con respaldo WMO_WIND",
            f"tracks.json solo ciclones con viento max >= {args.min_wind} kt",
        ],
        "cat45_rule": f"USA_SSHS >= 4 o viento max >= {CAT45_WIND_KT} kt",
        "basin_names": BASIN_NAMES,
    }

    print()
    sizes = {
        "seasons.json": write_json(data_dir / "seasons.json", seasons),
        "storms.json": write_json(data_dir / "storms.json", storms_out),
        "tracks.json": write_json(data_dir / "tracks.json", tracks),
        "meta.json": write_json(data_dir / "meta.json", meta),
    }

    print("Resumen (pegar en docs/entrega-e1.md):")
    print(f"  temporadas       {meta['seasons'][0]}–{meta['seasons'][1]}")
    print(f"  ciclones         {len(storms_out):,}")
    print(f"  cat. 4-5         {sum(s['cat45'] for s in storms_out):,}")
    print(f"  trayectorias     {len(tracks):,} (>= {args.min_wind} kt)")
    print(f"  cuencas          {', '.join(sorted(storms['basin'].unique()))}")
    for name, kb in sizes.items():
        print(f"  data/{name:<14} {kb:8.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
