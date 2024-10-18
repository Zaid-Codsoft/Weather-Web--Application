// const geminiApiKey = 'AIzaSyBUkXcwO_jO_trEIdY7Jcaiqdx3u2C8vPA'; // Replace with your Gemini API key
// Sample function to fetch weather data (you can replace it with your actual implementation)
async function fetchWeatherData(city) {
    const apiKey = '5cb96d5f4a48a574ba007bcefb6dadba'; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod !== 200) throw new Error(data.message);
      
      return data; // Return weather data
    } catch (error) {
      return { error: error.message }; // Return error message
    }
  }
  
  // Function to handle user input
  async function handleUserInput() {
    const userInput = document.getElementById('userInput');
    const userMessage = userInput.value.trim();
  
    // Clear the input field
    userInput.value = '';
  
    // Display user message
    displayMessage('You: ' + userMessage);
  
    // Check for weather-related query
    if (userMessage.toLowerCase().includes('weather')) {
      // Extract the city name from the user message
      const city = userMessage.replace(/.*?weather\s+in\s+/, '');
      const weatherData = await fetchWeatherData(city);
  
      if (weatherData.error) {
        displayMessage('Bot: ' + weatherData.error);
      } else {
        const response = `
          The current weather in ${weatherData.name} is ${weatherData.weather[0].description} with a temperature of ${Math.round(weatherData.main.temp)}°C.
        `;
        displayMessage('Bot: ' + response);
      }
    } else {
      displayMessage('Bot: Please ask for weather-related queries only.');
    }
  }
  
  // Function to display messages in the chat
  function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
  }
  
  // Set up the event listener for the send button
  document.getElementById('sendButton').addEventListener('click', handleUserInput);
  
  // Optional: Allow pressing "Enter" to send the message
  document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  });
  