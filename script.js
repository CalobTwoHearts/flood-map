// Center over Pine Ridge Reservation
var map = L.map('map').setView([43.3, -102.55], 9);

// Topographic base map
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data © OpenTopoMap & OpenStreetMap contributors'
}).addTo(map);

// Dummy polygon to show "flood risk zone"
var floodRiskZone = L.polygon([
  [43.25, -102.8],
  [43.25, -102.3],
  [43.4, -102.3],
  [43.4, -102.8]
], {
  color: 'blue',
  fillColor: '#3399ff',
  fillOpacity: 0.4
}).addTo(map);

floodRiskZone.bindPopup("Example Flood Risk Zone");

// Infrastructure marker
L.marker([43.3, -102.5]).addTo(map)
  .bindPopup("Infrastructure Location")
  .openPopup();

