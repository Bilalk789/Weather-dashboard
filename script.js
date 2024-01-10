
function getCoordinates(city) {
    const apiKey = '795f9902b6d2913174d818c05369fcf9';
    const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
    fetch(geocodingUrl)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          const coordinates = {
            lat: data.coord.lat,
            lon: data.coord.lon
          };
          getWeatherData(coordinates);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching coordinates:', error);
      });
  }
  
  // Function to fetch weather data based on geographical coordinates
  function getWeatherData(coordinates) {
    const apiKey = '795f9902b6d2913174d818c05369fcf9'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        displayCurrentWeather(data.list[0].main);
        displayForecast(data.list.slice(1));
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }
  
  // Function to display current weather
  function displayCurrentWeather(weather) {
    function displayCurrentWeather(weather) {
        // Assuming you have HTML elements with specific IDs
        const temperatureElement = document.getElementById('temperature');
        const humidityElement = document.getElementById('humidity');
        const windSpeedElement = document.getElementById('wind-speed');
      
        // Update the DOM with current weather details
        temperatureElement.textContent = `Temperature: ${weather.temp} °C`;
        humidityElement.textContent = `Humidity: ${weather.humidity}%`;
        windSpeedElement.textContent = `Wind Speed: ${weather.wind.speed} m/s`;
      }
    // Update the DOM with current weather details
  }
  
  // Function to display 5-day forecast
  function displayForecast(forecast) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    forecast.forEach(day => {
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
        <p>Date: ${day.dt_txt}</p>
        <p>Temperature: ${day.main.temp} °C</p>
        <p>Humidity: ${day.main.humidity}%</p>
        <p>Wind Speed: ${day.wind.speed} m/s</p>
      `;
  
      forecastContainer.appendChild(forecastItem);
    });
  
  }

  document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();
  
    if (cityName) {
      getCoordinates(cityName);
  
      // Update search history
      const historyList = document.getElementById('history-list');
      const listItem = document.createElement('li');
      listItem.textContent = cityName;
      listItem.addEventListener('click', function () {
        getCoordinates(cityName);
      });
      historyList.appendChild(listItem);
    }
  
    // Clear the input field
    cityInput.value = '';
  });
  