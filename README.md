

Weather Application
Overview
This weather application fetches current weather data and provides a 5-day weather forecast for a specified city using the OpenWeather API. The app includes a chatbot feature that can answer weather-related queries, along with a user-friendly interface for viewing weather data and forecasts.
Features
•	Current Weather Data: Fetch and display current weather conditions for a specified city.
•	5-Day Forecast: Provides detailed weather forecasts for the next five days.
•	Geolocation Support: Automatically detects the user's location and displays the weather for that location.
•	Loading Spinner: Displays a loading spinner while fetching data from the API.
•	Chatbot Integration: A chatbot that handles weather-related queries and provides information accordingly.
•	Filters and Sorting: Ability to filter and sort forecast data based on user preferences.
Technologies Used
•	HTML
•	CSS
•	JavaScript
•	OpenWeather API
•	Chart.js (for data visualization)
Getting Started
Prerequisites
•	A web browser (Google Chrome, Firefox, etc.)
•	An active internet connection
Setup Instructions
1.	Clone the Repository:
Open your terminal and run the following command to clone the repository:
Bash:
git clone <repository-url>
Replace <repository-url> with the URL of your GitHub repository.
2.	Navigate to the Project Directory:
Bash: cd weather-app
3.	Obtain an API Key:
o	Sign up for an account at OpenWeather.
o	Create a new API key in your account settings.
4.	Update the API Key:
Open the weather.js file and replace the existing API key with your newly generated API key:
javascript
Copy code
const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
5.	Open the Application:
o	Open the index.html file in your web browser to run the application.
How to Use
•	Enter a city name in the search bar to fetch the current weather and forecast data.
•	You can also use the chatbot to ask for weather information by typing your query.
•	Navigate to the forecast page to view a table of the upcoming weather conditions, including options to filter and sort the data.
Chatbot Instructions
•	Ask the chatbot weather-related questions (e.g., "What is the weather like in London?").
•	If you ask non-weather-related questions, the chatbot will respond with a message indicating that it can only provide weather information.



Live Preview :  https://weather-bot-web-app.netlify.app/

