// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Chart defaults
Chart.defaults.color = '#a1a1aa';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';

// Compare Chart
new Chart(document.getElementById('compareChart'), {
    type: 'bar',
    data: {
        labels: ['Прегледи', 'Обхват', 'Взаимодействия', 'Последователи'],
        datasets: [
            { label: 'Facebook', data: [627000, 320000, 3200, 340], backgroundColor: 'rgba(24,119,242,0.8)' },
            { label: 'Instagram', data: [496243, 229100, 7600, 145], backgroundColor: 'rgba(228,64,95,0.8)' },
            { label: 'TikTok', data: [486695, 478066, 6575, 346], backgroundColor: 'rgba(0,242,234,0.8)' }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
});

// All Platforms Chart - Using Instagram daily data for alignment
const dates = allData.instagram.map(d => d.date.slice(5));
new Chart(document.getElementById('allPlatformsChart'), {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
            { label: 'Instagram', data: allData.instagram.map(d => d.views), borderColor: '#e4405f', backgroundColor: 'rgba(228,64,95,0.1)', fill: true, tension: 0.4, pointRadius: 1 },
            { label: 'TikTok', data: allData.tiktok.map(d => d.views), borderColor: '#00f2ea', backgroundColor: 'rgba(0,242,234,0.1)', fill: true, tension: 0.4, pointRadius: 1 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false } }
});

// Instagram Chart
new Chart(document.getElementById('igChart'), {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
            { label: 'Прегледи', data: allData.instagram.map(d => d.views), borderColor: '#e4405f', backgroundColor: 'rgba(228,64,95,0.2)', fill: true, tension: 0.4 },
            { label: 'Взаимодействия', data: allData.instagram.map(d => d.interactions), borderColor: '#c13584', backgroundColor: 'rgba(193,53,132,0.1)', fill: true, tension: 0.4 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// TikTok Chart
new Chart(document.getElementById('ttChart'), {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
            { label: 'Прегледи', data: allData.tiktok.map(d => d.views), borderColor: '#00f2ea', backgroundColor: 'rgba(0,242,234,0.2)', fill: true, tension: 0.4 },
            { label: 'Харесвания', data: allData.tiktok.map(d => d.likes), borderColor: '#ff0050', backgroundColor: 'rgba(255,0,80,0.1)', fill: true, tension: 0.4 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// Facebook Chart - Using posts data
const fbDates = [...new Set(allData.facebookPosts.map(p => p.date))].sort();
const fbViewsByDate = {};
allData.facebookPosts.forEach(p => {
    fbViewsByDate[p.date] = (fbViewsByDate[p.date] || 0) + p.views;
});
new Chart(document.getElementById('fbChart'), {
    type: 'line',
    data: {
        labels: fbDates.map(d => d.slice(5)),
        datasets: [{ label: 'Прегледи', data: fbDates.map(d => fbViewsByDate[d] || 0), borderColor: '#1877f2', backgroundColor: 'rgba(24,119,242,0.2)', fill: true, tension: 0.4 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// Facebook Posts Table
const fbPostsDiv = document.getElementById('fbPosts');
fbPostsDiv.innerHTML = `<table class="data-table">
    <thead><tr><th>Дата</th><th>Тип</th><th>Заглавие</th><th>Прегледи</th><th>Обхват</th><th>Взаим.</th><th>❤️</th><th>+Follow</th></tr></thead>
    <tbody>${allData.facebookPosts.sort((a, b) => b.date.localeCompare(a.date)).map(p => `
        <tr class="${p.viral ? 'viral-row' : ''}">
            <td>${p.date}</td>
            <td><span class="post-type ${p.type.toLowerCase().replace(' ', '-')}">${p.type}</span></td>
            <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.title}</td>
            <td class="${p.views > 20000 ? 'highlight' : ''}">${p.views.toLocaleString()}</td>
            <td>${p.reach.toLocaleString()}</td>
            <td>${p.interactions}</td>
            <td>${p.likes}</td>
            <td>${p.follows ? '+' + p.follows : '0'}</td>
        </tr>
    `).join('')}</tbody>
</table>`;

// Instagram Table
const igTbl = document.getElementById('igTable');
igTbl.innerHTML = `<table class="data-table"><thead><tr><th>Дата</th><th>Прегледи</th><th>Обхват</th><th>Взаимодействия</th><th>Кликове</th><th>Посещения</th><th>Последователи</th></tr></thead><tbody>${allData.instagram.map(d => `<tr class="${d.views > 20000 ? 'viral-row' : ''}"><td>${d.date}</td><td class="${d.views > 20000 ? 'highlight' : ''}">${d.views.toLocaleString()}</td><td>${d.reach.toLocaleString()}</td><td>${d.interactions}</td><td>${d.clicks}</td><td>${d.visits}</td><td>+${d.follows}</td></tr>`).join('')
    }</tbody></table>`;

// TikTok Table
const ttTbl = document.getElementById('ttTable');
ttTbl.innerHTML = `<table class="data-table"><thead><tr><th>Дата</th><th>Прегледи</th><th>Обхват</th><th>Харесвания</th><th>Споделяния</th><th>Коментари</th><th>Последователи</th></tr></thead><tbody>${allData.tiktok.map(d => `<tr class="${d.views > 30000 ? 'viral-row' : ''}"><td>${d.date}</td><td class="${d.views > 30000 ? 'highlight' : ''}">${d.views.toLocaleString()}</td><td>${d.reach.toLocaleString()}</td><td>${d.likes}</td><td>${d.shares}</td><td>${d.comments}</td><td>+${d.followers}</td></tr>`).join('')
    }</tbody></table>`;

// Videos - Combined data by date
let videosData = [];
allData.instagram.forEach(ig => {
    const tt = allData.tiktok.find(t => t.date === ig.date) || { views: 0, reach: 0, likes: 0, followers: 0 };
    const fbPosts = allData.facebookPosts.filter(f => f.date === ig.date);
    const fbTotal = fbPosts.reduce((sum, p) => sum + p.views, 0);
    const fbFollows = fbPosts.reduce((sum, p) => sum + (p.follows || 0), 0);
    const total = fbTotal + ig.views + tt.views;
    videosData.push({
        date: ig.date,
        title: fbPosts[0]?.title || `Публикация ${ig.date}`,
        fb: { views: fbTotal, followers: fbFollows, posts: fbPosts.length },
        ig: ig,
        tt: tt,
        total: total
    });
});

function renderVideos(data) {
    const grid = document.getElementById('videosGrid');
    grid.innerHTML = data.map(v => `
        <div class="video-card ${v.total > 50000 ? 'viral' : ''}">
            <div class="video-info">
                <h4>📅 ${v.date}</h4>
                <p>${v.title}</p>
                <div class="meta">Общо: <strong style="color:#f59e0b">${v.total.toLocaleString()}</strong> прегледа</div>
            </div>
            <div class="platform-col">
                <h5><span class="badge fb">FB</span> Facebook</h5>
                <div class="mini-grid">
                    <div class="mini-box fb"><span class="v">${v.fb.views.toLocaleString()}</span><span class="l">Прегледи</span></div>
                    <div class="mini-box fb"><span class="v">${v.fb.posts}</span><span class="l">Постове</span></div>
                    <div class="mini-box fb"><span class="v">+${v.fb.followers}</span><span class="l">Follow</span></div>
                </div>
            </div>
            <div class="platform-col">
                <h5><span class="badge ig">IG</span> Instagram</h5>
                <div class="mini-grid">
                    <div class="mini-box ig"><span class="v">${v.ig.views.toLocaleString()}</span><span class="l">Прегледи</span></div>
                    <div class="mini-box ig"><span class="v">${v.ig.reach.toLocaleString()}</span><span class="l">Обхват</span></div>
                    <div class="mini-box ig"><span class="v">+${v.ig.follows}</span><span class="l">Follow</span></div>
                </div>
            </div>
            <div class="platform-col">
                <h5><span class="badge tt">TT</span> TikTok</h5>
                <div class="mini-grid">
                    <div class="mini-box tt"><span class="v">${v.tt.views.toLocaleString()}</span><span class="l">Прегледи</span></div>
                    <div class="mini-box tt"><span class="v">${v.tt.likes}</span><span class="l">❤️</span></div>
                    <div class="mini-box tt"><span class="v">+${v.tt.followers}</span><span class="l">Follow</span></div>
                </div>
            </div>
        </div>
    `).join('');
}
renderVideos(videosData);

function filterVideos() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const platform = document.getElementById('platformFilter').value;
    let filtered = videosData.filter(v => v.title.toLowerCase().includes(search) || v.date.includes(search));
    if (platform === 'fb') filtered = filtered.filter(v => v.fb.views > 0);
    if (platform === 'ig') filtered = filtered.filter(v => v.ig.views > 0);
    if (platform === 'tt') filtered = filtered.filter(v => v.tt.views > 0);
    renderVideos(filtered);
}

function sortVideos() {
    const sortBy = document.getElementById('sortBy').value;
    let sorted = [...videosData];
    if (sortBy === 'date') sorted.sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === 'dateAsc') sorted.sort((a, b) => a.date.localeCompare(b.date));
    if (sortBy === 'views') sorted.sort((a, b) => b.total - a.total);
    if (sortBy === 'followers') sorted.sort((a, b) => (b.fb.followers + b.ig.follows + b.tt.followers) - (a.fb.followers + a.ig.follows + a.tt.followers));
    renderVideos(sorted);
}

// Calendar
const calDiv = document.getElementById('calendarView');
const days = ['Нед', 'Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб'];
days.forEach(d => calDiv.innerHTML += `<div style="text-align:center;padding:0.5rem;font-weight:600;color:#a1a1aa">${d}</div>`);

// December 2025
const viralDays = ["2025-12-13", "2025-12-14", "2025-12-27", "2025-12-28", "2025-12-30"];
for (let i = 1; i <= 31; i++) {
    const dateStr = `2025-12-${String(i).padStart(2, '0')}`;
    const ig = allData.instagram.find(d => d.date === dateStr) || { views: 0, follows: 0 };
    const tt = allData.tiktok.find(t => t.date === dateStr) || { views: 0, followers: 0 };
    const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;
    const isViral = viralDays.includes(dateStr);
    calDiv.innerHTML += `<div class="cal-day ${isWeekend ? 'weekend' : ''} ${isViral ? 'viral' : ''}">
        <div class="day-num">${i} Дек</div>
        <div class="day-stats">
            <span>IG: ${ig.views.toLocaleString()}</span>
            <span>TT: ${tt.views.toLocaleString()}</span>
            <span>+${ig.follows + tt.followers} follow</span>
        </div>
    </div>`;
}
