document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('diseaseTrendChart')) {
        createCharts();
    }
});

function createCharts() {
    // Disease Trend Chart (Line Chart)
    const ctx1 = document.getElementById('diseaseTrendChart')?.getContext('2d');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Mar 13', 'Mar 14', 'Mar 15', 'Mar 16', 'Mar 17', 'Mar 18'],
                datasets: [
                    {
                        label: 'Late Blight',
                        data: [2, 3, 5, 2, 4, 1],
                        borderColor: 'green',
                        borderWidth: 2,
                        pointRadius: 4,
                        fill: false
                    },
                    {
                        label: 'Powdery Mildew',
                        data: [1, 4, 2, 6, 3, 5],
                        borderColor: 'blue',
                        borderWidth: 2,
                        pointRadius: 4,
                        fill: false
                    },
                    {
                        label: 'Leaf Spot',
                        data: [3, 2, 4, 3, 2, 4],
                        borderColor: 'orange',
                        borderWidth: 2,
                        pointRadius: 4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Severity Distribution Chart (Doughnut Chart)
    const ctx2 = document.getElementById('severityChart')?.getContext('2d');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [
                    {
                        data: [45, 35, 20],
                        backgroundColor: ['red', 'orange', 'green']
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    // Treatment Effectiveness Chart (Bar Chart)
    const ctx3 = document.getElementById('treatmentChart')?.getContext('2d');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['Fungicide', 'Organic', 'Cultural', 'Biological'],
                datasets: [
                    {
                        label: 'Effectiveness (%)',
                        data: [75, 50, 60, 40],
                        backgroundColor: ['green', 'lightgreen', 'yellowgreen', 'darkgreen']
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}
window.scrollTo(0, 0);  // Ensure the page starts at the top   

