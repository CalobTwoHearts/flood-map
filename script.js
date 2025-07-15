<!DOCTYPE html>
<html>
<head>
  <title>Flood Risk Map - Pine Ridge</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <style>
    #map { height: 100vh; }
    .town-label {
      font-size: 12px;
      font-weight: bold;
      color: black;
      text-shadow: 1px 1px white;
    }
    .legend i {
      width: 18px;
      height: 18px;
      float: left;
      margin-right: 8px;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    // Initialize map centered over Pine Ridge Reservation
    var map = L.map('map').setView([43.3, -102.55], 9);

    // Base map layer (topographic)
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data © OpenTopoMap & OpenStreetMap contributors'
    }).addTo(map);

    // --- White River (symbolic) ---
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

    // --- Flood Risk Zones (custom rectangles near towns) ---
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
          [43]()



