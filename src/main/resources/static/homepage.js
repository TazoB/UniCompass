document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  const map = L.map('bg-map', {
    center: [35, 10],
    zoom: 2.5,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  const universityLocations = [
    [48.14, 11.57],
    [58.37, 26.72],
    [35.71, 139.76],
    [1.29, 103.77],
    [40.48, -3.71],
    [60.18, 24.83],
    [43.66, -79.39],
    [-33.91, 151.23],
    [-33.44, -70.65],
    [38.73, -9.16]
  ];

  universityLocations.forEach(coords => {
    L.circleMarker(coords, {
      color: '#ef4444',
      weight: 2,
      fillColor: '#dc2626',
      fillOpacity: 0.8,
      radius: 6
    }).addTo(map);
  });
});