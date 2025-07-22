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

// --- Streamflow Data (USGS WaterWatch WMS) ---
L.tileLayer.wms('https://waterwatch.usgs.gov/arcgis/services/Streamflow/MapServer/WMSServer', {
  layers: '1',
  format: 'image/png',
  transparent: true,
  attribution: 'USGS Streamflow Data',
  opacity: 0.6,
  zIndex: 120
}).addTo(map);

// --- Historical Flood Events (USGS Flood Event Viewer GeoJSON) ---
// Using a bounding box roughly covering Oglala, Manderson, Wounded Knee area
fetch('https://stn.wim.usgs.gov/FEV/api/Events/GeoJson?bbox=-102.85,43.10,-102.35,43.30')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: function(feature, layer) {
        var props = feature.properties;
        var popupContent = `<b>Flood Event</b><br>
          Name: ${props.eventName || "N/A"}<br>
          Start Date: ${props.startDate || "N/A"}<br>
          Description: ${props.description || "No description available."}`;
        layer.bindPopup(popupContent);
      },
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    }).addTo(map);
  })
  .catch(error => {
    console.error("Failed to load flood events GeoJSON:", error);
  });

// --- Town Markers ---
var towns = [
  { name: "Oglala", coords: [43.19, -102.75] },
  { name: "Manderson", coords: [43.23, -102.56] },
  { name: "Wounded Knee", coords: [43.22, -102.39] }
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
  })
  .catch(error => {
    console.error("Failed to load reservation boundary:", error);
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
  div.innerHTML += '<i style="background: #ff7800"></i> Historical Flood Events<br>';
  div.innerHTML += '<i style="background: #0080ff"></i> Streamflow Data<br>';
  div.innerHTML += '<i style="background: #cc99ff"></i> Reservation Boundary<br>';
  div.innerHTML += '<i style="background: #aaddff"></i> White River Flood Buffer<br>';
  div.innerHTML += '<svg width="18" height="18"><circle cx="9" cy="9" r="7" fill="black"/></svg> Town Marker<br>';
  return div;
};
legend.addTo(map);

