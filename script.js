// Initialize map centered over Pine Ridge Reservation area including Oglala, Manderson, Wounded Knee
var map = L.map('map').setView([43.2, -102.6], 12);

// Base map layer (topographic)
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data © OpenTopoMap & OpenStreetMap contributors'
}).addTo(map);

// --- Elevation Contours (USGS WMS) ---
L.tileLayer.wms("https://carto.nationalmap.gov/arcgis/services/contours/MapServer/WMSServer", {
  layers: 'Contours US 100 Foot Lines',
  format: 'image/png',
  transparent: true,
  attribution: 'USGS Elevation Contours'
}).addTo(map);

// --- Streamflow Data (USGS WaterWatch WMS) ---
L.tileLayer.wms("https://waterwatch.usgs.gov/arcgis/services/Streamflow/MapServer/WMSServer", {
  layers: 'Streamflow',
  format: 'image/png',
  transparent: true,
  attribution: 'USGS Streamflow Data'
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
  });

// --- Legend ---
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: #4477ff"></i> Elevation Contours<br>';
  div.innerHTML += '<i style="background: #ff7800"></i> Historical Flood Events<br>';
  div.innerHTML += '<i style="background: #0080ff"></i> Streamflow Data<br>';
  div.innerHTML += '<i style="background: #cc99ff"></i> Reservation Boundary<br>';
  div.innerHTML += '<svg width="18" height="18"><circle cx="9" cy="9" r="7" fill="black"/></svg> Town Marker<br>';
  return div;
};
legend.addTo(map);

