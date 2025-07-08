// Initialize map centered over Pine Ridge Reservation
var map = L.map('map').setView([43.3, -102.55], 9);

// Base map layer (topographic)
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data © OpenTopoMap & OpenStreetMap contributors'
}).addTo(map);

// River (White River)
var riverLayer = L.geoJSON({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "White River" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-102.97, 43.25],
          [-102.8, 43.26],
          [-102.6, 43.28],
          [-102.4, 43.31],
          [-102.3, 43.33]
        ]
      }
    }
  ]
}, {
  style: {
    color: "#0077cc",
    weight: 3
  }
}).addTo(map);

riverLayer.bindPopup("White River");

// Infrastructure/Home markers (at-risk locations)
var homesAtRisk = [
  { name: "Oglala Town Center", coords: [43.19, -102.75] },
  { name: "Porcupine Community", coords: [43.17, -102.58] },
  { name: "Badlands Area Home", coords: [43.02, -102.28] }
];

homesAtRisk.forEach(function(home) {
  L.marker(home.coords)
    .addTo(map)
    .bindPopup("<b>" + home.name + "</b><br>Potential flood risk area");
});

// Flood risk zones
var floodZones = [
  {
    name: "Flood Risk Area near Oglala",
    coords: [
      [43.18, -102.8],
      [43.18, -102.75],
      [43.22, -102.75],
      [43.22, -102.8]
    ]
  },
  {
    name: "Flood Risk Area near Porcupine",
    coords: [
      [43.15, -102.6],
      [43.15, -102.55],
      [43.19, -102.55],
      [43.19, -102.6]
    ]
  },
  {
    name: "Flood Risk Area near Badlands",
    coords: [
      [43.0, -102.3],
      [43.0, -102.25],
      [43.05, -102.25],
      [43.05, -102.3]
    ]
  }
];

floodZones.forEach(function(zone) {
  var polygon = L.polygon(zone.coords, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
  }).addTo(map);

  polygon.bindPopup(zone.name);
});

// Reservation district boundary polygon (example)
var reservationDistrict = L.polygon([
  [43.35, -102.85],
  [43.35, -102.45],
  [43.15, -102.45],
  [43.15, -102.85]
], {
  color: 'green',
  fillColor: '#228B22',
  fillOpacity: 0.2,
  weight: 3
}).addTo(map);

reservationDistrict.bindPopup("Reservation District Boundary");

// Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: red"></i> Flood Risk Zone<br>';
  div.innerHTML += '<i style="background: #0077cc"></i> River<br>';
  div.innerHTML += '<i style="background: green"></i> Reservation Boundary<br>';
  div.innerHTML += '<svg width="18" height="18"><circle cx="9" cy="9" r="7" fill="black"/></svg> Infrastructure/Home<br>';
  return div;
};

legend.addTo(map);

