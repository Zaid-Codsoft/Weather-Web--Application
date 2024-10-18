const apiKey = '5cb96d5f4a48a574ba007bcefb6dadba'; 
const searchBar = document.getElementById('searchBar');
const forecastBody = document.getElementById('forecastBody');
const weatherWidget = document.getElementById('weatherWidget');
const unitToggle = document.querySelectorAll('input[name="unit"]'); 
const loadingSpinner = document.getElementById('loadingSpinner'); 

let barChart, doughnutChart, lineChart;


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetchWeatherDataByCoordinates(latitude, longitude);
  }, () => {
    alert('Unable to retrieve yr current location. Please enter a name of city.');
  });
} else {
  alert('Geolocation is not supported by your browser. Please enter a city name.');
}

async function fetchWeatherDataByCoordinates(latitude, longitude) {
  const selectedUnit = document.querySelector('input[name="unit"]:checked').value; 
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${selectedUnit}`;
  await fetchWeatherData(url, selectedUnit);
}

// Listen for city input from search bar
searchBar.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const city = e.target.value.trim();
    const selectedUnit = document.querySelector('input[name="unit"]:checked').value; 
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${selectedUnit}`;
    await fetchWeatherData(url, selectedUnit);
  }
});

async function fetchWeatherData(url, selectedUnit) {
  showLoadingSpinner(); 
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod !== '200') throw new Error(data.message);

    const forecast = data.list.slice(0, 40); 
    const currentWeather = forecast[0];

    updateWeatherOverview(data.city.name, currentWeather, selectedUnit); 
    updateWeatherBackground(currentWeather.weather[0].main);

    const weatherCounts = getWeatherConditionCounts(forecast); 
    updateDoughnutChart(Object.keys(weatherCounts), Object.values(weatherCounts));

    const temperatures = forecast.slice(0, 5).map(item => item.main.temp);
    const labels = forecast.slice(0, 5).map(item => item.dt_txt.split(' ')[1]);

    updateBarChart(labels, temperatures, selectedUnit);
    updateLineChart(labels, temperatures, selectedUnit);
    populateForecastTable(forecast.slice(0, 4), selectedUnit); 
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    hideLoadingSpinner(); 
  }
}

function showLoadingSpinner() {
  loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
  loadingSpinner.style.display = 'none'; 
}

function getWeatherConditionCounts(forecast) {
  const conditionCounts = {};

  forecast.forEach(item => {
    const condition = item.weather[0].main;
    conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
  });

  return conditionCounts;
}
function updateWeatherBackground(condition) {
  const backgrounds = {
    Clear: 'linear-gradient(135deg, #74b9ff, #a29bfe)',
    Clouds: 'linear-gradient(135deg, #d3d3d3, #636e72)',
    Rain: 'linear-gradient(135deg, #74b9ff, #0984e3)',
    Snow: 'linear-gradient(135deg, #dfe6e9, #b2bec3)',
    Smoke: 'linear-gradient(135deg, #636e72, #2d3436)',
    Thunderstorm: 'linear-gradient(135deg, #2d3436, #0f2027)',
    Drizzle: 'linear-gradient(135deg, #a4b0be, #dfe4ea)',
  };

  weatherWidget.style.background = backgrounds[condition] || 'linear-gradient(135deg, #74b9ff, #a29bfe)';
}

function updateWeatherOverview(cityName, currentWeather, unit) {
  document.getElementById('cityName').innerText = cityName;
  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const temperatureValue = unit === 'metric' ? currentWeather.main.temp : (currentWeather.main.temp * 9/5) + 32;
  document.getElementById('currentTemp').innerText = `${Math.round(temperatureValue)}${temperatureUnit}`;
  document.getElementById('weatherCondition').innerText = currentWeather.weather[0].description;
  document.getElementById('humidity').innerText = `Humidity: ${currentWeather.main.humidity}%`;
  const windSpeedUnit = unit === 'metric' ? 'm/s' : 'mph';
  const windSpeedValue = unit === 'metric' ? currentWeather.wind.speed : currentWeather.wind.speed * 2.23694; 
  document.getElementById('windSpeed').innerText = `Wind: ${windSpeedValue.toFixed(2)} ${windSpeedUnit}`;
  document.getElementById('lastUpdated').innerText = `As of ${new Date().toLocaleTimeString()}`;
  document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
}

// Populate forecast table
function populateForecastTable(forecast, unit) {
  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const conversionFactor = unit === 'metric' ? 1 : 9/5; // Conversion factor for Fahrenheit
  const temperatureOffset = unit === 'metric' ? 0 : 32; // Offset for Fahrenheit

  forecastBody.innerHTML = forecast.map(item => `
    <tr>
      <td>${item.dt_txt.split(' ')[1]}</td>
      <td>${Math.round(item.main.temp * conversionFactor + temperatureOffset)}${temperatureUnit}</td>
      <td><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Icon"></td>
      <td>${item.pop * 100}%</td>
    </tr>
  `).join('');
}

// Update Bar chart
function updateBarChart(labels, data, unit) {
  if (barChart) barChart.destroy();
  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const convertedData = data.map(temp => unit === 'metric' ? temp : (temp * 9/5) + 32);

  barChart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: `Temperature (${temperatureUnit})`, data: convertedData, backgroundColor: '#74b9ff' }]
    }
  });
}

// Update Doughnut chart dynamically
function updateDoughnutChart(labels, data) {
  if (doughnutChart) doughnutChart.destroy();
  doughnutChart = new Chart(document.getElementById('doughnutChart'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#55efc4', '#ffeaa7', '#fab1a0', '#74b9ff', '#81ecec']
      }]
    }
  });
}

// Update Line chart
function updateLineChart(labels, data, unit) {
  if (lineChart) lineChart.destroy();
  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const convertedData = data.map(temp => unit === 'metric' ? temp : (temp * 9/5) + 32);

  lineChart = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: `Temperature (${temperatureUnit})`, data: convertedData, borderColor: '#0984e3', fill: false }]
    }
  });
}
