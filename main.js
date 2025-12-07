// Basis OpenLayers-kaart voor V2
const map = new ol.Map({
  target: "map",
  layers: [
    // simpele OSM basemap (later vervangen/uitbreiden met PDOK, AHN, geomorf, etc.)
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([4.35, 52.07]), // ongeveer Den Haag
    zoom: 11,
  }),
});
