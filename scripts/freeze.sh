#!/usr/bin/env bash
# Congela el estado actual del sitio como una version navegable.
#
#   bash scripts/freeze.sh v1
#
# La pauta acepta tags de git o subcarpetas navegables; aqui se usan las dos.
# El tag es la prueba verificable del historial; la carpeta deja que cualquiera
# abra la version antigua en GitHub Pages sin clonar el repositorio.
#
# Se copia tambien data/: unos pocos MB por version, a cambio de que cada una
# siga funcionando aunque el esquema de los JSON cambie despues.
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "uso: bash scripts/freeze.sh vN   (por ejemplo: v1)" >&2
  exit 1
fi

VER="$1"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/versions/$VER"

if [ -d "$DEST" ]; then
  read -r -p "versions/$VER ya existe. ¿Sobrescribir? [s/N] " ans
  [[ "$ans" =~ ^[sS]$ ]] || { echo "cancelado"; exit 1; }
  rm -rf "$DEST"
fi

mkdir -p "$DEST"
cp "$ROOT/index.html" "$DEST/"
cp -r "$ROOT/css" "$ROOT/js" "$ROOT/data" "$DEST/"

# La etiqueta de version que la pagina muestra en el encabezado.
sed -i "s|id=\"version-tag\">[^<]*<|id=\"version-tag\">${VER^^}<|" "$DEST/index.html"

cat > "$DEST/NOTA.md" <<NOTA
# ${VER^^} — congelada el $(date +%Y-%m-%d)

Copia navegable de la ${VER^^}. No se edita: para cambios, trabajar en la raiz
del repositorio y volver a congelar.

Commit de origen: $(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo 'sin git')
NOTA

echo "versions/$VER listo ($(du -sh "$DEST" | cut -f1))"
echo
echo "Siguiente paso, para que la version quede verificable en el historial:"
echo "  git add -A && git commit -m \"${VER^^}: …\" && git tag $VER"
