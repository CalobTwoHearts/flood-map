var map = L.map('map').setView([43.3, -102.55], 9);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data © OpenTopoMap & OpenStreetMap contributors'
}).addTo(map);

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

L.marker([43.3, -102.5]).addTo(map)
  .bindPopup("Infrastructure Location")
  .openPopup();

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

// Reservation district boundary polygon example
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
