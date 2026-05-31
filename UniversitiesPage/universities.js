document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  lucide.createIcons();

  // 2. Map boundary layout definitions
  const bounds = [
    [-90, -180],
    [90, 180]
  ];

  const calculateMinZoom = () => window.innerWidth > 1500 ? 3 : 2;

  // 3. Initialize map layout viewport parameters
  const map = L.map('main-map', {
    center: [35, 10],
    zoom: calculateMinZoom(),
    minZoom: calculateMinZoom(),
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    zoomControl: false
  });

  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  // 4. Clean Tile Layer Map Base setup
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    noWrap: true
  }).addTo(map);

  // 5. DOM Target Element Extractions
  const sidePanel = document.getElementById('side-panel');
  const closeBtn = document.getElementById('close-panel-btn');

  const elBadge = document.getElementById('match-badge');
  const elName = document.getElementById('uni-name');
  const elLocation = document.querySelector('#uni-location span');
  const elImage = document.getElementById('uni-image');

  const elRanking = document.getElementById('stat-ranking');
  const elAcceptance = document.getElementById('stat-acceptance');
  const elStudents = document.getElementById('stat-students');
  const elEstablished = document.getElementById('stat-established');

  const elPercentageText = document.getElementById('match-percentage');
  const elProgressBarFill = document.getElementById('match-progress-fill');

  const elRoadmapList = document.getElementById('roadmap-list');

  const elCostTuition = document.getElementById('cost-tuition');
  const elCostLiving = document.getElementById('cost-living');
  const elCostOther = document.getElementById('cost-other');
  const elCostTotal = document.getElementById('cost-total');

  const elScholarshipList = document.getElementById('scholarship-entries-list');
  const elEmploymentRate = document.getElementById('stat-employment');
  const elStartingSalary = document.getElementById('stat-salary');
  const elIndustriesFlexBox = document.getElementById('top-industries-box-list');

  let activeMarker = null;

  // 6. Dynamic Bracket Metric Color Utilities (Matches the requested variable keys)
  function getMarkerHexColor(percentage) {
    if (percentage >= 85) return '#10b981'; // --color-safe (Green)
    if (percentage >= 70) return '#eab308'; // --color-target (Yellow)
    if (percentage >= 50) return '#f59e0b'; // --color-reach (Orange)
    return '#ef4444';                       // --color-dream (Red)
  }

  function getMatchTierLabel(percentage) {
    if (percentage >= 85) return 'Safe Match';
    if (percentage >= 70) return 'Target Match';
    if (percentage >= 50) return 'Reach Match';
    return 'Dream Match';
  }

  // 7. Panel Closing Transitions
  closeBtn.addEventListener('click', () => {
    sidePanel.classList.remove('panel-active');
    sidePanel.classList.add('panel-hidden');

    if (activeMarker) {
      activeMarker.setRadius(7); // Revert target size configuration
      activeMarker = null;
    }
  });

  // 8. Core Data Vector Renderer Pipeline
  function renderUniversityPins(universitiesList) {
    universitiesList.forEach(uni => {
      const lat = uni.latitude !== undefined ? uni.latitude : uni.lat;
      const lng = uni.longitude !== undefined ? uni.longitude : uni.lng;

      if (lat === undefined || lng === undefined) return;

      const targetColor = getMarkerHexColor(uni.matchPercentage);

      // Deploy standard dot pins directly matching your parameters
      const marker = L.circleMarker([lat, lng], {
        color: '#ffffff',
        fillColor: targetColor,
        fillOpacity: 0.95,
        radius: 7,
        weight: 1.5
      }).addTo(map);

      // Marker Clicking Handler Processing Sub-systems
      marker.on('click', () => {
        if (activeMarker) activeMarker.setRadius(7);

        marker.setRadius(11);
        activeMarker = marker;

        // Populate Text Identity Fields
        elName.innerHTML = `${uni.name || "Unknown University"} <i data-lucide="badge-check" class="verified-icon"></i>`;
        elLocation.textContent = uni.location || "Location Details Unspecified";
        elImage.src = uni.imageUrl || "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22450%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23cbd5e1%22%2F%3E%3C%2svg%3E";

        // Populate Top Profile Meta Matrices
        elRanking.textContent = uni.ranking || "N/A";
        elAcceptance.textContent = uni.acceptanceRate || "N/A";
        elStudents.textContent = uni.totalStudents || "N/A";
        elEstablished.textContent = uni.established || "N/A";

        // Hydrate Admission Chance Elements
        const chanceScore = uni.matchPercentage || 0;
        elPercentageText.textContent = `${chanceScore}%`;
        elProgressBarFill.style.width = `${chanceScore}%`;

        if (elBadge) {
          elBadge.textContent = getMatchTierLabel(chanceScore);
          elBadge.style.backgroundColor = targetColor;
        }

        // Render Action Roadmaps Checklist Grid
        if (uni.improvementChecklist && Array.isArray(uni.improvementChecklist)) {
          elRoadmapList.innerHTML = uni.improvementChecklist.map(step => {
            // Compute dynamic sub-bar visual metrics percentages safely
            const dynamicBarWidth = Math.min(100, (parseInt(step.impact) || 5) * 6);
            return `
              <li>
                <div class="task-wrapper"><i data-lucide="check"></i> <span>${step.task}</span></div>
                <div style="display: flex; align-items: center;">
                  <span class="impact-val-text">Impact: ${step.impact}</span>
                  <div class="horizontal-bar-track">
                    <div class="horizontal-bar-fill" style="width: ${dynamicBarWidth}%;"></div>
                  </div>
                </div>
              </li>
            `;
          }).join('');
        } else {
          elRoadmapList.innerHTML = '<li>All profiles optimization metrics completely qualified.</li>';
        }

        // Hydrate Budget Data Calculations Separated by Structural Faculty Variables
        if (uni.costs) {
          elCostTuition.textContent = uni.costs.tuition || "$0";
          elCostLiving.textContent = uni.costs.living || "$0";
          elCostOther.textContent = uni.costs.other || "$0";
          elCostTotal.textContent = uni.costs.total || "$0";
        }

        // Hydrate Scholarship Entry Cards Rows Loop
        if (uni.scholarships && Array.isArray(uni.scholarships)) {
          elScholarshipList.innerHTML = uni.scholarships.map(sch => `
            <div class="scholarship-entry-card">
              <div class="sch-header-line">
                <i data-lucide="${sch.icon || 'award'}" style="width:14px; height:14px; color:var(--accent-blue);"></i>
                <span>${sch.name}</span>
              </div>
              <div class="sch-details-subrow">
                <span>${sch.chance} success chance</span>
                <span class="sch-bold-amount">${sch.amount}</span>
              </div>
            </div>
          `).join('');
        } else {
          elScholarshipList.innerHTML = '<p class="interpretive-text">No active funding programs verified.</p>';
        }

        // Hydrate Career Data Metrics Layout Boxes
        elEmploymentRate.textContent = uni.employmentRate || "N/A";
        elStartingSalary.textContent = uni.avgStartingSalary || "N/A";

        // Render Horizontal Target Industry Node Elements
        if (uni.topIndustries && Array.isArray(uni.topIndustries)) {
          elIndustriesFlexBox.innerHTML = uni.topIndustries.map(ind => `
            <div class="industry-node-tag">
              <div class="ind-icon-wrapper"><i data-lucide="${ind.icon || 'briefcase'}" style="width: 16px; height: 16px;"></i></div>
              <span>${ind.name}</span>
            </div>
          `).join('');
        } else {
          elIndustriesFlexBox.innerHTML = '';
        }

        // Re-execute Lucide rendering mapping tracking engines across structural DOM alterations
        lucide.createIcons();

        // Reveal layout panels container tracking states
        sidePanel.classList.remove('panel-hidden');
        sidePanel.classList.add('panel-active');

        // Center map configuration layout
        const zoom = map.getZoom();
        const lngOffset = 200 / Math.pow(2, zoom);
        map.flyTo([lat, lng - lngOffset], zoom, { animate: true, duration: 0.8 });
      });
    });
  }

  // 9. Load API Telemetry Feeds
  fetch('http://localhost:8080/universities')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP network response failure: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        renderUniversityPins(data);
      } else {
        renderUniversityPins(getSampleUniversityData());
      }
    })
    .catch(error => {
      console.warn('Telemetry engine mapping fallbacks triggered:', error);
      renderUniversityPins(getSampleUniversityData());
    });

  // 10. High Fidelity Sample Backup Dataset (Fully supports your light theme elements)
  function getSampleUniversityData() {
    return [
      {
        id: 1,
        name: "Stanford University",
        location: "Stanford, California, USA",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
        latitude: 37.4275,
        longitude: -122.1697,
        matchPercentage: 42, // Dream Match
        ranking: "#3 in the World",
        acceptanceRate: "4.3%",
        totalStudents: "17,609",
        established: "1885",
        improvementChecklist: [
          { task: "Increase SAT Score by 150+ points", impact: "+12%" },
          { task: "Complete a Research Project", impact: "+10%" },
          { task: "Get a Leadership Position", impact: "+8%" },
          { task: "Win a National/International Competition", impact: "+7%" },
          { task: "Achieve English Level C1 or higher", impact: "+5%" }
        ],
        costs: {
          tuition: "$62,484",
          living: "$20,382",
          other: "$6,000",
          total: "$88,866"
        },
        scholarships: [
          { name: "Merit Based Scholarship", chance: "25%", amount: "Up to $20,000", icon: "star" },
          { name: "Need Based Aid", chance: "35%", amount: "Varies", icon: "sparkles" }
        ],
        employmentRate: "94%",
        avgStartingSalary: "$92,000/yr",
        topIndustries: [
          { name: "Tech", icon: "cpu" },
          { name: "Finance", icon: "landmark" },
          { name: "Consulting", icon: "briefcase" },
          { name: "Research", icon: "microscope" }
        ]
      },
      {
        id: 2,
        name: "Technical University of Munich",
        location: "Munich, Germany",
        imageUrl: "https://images.unsplash.com/photo-1592289196898-1e428d0835f1?w=600",
        latitude: 48.1496,
        longitude: 11.5678,
        matchPercentage: 88, // Safe Match
        ranking: "#49 in the World",
        acceptanceRate: "35%",
        totalStudents: "50,484",
        established: "1868",
        improvementChecklist: [
          { task: "Submit verified GitHub Project Portfolio", impact: "+10%" },
          { task: "Pass German Language Threshold Module (A2)", impact: "+5%" }
        ],
        costs: {
          tuition: "$0 (Tuition Free)",
          living: "$14,500",
          other: "$2,200",
          total: "$16,700"
        },
        scholarships: [
          { name: "DAAD International Student Grant", chance: "15%", amount: "$12,000/yr", icon: "globe" }
        ],
        employmentRate: "96%",
        avgStartingSalary: "$75,000/yr",
        topIndustries: [
          { name: "Automotive", icon: "car" },
          { name: "Tech", icon: "cpu" },
          { name: "Research", icon: "microscope" }
        ]
      }
    ];
  }
});