// Páginas Protobject del panel (igual que los artefactos del Physical Viz Toolkit).
// Protobject es el canal opcional: el panel también funciona con su propio QR (ver index.html).
if (window.Protobject) {   // si Protobject no cargó, el panel sigue funcionando con su propio QR
Protobject.setProduction(true);

Protobject.initialize([
  {
    name: "Pantalla",       // corre en el computador
    page: "index.html",
    main: true,
    debug: "master",
  },
  {
    name: "Panel",          // corre en la tablet, bajo el cartón con agujeros
    page: "sensor.html",
    debug: "local",
  }
]);
}
