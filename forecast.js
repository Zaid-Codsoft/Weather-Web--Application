const apiKey = '5cb96d5f4a48a574ba007bcefb6dadba'; // Your OpenWeather API key
let currentPage = 0;
const entriesPerPage = 10;
let forecastData = [];
let filteredData = [];

// Fetch forecast data for the initial city
fetchForecastData('Islamabad'); // Default city

// Fetch forecast data based on city name
document.getElementById('searchButton').addEventListener('click', () => {
  const city = document.getElementById('citySearch').value.trim();
  if (city) {
    currentPage = 0; // Reset to first page
    fetchForecastData(city);
    
  } else {
    alert('Please enter a city name.');
  }
});

async function fetchForecastData(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod !== '200') throw new Error(data.message);

    forecastData = data.list.slice(0, 40); 
    filteredData = forecastData; 
    displayForecast(currentPage);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}


function displayForecast(page) {
  const start = page * entriesPerPage;
  const end = start + entriesPerPage;
  const paginatedData = filteredData.slice(start, end);

  const forecastTableBody = document.getElementById('forecastTableBody');
  forecastTableBody.innerHTML = paginatedData.map(item => `
    <tr>
      <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
      <td>${Math.round(item.main.temp)}°</td>
      <td>${item.main.humidity}%</td>
      <td>${item.weather[0].description}</td>
    </tr>
  `).join('');

  document.getElementById('pageInfo').innerText = `Page ${currentPage + 1}`;
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    displayForecast(currentPage);
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  if ((currentPage + 1) * entriesPerPage < filteredData.length) {
    currentPage++;
    displayForecast(currentPage);
  }
});


document.getElementById('filterRain').addEventListener('click', () => {
  filteredData = forecastData.filter(item => item.weather[0].main.toLowerCase().includes('rain'));
  currentPage = 0; 
  displayForecast(currentPage);
});



            // Show the highest temperature
            document.getElementById('highestTemp').addEventListener('click', () => {
            const highestTempEntry = forecastData.reduce((prev, current) => (prev.main.temp > current.main.temp) ? prev : current);
            filteredData = [highestTempEntry];        // Show only the entry with the highest temperature
            currentPage = 0; // Reset to first page
            displayForecast(currentPage);
            });

                // Sort temperatures in ascending order
                document.getElementById('sortAsc').addEventListener('click', () => {
                filteredData = [...forecastData].sort((a, b) => a.main.temp - b.main.temp);
                currentPage = 0; // Reset to first page
                displayForecast(currentPage);
                });

                // Sort temperatures in descending order
                document.getElementById('sortDesc').addEventListener('click', () => {
                filteredData = [...forecastData].sort((a, b) => b.main.temp - a.main.temp);
                currentPage = 0; // Reset to first page
                displayForecast(currentPage);
                });

// Integrate the chatbot functionality
document.getElementById('sendButton').addEventListener('click', () => {
  const userInput = document.getElementById('userInput').value.trim();
  if (userInput) {
    handleUserQuery(userInput);
    document.getElementById('userInput').value = ''; // Clear input
  }
});

            async function handleUserQuery(query) {
            addMessage(`You: ${query}`, 'user');

            if (query.toLowerCase().includes('weather')) {
                const city = extractCity(query); // Implement this function to extract city from the query
                const weatherData = await fetchWeatherData(city);
                const message = weatherData 
                ? `The weather in ${city} is ${weatherData.temp}°C with ${weatherData.description}.`
                : `Sorry, I couldn't find the weather for ${city}.`;
                addMessage(message, 'bot');
            } else {
                const response = await fetchGeminiResponse(query);
                addMessage(response, 'bot');
            }
            }
            async function fetchWeatherData(city) {
                const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
            
                try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.cod !== '200') throw new Error(data.message);
            
                // Display the searched city name
                const searchedCityElement = document.getElementById('searchedCity');
                searchedCityElement.innerText = `Weather Forecast for: ${data.city.name}`;
                searchedCityElement.style.display = 'block'; // Show the city name
                
                const forecast = data.list.slice(0, 40); // 5-day forecast with 3-hour intervals
                const currentWeather = forecast[0];
            
                updateWeatherOverview(data.city.name, currentWeather);
                updateWeatherBackground(currentWeather.weather[0].main);
            
                const weatherCounts = getWeatherConditionCounts(forecast); // Get weather condition counts
                updateDoughnutChart(Object.keys(weatherCounts), Object.values(weatherCounts));
            
                const temperatures = forecast.slice(0, 5).map(item => item.main.temp);
                const labels = forecast.slice(0, 5).map(item => item.dt_txt.split(' ')[1]);
            
                updateBarChart(labels, temperatures);
                updateLineChart(labels, temperatures);
                populateForecastTable(forecast.slice(0, 4)); // Populate forecast table
                } catch (error) {
                alert(`Error: ${error.message}`);
                }
            }
            
            async function fetchGeminiResponse(query) {
            const url = 'https://api.gemini.com/v1/chat'; // Update with actual Gemini endpoint
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${geminiApiKey}`
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            return data.response; // Adjust based on actual response structure
            }

            function addMessage(message, sender) {
            const messagesDiv = document.getElementById('messages');
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messageElement.className = sender;
            messagesDiv.appendChild(messageElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
            }

            // Example of how to call the function
            handleUserQuery('Example: What is the weather in Islamabad?'); // Replace with dynamic user input
