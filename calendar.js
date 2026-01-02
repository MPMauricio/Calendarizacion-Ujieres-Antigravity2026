const groups = ['A', 'B', 'C'];
// Start date: Dec 28, 2025 was Group C.
// We need to calculate the group for any given Sunday/Wednesday in 2026.
// Logic:
// 1. Find the first Sunday of 2026.
// 2. Determine its group based on the sequence from Dec 28, 2025.
// Dec 28 (C) -> Jan 4 (A) -> Jan 11 (B) -> Jan 18 (C)...
// So effectively, it's a rotation of Sundays.

function getGroupForDate(date) {
    // Base date: Dec 28, 2025 is Sunday, Group C (Index 2)
    const baseDate = new Date(2025, 11, 28); // Month is 0-indexed: 11 = Dec
    const baseGroupIndex = 2; // C

    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // We only care about Sundays and Wednesdays.
    // If it's a Wednesday, it shares the group of the *preceding* Sunday.
    // Wednesday is 3 days after Sunday.
    
    // Find the Sunday belonging to this rotation week
    // If date is Sunday (0), shift is 0.
    // If date is Wednesday (3), shift is 3.
    // We can just calculate weeks from base date.
    
    // However, simpler logic:
    // Count how many weeks have passed since Dec 28, 2025.
    // diffDays / 7 gives regular weeks.
    
    // Let's normalize to the preceding Sunday to find the "week group"
    const dayOfWeek = date.getDay(); // 0 = Sun, 3 = Wed
    let daysSinceSunday = 0;
    if (dayOfWeek === 3) daysSinceSunday = 3; 
    
    // Approximate days from base (Sunday)
    // If checking Jan 7 (Wed), diff is 10 days. 10 - 3 = 7 days from base.
    // 7 days / 7 = 1 week passed.
    // Base (0 weeks) = C (2)
    // 1 week = A (0) ((2 + 1) % 3)
    
    const daysFromBaseSunday = diffDays - daysSinceSunday;
    const weeksPassed = Math.round(daysFromBaseSunday / 7);
    
    const groupIndex = (baseGroupIndex + weeksPassed) % 3;
    return groups[groupIndex];
}

const quarters = {
    1: { name: 'Q1', months: [0, 1, 2], label: 'ENERO – MARZO' },
    2: { name: 'Q2', months: [3, 4, 5], label: 'ABRIL – JUNIO' },
    3: { name: 'Q3', months: [6, 7, 8], label: 'JULIO – SEPTIEMBRE' },
    4: { name: 'Q4', months: [9, 10, 11], label: 'OCTUBRE – DICIEMBRE' }
};

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function showQuarter(quarterId) {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('calendar-view').style.display = 'block';
    
    const pastoreoView = document.getElementById('pastoreo-view');
    if(pastoreoView) pastoreoView.style.display = 'none';
    const misionesView = document.getElementById('misiones-view');
    if(misionesView) misionesView.style.display = 'none';
    
    const quarterData = quarters[quarterId];
    document.getElementById('quarter-title').textContent = `${quarterData.name}: ${quarterData.label}`;
    
    const gridContainer = document.getElementById('months-grid');
    gridContainer.innerHTML = ''; // Clear previous

    quarterData.months.forEach(monthIndex => {
        const monthElement = createMonthCalendar(2026, monthIndex);
        gridContainer.appendChild(monthElement);
    });
}

function showHome() {
    document.getElementById('calendar-view').style.display = 'none';
    const manualView = document.getElementById('manual-view');
    if(manualView) manualView.style.display = 'none';
    const pastoreoView = document.getElementById('pastoreo-view');
    if(pastoreoView) pastoreoView.style.display = 'none';
    const misionesView = document.getElementById('misiones-view');
    if(misionesView) misionesView.style.display = 'none';
    
    document.getElementById('home-view').style.display = 'block';
    window.scrollTo(0, 0);
}

function showManual() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('calendar-view').style.display = 'none';
    const pastoreoView = document.getElementById('pastoreo-view');
    if(pastoreoView) pastoreoView.style.display = 'none';
    const misionesView = document.getElementById('misiones-view');
    if(misionesView) misionesView.style.display = 'none';

    document.getElementById('manual-view').style.display = 'block';
    window.scrollTo(0, 0);
}

function showPastoreo() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('calendar-view').style.display = 'none';
    const manualView = document.getElementById('manual-view');
    if(manualView) manualView.style.display = 'none';
    const misionesView = document.getElementById('misiones-view');
    if(misionesView) misionesView.style.display = 'none';

    document.getElementById('pastoreo-view').style.display = 'block';
    window.scrollTo(0, 0);
}

function showMisiones() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('calendar-view').style.display = 'none';
    const manualView = document.getElementById('manual-view');
    if(manualView) manualView.style.display = 'none';
    const pastoreoView = document.getElementById('pastoreo-view');
    if(pastoreoView) pastoreoView.style.display = 'none';

    document.getElementById('misiones-view').style.display = 'block';
    window.scrollTo(0, 0);
}

function createMonthCalendar(year, monthIndex) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month-card';

    // Title
    const title = document.createElement('h3');
    title.textContent = monthNames[monthIndex];
    monthDiv.appendChild(title);

    // Days Header
    const daysHeader = document.createElement('div');
    daysHeader.className = 'days-header';
    ['D', 'L', 'M', 'M', 'J', 'V', 'S'].forEach(d => {
        const span = document.createElement('span');
        span.textContent = d;
        daysHeader.appendChild(span);
    });
    monthDiv.appendChild(daysHeader);

    // Days Grid
    const daysGrid = document.createElement('div');
    daysGrid.className = 'days-grid';

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0); // Last day of month
    
    // Empty slots for start of month
    let startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    for (let i = 0; i < startDayOfWeek; i++) {
        const empty = document.createElement('div');
        empty.className = 'day empty';
        daysGrid.appendChild(empty);
    }

    // Days
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const currentDate = new Date(year, monthIndex, d);
        const dayOfWeek = currentDate.getDay();
        
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.textContent = d;

        // Check if Sunday (0) or Wednesday (3)
        if (dayOfWeek === 0 || dayOfWeek === 3) {
            const group = getGroupForDate(currentDate);
            dayEl.classList.add(`group-${group}`);
            
            // Optional: Add tooltip or small indicator
            const groupLabel = document.createElement('span');
            groupLabel.className = 'group-indicator';
            groupLabel.textContent = group;
            dayEl.appendChild(groupLabel);
        }

        daysGrid.appendChild(dayEl);
    }

    monthDiv.appendChild(daysGrid);
    return monthDiv;
}

// Attach event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to main Q buttons if they exist in static HTML, 
    // or we can generate them. 
    // Assuming the HTML structure we will build next.
});
