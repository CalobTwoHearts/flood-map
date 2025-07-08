// Center over Pine Ridge Reservation
var map = L.map('map').setView([43.3, -102.55], 9);

// Base map from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
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
