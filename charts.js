// Chart.js Configuration
Chart.defaults.color = '#a1a1aa';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';

const dates = ['31 Окт', '1 Ное', '2 Ное', '3 Ное', '4 Ное', '5 Ное', '6 Ное', '7 Ное', '8 Ное', '9 Ное', '10 Ное', '11 Ное', '12 Ное', '13 Ное', '14 Ное', '15 Ное', '16 Ное', '17 Ное', '18 Ное', '19 Ное', '20 Ное', '21 Ное', '22 Ное', '23 Ное', '24 Ное', '25 Ное', '26 Ное', '27 Ное', '28 Ное', '29 Ное', '30 Ное', '1 Дек', '2 Дек', '3 Дек', '4 Дек', '5 Дек', '6 Дек', '7 Дек', '8 Дек', '9 Дек', '10 Дек', '11 Дек', '12 Дек', '13 Дек', '14 Дек', '15 Дек', '16 Дек', '17 Дек', '18 Дек', '19 Дек', '20 Дек', '21 Дек', '22 Дек', '23 Дек', '24 Дек', '25 Дек', '26 Дек', '27 Дек', '28 Дек', '29 Дек', '30 Дек', '31 Дек'];

const views = [5213, 4216, 4594, 2699, 4916, 11767, 2002, 5660, 5324, 3197, 2869, 7937, 2661, 2728, 2213, 2906, 2988, 11362, 7353, 5405, 3621, 9444, 7439, 3801, 6561, 4407, 3270, 4683, 4471, 7098, 5564, 6903, 6677, 5179, 6138, 3846, 1773, 1156, 4669, 10646, 8629, 15311, 11668, 95903, 100338, 30011, 21316, 18298, 18114, 12854, 16659, 7178, 8851, 6062, 12756, 17166, 23943, 33208, 31178, 29419, 25289, 11947];

const viewers = [1148, 762, 286, 277, 1068, 1011, 1010, 3776, 3094, 1959, 1364, 5654, 1162, 1212, 1071, 1256, 1737, 7204, 3850, 2583, 1765, 6207, 4487, 2081, 3800, 2698, 1857, 2955, 1916, 4394, 4177, 3934, 3861, 2917, 3421, 2019, 956, 423, 2862, 6824, 5569, 9053, 7849, 49184, 53233, 17556, 10811, 9471, 10290, 8232, 10339, 3813, 4707, 3253, 9037, 12601, 18050, 21967, 19793, 17902, 14122, 7449];

const followers = [4, 2, 3, 0, 1, 9, 0, 5, 1, 0, 2, 4, 1, 1, 2, 0, 2, 6, 3, 2, 1, 4, 3, 3, 4, 2, 1, 2, 0, 2, 1, 2, 0, 1, 3, 1, 0, 1, 1, 11, 5, 4, 6, 58, 68, 17, 10, 6, 11, 3, 8, 5, 4, 4, 0, 3, 9, 18, 29, 20, 17, 5];

// Main Chart
new Chart(document.getElementById('mainChart'), {
    type: 'line',
    data: {
        labels: dates,
        datasets: [
            {
                label: 'Прегледи',
                data: views,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139,92,246,0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6
            },
            {
                label: 'Зрители',
                data: viewers,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245,158,11,0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
        },
        plugins: { legend: { position: 'top' } }
    }
});

// Content Chart
new Chart(document.getElementById('contentChart'), {
    type: 'doughnut',
    data: {
        labels: ['Reels', 'Галерии', 'Линкове', 'Снимки', 'Друго', 'Текст'],
        datasets: [{
            data: [572681, 86208, 79536, 22287, 413, 329],
            backgroundColor: [
                'rgba(139,92,246,0.8)',
                'rgba(59,130,246,0.8)',
                'rgba(16,185,129,0.8)',
                'rgba(245,158,11,0.8)',
                'rgba(107,114,128,0.8)',
                'rgba(236,72,153,0.8)'
            ],
            borderColor: '#1a1a24',
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
            legend: {
                position: 'right',
                labels: { padding: 15, usePointStyle: true, pointStyle: 'circle' }
            }
        }
    }
});
