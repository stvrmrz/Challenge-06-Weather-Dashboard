// This function essentially fetches weather data for a specified city using the OpenWeatherMap API,
// extracts the latitude and longitude coordinates from the response, and logs them to the console. 
// It also handles errors that may occur during the fetch operation.
function getCoordinates(city) {
    const apiKey = 'b93acfb12967de0cf2063193b0042830';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(function(data) {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);
            // Call the getWeather function with the coordinates
            getWeather(lat, lon);
        })
        .catch(function(error) {
            console.error('There was a problem with the fetch operation:', error);
        });
}
  
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');

    // Add event listener to the form submission
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get the city name entered by the user
        const cityInput = document.getElementById('city-input').value.trim();

        // Call the getCoordinates function with the city name
        getCoordinates(cityInput);
    });
});
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

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const historyList = document.getElementById('history-list');

    // Load search history from local storage when the page is loaded
    loadHistory();

    // Add event listener to the form submission
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get the city name entered by the user
        const cityInput = document.getElementById('city-input').value.trim();

        // Call the getWeather function with the city name
        getWeather(cityInput);

        // Add the city to the search history
        addToHistory(cityInput);
    });

    // Function to add a city to the search history
    function addToHistory(city) {
        // Create a new list item
        const listItem = document.createElement('li');
        listItem.textContent = city;

        // Add the list item to the history list
        historyList.appendChild(listItem);

        // Save the updated search history to local storage
        saveHistory();
    }

    // Function to load search history from local storage
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Loop through the search history and add each city to the list
        history.forEach(function(city) {
            addToHistory(city);
        });
    }

    // Function to save search history to local storage
    function saveHistory() {
        const historyItems = Array.from(historyList.children).map(function(item) {
            return item.textContent;
        });

        localStorage.setItem('searchHistory', JSON.stringify(historyItems));
    }
});
