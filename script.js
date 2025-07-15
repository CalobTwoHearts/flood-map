// Initialize map centered over Pine Ridge Reservation
var map = L.map('map').setView([43.3, -102.55], 9);

// Base map layer (topographic)
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data © OpenTopoMap & OpenStreetMap contributors'
}).addTo(map);

// --- Flood Risk Zones ---
var floodZones = [
  {
    name: "Flood Risk: Oglala",
    coords: [
      [43.18, -102.8],
      [43.18, -102.75],
      [43.22, -102.75],
      [43.22, -102.8]
    ]
  },
  {
    name: "Flood Risk: Pine Ridge",
    coords: [
      [43.00, -102.65],
      [43.00, -102.60],
      [43.04, -102.60],
      [43.04, -102.65]
    ]
  },
  {
    name: "Flood Risk: Badlands",
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

// --- Town markers ---
var towns = [
  { name: "Oglala", coords: [43.19, -102.75] },
  { name: "Kyle", coords: [43.42, -102.18] },
  { name: "Porcupine", coords: [43.19, -102.53] },
  { name: "Pine Ridge", coords: [43.02, -102.58] }
];

towns.forEach(function(town) {
  L.marker(town.coords, {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
      iconSize: [24, 24]
    })
  })
    .addTo(map)
    .bindPopup("<b>Town of " + town.name + "</b><br>Flood vulnerability under review.")
    .bindTooltip(town.name, {
      permanent: true,
      direction: 'top',
      className: 'town-label'
    });
});

// --- Reservation boundary ---
fetch("https://sdgis.sd.gov/host/rest/services/Hosted/Boundary_ReservationBoundariesAndTribalLands/FeatureServer/0/query?where=NAME%3D'Pine+Ridge+Reservation'&f=geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: '#8800cc',
        fillColor: '#cc99ff',
        fillOpacity: 0.3,
        weight: 2
      }
    }).addTo(map).bindPopup("Pine Ridge Reservation Boundary");
  });

// --- Highway 44 Flood Risk Layer ---
fetch('highway_44_flood_risk.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'orange',
        weight: 4,
        dashArray: '4, 4'
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.notes || ''}`);
      }
    }).addTo(map);
  });

// --- Roads and White River Network Layer ---
fetch('infrastructure_and_river.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function(feature) {
        if (feature.properties.type === "river") {
          return { color: '#0077cc', weight: 4 };
        } else if (feature.properties.type === "tributary") {
          return { color: '#66aaff', weight: 2, dashArray: '2, 6' };
        } else {
          return { color: feature.properties.color || 'gray', weight: 3, dashArray: '5, 5' };
        }
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>${feature.properties.name}</b>`);
        if (feature.properties.type === "river" && feature.properties.mainstem) {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            direction: 'center',
            className: 'river-label'
          });
        }
      }
    }).addTo(map);
  });

// --- Legend ---
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: red"></i> Flood Risk Zones<br>';
  div.innerHTML += '<i style="background: #0077cc"></i> White River<br>';
  div.innerHTML += '<i style="background: #66aaff"></i> Tributary<br>';
  div.innerHTML += '<i style="background: #cc99ff"></i> Reservation Boundary<br>';
  div.innerHTML += '<i style="background: orange"></i> Hwy 44 Flood Risk<br>';
  div.innerHTML += '<i style="background: brown"></i> Hwy 18<br>';
  div.innerHTML += '<i style="background: darkred"></i> BIA Rt. 2<br>';
  div.innerHTML += '<svg width="18" height="18"><circle cx="9" cy="9" r="7" fill="black"/></svg> Town Marker<br>';
  return div;
};
legend.addTo(map);


