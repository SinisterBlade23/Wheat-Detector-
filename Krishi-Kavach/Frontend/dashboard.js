document.addEventListener('DOMContentLoaded', function() {
  createCharts();
  setupNavigation();
  setupInteractions();
  
  // Hide loading overlay
  setTimeout(() => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500);
    }
  }, 1500);
});

function createCharts() {
  try {
    // Disease Trend Chart (Line Chart)
    const ctx1 = document.getElementById('diseaseTrendChart')?.getContext('2d');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['Mar 13', 'Mar 14', 'Mar 15', 'Mar 16', 'Mar 17', 'Mar 18', 'Mar 19'],
          datasets: [{
            label: 'Late Blight',
            data: [2, 1, 2, 5, 4, 3, 3],
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#4caf50',
            fill: false,
            tension: 0.4
          }, {
            label: 'Powdery Mildew',
            data: [3, 3, 2, 4, 6, 5, 1],
            borderColor: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#2196f3',
            fill: false,
            tension: 0.4
          }, {
            label: 'Leaf Spot',
            data: [3, 2, 1, 0, 2, 3, 3],
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#ff9800',
            fill: false,
            tension: 0.4
          }]
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
                font: { size: 12 }
              },
              grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            x: {
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { font: { size: 12 } }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                boxWidth: 6,
                padding: 15,
                font: { size: 12 }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 10,
              cornerRadius: 6,
              titleFont: { size: 14 },
              bodyFont: { size: 13 },
              callbacks: {
                label: function(context) {
                  const datasetLabel = context.dataset.label || '';
                  const value = context.parsed.y;
                  const previousValue = context.dataset.data[context.dataIndex - 1];
                  
                  if (previousValue) {
                    const percentChange = ((value - previousValue) / previousValue * 100).toFixed(1);
                    const direction = percentChange >= 0 ? '▲' : '▼';
                    return `${datasetLabel}: ${value} (${direction} ${Math.abs(percentChange)}%)`;
                  }
                  
                  return `${datasetLabel}: ${value}`;
                }
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
          maintainAspectRatio: true,
          aspectRatio: 1,
          cutout: '60%',
          plugins: {
            legend: { display: false },
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
              grid: { display: false },
              ticks: { font: { size: 12 } }
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 12 } }
            }
          },
          plugins: {
            legend: { display: false },
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
  } catch (error) {
    console.error('Error creating charts:', error);
  }
}

function setupNavigation() {
  // Get the navigation items
  const navItems = document.querySelectorAll('nav ul li');
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
        
        // Hide stats and charts
        document.querySelector('.stats').style.display = 'none';
        document.querySelector('.charts').style.display = 'none';
        document.querySelector('.cards-container').style.display = 'none';
        document.querySelector('.header').style.display = 'none';
      } else {
        // Hide scan history section
        scanHistorySection.style.display = 'none';
        
        // Show stats and charts
        document.querySelector('.stats').style.display = 'flex';
        document.querySelector('.charts').style.display = 'flex';
        document.querySelector('.cards-container').style.display = 'flex';
        document.querySelector('.header').style.display = 'flex';
      }
    });
  });
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
}

function setupInteractions() {
  // Add smooth scrolling to all links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Make page transitions smoother
  document.querySelectorAll('.stat-box, .chart').forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.transition = 'transform 0.3s ease';
    });
  });
  
  // Filter button functionality
  const filterButton = document.querySelector('.filter-button');
  if (filterButton) {
    filterButton.addEventListener('click', function() {
      alert('Filter functionality will be implemented here');
    });
  }
  
  // Card click functionality
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', function() {
      const diseaseTitle = this.querySelector('.card-title')?.textContent;
      if (diseaseTitle) {
        alert(`Viewing details for ${diseaseTitle}`);
      }
    });
  });
  
  // Setup resize handler for charts
  window.addEventListener('resize', debounce(() => {
    const charts = Object.values(Chart.instances);
    charts.forEach(chart => chart.resize());
  }, 250));
}

// Utility function for debouncing
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

