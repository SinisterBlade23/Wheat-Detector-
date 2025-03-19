document.addEventListener('DOMContentLoaded', function() {
    createCharts();
    enableSmoothScrolling();
});

function enableSmoothScrolling() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Make page transitions smoother
    document.querySelectorAll('.stat-box, .chart').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function createCharts() {
    // Disease Trend Chart (Line Chart)
    const ctx1 = document.getElementById('diseaseTrendChart')?.getContext('2d');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Mar 13', 'Mar 14', 'Mar 15', 'Mar 16', 'Mar 17', 'Mar 18', 'Mar 19'],
                datasets: [
                    {
                        label: 'Late Blight',
                        data: [2, 1, 2, 5, 4, 3, 3],
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#4caf50',
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Powdery Mildew',
                        data: [3, 3, 2, 4, 6, 5, 1],
                        borderColor: '#2196f3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#2196f3',
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Leaf Spot',
                        data: [3, 2, 1, 0, 2, 3, 3],
                        borderColor: '#ff9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#ff9800',
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 8,
                        ticks: {
                            stepSize: 2,
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 6,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        cornerRadius: 6,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Severity Distribution Chart (Doughnut Chart)
    const ctx2 = document.getElementById('severityChart')?.getContext('2d');
    if (ctx2) {
        const severityColors = ['#ff9800', '#4caf50', '#ff5252'];
        const severityLabels = ['High', 'Medium', 'Low'];
        const severityData = [45, 35, 20];
        
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: severityLabels,
                datasets: [{
                    data: severityData,
                    backgroundColor: severityColors,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        // Create custom legend
        const legendContainer = document.getElementById('severityLegend');
        if (legendContainer) {
            severityLabels.forEach((label, index) => {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                
                const colorBox = document.createElement('span');
                colorBox.className = 'legend-color';
                colorBox.style.backgroundColor = severityColors[index];
                
                const labelText = document.createElement('span');
                labelText.textContent = `${label}: ${severityData[index]}%`;
                
                legendItem.appendChild(colorBox);
                legendItem.appendChild(labelText);
                legendContainer.appendChild(legendItem);
            });
        }
    }

    // Treatment Effectiveness Chart (Bar Chart)
    const ctx3 = document.getElementById('treatmentChart')?.getContext('2d');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['Fungicide', 'Organic', 'Cultural', 'Biological'],
                datasets: [{
                    label: 'Effectiveness (%)',
                    data: [75, 50, 85, 40],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(76, 175, 80, 0.7)',
                        'rgba(76, 175, 80, 0.9)',
                        'rgba(76, 175, 80, 0.6)'
                    ],
                    borderWidth: 0,
                    borderRadius: 6,
                    hoverBackgroundColor: '#4caf50'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                return `Effectiveness: ${context.raw}%`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    createCharts();
    setupNavigation();
});

function setupNavigation() {
    const overviewTab = document.querySelector('nav ul li:first-child');
    const scanHistoryTab = document.querySelector('nav ul li:nth-child(2)');
    const overviewContent = document.querySelector('.stats').parentElement;
    const scanHistoryContent = document.querySelector('.scan-history-view');
    
    // Initial state
    overviewTab.classList.add('active');
    scanHistoryTab.classList.remove('active');
    overviewContent.style.display = 'block';
    scanHistoryContent.style.display = 'none';
    
    // Click handlers
    overviewTab.addEventListener('click', function() {
        overviewTab.classList.add('active');
        scanHistoryTab.classList.remove('active');
        overviewContent.style.display = 'block';
        scanHistoryContent.style.display = 'none';
    });
    
    scanHistoryTab.addEventListener('click', function() {
        scanHistoryTab.classList.add('active');
        overviewTab.classList.remove('active');
        scanHistoryContent.style.display = 'block';
        overviewContent.style.display = 'none';
    });
}

// scan-history 
document.addEventListener('DOMContentLoaded', function() {
    // Get the navigation items
    const navItems = document.querySelectorAll('nav ul li');
    
    // Get the scan history section
    const scanHistorySection = document.getElementById('scan-history-section');
    
    // Add click event to each nav item
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Check if Scan History was clicked
        if (this.textContent.includes('Scan History')) {
          // Show scan history section
          scanHistorySection.style.display = 'block';
          
          // Hide other sections if needed
          // You may need to add code here to hide other sections
        } else {
          // Hide scan history section
          scanHistorySection.style.display = 'none';
        }
      });
    });
  });


//   navbar 
// Add this JavaScript to make the navbar interactive
document.addEventListener('DOMContentLoaded', function() {
    // Navbar shrink on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Active link highlighting
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// navbar end 




// Add to dashboard.js
const filterButton = document.querySelector('.filter-button');
filterButton.addEventListener('click', function() {
    alert('Filter functionality will be implemented here');
    // In a real implementation, this would show filter options
});


// Add to dashboard.js
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('click', function() {
        const diseaseTitle = this.querySelector('.card-title').textContent;
        alert(`Viewing details for ${diseaseTitle}`);
        // In a real implementation, this would open a detailed view
    });
});

// Add to dashboard.js
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
});
