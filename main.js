const monumentenLayer = L.layerGroup();

fetch("data/monumenten_amk.geojson")
  .then(r => r.json())
  .then(data => {
    const layer = L.geoJSON(data, {
      style: {
        color: "#7c2d12",
        weight: 1,
        fillColor: "#fed7aa",
        fillOpacity: 0.4
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        const naam = p.NAAM || p.naam || "Monument";
        const code = p.AMK_ID || p.ID || "";
        const periode = p.PERIODE || p.PERIOD || "";
        const type = p.TYPE || p.KLASSE1 || "";

        layer.bindPopup(
          `<strong>${naam}</strong><br>` +
          (code ? `Code: ${code}<br>` : "") +
          (type ? `Type: ${type}<br>` : "") +
          (periode ? `Periode: ${periode}<br>` : "")
        );
      }
    });

    monumentenLayer.addLayer(layer);
  });
