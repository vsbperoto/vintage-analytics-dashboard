// =====================================================
// MAIN.JS - FIRE DASHBOARD FUNCTIONALITY
// =====================================================

// NAVIGATION
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// CHART DEFAULTS
Chart.defaults.color = '#9ca3af';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
Chart.defaults.font.family = 'Inter';

// COMPARE CHART
new Chart(document.getElementById('compareChart'), {
    type: 'bar',
    data: {
        labels: ['Прегледи', 'Обхват', 'Взаимодействия'],
        datasets: [
            { label: 'Facebook', data: [627000, 320000, 3200], backgroundColor: '#1877f2' },
            { label: 'Instagram', data: [496243, 229100, 7600], backgroundColor: '#e4405f' },
            { label: 'TikTok', data: [486695, 478066, 6575], backgroundColor: '#00f2ea' }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
});

// AUDIENCE CHART (TikTok)
const dates = allData.tiktokAudience.map(d => d.date.slice(5).replace('/', '.'));
new Chart(document.getElementById('audienceChart'), {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
            { label: 'Обхват', data: allData.tiktokAudience.map(d => d.reached), borderColor: '#00f2ea', backgroundColor: 'rgba(0,242,234,0.1)', fill: true, tension: 0.4, pointRadius: 0 },
            { label: 'Engaged', data: allData.tiktokAudience.map(d => d.engaged), borderColor: '#ff0050', backgroundColor: 'rgba(255,0,80,0.1)', fill: true, tension: 0.4, pointRadius: 0 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false } }
});

// FACEBOOK CHART
new Chart(document.getElementById('fbChart'), {
    type: 'bar',
    data: {
        labels: allData.facebookPosts.map(p => p.date.slice(5)),
        datasets: [{ label: 'Прегледи', data: allData.facebookPosts.map(p => p.views), backgroundColor: (ctx) => ctx.raw > 100000 ? '#f59e0b' : '#1877f2' }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// INSTAGRAM CHART
new Chart(document.getElementById('igChart'), {
    type: 'line',
    data: {
        labels: allData.instagram.map(d => d.date.slice(5)),
        datasets: [
            { label: 'Прегледи', data: allData.instagram.map(d => d.views), borderColor: '#e4405f', backgroundColor: 'rgba(228,64,95,0.2)', fill: true, tension: 0.4 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// TIKTOK CHART
new Chart(document.getElementById('ttChart'), {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
            { label: 'Обхват', data: allData.tiktokAudience.map(d => d.reached), borderColor: '#00f2ea', backgroundColor: 'rgba(0,242,234,0.15)', fill: true, tension: 0.4 },
            { label: 'Последователи', data: allData.tiktokAudience.map(d => d.newFollowers * 100), borderColor: '#ff0050', backgroundColor: 'rgba(255,0,80,0.1)', fill: true, tension: 0.4 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// FACEBOOK TABLE
const fbTable = document.getElementById('fbTable');
fbTable.innerHTML = `<table class="data-table">
    <thead><tr><th>Дата</th><th>Заглавие</th><th>Прегледи</th><th>Обхват</th><th>Взаим.</th><th>+Follow</th></tr></thead>
    <tbody>${allData.facebookPosts.sort((a, b) => b.views - a.views).map(p => `
        <tr class="${p.viral ? 'viral-row' : ''}">
            <td>${p.date}</td>
            <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.title}</td>
            <td class="${p.views > 50000 ? 'highlight' : ''}">${p.views.toLocaleString()}</td>
            <td>${p.reach.toLocaleString()}</td>
            <td>${p.interactions}</td>
            <td>+${p.follows || 0}</td>
        </tr>
    `).join('')}</tbody>
</table>`;

// TIKTOK VIDEOS
let ttVideos = [...allData.tiktokVideos];

function renderTTVideos(data) {
    const container = document.getElementById('ttVideos');
    container.innerHTML = data.map(v => `
        <div class="video-card ${v.viral ? 'viral' : ''}">
            <div class="video-date">📅 ${v.date}</div>
            <div class="video-title">${v.title}</div>
            <div class="video-stats">
                <div class="video-stat"><span class="v">${v.views.toLocaleString()}</span><span class="l">👁️</span></div>
                <div class="video-stat"><span class="v">${v.likes}</span><span class="l">❤️</span></div>
                <div class="video-stat"><span class="v">${v.shares}</span><span class="l">🔄</span></div>
                <div class="video-stat"><span class="v">${v.saves}</span><span class="l">💾</span></div>
            </div>
        </div>
    `).join('');
}
renderTTVideos(ttVideos);

function filterTT() {
    const search = document.getElementById('ttSearch').value.toLowerCase();
    let filtered = allData.tiktokVideos.filter(v => v.title.toLowerCase().includes(search) || v.date.includes(search));
    renderTTVideos(filtered);
}

function sortTT() {
    const sortBy = document.getElementById('ttSort').value;
    let sorted = [...allData.tiktokVideos];
    if (sortBy === 'views') sorted.sort((a, b) => b.views - a.views);
    if (sortBy === 'date') sorted.sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === 'likes') sorted.sort((a, b) => b.likes - a.likes);
    renderTTVideos(sorted);
}

// VIDEOS BY DATE (combined)
function renderVideosByDate() {
    const grid = document.getElementById('videosGrid');
    const allDates = [...new Set([
        ...allData.tiktokVideos.map(v => v.date),
        ...allData.facebookPosts.map(p => p.date),
        ...allData.instagram.map(i => i.date)
    ])].sort((a, b) => b.localeCompare(a));

    grid.innerHTML = allDates.slice(0, 31).map(date => {
        const tt = allData.tiktokVideos.find(v => v.date === date) || { views: 0, likes: 0, shares: 0 };
        const fb = allData.facebookPosts.filter(p => p.date === date);
        const fbTotal = fb.reduce((sum, p) => sum + p.views, 0);
        const ig = allData.instagram.find(i => i.date === date) || { views: 0, reach: 0, follows: 0 };
        const total = fbTotal + ig.views + tt.views;
        const isViral = total > 100000;

        return `
            <div class="day-card ${isViral ? 'viral' : ''}">
                <div class="day-info">
                    <h4>📅 ${date}</h4>
                    <p>${tt.title || fb[0]?.title || 'Публикации от този ден'}</p>
                    <div class="total">Общо: <strong>${total.toLocaleString()}</strong> прегледа</div>
                </div>
                <div class="day-platform">
                    <h5><span class="badge fb">FB</span> Facebook</h5>
                    <div class="mini-stats">
                        <div><span class="v">${fbTotal.toLocaleString()}</span><span class="l">Views</span></div>
                        <div><span class="v">${fb.length}</span><span class="l">Posts</span></div>
                        <div><span class="v">${fb.reduce((s, p) => s + (p.follows || 0), 0)}</span><span class="l">+Follow</span></div>
                    </div>
                </div>
                <div class="day-platform">
                    <h5><span class="badge ig">IG</span> Instagram</h5>
                    <div class="mini-stats">
                        <div><span class="v">${ig.views.toLocaleString()}</span><span class="l">Views</span></div>
                        <div><span class="v">${ig.reach?.toLocaleString() || 0}</span><span class="l">Reach</span></div>
                        <div><span class="v">+${ig.follows || 0}</span><span class="l">Follow</span></div>
                    </div>
                </div>
                <div class="day-platform">
                    <h5><span class="badge tt">TT</span> TikTok</h5>
                    <div class="mini-stats">
                        <div><span class="v">${tt.views.toLocaleString()}</span><span class="l">Views</span></div>
                        <div><span class="v">${tt.likes}</span><span class="l">❤️</span></div>
                        <div><span class="v">${tt.shares}</span><span class="l">Shares</span></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
renderVideosByDate();

// CALENDAR - COMPLETE WITH MONTH SWITCHING
let currentMonth = 12; // December

function renderCalendar(month = 12) {
    currentMonth = month;
    const grid = document.getElementById('calendarGrid');
    const monthTitle = document.querySelector('.cal-month');
    const days = ['Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб', 'Нед'];
    const monthNames = { 11: 'Ноември 2025', 12: 'Декември 2025' };

    if (monthTitle) monthTitle.textContent = monthNames[month];

    // Update nav buttons
    document.querySelectorAll('.cal-btn').forEach(btn => {
        if (btn.dataset.month === '11') {
            btn.classList.toggle('active', month === 11);
        }
    });

    // Headers
    let html = days.map(d => `<div class="cal-header">${d}</div>`).join('');

    // Get first day offset (Monday = 0, Sunday = 6)
    const firstDay = new Date(2025, month - 1, 1).getDay();
    const firstDayOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(2025, month, 0).getDate();

    // Empty cells before first day
    for (let i = 0; i < firstDayOffset; i++) {
        html += `<div class="cal-day empty"></div>`;
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Get data from all platforms
        const tt = allData.tiktokAudience.find(d => d.date === dateStr) || { reached: 0, newFollowers: 0, engaged: 0 };
        const ttVideo = allData.tiktokVideos.find(v => v.date === dateStr);
        const fb = allData.facebookPosts.filter(p => p.date === dateStr);
        const ig = allData.instagram.find(d => d.date === dateStr) || { views: 0, reach: 0, follows: 0 };

        // Calculate totals
        const fbViews = fb.reduce((sum, p) => sum + p.views, 0);
        const fbFollows = fb.reduce((sum, p) => sum + (p.follows || 0), 0);
        const igViews = ig.views || 0;
        const igFollows = ig.follows || 0;
        const ttViews = ttVideo?.views || 0;
        const ttReach = tt.reached || 0;
        const ttFollows = tt.newFollowers || 0;

        const totalViews = fbViews + igViews + ttViews;
        const totalFollows = fbFollows + igFollows + ttFollows;

        // Determine day class
        let className = 'cal-day';
        let dayIcon = '';
        if (totalViews > 100000) {
            className += ' viral';
            dayIcon = '🔥';
        } else if (totalViews > 30000) {
            className += ' high';
            dayIcon = '⚡';
        } else if (totalViews > 10000) {
            className += ' medium';
        }

        // Weekend styling
        const dayOfWeek = new Date(2025, month - 1, day).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) className += ' weekend';

        html += `
            <div class="${className}" data-date="${dateStr}" onclick="showDayDetails('${dateStr}')">
                <div class="cal-day-num">${dayIcon} ${day}</div>
                <div class="cal-day-stats">
                    <span class="fb-stat">📘 ${fbViews > 0 ? (fbViews > 1000 ? (fbViews / 1000).toFixed(0) + 'K' : fbViews) : '-'}</span>
                    <span class="ig-stat">📸 ${igViews > 0 ? (igViews > 1000 ? (igViews / 1000).toFixed(0) + 'K' : igViews) : '-'}</span>
                    <span class="tt-stat">🎵 ${ttViews > 0 ? (ttViews > 1000 ? (ttViews / 1000).toFixed(0) + 'K' : ttViews) : '-'}</span>
                </div>
                ${totalFollows > 0 ? `<div class="cal-day-follows">+${totalFollows} 👥</div>` : ''}
            </div>
        `;
    }

    grid.innerHTML = html;
}

// Month navigation
document.querySelectorAll('.cal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const month = parseInt(btn.dataset.month);
        if (month && !btn.classList.contains('disabled')) {
            renderCalendar(month);
        }
    });
});

// Show day details popup
function showDayDetails(dateStr) {
    const tt = allData.tiktokAudience.find(d => d.date === dateStr) || { reached: 0, newFollowers: 0 };
    const ttVideo = allData.tiktokVideos.find(v => v.date === dateStr);
    const fb = allData.facebookPosts.filter(p => p.date === dateStr);
    const ig = allData.instagram.find(d => d.date === dateStr) || { views: 0, reach: 0, follows: 0 };

    const fbViews = fb.reduce((sum, p) => sum + p.views, 0);
    const totalViews = fbViews + (ig.views || 0) + (ttVideo?.views || 0);

    const [year, month, day] = dateStr.split('-');
    const dayNames = ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'];
    const monthNames = ['', 'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
    const dateObj = new Date(dateStr);
    const dayName = dayNames[dateObj.getDay()];
    const monthName = monthNames[parseInt(month)];

    alert(`📅 ${dayName}, ${parseInt(day)} ${monthName} ${year}

📊 ОБЩО: ${totalViews.toLocaleString()} прегледа

📘 Facebook: ${fbViews.toLocaleString()} views | ${fb.length} post(s)
${fb[0] ? '→ ' + fb[0].title.slice(0, 50) + '...' : ''}

📸 Instagram: ${(ig.views || 0).toLocaleString()} views | +${ig.follows || 0} follow

🎵 TikTok: ${(ttVideo?.views || 0).toLocaleString()} views | +${tt.newFollowers} follow
${ttVideo ? '→ ' + ttVideo.title.slice(0, 50) + '...' : ''}`);
}

renderCalendar(12);

console.log('🔥 Restaurant Vintage Analytics Dashboard Loaded!');
console.log('📊 Total Views:', allData.combined.totalViews.toLocaleString());
console.log('👥 Total Followers:', allData.combined.totalFollowers);
