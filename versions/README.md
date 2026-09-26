# Versiones

La pauta pide que cada versión sea **verificable** y recomienda mantenerlas
navegables. Aquí se usan los dos mecanismos, porque cumplen cosas distintas:

| Mecanismo | Para qué sirve |
|---|---|
| **Tag de git** (`v1`, `v2`, …) | La prueba del historial. El tag apunta a un commit con su fecha real: es lo que demuestra que el proceso ocurrió a lo largo de semanas. |
| **Carpeta `versions/vN/`** | La copia navegable. Permite abrir `…github.io/<repo>/versions/v1/` y ver la versión antigua funcionando, sin clonar nada. |

## Cómo se congela una versión

```bash
bash scripts/freeze.sh v1
git add -A
git commit -m "V1: la idea completa funcionando"
git tag v1
```

`freeze.sh` copia `index.html`, `css/`, `js/` y `data/`. Se duplican unos MB por
versión —nada frente a los límites de GitHub Pages— y a cambio cada versión
sigue funcionando aunque el esquema de los JSON cambie más adelante.

## Advertencia de la pauta

> "El historial de GitHub cuenta la historia real. Cuatro versiones creadas con
> cuatro commits la noche anterior a la entrega no son un proceso: son una
> escenografía, y se penalizará fuertemente."

Commitear seguido, con fechas reales, es parte del entregable.
