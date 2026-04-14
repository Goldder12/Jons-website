/**
 * student.js
 * JavaScript logic for the modern student dashboard.
 * Implements Chart.js configuration and dynamic interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
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
    const navButtons = document.querySelectorAll('.nav-pills-custom .btn');
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
        });
    });

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

    // 4. Dark Mode / Light Mode Advanced Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const btnLight = document.getElementById('theme-btn-light');
    const btnDark = document.getElementById('theme-btn-dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            // Toggle body class
            document.body.classList.toggle('dark-mode');
            
            // Check if dark mode is active
            if (document.body.classList.contains('dark-mode')) {
                btnLight.classList.add('d-none');
                btnDark.classList.remove('d-none');
                btnDark.classList.remove('text-muted');
                btnDark.classList.add('text-dark');
            } else {
                btnDark.classList.add('d-none');
                btnLight.classList.remove('d-none');
                btnLight.classList.remove('text-muted');
                btnLight.classList.add('text-dark');
            }
        });
    }
});
