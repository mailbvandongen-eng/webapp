// Detectorkaart V2 – basis: Leaflet + grote GPS-stip

document.addEventListener("DOMContentLoaded", () => {
  // ---- 1. Basiskaart ----
  const map = L.map("map", {
    zoomControl: true,
  }).setView([52.07, 4.35], 12); // omgeving Den Haag

  // Simpele OSM-basemap. Later kunnen we hier BRT/PDOK achtergronden neerzetten.
  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  });

  osm.addTo(map);

  // ---- 2. GPS-stip + accuracy cirkel ----
  let gpsMarker = null;
  let gpsAccuracyCircle = null;
  let gpsActive = false;

  function updateGps(positionEvent) {
    const latlng = positionEvent.latlng;

    // Grote stip zoals Google Maps (maar dan iets dikker, want jij zoekt serieuze spullen)
    if (!gpsMarker) {
      gpsMarker = L.circleMarker(latlng, {
        radius: 14, // DIT maakt 'm lekker groot
        weight: 3,
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 0.5,
        className: "gps-marker",
      }).addTo(map);
    } else {
      gpsMarker.setLatLng(latlng);
    }

    // Accuracy cirkel
    if (!gpsAccuracyCircle) {
      gpsAccuracyCircle = L.circle(latlng, {
        radius: positionEvent.accuracy || 20,
        color: "#93c5fd",
        weight: 1,
        fillColor: "#bfdbfe",
        fillOpacity: 0.15,
      }).addTo(map);
    } else {
      gpsAccuracyCircle.setLatLng(latlng);
      gpsAccuracyCircle.setRadius(positionEvent.accuracy || 20);
    }
  }

  function onLocationFound(e) {
    updateGps(e);

    // Alleen de eerste keer: naar je locatie zoomen
    if (!gpsActive) {
      map.setView(e.latlng, 17);
      gpsActive = true;
    }
  }

  function onLocationError(e) {
    alert("Kon je locatie niet bepalen: " + e.message);
  }

  map.on("locationfound", onLocationFound);
  map.on("locationerror", onLocationError);

  function startGpsTracking() {
    map.locate({
      setView: !gpsActive,
      maxZoom: 18,
      watch: true,
      enableHighAccuracy: true,
    });
  }

  const gpsBtn = document.getElementById("gps-btn");
  if (gpsBtn) {
    gpsBtn.addEventListener("click", () => {
      startGpsTracking();
    });
  }

  // ---- 3. Haakje voor toekomstige lagen (AHN / LIDAR / Hillshade) ----
  // Hier gaan we later PDOK-lagen toevoegen, bijvoorbeeld:
  //
  // const ahnWms = L.tileLayer.wms(
  //   "https://service.pdok.nl/rws/ahn/wms/v1_0?",
  //   {
  //     layers: "<LAAGNAAM_HIER>", // bijv. DTM/DSM laag uit de WMS capabilities
  //     format: "image/png",
  //     transparent: true,
  //     attribution: "AHN via PDOK",
  //   }
  // );
  //
  // En dan toevoegen als overlay + layer control.
});
