document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const universityCache = { generic: {}, personalized: {} };
    const markers = {};

    const map = L.map('map', { zoomControl: false, minZoom: 3, maxBounds: [[-90, -180], [90, 180]], maxBoundsViscosity: 1.0 }).setView([35.0, -20.0], 3);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);

    const smallRedPin = L.divIcon({
        className: 'custom-red-pin',
        html: '<div class="pin-dot" style="background-color: #dc2626; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
    });

    const getColoredPin = (level) => {
        let bgColor = '#64748b';
        if (level === 'high') bgColor = '#16a34a';
        else if (level === 'med') bgColor = '#eab308';
        else if (level === 'low') bgColor = '#dc2626';

        return L.divIcon({
            className: 'custom-pin',
            html: `<div class="pin-dot" style="background-color: ${bgColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.4);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });
    }

    const sidePanel = document.getElementById('university-panel');
    const viewGeneric = document.getElementById('view-generic');
    const viewPersonalized = document.getElementById('view-personalized');
    const btnPersonalizedMap = document.getElementById('btn-personalized-map');

    let isPersonalizedMode = false;
    let currentlySelectedUni = null;

    async function fetchPins() {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/universities/pins', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to load map pins");

            const pins = await response.json();

            pins.forEach(pin => {
                const marker = L.marker([pin.latitude, pin.longitude], { icon: smallRedPin }).addTo(map);
                markers[pin.id] = marker;
                marker.on('click', () => handlePinClick(pin.id, pin.latitude, pin.longitude));
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function handlePinClick(uniId, lat, lng) {
        sidePanel.classList.add('open');
        document.getElementById('sp-name').textContent = "Loading details...";
        map.setView([lat, lng], map.getZoom(), { animate: true, pan: { duration: 0.5 } });

        const token = localStorage.getItem('jwt_token');

        const endpoint = isPersonalizedMode
            ? `http://localhost:8080/api/universities/calculate/${uniId}`
            : `http://localhost:8080/universities/info/${uniId}`;

        const cacheBucket = isPersonalizedMode ? 'personalized' : 'generic';

        if (universityCache[cacheBucket][uniId]) {
            populatePanel(universityCache[cacheBucket][uniId]);
            updatePanelView();
            return;
        }

        try {
            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: Failed to load details.`);
            }

            const detailedData = await response.json();

            detailedData.id = detailedData.universityId || detailedData.id;

            universityCache[cacheBucket][uniId] = detailedData;

            populatePanel(detailedData);
            updatePanelView();
        } catch (error) {
            document.getElementById('sp-name').textContent = "Error loading data.";
        }
    }

    function populatePanel(uni) {
        currentlySelectedUni = uni;
        document.getElementById('sp-cover').src = uni.coverImageUrl || 'https://via.placeholder.com/600x200?text=No+Image';
        document.getElementById('sp-name').textContent = uni.name;
        document.getElementById('sp-location').textContent = `${uni.city}, ${uni.country}`;
        document.getElementById('sp-url').textContent = uni.websiteUrl || 'No website provided';
        document.getElementById('sp-url').href = uni.websiteUrl || '#';
        document.getElementById('sp-desc').textContent = uni.description || 'No description available.';
        document.getElementById('sp-ranking').textContent = uni.worldRanking ? `#${uni.worldRanking}` : 'Unranked';

        const btnFavorite = document.getElementById('btn-favorite');
        const favWrapper = document.getElementById('favorite-icon-wrapper');
        favWrapper.innerHTML = `<i data-lucide="bookmark"></i>`;

        if (uni.isUserFavorite) btnFavorite.classList.add('is-active');
        else btnFavorite.classList.remove('is-active');

        const programsList = document.getElementById('sp-programs-list');
        programsList.innerHTML = '';
        if (uni.programs) {
            uni.programs.forEach(p => programsList.innerHTML += `<li>${p}</li>`);
        } else if (uni.topPrograms) {
            uni.topPrograms.forEach(p => programsList.innerHTML += `<li>${p.programName}</li>`);
        } else {
            programsList.innerHTML = `<li>No programs listed.</li>`;
        }

        const matchData = uni.topPrograms || [];
        const matchContainer = document.getElementById('sp-best-matches');
        matchContainer.innerHTML = '';

        if (matchData.length === 0 && isPersonalizedMode) {
            matchContainer.innerHTML = `<p style="color: #64748b; font-size: 0.9rem;">No programs match your Point of Interest.</p>`;
        } else {
            matchData.forEach(match => {
                const badgeClass = match.level === 'high' ? 'match-high' : match.level === 'med' ? 'match-med' : 'match-low';

                const isFav = match.isUserFavorite === true;
                const heartColor = isFav ? '#ef4444' : '#94a3b8';
                const heartFill = isFav ? '#ef4444' : 'none';

                matchContainer.innerHTML += `
                    <div class="match-row">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="program-name">${match.programName}</span>
                            <button class="btn-fav-program" data-prog-id="${match.programId}" data-is-fav="${isFav}" style="background: none; border: none; cursor: pointer; padding: 0; color: ${heartColor}; transition: all 0.2s; outline: none;">
                                <i data-lucide="heart" class="icon-sm" style="fill: ${heartFill};"></i>
                            </button>
                        </div>
                        <span class="match-badge ${badgeClass}">${match.matchPercentage}% Match</span>
                    </div>
                `;
            });
        }

        const gapData = uni.gaps || [];
        const gapContainer = document.getElementById('sp-gap-analysis');
        gapContainer.innerHTML = '';

        if (gapData.length === 0 && isPersonalizedMode && matchData.length > 0) {
            gapContainer.innerHTML = `<p style="color: #16a34a; font-size: 0.9rem;">You meet all target criteria!</p>`;
        } else {
            gapData.forEach(gap => {
                gapContainer.innerHTML += `
                    <div class="action-box">
                        <div class="action-header">
                            <i data-lucide="${gap.icon}" class="icon-sm"></i> ${gap.title}
                        </div>
                        <div class="action-text">${gap.text}</div>
                    </div>
                `;
            });
        }

        lucide.createIcons();

        document.querySelectorAll('.btn-fav-program').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();

                const progId = btn.getAttribute('data-prog-id');
                const isCurrentlyFav = btn.getAttribute('data-is-fav') === 'true';
                const newFavState = !isCurrentlyFav;

                btn.setAttribute('data-is-fav', newFavState);
                btn.style.color = newFavState ? '#ef4444' : '#94a3b8';
                const svg = btn.querySelector('svg');
                if (svg) {
                    svg.style.fill = newFavState ? '#ef4444' : 'none';
                }
                if (uni.topPrograms) {
                    const p = uni.topPrograms.find(prog => prog.programId == progId);
                    if (p) p.isUserFavorite = newFavState;
                }

                const token = localStorage.getItem('jwt_token');

                const requestMethod = newFavState ? 'POST' : 'DELETE';

                try {
                    const response = await fetch(`http://localhost:8080/universities/programs/${progId}/favorite`, {
                        method: requestMethod,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) throw new Error("Failed to favorite program.");

                } catch (error) {
                    console.error(error);
                    btn.setAttribute('data-is-fav', isCurrentlyFav);
                    btn.style.color = isCurrentlyFav ? '#ef4444' : '#94a3b8';
                    if (svg) svg.style.fill = isCurrentlyFav ? '#ef4444' : 'none';

                    if (uni.topPrograms) {
                        const p = uni.topPrograms.find(prog => prog.programId == progId);
                        if (p) p.isUserFavorite = isCurrentlyFav;
                    }
                }
            });
        });
    }

    function updatePanelView() {
        if (isPersonalizedMode) {
            viewGeneric.classList.add('hidden');
            viewPersonalized.classList.remove('hidden');
        } else {
            viewGeneric.classList.remove('hidden');
            viewPersonalized.classList.add('hidden');
        }
    }

    document.getElementById('btn-close-panel').addEventListener('click', () => sidePanel.classList.remove('open'));
    map.on('click', () => sidePanel.classList.remove('open'));

    btnPersonalizedMap.addEventListener('click', async () => {
        isPersonalizedMode = !isPersonalizedMode;
        const token = localStorage.getItem('jwt_token');

        if (isPersonalizedMode) {
            btnPersonalizedMap.classList.add('active');
            btnPersonalizedMap.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Calculating...`;
            lucide.createIcons();

            try {
                const response = await fetch('http://localhost:8080/api/universities/map-matches', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to calculate matches");

                const matchData = await response.json();

                matchData.forEach(match => {
                    const marker = markers[match.universityId];
                    if (marker) marker.setIcon(getColoredPin(match.matchLevel));
                });

                btnPersonalizedMap.innerHTML = `<i data-lucide="x-circle" class="icon-sm"></i> Exit personalized map`;
            } catch (error) {
                console.error(error);
                btnPersonalizedMap.innerHTML = `<i data-lucide="sparkles" class="icon-sm"></i> See personalized map`;
                isPersonalizedMode = false;
            }

        } else {
            btnPersonalizedMap.classList.remove('active');
            btnPersonalizedMap.innerHTML = `<i data-lucide="sparkles" class="icon-sm"></i> See personalized map`;

            Object.values(markers).forEach(marker => marker.setIcon(smallRedPin));
        }

        lucide.createIcons();

        if (sidePanel.classList.contains('open') && currentlySelectedUni) {
            handlePinClick(currentlySelectedUni.id, map.getCenter().lat, map.getCenter().lng);
        }
    });

    fetchPins();

    document.getElementById('btn-favorite').addEventListener('click', async () => {
        if (!currentlySelectedUni) return;

        const btnFavorite = document.getElementById('btn-favorite');

        const newFavState = !currentlySelectedUni.isUserFavorite;
        const requestMethod = newFavState ? 'POST' : 'DELETE';

        currentlySelectedUni.isUserFavorite = newFavState;
        btnFavorite.classList.toggle('is-active');

        const token = localStorage.getItem('jwt_token');
        try {
            const response = await fetch(`http://localhost:8080/universities/${currentlySelectedUni.id}/favorite`, {
                method: requestMethod,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Failed to update server.");
        } catch (error) {
            console.error(error);
            currentlySelectedUni.isUserFavorite = !currentlySelectedUni.isUserFavorite;
            btnFavorite.classList.toggle('is-active');
        }
    });
});