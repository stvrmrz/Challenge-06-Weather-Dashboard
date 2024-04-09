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
        })
        .catch(function(error) {
            console.error('There was a problem with the fetch operation:', error);
        });
  }

  getCoordinates('New York');
  