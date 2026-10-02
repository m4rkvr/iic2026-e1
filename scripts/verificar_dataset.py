#!/usr/bin/env python3
"""Comprueba que los archivos de data/ cuadren con el inventario de meta.json.

Existe para que otro grupo —o la GitHub Action— sepa en dos segundos si su copia
de los datos es la publicada, o si alguien edito un CSV a mano.

    python3 scripts/verificar_dataset.py

Sale con codigo 1 si algo no cuadra, asi que sirve tal cual en CI.
"""
import hashlib
import json
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        while chunk := fh.read(1 << 20):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    meta_path = DATA / "meta.json"
    if not meta_path.exists():
        print("falta data/meta.json — corre scripts/preprocess.py", file=sys.stderr)
        return 1

    meta = json.loads(meta_path.read_text())
    inventario = meta.get("files")
    if not inventario:
        print("meta.json no trae inventario 'files' — regeneralo con "
              "scripts/preprocess.py", file=sys.stderr)
        return 1

    print(f"{meta['dataset']} · descargado {meta['downloaded_utc']}")
    fallas = []
    for entrada in inventario:
        nombre = entrada["file"]
        path = DATA / nombre
        if not path.exists():
            fallas.append(f"{nombre}: no existe")
            print(f"  ✗ {nombre:<26} no existe")
            continue

        bytes_ok = path.stat().st_size == entrada["bytes"]
        hash_real = sha256(path)
        hash_ok = hash_real == entrada["sha256"]

        if bytes_ok and hash_ok:
            print(f"  ✓ {nombre:<26} {entrada['bytes']/1024:9.1f} KB · "
                  f"{entrada['rows']:>7,} filas")
        else:
            detalle = (f"{path.stat().st_size} bytes vs {entrada['bytes']} esperados"
                       if not bytes_ok else f"sha256 {hash_real[:12]}… no coincide")
            fallas.append(f"{nombre}: {detalle}")
            print(f"  ✗ {nombre:<26} {detalle}")

    if fallas:
        print(f"\n{len(fallas)} archivo(s) no cuadran con meta.json. O se editaron "
              "a mano, o meta.json quedo viejo:\n  python3 scripts/preprocess.py "
              f"--source {meta['source_file'].split('.')[1]}", file=sys.stderr)
        return 1

    print(f"\n{len(inventario)} archivos verificados — la copia es la publicada.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
