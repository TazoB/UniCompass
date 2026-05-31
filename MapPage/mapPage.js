document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  lucide.createIcons();

  // 2. Map bounds
  const bounds = [
    [-90, -180],
    [90, 180]
  ];

  const calculateMinZoom = () => window.innerWidth > 1500 ? 3 : 2;

  // 3. Initialize map
  const map = L.map('main-map', {
    center: [35, 10],
    zoom: calculateMinZoom(),
    minZoom: calculateMinZoom(),
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    zoomControl: false
  });

  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  // 4. Tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    noWrap: true
  }).addTo(map);

  // 5. Panel DOM elements (MUST be inside DOMContentLoaded)
  const sidePanel = document.getElementById('side-panel');
  const closeBtn = document.getElementById('close-panel-btn');

  const elBadge = document.getElementById('match-badge');
  const elName = document.getElementById('uni-name');
  const elLocation = document.querySelector('#uni-location span');

  const elCost = document.getElementById('stat-cost');
  const elVisa = document.getElementById('stat-visa');
  const elAcceptance = document.getElementById('stat-acceptance');
  const elSalary = document.getElementById('stat-salary');

  const elRoadmapList = document.getElementById('roadmap-list');

  let activeMarker = null;

  // 6. Close panel safely
  closeBtn.addEventListener('click', () => {
    sidePanel.classList.remove('panel-active');
    sidePanel.classList.add('panel-hidden');

    if (activeMarker) {
      activeMarker.setRadius(8);
      activeMarker = null;
    }
  });

  // 7. Fetch universities
  fetch('http://localhost:8080/universities')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(universities => {

      console.log("Universities loaded:", universities);

      if (!Array.isArray(universities)) {
        throw new Error("API did not return an array");
      }

      universities.forEach(uni => {

        // safety check for coordinates
        if (!uni.latitude || !uni.longitude) {
          console.warn("Skipping invalid university:", uni);
          return;
        }

        const marker = L.circleMarker([uni.latitude, uni.longitude], {
          color: '#ff0000',
          fillColor: '#ff0000',
          fillOpacity: 0.9,
          radius: 2,
          weight: 2
        }).addTo(map);

        // marker click handler (IMPORTANT: inside loop)
        marker.on('click', () => {

          // reset previous marker
          if (activeMarker) {
            activeMarker.setRadius(2);
          }

          marker.setRadius(12);
          activeMarker = marker;

          // fill panel safely
          elName.textContent = uni.name || "Unknown University";
          elLocation.textContent = uni.location || "Unknown location";

          if (elBadge) {
            elBadge.style.backgroundColor = '#ef4444';
            elBadge.style.color = '#fff';
          }

          // show panel
          sidePanel.classList.remove('panel-hidden');
          sidePanel.classList.add('panel-active');

          // smooth pan
          const zoom = map.getZoom();
          const lngOffset = 150 / Math.pow(2, zoom);

          map.flyTo(
            [uni.latitude, uni.longitude - lngOffset],
            zoom,
            { animate: true, duration: 0.8 }
          );
        });
      });
    })
    .catch(error => {
      console.error('Error fetching university data:', error);
    });
});