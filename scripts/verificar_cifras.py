#!/usr/bin/env python3
"""Recalcula desde los JSON las cifras que se citan en la pagina y en la
bitacora de decisiones. Existe para que cualquiera —incluido el equipo docente
en una revision— pueda comprobar un numero en diez segundos, en vez de creerlo.

    python3 scripts/verificar_cifras.py
"""
import json
import statistics as st
from collections import defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"


def pct(valores, q):
    v = sorted(valores)
    k = (len(v) - 1) * q
    lo, hi = int(k), min(int(k) + 1, len(v) - 1)
    return v[lo] + (k - lo) * (v[hi] - v[lo])


def decada(anio):
    return (anio // 10) * 10


def ols(xs, ys):
    """Pendiente de una recta por minimos cuadrados y su error estandar.

    A mano y sin numpy: el repositorio solo depende de pandas, y eso es para el
    pipeline. Quien verifique las cifras no deberia tener que instalar nada.
    """
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sxx
    a = my - b * mx
    res = [y - (a + b * x) for x, y in zip(xs, ys)]
    s2 = sum(r * r for r in res) / (n - 2)
    return b, (s2 / sxx) ** 0.5


def main():
    seasons = json.loads((DATA / "seasons.json").read_text())
    storms = json.loads((DATA / "storms.json").read_text())
    meta = json.loads((DATA / "meta.json").read_text())

    # La ventana viene de meta.json, no hardcodeada: el script tiene que seguir
    # diciendo la verdad si cambia --desde. 2025-2026 siguen provisionales.
    primera, ultima = meta["seasons"]
    completas = set(range(primera, 2025))

    por_temporada = defaultdict(int)
    for fila in seasons:
        por_temporada[fila["season"]] += fila["n_storms"]
    conteos = [n for a, n in por_temporada.items() if a in completas]

    print(f"{meta['dataset']} · {meta['n_storms']} ciclones · "
          f"temporadas {meta['seasons'][0]}-{meta['seasons'][1]}")
    print()
    print("1) El total NO tiene tendencia")
    print(f"   ciclones por temporada completa ({primera}-2024): "
          f"min {min(conteos)} · mediana {st.median(conteos):.0f} · max {max(conteos)}")
    print()

    print("2) Proporcion que llega a cat. 4-5, por decada")
    agrupado = defaultdict(lambda: [0, 0])
    for fila in seasons:
        d = agrupado[decada(fila["season"])]
        d[0] += fila["n_storms"]
        d[1] += fila["n_cat45"]
    for d in sorted(agrupado):
        n, c = agrupado[d]
        temporadas = len({f["season"] for f in seasons if decada(f["season"]) == d})
        marca = "  (incompleta)" if temporadas < 10 else ""
        print(f"   {d}s  n={n:>5}  cat45={c:>4}  {100 * c / n:5.1f} %{marca}")
    print()

    print("3) Por que la distribucion no es un grafico de barras")
    print("   la mediana y el p90 estan quietos: lo que hay es dispersion,")
    print("   y una barra con el promedio la borra")
    vientos = defaultdict(list)
    for s in storms:
        vientos[decada(s["season"])].append(s["max_wind"])
    print(f"   {'dec':<7}{'mediana':>9}{'media':>8}{'p90':>8}{'p95':>8}")
    for d in sorted(vientos):
        v = vientos[d]
        print(f"   {str(d) + 's':<7}{st.median(v):>9.0f}{st.mean(v):>8.1f}"
              f"{pct(v, 0.90):>8.0f}{pct(v, 0.95):>8.0f}")
    print()

    print("4) Hay tendencia? Ajuste lineal por temporada, solo completas")
    print(f"   ({primera}-2024, {len(conteos)} temporadas)")
    cat45 = defaultdict(int)
    for fila in seasons:
        cat45[fila["season"]] += fila["n_cat45"]
    xs = sorted(a for a in por_temporada if a in completas)
    series = {
        "ciclones por temporada": [float(por_temporada[a]) for a in xs],
        "proporcion cat. 4-5   ": [cat45[a] / por_temporada[a] for a in xs],
    }
    for nombre, ys in series.items():
        b, se = ols(xs, ys)
        # t de Student al 95 % con n-2 grados de libertad, ~2.07 para n=25.
        t = b / se if se else float("inf")
        veredicto = "SI" if abs(t) > 2.07 else "NO distinguible de cero"
        esc = 100 if "proporcion" in nombre else 1
        unidad = "puntos" if "proporcion" in nombre else "ciclones"
        print(f"   {nombre}  {b*10*esc:+7.2f} {unidad}/decada  "
              f"(EE {se*10*esc:.2f}, t={t:+.2f})  -> {veredicto}")
    print()

    print("5) Lo mismo, solo entre los que alcanzan fuerza de huracan (>= 64 kt)")
    fuertes = defaultdict(list)
    for s in storms:
        if s["max_wind"] >= 64:
            fuertes[decada(s["season"])].append(s["max_wind"])
    for d in sorted(fuertes):
        v = fuertes[d]
        print(f"   {str(d) + 's':<7}n={len(v):>4}  mediana {st.median(v):>5.0f} kt")


if __name__ == "__main__":
    main()
