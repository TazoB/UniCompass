document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  lucide.createIcons();

  // 2. Initialize Leaflet Background Map
  // Disable all interactions so it acts purely as a background
  const map = L.map('bg-map', {
    center: [35, 10], // Center the map to show Europe, Asia, and North America nicely
    zoom: 2.5,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    attributionControl: false // Hide attribution for clean background look
  });

// Use a bright, colorful Light Mode map tile from CartoDB (Voyager)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // 3. Add Red Markers for "Hidden Gem" Universities
  // Array of coordinates: [Latitude, Longitude]
  const universityLocations = [
    [48.14, 11.57],   // Munich, Germany
    [58.37, 26.72],   // Tartu, Estonia
    [35.71, 139.76],  // Tokyo, Japan
    [1.29, 103.77],   // Singapore
    [40.48, -3.71],   // Madrid, Spain
    [60.18, 24.83],   // Helsinki, Finland
    [43.66, -79.39],  // Toronto, Canada
    [-33.91, 151.23], // Sydney, Australia
    [-33.44, -70.65], // Santiago, Chile
    [38.73, -9.16]    // Lisbon, Portugal
  ];

  // Loop through and place glowing red circle markers
  universityLocations.forEach(coords => {
    L.circleMarker(coords, {
      color: '#ef4444',       // Tailwind red-500 border
      weight: 2,
      fillColor: '#dc2626',   // Tailwind red-600 fill
      fillOpacity: 0.8,
      radius: 6               // Size of the dot
    }).addTo(map);
  });

  // 4. Navbar visual effect on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
});