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
                console.error('Error fetching coordinates:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}

function getWeatherData(coordinates) {
    const apiKey = '795f9902b6d2913174d818c05369fcf9';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.list[0].main);
            displayForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function displayCurrentWeather(weather) {
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');

    temperatureElement.textContent = `🌤️ Temperature: ${weather?.temp || 'N/A'} °C`;
    humidityElement.textContent = `💦 Humidity: ${weather?.humidity || 'N/A'}%`;
    windSpeedElement.textContent = `💨 Wind Speed: ${weather?.wind?.speed || 'N/A'} m/s`;
}

function displayForecast(forecast) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    
    for (let i = 0; i < forecast.length; i += 8) {
        const day = forecast[i];
        const date = new Date(day.dt_txt);
        const iconCode = day.weather[0].icon;
        const temperature = day.main.temp;
        const windSpeed = day.wind.speed;
        const humidity = day.main.humidity;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        const iconImg = document.createElement('img');
        iconImg.src = iconUrl;
        iconImg.alt = 'Weather Icon';
        forecastItem.innerHTML = `
            <p>Date: ${date.toLocaleDateString()}</p>
            <p>Icon: ${iconImg.outerHTML}</p>
            <p>🌤️Temperature: ${temperature} °C</p>
            <p>💦Humidity: ${humidity}%</p>
            <p> 💨Wind Speed: ${windSpeed} m/s</p>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}

function groupByDate(forecast) {
    const groupedForecast = {};

    forecast.forEach(day => {
        const date = day.dt_txt.split(' ')[0];
        if (!groupedForecast[date]) {
            groupedForecast[date] = [];
        }
        groupedForecast[date].push(day);
    });

    return groupedForecast;
}

function calculateAverage(forecastData, property) {
    const values = forecastData.map(day => day[property]);
    const numericValues = values.filter(value => typeof value === 'number' && !isNaN(value));

    if (numericValues.length === 0) {
        return 'N/A';
    }

    const sum = numericValues.reduce((acc, value) => acc + value, 0);
    const average = sum / numericValues.length;

    return average.toFixed(2);
}

function getDayOfWeek(dayIndex) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
}

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();

    if (cityName) {
        getCoordinates(cityName);
        const historyList = document.getElementById('history-list');
        const listItem = document.createElement('li');
        listItem.textContent = cityName;
        listItem.addEventListener('click', function () {
            getCoordinates(cityName);
        });
        historyList.appendChild(listItem);
    }

    cityInput.value = '';
});
