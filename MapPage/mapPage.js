document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  lucide.createIcons();

  // 2. Set world bounds
  const bounds = [
    [-90, -180], 
    [90, 180]    
  ];

 // Dynamic zoom: If screen is wider than 1500px, force minZoom to 3, otherwise 2 is fine (like on mobile/tablets).
  const calculateMinZoom = () => window.innerWidth > 1500 ? 3 : 2;

  const map = L.map('main-map', {
    center: [35, 10], 
    zoom: calculateMinZoom(),
    minZoom: calculateMinZoom(), // <--- Dynamic Min Zoom
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    zoomControl: false 
  });
  
  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  // Beautiful, bright, colorful map (No CSS hacks needed)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    noWrap: true 
  }).addTo(map);

  // 4. Database of Universities (Hackathon Mock Data)
  const universities = [
    {
      id: 1,
      name: "Technical University of Munich",
      location: "Munich, Germany",
      lat: 48.14,
      lng: 11.57,
      matchType: "TARGET",
      matchScore: "82%",
      cost: "$1,100",
      visa: "95% (High)",
      acceptance: "18%",
      salary: "$75k",
      roadmap: [
        "Take intensive German A1/A2 course before July.",
        "Highlight embedded systems projects in motivation letter.",
        "Submit VPD document via Uni-Assist early."
      ]
    },
    {
      id: 2,
      name: "Stanford University",
      location: "Stanford, CA, USA",
      lat: 37.42,
      lng: -122.16,
      matchType: "DREAM",
      matchScore: "21%",
      cost: "$62,000",
      visa: "80% (Medium)",
      acceptance: "4%",
      salary: "$160k+",
      roadmap: [
        "Boost SAT Math (Goal: 790+).",
        "Lead AP Research Project (Submit by Oct).",
        "Publish independent AI/Robotics framework on GitHub."
      ]
    },
    {
      id: 3,
      name: "University of Tartu",
      location: "Tartu, Estonia",
      lat: 58.37,
      lng: 26.72,
      matchType: "SAFE",
      matchScore: "94%",
      cost: "$4,500",
      visa: "99% (Very High)",
      acceptance: "65%",
      salary: "$55k",
      roadmap: [
        "Maintain current GPA above 85%.",
        "Write a standard motivation letter outlining software interest."
      ]
    }
  ];

  // 5. Panel DOM Elements
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

  // 6. მარკერების დამატება (მხოლოდ ერთი წითელი ფერით)
  universities.forEach(uni => {
    const marker = L.circleMarker([uni.lat, uni.lng], {
      color: '#ef4444',       // მკვეთრი წითელი (Tailwind red-500)
      fillColor: '#ef4444', 
      fillOpacity: 0.9,
      radius: 8,
      weight: 2
    }).addTo(map);

    // Marker Click Event
    marker.on('click', () => {
      // ანიმაცია: არჩეული მარკერი იზრდება
      if (activeMarker) activeMarker.setRadius(8);
      marker.setRadius(12);
      activeMarker = marker;

      // პანელის მონაცემების შევსება
      elBadge.textContent = `${uni.matchType} - ${uni.matchScore}`;
      // ბეიჯის ფერიც წითელი იქნება, რომ დიზაინში ჩაჯდეს (ან შეგიძლიათ ნეიტრალური მუქი დატოვოთ)
      elBadge.style.backgroundColor = '#ef4444'; 
      elBadge.style.color = '#ffffff';
      
      elName.textContent = uni.name;
      elLocation.textContent = uni.location;
      elCost.textContent = uni.cost;
      elVisa.textContent = uni.visa;
      elAcceptance.textContent = uni.acceptance;
      elSalary.textContent = uni.salary;

      // სიის გენერაცია
      elRoadmapList.innerHTML = ''; 
      uni.roadmap.forEach((step, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<div class="step-num">${index + 1}</div> <div>${step}</div>`;
        elRoadmapList.appendChild(li);
      });

      // პანელის გამოჩენა
      sidePanel.classList.remove('panel-hidden');
      sidePanel.classList.add('panel-active');

      // რუკის პანირება
      const zoom = map.getZoom();
      const lngOffset = 150 / Math.pow(2, zoom); 
      
      map.flyTo([uni.lat, uni.lng - lngOffset], zoom, {
        animate: true,
        duration: 0.8 
      });
    });
  });

  // 7. პანელის დახურვა
  closeBtn.addEventListener('click', () => {
    sidePanel.classList.remove('panel-active');
    sidePanel.classList.add('panel-hidden');
    
    if (activeMarker) {
      activeMarker.setRadius(8);
      activeMarker = null;
    }
  });
});