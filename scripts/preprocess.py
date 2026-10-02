#!/usr/bin/env python3
"""IBTrACS v04r01 -> JSON livianos para la visualizacion E1.

Uso:
    python3 scripts/preprocess.py                        # last3years (10 MB, rapido)
    python3 scripts/preprocess.py --source since1980     # 144 MB, serie completa
    python3 scripts/preprocess.py --source ALL           # 332 MB, 1842-presente

Escribe dos representaciones de los mismos datos: JSON compacto en data/
(lo que consume la pagina) y CSV en data/csv/ (lo que consume cualquier
otra herramienta: pandas, d3.csv, Observable, RAWGraphs, Tableau).
Los nombres de columna son identicos en ambas, para que no haya traduccion.

El CSV crudo se guarda en scripts/cache/ (ignorado por git) y se reutiliza.
Fuente: NOAA NCEI, IBTrACS v04r01, DOI 10.25921/82ty-9e16
"""

import argparse
import csv
import hashlib
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
    "DIST2LAND", "TRACK_TYPE",
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
# Primera temporada que entra al dataset. 2000 y no 1980: desde ~2000 la
# cobertura satelital y los metodos de estimacion son homogeneos en las siete
# cuencas, asi que las temporadas son comparables entre si sin corregir nada.
# Con --desde 1980 se reproduce la ventana anterior.
DEFAULT_SINCE = 2000


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


def load(csv_path: Path, desde: int) -> pd.DataFrame:
    """Lee el CSV, recorta a las temporadas >= desde y aplica los filtros."""
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

    # Ventana temporal. Va antes de los demas filtros para que los conteos que
    # se reportan describan la ventana publicada y no el archivo completo.
    df = df[df["SEASON"] >= desde]

    # Solo horas sinopticas. IBTrACS publica ademas filas a las 03/09/15/21 h que
    # son interpolacion suya, no reportes de agencia: estan en todo el registro
    # (~50 % de las filas en cada decada, no solo en las recientes), el 98,8 % de
    # los vientos sinopticos son multiplos de 5 kt contra el 58,8 % de los
    # intermedios, y el 99,9 % de los valores intermedios cae a <= 2,5 kt del
    # promedio de sus vecinos. Conservarlas duplicaria cada reporte con un valor
    # derivado de el. La prueba: scripts/verificar_interpolacion.py
    df = df[df["ISO_TIME"].dt.hour.isin([0, 6, 12, 18])]

    # USA_WIND cubre mucho mas que WMO_WIND; se documenta la mezcla de agencias.
    for col in ("USA_WIND", "WMO_WIND", "USA_PRES", "WMO_PRES",
                "USA_SSHS", "DIST2LAND"):
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

    # DIST2LAND es la distancia a la costa mas cercana: 0 significa en tierra.
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


def build_observations(df: pd.DataFrame) -> pd.DataFrame:
    """Tabla punto a punto: una fila por observacion 6-horaria.

    Es la tabla mas cruda que publicamos, y la unica que permite reconstruir
    cualquiera de las otras dos. Repite season/basin/name en cada fila a
    proposito: se puede graficar sin hacer ningun join.
    """
    out = pd.DataFrame({
        "sid": df["SID"],
        "iso_time": df["ISO_TIME"].dt.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "season": df["SEASON"].astype(int),
        "basin": df["BASIN"],
        "name": df["NAME"].replace({"NOT_NAMED": "SIN NOMBRE",
                                    "UNNAMED": "SIN NOMBRE"}),
        "nature": df["NATURE"],
        "lat": df["LAT"].round(2),
        "lon": df["LON"].round(2),
        "wind_kt": df["wind"].astype(int),
        # Int64 (no int) porque pres_mb tiene huecos: con float se escribiria
        # "1000.0" y cualquier lector lo tomaria por una medida con decimales.
        "pres_mb": df["pres"].astype("Int64"),
        "sshs": df["USA_SSHS"].astype("Int64"),
        "dist2land_km": df["DIST2LAND"].astype("Int64"),
        # true/false en minuscula, igual que en los otros dos CSV y que en JSON.
        "provisional": df["provisional"].map({True: "true", False: "false"}),
    })
    return out.sort_values(["sid", "iso_time"])


def write_csv(path: Path, rows: list) -> float:
    """Escribe una lista de dicts como CSV y devuelve el tamano en KB.

    Los booleanos van como true/false (no True/False): es lo que esperan
    d3.autoType y cualquier parser de JS, y pandas los lee igual de bien.
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()),
                           lineterminator="\n")
        w.writeheader()
        for r in rows:
            w.writerow({k: ("true" if v is True else
                            "false" if v is False else
                            "" if v is None else v)
                        for k, v in r.items()})
    return path.stat().st_size / 1024


def sha256(path: Path) -> str:
    """Huella del archivo, para que un consumidor detecte si cambio."""
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        while chunk := fh.read(1 << 20):
            h.update(chunk)
    return h.hexdigest()


def inventory(data_dir: Path, names: list, rows: dict) -> list:
    """Inventario de la distribucion: que archivos hay, cuantas filas y su hash.

    Va dentro de meta.json para que otro grupo pueda versionar su copia y
    saber, sin descargar de nuevo, si los datos cambiaron.
    """
    out = []
    for name in names:
        path = data_dir / name
        out.append({
            "file": name,
            "bytes": path.stat().st_size,
            "rows": rows.get(name),
            "sha256": sha256(path),
        })
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--source", default="last3years",
                    choices=["last3years", "since1980", "ALL",
                             "NA", "EP", "WP", "NI", "SI", "SP", "SA"],
                    help="archivo IBTrACS a usar (default: last3years)")
    ap.add_argument("--desde", type=int, default=DEFAULT_SINCE, metavar="TEMPORADA",
                    help=f"primera temporada que se incluye "
                         f"(default: {DEFAULT_SINCE})")
    ap.add_argument("--min-wind", type=int, default=DEFAULT_MIN_WIND,
                    help=f"viento min. en kt para incluir trayectoria "
                         f"(default: {DEFAULT_MIN_WIND})")
    args = ap.parse_args()

    root = Path(__file__).resolve().parent.parent
    data_dir = root / "data"
    data_dir.mkdir(exist_ok=True)

    print(f"IBTrACS v04r01 — fuente: {args.source} · temporadas >= {args.desde}")
    csv_path = download(args.source, root / "scripts" / "cache")

    print("  leyendo y filtrando…")
    df, rows_read = load(csv_path, args.desde)
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
        "season_min": int(args.desde),
        "filters": [
            f"solo temporadas >= {args.desde} (cobertura satelital homogenea)",
            "se descartan ramas secundarias (TRACK_TYPE con 'spur')",
            "hora sinoptica 00/06/12/18 UTC (las filas intermedias son interpolacion de IBTrACS, no reportes de agencia)",
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
    }

    # Las mismas tablas en CSV, para quien no quiera parsear JSON anidado.
    # observations.csv es la unica salida que no tiene equivalente JSON: es la
    # tabla punto a punto completa, de la que se derivan las otras dos.
    obs = build_observations(df)
    obs_path = data_dir / "csv" / "observations.csv"
    obs_path.parent.mkdir(parents=True, exist_ok=True)
    obs.to_csv(obs_path, index=False, lineterminator="\n")
    sizes["csv/observations.csv"] = obs_path.stat().st_size / 1024
    sizes["csv/storms.csv"] = write_csv(data_dir / "csv" / "storms.csv",
                                        storms_out)
    sizes["csv/seasons.csv"] = write_csv(data_dir / "csv" / "seasons.csv",
                                         seasons)

    # El inventario va al final: necesita los archivos ya escritos para hashearlos.
    # meta.json queda fuera del inventario — no puede contener su propio hash.
    meta["files"] = inventory(
        data_dir,
        ["seasons.json", "storms.json", "tracks.json",
         "csv/seasons.csv", "csv/storms.csv", "csv/observations.csv"],
        {"seasons.json": len(seasons), "csv/seasons.csv": len(seasons),
         "storms.json": len(storms_out), "csv/storms.csv": len(storms_out),
         "tracks.json": len(tracks), "csv/observations.csv": len(obs)},
    )
    sizes["meta.json"] = write_json(data_dir / "meta.json", meta)

    print("Resumen (pegar en docs/entrega-e1.md):")
    print(f"  temporadas       {meta['seasons'][0]}–{meta['seasons'][1]}")
    print(f"  ciclones         {len(storms_out):,}")
    print(f"  cat. 4-5         {sum(s['cat45'] for s in storms_out):,}")
    print(f"  trayectorias     {len(tracks):,} (>= {args.min_wind} kt)")
    print(f"  observaciones    {len(obs):,}")
    print(f"  cuencas          {', '.join(sorted(storms['basin'].unique()))}")
    for name, kb in sizes.items():
        print(f"  data/{name:<22} {kb:9.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
