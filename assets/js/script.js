document.addEventListener('DOMContentLoaded', function () {
    // Load search history from localStorage
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // Display search history
    displaySearchHistory(searchHistory);
    // Add event listener to search form
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const cityInput = document.getElementById('city-input').value.trim();
        if (cityInput !== '') {
            getCoordinates(cityInput);
        }
    });
});

// The function getCoordinates(city) fetches weather data for a specified city from the OpenWeatherMap 
// API, extracts the latitude and longitude from the response, displays the weather information using 
// the getWeather(lat, lon, city) function, and adds the city to the search history.
function getCoordinates(city) {
    // API key for accessing OpenWeatherMap API
    const apiKey = 'b93acfb12967de0cf2063193b0042830';
    // URL for fetching weather data based on the provided city
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    // Fetching weather data from the API
    fetch(apiUrl)
        .then(function(response) {
            // Checking if the response is successful
            if (!response.ok) {
                // If response is not okay, throw an error
                throw new Error('City not found');
            }
            // If response is okay, parse JSON data
            return response.json();
        })
        .then(function(data) {
            // Extracting latitude and longitude from the response data
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            // Calling the getWeather function with latitude, longitude, and city
            getWeather(lat, lon, city);
            // Adding the city to search history
            saveToSearchHistory(city);
        })
        .catch(function(error) {
            // Handling errors that occurred during fetch operation
            console.error('There was a problem with the fetch operation:', error);
        });
}

// This function fetches weather data for a specified city using the OpenWeatherMap API
// and displays the city name and current temperature in Fahrenheit.
function getWeather(lat, lon, city) {
    const apiKey = 'b93acfb12967de0cf2063193b0042830';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            displayWeather(data, city);
        })
        .catch(function(error) {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to display weather information for a specified city
function displayWeather(data, city) {
    const weatherInfoDiv = document.getElementById('weather-info');
    weatherInfoDiv.innerHTML = ''; // Clear previous content
    // Display current weather information
    const cityName = city;
    const currentWeather = data.list[0];
    const date = new Date(currentWeather.dt * 1000).toLocaleDateString();
    const temperature = Math.round(currentWeather.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
    const humidity = currentWeather.main.humidity;
    const windSpeed = currentWeather.wind.speed;
    const weatherIcon = currentWeather.weather[0].icon;
    const weatherDescription = currentWeather.weather[0].description;
  
    const weatherHtml = `
        <div class="current-weather">
            <h2>${cityName} (${date}) <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}"></h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
    `;
    weatherInfoDiv.innerHTML = weatherHtml;
}

// This function saves a city to the search history in the browser's local storage, updating 
// the displayed search history if the city is not already present.
function saveToSearchHistory(city) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            displaySearchHistory(searchHistory);
        }
}

// This function dynamically displays the search history as clickable list items on the webpage, 
// triggering a weather data fetch for the selected city upon click.
function displaySearchHistory(history) {
const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        history.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', function () {
                getCoordinates(city);
            });
            historyList.appendChild(li);
        });
}