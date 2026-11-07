// Páginas Protobject del panel-mapa: la pantalla corre en el PC (main) y el mapa táctil en la tablet.
// Debe ser el último <script> de cada HTML. Mismo esquema que los artefactos del Physical Viz Toolkit.

// Modo producción: el prototipo está hospedado en HTTPS (GitHub Pages).
Protobject.setProduction(true);

Protobject.initialize([
  {
    name: "Pantalla",       // corre en el PC: muestra el huracán y lo hace sonar
    page: "index.html",
    main: true,
    debug: "master",
  },
  {
    name: "Sensor",         // corre en la tablet, bajo el cartón con agujeros
    page: "sensor.html",
    debug: "local",
  }
]);
