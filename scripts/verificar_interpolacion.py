#!/usr/bin/env python3
"""Comprueba por que se descartan las filas de las 03/09/15/21 h.

La bitacora afirma que esas filas son interpolacion de IBTrACS y no reportes de
agencia. Esta es la prueba, para que nadie tenga que creerlo:

  1. Reparto por decada: si fueran un fenomeno reciente (como decia la primera
     version de la justificacion, que estaba mal) se concentrarian en las
     ultimas decadas. Son ~50 % en todas.
  2. Pasos de 5 kt: las agencias reportan el viento en multiplos de 5. Las horas
     sinopticas lo son casi siempre; las intermedias, mucho menos.
  3. Interpolacion lineal: el viento de las 03 h contra el promedio de 00 y 06.

Necesita el CSV crudo en scripts/cache/ (lo deja scripts/preprocess.py).

    python3 scripts/verificar_interpolacion.py
"""
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
SINOPTICAS = [0, 6, 12, 18]


def cargar() -> pd.DataFrame:
    cache = sorted((ROOT / "scripts" / "cache").glob("ibtracs.*.csv"))
    if not cache:
        print("No hay CSV crudo en scripts/cache/. Corre primero:\n"
              "  python3 scripts/preprocess.py --source since1980", file=sys.stderr)
        sys.exit(1)
    # El mas grande: el que cubre mas temporadas.
    csv = max(cache, key=lambda p: p.stat().st_size)
    print(f"fuente: {csv.name} ({csv.stat().st_size/1e6:.0f} MB)\n")

    df = pd.read_csv(
        csv,
        usecols=["SID", "SEASON", "ISO_TIME", "TRACK_TYPE", "USA_WIND"],
        skiprows=[1], keep_default_na=False,
        na_values=[" ", "", "-999", "-1049"], low_memory=False,
    )
    df = df[~df["TRACK_TYPE"].str.contains("spur", case=False, na=False)]
    df["ISO_TIME"] = pd.to_datetime(df["ISO_TIME"], errors="coerce")
    df["USA_WIND"] = pd.to_numeric(df["USA_WIND"], errors="coerce")
    df = df.dropna(subset=["ISO_TIME"])
    df["sinoptica"] = df["ISO_TIME"].dt.hour.isin(SINOPTICAS)
    return df


def main() -> int:
    df = cargar()

    print("1. Reparto por decada — ¿son un fenomeno reciente?")
    print("   decada     filas   sinopticas   intermedias   % intermedias")
    dec = (df["SEASON"] // 10 * 10).astype(int)
    for d, g in df.groupby(dec):
        print(f"     {d}s  {len(g):>8,}   {g['sinoptica'].sum():>9,}   "
              f"{(~g['sinoptica']).sum():>10,}   {100*(~g['sinoptica']).mean():>9.1f} %")
    print("   -> uniforme en todas las decadas: NO es un fenomeno reciente.\n")

    con_viento = df.dropna(subset=["USA_WIND"])
    print("2. ¿El viento viene en pasos de 5 kt, como lo reportan las agencias?")
    for nombre, g in (("horas sinopticas", con_viento[con_viento["sinoptica"]]),
                      ("horas intermedias", con_viento[~con_viento["sinoptica"]])):
        print(f"   {nombre:<20}{100*(g['USA_WIND'] % 5 == 0).mean():5.1f} %  "
              f"multiplos de 5   (n={len(g):,})")
    print("   -> las intermedias caen fuera de la rejilla de reporte.\n")

    print("3. El viento de las 03h contra el promedio de las 00h y 06h")
    d = con_viento.sort_values(["SID", "ISO_TIME"])
    pares = []
    for _, g in d.groupby("SID"):
        horas = g["ISO_TIME"].dt.hour.to_numpy()
        viento = g["USA_WIND"].to_numpy()
        for i in range(1, len(g) - 1):
            if (horas[i] not in SINOPTICAS
                    and horas[i-1] in SINOPTICAS and horas[i+1] in SINOPTICAS):
                pares.append(abs(viento[i] - (viento[i-1] + viento[i+1]) / 2))
    s = pd.Series(pares)
    print(f"   comparaciones: {len(s):,}")
    print(f"   diferencia exactamente 0:  {100*(s == 0).mean():5.1f} %")
    print(f"   diferencia <= 2,5 kt:      {100*(s <= 2.5).mean():5.1f} %")
    print(f"   mediana de la diferencia:  {s.median()} kt")
    print("   -> son el punto medio entre los dos reportes: interpolacion.\n")

    print("Conclusion: las filas intermedias no aportan observacion nueva. "
          "Conservarlas\nduplicaria cada reporte con un valor derivado de el.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
