// Initialize map centered over Pine Ridge Reservation area including Oglala, Manderson, Wounded Knee
var map = L.map('map').setView([43.2, -102.6], 12);

// Base map layer (topographic)
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data © OpenTopoMap & OpenStreetMap contributors'
}).addTo(map);

// --- USGS Hillshade Overlay for terrain shading ---
L.tileLayer.wms('https://basemap.nationalmap.gov/arcgis/services/USGSShadedReliefOnly/MapServer/WMSServer', {
  layers: '0',
  format: 'image/png',
  transparent: true,
  attribution: 'USGS Hillshade',
  opacity: 0.5,
  zIndex: 100
}).addTo(map);

// --- Elevation Contours (USGS WMS) ---
L.tileLayer.wms('https://basemap.nationalmap.gov/arcgis/services/Contours/MapServer/WMSServer', {
  layers: '0',
  format: 'image/png',
  transparent: true,
  attribution: 'USGS Elevation Contours',
  opacity: 0.6,
  zIndex: 110
}).addTo(map);

// --- Town Markers ---
var towns = [
  { name: "Oglala", coords: [43.19, -102.75] },
  { name: "Manderson", coords: [43.2352, -102.4636] },
  { name: "Wounded Knee", coords: [43.1454, -102.3673] }
];

towns.forEach(function(town) {
  L.marker(town.coords, {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
      iconSize: [24, 24]
    })
  })
    .addTo(map)
    .bindPopup(`<b>${town.name}</b><br>Flood risk from White River under review.`)
    .bindTooltip(town.name, {
      permanent: true,
      direction: 'top',
      className: 'town-label'
    });
});

// --- White River Flood Buffer Zone (embedded GeoJSON) ---
var riverBuffer = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "White River 0.5mi Buffer"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-102.87, 43.17],
            [-102.85, 43.18],
            [-102.82, 43.20],
            [-102.80, 43.22],
            [-102.78, 43.24],
            [-102.75, 43.26],
            [-102.72, 43.27],
            [-102.69, 43.28],
            [-102.66, 43.27],
            [-102.64, 43.26],
            [-102.62, 43.24],
            [-102.60, 43.22],
            [-102.59, 43.20],
            [-102.59, 43.18],
            [-102.60, 43.16],
            [-102.62, 43.14],
            [-102.65, 43.13],
            [-102.68, 43.12],
            [-102.71, 43.12],
            [-102.74, 43.12],
            [-102.77, 43.13],
            [-102.80, 43.14],
            [-102.83, 43.15],
            [-102.85, 43.16],
            [-102.87, 43.17]
          ]
        ]
      }
    }
  ]
};

L.geoJSON(riverBuffer, {
  style: {
    color: '#3399ff',
    weight: 2,
    fillColor: '#aaddff',
    fillOpacity: 0.3
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup("Estimated 0.5-mile flood risk buffer from the White River.");
  }
}).addTo(map);

// --- Legend ---
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: #4477ff"></i> Elevation Contours<br>';
  div.innerHTML += '<i style="background: #aaddff"></i> White River Flood Buffer<br>';
  div.innerHTML += '<svg width="18" height="18"><circle cx="9" cy="9" r="7" fill="black"/></svg> Town Marker<br>';
  return div;
};
legend.addTo(map);


