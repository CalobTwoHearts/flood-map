// Initialize map centered over Pine Ridge Reservation
var map = L.map('map').setView([43.2, -102.6], 10);

// Base map layer (topographic)
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data © OpenTopoMap & OpenStreetMap contributors'
}).addTo(map);

// --- Load White River Floodplain Polygon ---
fetch('white_river_floodplain_expanded.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: '#0044cc',
        fillColor: '#4477ff',
        fillOpacity: 0.4,
        weight: 2,
        dashArray: '5,5'
      }
    }).addTo(map).bindPopup("White River Floodplain - Pine Ridge Area");
  });

// --- Load Roads (Highway 44 and others) ---
fetch('roads_expanded.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: function(feature) {
        if (feature.properties.type === 'highway') {
          return { color: 'orange', weight: 4 };
        } else {
          return { color: 'brown', weight: 3 };
        }
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>${feature.properties.name}</b>`);
      }
    }).addTo(map);
  });

// --- Town Markers ---
var towns = [
  { name: "Oglala", coords: [43.19, -102.75] },
  { name: "Porcupine", coords: [43.19, -102.53] },
  { name: "Kyle", coords: [43.41, -102.18] },
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
    .bindPopup(`<b>${town.name}</b><br>Flood risk from White River under review.`)
    .bindTooltip(town.name, {
      permanent: true,
      direction: 'top',
      className: 'town-label'
    });
});

// --- Reservation Boundary ---
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

// --- Legend ---
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: #4477ff"></i> White River Floodplain<br>';
  div.innerHTML += '<i style="background: orange"></i> Highway 44<br>';
  div.innerHTML += '<i style="background: brown"></i> Other Roads<br>';
  div.innerHTML += '<i style="background: #cc99ff"></i> Reservation Boundary<br>';
  div.innerHTML += '<svg width="18" height="18"><circle cx="9" cy="9" r="7" fill="black"/></svg> Town Marker<br>';
  return div;
};
legend.addTo(map);

