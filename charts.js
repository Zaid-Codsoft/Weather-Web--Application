const barCtx = document.getElementById('barChart').getContext('2d');
const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
const lineCtx = document.getElementById('lineChart').getContext('2d');

// Bar Chart with animation
new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [{
      label: 'Temperature (°C)',
      data: [12, 19, 3, 5, 2],
      backgroundColor: 'rgba(75, 192, 192, 0.2)'
    }]
  },
  options: {
    animation: {
      duration: 2000,
      easing: 'easeOutBounce'
    }
  }
});
let doughnutChart;

function updateDoughnutChart(labels, data) {
  if (doughnutChart) doughnutChart.destroy();  // Destroy existing chart to avoid duplication

  const ctx = document.getElementById('doughnutChart').getContext('2d');
  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,  // Dynamic labels (e.g., Clear, Clouds, Rain)
      datasets: [{
        label: 'Weather Conditions',
        data: data,  // Dynamic data (frequency of conditions)
        backgroundColor: [
          '#74b9ff',  // Blue for Clear
          '#b2bec3',  // Grey for Clouds
          '#0984e3',  // Dark Blue for Rain
          '#dfe6e9',  // Light Grey for Snow
          '#ffeaa7',  // Yellow for Drizzle
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });
}


// Line Chart
new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [{
      label: 'Temperature (°C)',
      data: [12, 15, 14, 18, 17],
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false
    }]
  },
  options: {
    animation: {
      easing: 'easeInOutBack'
    }
  }
});
