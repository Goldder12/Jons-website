/**
 * student.js
 * JavaScript logic for the modern student dashboard.
 * Implements Chart.js configuration and dynamic interactions.
 */
import { groupsData, getGroupById } from "../data/group_data.js";
import { authStorageKey } from "../data/login_data.js";

document.addEventListener('DOMContentLoaded', () => {
    const THEME_STORAGE_KEY = 'skillset-theme';
    const logoutButton = document.getElementById('logout-button');

    function redirectToLogin() {
        window.location.href = '../login.html';
    }

    function setupLogout() {
        if (!logoutButton) {
            return;
        }

        logoutButton.addEventListener('click', function() {
            localStorage.removeItem(authStorageKey);
            redirectToLogin();
        });
    }

    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
    }

    function setupTheme() {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

        const themeToggleBtn = document.getElementById('theme-toggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', function() {
                const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
                localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
                applyTheme(nextTheme);
            });
        }

        window.addEventListener('storage', function(event) {
            if (event.key === THEME_STORAGE_KEY) {
                applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
            }
        });
    }

    setupTheme();
    setupLogout();

    // 1. Initialize Performance Chart using Chart.js
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Gradient definitions for the chart areas
    const orangeGradient = ctx.createLinearGradient(0, 0, 0, 300);
    orangeGradient.addColorStop(0, 'rgba(255, 157, 104, 0.4)');
    orangeGradient.addColorStop(1, 'rgba(255, 157, 104, 0.0)');
    
    const pinkGradient = ctx.createLinearGradient(0, 0, 0, 300);
    pinkGradient.addColorStop(0, 'rgba(255, 123, 165, 0.4)');
    pinkGradient.addColorStop(1, 'rgba(255, 123, 165, 0.0)');

    
    const performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
                {
                    label: 'Practice',
                    data: [15, 25, 20, 45, 60, 95, 65],
                    borderColor: '#ff7ba5',
                    backgroundColor: pinkGradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#ff7ba5',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4 // Creates the smooth curves
                },
                {
                    label: 'Theory',
                    data: [10, 15, 12, 30, 40, 60, 45],
                    borderColor: '#ff9d68',
                    backgroundColor: orangeGradient,
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#ff9d68',
                    pointBorderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.4
                }

            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false // We use our custom HTML legend
                },
                tooltip: {
                    backgroundColor: '#1e2025',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + '%';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b92a5',
                        font: {
                            family: 'Candara, "Trebuchet MS", sans-serif',
                            size: 13
                        }
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(0,0,0,0.04)',
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: {
                        stepSize: 40,
                        color: '#8b92a5',
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            family: 'Candara, "Trebuchet MS", sans-serif',
                            size: 13
                        }
                    }
                }
            }
        }
    });

    // 2. Add subtle interactive elements
    // Tab switching interaction
    const navButtons = document.querySelectorAll('.nav-pills-custom .tab-btn');
    const sections = document.querySelectorAll('.tab-content-section');
    const mainPageTitle = document.getElementById('main-page-title');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active classes
            navButtons.forEach(btn => {
                btn.classList.remove('btn-dark');
                btn.classList.add('text-muted');
                btn.classList.add('btn-nav-hover');
            });
            // Add active class to clicked
            this.classList.remove('text-muted');
            this.classList.remove('btn-nav-hover');
            this.classList.add('btn-dark');

            // Switch section
            const targetId = this.getAttribute('data-target');
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.remove('d-none');
                } else {
                    sec.classList.add('d-none');
                }
            });
            
            // Update Title
            if (mainPageTitle) {
                if (targetId === 'section-dashboard') mainPageTitle.textContent = 'Dashboard';
                if (targetId === 'section-speaking') mainPageTitle.textContent = 'Speaking';
                if (targetId === 'section-progress') mainPageTitle.textContent = 'Progress';
                if (targetId === 'section-courses') mainPageTitle.textContent = 'Courses';
            }
        });
    });

    // 2.5 Dynamic Courses & Details Rendering
    const coursesGrid = document.getElementById('student-courses-grid');
    if (coursesGrid) {
        coursesGrid.innerHTML = `
            <div class="dualigo-group-list w-100">
                ${groupsData.map(group => `
                    <article class="dualigo-group-card" data-course-id="${group.id}">
                        <div class="dualigo-group-copy">
                            <h3>${group.title}</h3>
                            <p>${group.description}</p>
                            <div class="dualigo-group-meta">
                                <span>${group.level}</span>
                                <span>${group.teacher}</span>
                                <span>${group.subtitle}</span>
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;

        // Handle card click
        const courseCards = coursesGrid.querySelectorAll('.dualigo-group-card');
        courseCards.forEach(card => {
            card.addEventListener('click', () => {
                const groupId = card.getAttribute('data-course-id');
                const group = getGroupById(groupId);
                if (!group) return;

                // Populate details
                document.getElementById('detail-course-title').textContent = group.title;
                document.getElementById('detail-course-desc').textContent = group.description;
                document.getElementById('detail-course-teacher').textContent = group.teacher;
                document.getElementById('detail-course-level').textContent = group.level;
                document.getElementById('detail-course-schedule').textContent = group.nextLesson;
                document.getElementById('detail-course-duration').textContent = group.duration;

                // Populate tasks / lessons
                const taskList = document.getElementById('detail-course-tasks');
                taskList.innerHTML = group.lessons.map(lesson => `
                    <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center border-light px-0 py-3">
                        <div>
                            <h6 class="mb-1 text-dark fw-semibold">${lesson.title}: ${lesson.topic}</h6>
                            <span class="text-muted small"><i class="bi bi-calendar-event me-1"></i> ${lesson.schedule}</span>
                        </div>
                        <button class="btn btn-sm btn-dark rounded-pill px-3">Start Task</button>
                    </li>
                `).join('');

                // Hide courses, show details
                sections.forEach(sec => sec.classList.add('d-none'));
                document.getElementById('section-course-details').classList.remove('d-none');
                if (mainPageTitle) mainPageTitle.textContent = group.title;
            });
        });
    }

    // Back button in course details
    const btnBackCourses = document.getElementById('btn-back-courses');
    if (btnBackCourses) {
        btnBackCourses.addEventListener('click', () => {
            sections.forEach(sec => sec.classList.add('d-none'));
            document.getElementById('section-courses').classList.remove('d-none');
            if (mainPageTitle) mainPageTitle.textContent = 'Courses';
            
            // Sync nav pill
            navButtons.forEach(btn => {
                if (btn.getAttribute('data-target') === 'section-courses') {
                    btn.classList.add('btn-dark');
                    btn.classList.remove('text-muted', 'btn-nav-hover');
                } else {
                    btn.classList.remove('btn-dark');
                    btn.classList.add('text-muted', 'btn-nav-hover');
                }
            });
        });
    }

    // Sidebar navigation active state
    const sidebarNavItems = document.querySelectorAll('.nav-menu .nav-item');
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            sidebarNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 3. Course Search Functionality
    const searchInput = document.getElementById('courseSearch');
    const courseItems = document.querySelectorAll('.course-item');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();

            courseItems.forEach(item => {
                const title = item.querySelector('h5').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = ''; // Reset display
                } else {
                    item.style.display = 'none'; // Hide if no match
                }
            });
        });
    }

});
