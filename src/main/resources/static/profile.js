let user = null;

function getTemplate(templateId) {
    return document.getElementById(templateId).content.cloneNode(true);
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });
}

async function syncArrayToServer(endpoint, dataArray) {
    const token = localStorage.getItem('jwt_token');
    try {
        const response = await fetch(`http://localhost:8080/api/user/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataArray)
        });

        if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
    } catch (error) {
        console.error(error);
    }
}

function renderPreferences() {
    document.getElementById('val-country').textContent = user.preferences.country || 'Not specified';
    document.getElementById('val-city').textContent = user.preferences.city || 'Not specified';
    document.getElementById('val-state').textContent = user.preferences.state || 'Not specified';

    const budget = user.preferences.budget || 0;
    document.getElementById('val-budget').textContent = budget.toLocaleString();
    document.getElementById('val-poi').textContent = user.preferences.poi || 'Not specified';
}

async function togglePreferencesEdit() {
    const isEditing = !document.getElementById('preferences-edit').classList.contains('hidden');

    if (!isEditing) {
        document.getElementById('preferences-view').classList.add('hidden');
        document.getElementById('preferences-edit').classList.remove('hidden');
        document.getElementById('btn-edit-preferences').classList.add('hidden');
        document.getElementById('btn-save-preferences').classList.remove('hidden');

        document.getElementById('input-country').value = user.preferences.country || '';
        document.getElementById('input-city').value = user.preferences.city || '';
        document.getElementById('input-state').value = user.preferences.state || '';

        const budget = user.preferences.budget || 0;
        document.getElementById('input-budget').value = budget;
        document.getElementById('budget-display').textContent = budget.toLocaleString();

        document.getElementById('input-poi').value = user.preferences.poi || '';
    } else {
        const btn = document.getElementById('btn-save-preferences');
        const originalText = btn.textContent;
        btn.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Saving...`;
        lucide.createIcons();

        const payload = {
            country: document.getElementById('input-country').value.trim(),
            city: document.getElementById('input-city').value.trim(),
            state: document.getElementById('input-state').value.trim(),
            budget: parseInt(document.getElementById('input-budget').value) || 0,
            poi: document.getElementById('input-poi').value.trim()
        };

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch('http://localhost:8080/api/user/update-preferences', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update preferences");

            user.preferences.country = payload.country;
            user.preferences.city = payload.city;
            user.preferences.state = payload.state;
            user.preferences.budget = payload.budget;
            user.preferences.poi = payload.poi;

            document.getElementById('preferences-view').classList.remove('hidden');
            document.getElementById('preferences-edit').classList.add('hidden');
            document.getElementById('btn-edit-preferences').classList.remove('hidden');
            document.getElementById('btn-save-preferences').classList.add('hidden');

            renderPreferences();
        } catch (error) {
            console.error(error);
        } finally {
            btn.textContent = originalText;
        }
    }
}
document.getElementById('btn-edit-preferences').addEventListener('click', togglePreferencesEdit);
document.getElementById('btn-save-preferences').addEventListener('click', togglePreferencesEdit);

document.getElementById('input-budget').addEventListener('input', (e) => {
    document.getElementById('budget-display').textContent = Number(e.target.value).toLocaleString();
});

function renderAcademics() {
    document.getElementById('val-gpa').textContent = user.academics.gpa || 'N/A';
    document.getElementById('val-sat').textContent = user.academics.sat || 'Not taken';
    document.getElementById('val-toefl').textContent = user.academics.toefl || 'Not taken';
    document.getElementById('val-ielts').textContent = user.academics.ielts || 'Not taken';
}

async function toggleAcademicsEdit() {
    const isEditing = !document.getElementById('academics-edit').classList.contains('hidden');

    if (!isEditing) {
        document.getElementById('academics-view').classList.add('hidden');
        document.getElementById('academics-edit').classList.remove('hidden');
        document.getElementById('btn-edit-academics').classList.add('hidden');
        document.getElementById('btn-save-academics').classList.remove('hidden');

        document.getElementById('input-gpa').value = user.academics.gpa || '';
        document.getElementById('input-sat').value = user.academics.sat || '';
        document.getElementById('input-toefl').value = user.academics.toefl || '';
        document.getElementById('input-ielts').value = user.academics.ielts || '';
    } else {
        const btn = document.getElementById('btn-save-academics');
        const originalText = btn.textContent;
        btn.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Saving...`;
        lucide.createIcons();

        let parsedGpa = parseFloat(document.getElementById('input-gpa').value);
        let parsedSat = parseInt(document.getElementById('input-sat').value);
        let parsedToefl = parseInt(document.getElementById('input-toefl').value);
        let parsedIelts = parseFloat(document.getElementById('input-ielts').value);

        const payload = {
            gpa: !isNaN(parsedGpa) ? parseFloat(Math.min(Math.max(parsedGpa, 0), 4.0).toFixed(2)) : null,
            sat: !isNaN(parsedSat) ? Math.min(Math.max(parsedSat, 0), 1600) : null,
            toefl: !isNaN(parsedToefl) ? Math.min(Math.max(parsedToefl, 0), 120) : null,
            ielts: !isNaN(parsedIelts) ? parseFloat(Math.min(Math.max(parsedIelts, 0), 9.0).toFixed(1)) : null
        };

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch('http://localhost:8080/api/user/update-academics', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update academics");

            user.academics.gpa = payload.gpa;
            user.academics.sat = payload.sat;
            user.academics.toefl = payload.toefl;
            user.academics.ielts = payload.ielts;

            document.getElementById('academics-view').classList.remove('hidden');
            document.getElementById('academics-edit').classList.add('hidden');
            document.getElementById('btn-edit-academics').classList.remove('hidden');
            document.getElementById('btn-save-academics').classList.add('hidden');

            renderAcademics();
        } catch (error) {
            console.error(error);
        } finally {
            btn.textContent = originalText;
        }
    }
}
document.getElementById('btn-edit-academics').addEventListener('click', toggleAcademicsEdit);
document.getElementById('btn-save-academics').addEventListener('click', toggleAcademicsEdit);

function renderFavoritesList(containerId, arrayData, endpointBase, renderFn) {
    const list = document.getElementById(containerId);
    list.innerHTML = '';
    arrayData.forEach((item, index) => {
        const node = getTemplate('tpl-list-item-readonly');

        node.querySelector('.item-text').textContent = item.name || item;

        node.querySelector('.delete').addEventListener('click', async () => {
            if(!item.id) {
                arrayData.splice(index, 1);
                renderFn();
                return;
            }

            try {
                const token = localStorage.getItem('jwt_token');
                const response = await fetch(`http://localhost:8080/${endpointBase}/${item.id}/favorite`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to remove favorite");

                arrayData.splice(index, 1);
                renderFn();
            } catch (error) {
                console.error(error);
            }
        });
        list.appendChild(node);
    });
    lucide.createIcons();
}

function renderStringList(containerId, arrayData, endpointKey, renderFn) {
    const list = document.getElementById(containerId);
    list.innerHTML = '';
    arrayData.forEach((item, index) => {
        const node = getTemplate('tpl-list-item');
        const li = node.querySelector('li');
        node.querySelector('.item-text').textContent = item;

        node.querySelector('.delete').addEventListener('click', () => {
            arrayData.splice(index, 1);
            syncArrayToServer(endpointKey, arrayData);
            renderFn();
        });

        node.querySelector('.edit').addEventListener('click', () => {
            const editNode = getTemplate('tpl-edit-string');
            const input = editNode.querySelector('input');
            input.value = item;

            editNode.querySelector('.save').addEventListener('click', () => {
                if (input.value.trim()) {
                    arrayData[index] = input.value.trim();
                    syncArrayToServer(endpointKey, arrayData);
                }
                renderFn();
            });
            editNode.querySelector('.cancel').addEventListener('click', renderFn);

            li.replaceWith(editNode);
            lucide.createIcons();
            input.focus();
        });
        list.appendChild(node);
    });
    lucide.createIcons();
}

function handleAddStringItem(containerId, arrayData, endpointKey, renderFn, placeholder) {
    const list = document.getElementById(containerId);
    const editNode = getTemplate('tpl-edit-string');
    const input = editNode.querySelector('input');
    input.placeholder = placeholder;

    editNode.querySelector('.save').addEventListener('click', () => {
        if (input.value.trim()) {
            arrayData.push(input.value.trim());
            syncArrayToServer(endpointKey, arrayData);
        }
        renderFn();
    });
    editNode.querySelector('.cancel').addEventListener('click', renderFn);

    list.appendChild(editNode);
    lucide.createIcons();
    input.focus();
}

function renderSkills() {
    const container = document.getElementById('container-skills');
    container.innerHTML = '';
    user.skills.forEach((skill, index) => {
        const node = getTemplate('tpl-tag');
        node.querySelector('.tag-text').textContent = skill;
        node.querySelector('.tag-delete-wrapper').addEventListener('click', () => {
            user.skills.splice(index, 1);
            syncArrayToServer('update-skills', user.skills);
            renderSkills();
        });
        container.appendChild(node);
    });
    lucide.createIcons();
}

document.getElementById('btn-add-skill').addEventListener('click', () => {
    const container = document.getElementById('container-skills');
    const node = getTemplate('tpl-tag-edit');
    const input = node.querySelector('input');
    input.placeholder = "New skill...";
    node.querySelector('.save').addEventListener('click', () => {
        if (input.value.trim()) {
            user.skills.push(input.value.trim());
            syncArrayToServer('update-skills', user.skills);
        }
        renderSkills();
    });
    container.appendChild(node);
    lucide.createIcons();
    input.focus();
});

function renderLanguages() {
    const list = document.getElementById('list-languages');
    list.innerHTML = '';
    user.languages.forEach((lang, index) => {
        const node = getTemplate('tpl-list-item');
        const li = node.querySelector('li');
        node.querySelector('.item-text').textContent = `${lang.language} - ${lang.level}`;

        node.querySelector('.delete').addEventListener('click', () => {
            user.languages.splice(index, 1);
            syncArrayToServer('update-languages', user.languages);
            renderLanguages();
        });

        node.querySelector('.edit').addEventListener('click', () => {
            const editNode = getTemplate('tpl-language-edit');
            const input = editNode.querySelector('.lang-name');
            const select = editNode.querySelector('.lang-level');
            input.value = lang.language;
            select.value = lang.level;

            editNode.querySelector('.save').addEventListener('click', () => {
                if (input.value.trim()) {
                    user.languages[index] = { language: input.value.trim(), level: select.value };
                    syncArrayToServer('update-languages', user.languages);
                }
                renderLanguages();
            });
            editNode.querySelector('.cancel').addEventListener('click', renderLanguages);
            li.replaceWith(editNode);
            lucide.createIcons();
        });
        list.appendChild(node);
    });
    lucide.createIcons();
}

document.getElementById('btn-add-language').addEventListener('click', () => {
    const list = document.getElementById('list-languages');
    const editNode = getTemplate('tpl-language-edit');
    const input = editNode.querySelector('.lang-name');
    const select = editNode.querySelector('.lang-level');
    input.placeholder = "Language (e.g. French)";

    editNode.querySelector('.save').addEventListener('click', () => {
        if (input.value.trim()) {
            user.languages.push({ language: input.value.trim(), level: select.value });
            syncArrayToServer('update-languages', user.languages);
        }
        renderLanguages();
    });
    editNode.querySelector('.cancel').addEventListener('click', renderLanguages);
    list.appendChild(editNode);
    lucide.createIcons();
    input.focus();
});

function renderChecklist() {
    const todoList = document.getElementById('list-todo');
    const doneList = document.getElementById('list-completed');
    todoList.innerHTML = ''; doneList.innerHTML = '';

    user.checklist.forEach((item, index) => {
        const node = getTemplate('tpl-checklist-item');
        const li = node.querySelector('li');
        const checkbox = node.querySelector('.task-checkbox');
        const span = node.querySelector('.task-text');

        span.textContent = item.text;
        checkbox.checked = item.completed;
        if (item.completed) span.classList.add('completed-text');

        checkbox.addEventListener('change', (e) => {
            user.checklist[index].completed = e.target.checked;
            syncArrayToServer('update-checklist', user.checklist);
            renderChecklist();
        });

        node.querySelector('.delete').addEventListener('click', () => {
            user.checklist.splice(index, 1);
            syncArrayToServer('update-checklist', user.checklist);
            renderChecklist();
        });

        node.querySelector('.edit').addEventListener('click', () => {
            const editNode = getTemplate('tpl-edit-string');
            const input = editNode.querySelector('input');
            input.value = item.text;

            editNode.querySelector('.save').addEventListener('click', () => {
                if (input.value.trim()) {
                    user.checklist[index].text = input.value.trim();
                    syncArrayToServer('update-checklist', user.checklist);
                }
                renderChecklist();
            });
            editNode.querySelector('.cancel').addEventListener('click', renderChecklist);

            li.replaceWith(editNode);
            lucide.createIcons();
            input.focus();
        });

        if (item.completed) doneList.appendChild(node);
        else todoList.appendChild(node);
    });

    if (todoList.children.length === 0) todoList.innerHTML = '<li><span style="color:#94a3b8">All caught up!</span></li>';
    if (doneList.children.length === 0) doneList.innerHTML = '<li><span style="color:#94a3b8">No completed tasks yet.</span></li>';
    lucide.createIcons();
}

document.getElementById('btn-add-task').addEventListener('click', () => {
    const list = document.getElementById('list-todo');
    if (list.querySelector('span') && list.querySelector('span').textContent === 'All caught up!') list.innerHTML = '';

    const editNode = getTemplate('tpl-edit-string');
    const input = editNode.querySelector('input');
    input.placeholder = "New task...";

    editNode.querySelector('.save').addEventListener('click', () => {
        if (input.value.trim()) {
            user.checklist.push({ id: Date.now(), text: input.value.trim(), completed: false });
            syncArrayToServer('update-checklist', user.checklist);
        }
        renderChecklist();
    });
    editNode.querySelector('.cancel').addEventListener('click', renderChecklist);

    list.prepend(editNode);
    lucide.createIcons();
    input.focus();
});


function populateSidebar() {
    const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.basics.fullName || 'User') + "&background=2563eb&color=fff&size=150";
    const profilePic = user.basics.profilePicUrl || defaultAvatar;

    const profileImg = `<img src="${profilePic}" alt="Profile" class="avatar-img">`;
    document.getElementById('nav-avatar').innerHTML = profileImg;
    document.getElementById('sidebar-avatar').innerHTML = profileImg;

    document.getElementById('nav-name').textContent = user.basics.fullName || 'User';
    document.getElementById('sidebar-name').textContent = user.basics.fullName || 'User';
    document.getElementById('sidebar-username').textContent = `@${user.basics.username || 'username'}`;
    document.getElementById('sidebar-email').textContent = user.basics.email || '';
    document.getElementById('sidebar-email').href = `mailto:${user.basics.email || ''}`;
    document.getElementById('sidebar-bio').textContent = user.basics.bio || 'Add a bio to tell universities about yourself.';
}

function initModal() {
    const modal = document.getElementById('modal-edit-profile');

    document.getElementById('btn-edit-profile').addEventListener('click', () => {
        const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.basics.fullName || 'User') + "&background=2563eb&color=fff&size=150";
        document.getElementById('modal-avatar-preview').src = user.basics.profilePicUrl || defaultAvatar;

        document.getElementById('input-profile-name').value = user.basics.fullName || '';
        document.getElementById('input-profile-username').value = user.basics.username || '';
        document.getElementById('input-profile-email').value = user.basics.email || '';
        document.getElementById('input-profile-bio').value = user.basics.bio || '';
        modal.classList.remove('hidden');
    });

    const closeModal = () => modal.classList.add('hidden');
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-profile').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.getElementById('btn-save-profile').addEventListener('click', async () => {
        const btn = document.getElementById('btn-save-profile');
        const originalText = btn.textContent;
        btn.textContent = "Saving...";

        const payload = {
            fullName: document.getElementById('input-profile-name').value.trim(),
            username: document.getElementById('input-profile-username').value.trim(),
            email: document.getElementById('input-profile-email').value.trim(),
            bio: document.getElementById('input-profile-bio').value.trim(),
            profilePicUrl: user.basics.profilePicUrl
        };

        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch('http://localhost:8080/api/user/update-basics', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update profile basics");

            user.basics.fullName = payload.fullName;
            user.basics.username = payload.username;
            user.basics.email = payload.email;
            user.basics.bio = payload.bio;

            populateSidebar();
            closeModal();
        } catch (error) {
            console.error(error);
        } finally {
            btn.textContent = originalText;
        }
    });
}

async function fetchUserProfile() {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('jwt_token');
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) throw new Error('Failed to load profile data');

        const data = await response.json();

        user = {
            basics: data.basics || {},
            preferences: data.preferences || {},
            academics: data.academics || {},
            extracurriculars: data.extracurriculars || [],
            skills: data.skills || [],
            languages: data.languages || [],
            favorites: data.favorites || { universities: [], programs: [] },
            checklist: data.checklist || []
        };

        initUI();

    } catch (error) {
        console.error(error);
    }
}

function initUI() {
    populateSidebar();
    initModal();
    setupTabs();

    renderAcademics();
    renderPreferences();

    const reRenderExtra = () => renderStringList('list-extracurriculars', user.extracurriculars, 'update-extracurriculars', reRenderExtra);
    reRenderExtra();
    document.getElementById('btn-add-activity').addEventListener('click', () => handleAddStringItem('list-extracurriculars', user.extracurriculars, 'update-extracurriculars', reRenderExtra, "Describe activity..."));

    const reRenderUnis = () => renderFavoritesList('list-fav-unis', user.favorites.universities, 'universities', reRenderUnis);
    reRenderUnis();

    const reRenderProgs = () => renderFavoritesList('list-fav-programs', user.favorites.programs, 'universities/programs', reRenderProgs);
    reRenderProgs();

    renderSkills();
    renderLanguages();
    renderChecklist();
}

document.addEventListener('DOMContentLoaded', fetchUserProfile);