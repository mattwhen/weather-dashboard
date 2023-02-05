let centerContent = document.querySelector('.center-content');
let searchContainer = document.querySelector('.search-container');
let searchBar = document.querySelector('#search-city');
let weatherStatus = document.querySelector('.weather-status');
let cityArray = JSON.parse(localStorage.getItem('search-history')); 
let cityHistory = []; 

// Call the GeoAPI after user clicks on the search button 
function callGeoApi() {
    // IF the search field is empty, display an error message with the input field box being highlighted red. 
    if (searchBar.value === '') {
        let errorMsg = document.createElement('div');
        errorMsg.setAttribute('style', 'color:red');
        errorMsg.textContent = "Please enter a city"; 
        searchContainer.appendChild(errorMsg);
        setTimeout(() => { // Display error message for one second then disappears. 
            errorMsg.textContent = '';
        }, 1000)
        }
    // ELSE fetch data from the openweathermap URL. 
    else {
        let fetchUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchBar.value + '&limit=1&appid=' + apiKey;
            fetch(fetchUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                let lat = data[0].lat; // Stores the coordinates of the latitude 
                let lon = data[0].lon; // Stores the coordinates of teh longitude
                call5DayData(lat, lon); // Call the 5 day weather forecast API with the variables that have the stored latitude and longitude as an argument. 
                callCityHistory(searchBar.value);
                document.querySelector('.form-control').value = '';
            })
    }
}
function call5DayData(lat, lon) { // Pass the values from the previous fetch request into the function parameters
    let fetchUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(fetchUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);  

        let createh2El = document.querySelector('.weather-status');
        createh2El.textContent = `Date: ${data.list[0].dt_txt.substring(0, 11)}`; // Renders the current date and removes the excess string we don't need when rendering to the page. In this case, the time format (i.e. 12:30:00). 
        // Creates div for displaying Temperature in Fahrenheit.
        let createTemperatureDiv = document.createElement('div');
        createTemperatureDiv.textContent = 'Temp: ' + data.list[0].main.temp + ' F';
        // Creates div for wind measurement.
        let createWindDiv = document.createElement('div');
        createWindDiv.textContent = 'Wind: ' + data.list[0].wind.speed + ' MPH';
        // Creates div for humidity. 
        let createHumidDiv = document.createElement('div');
        createHumidDiv.textContent = 'Humidity: ' + data.list[0].wind.gust + ' %';
        // Creates img element and displays weather icon as the content.
        let weatherIcon = data.list[0].weather[0].icon; // Stores the weather icon from data
        let createWeatherIcon = document.createElement('img');
        let weatherIconUrl = 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png';
        createWeatherIcon.setAttribute('src', weatherIconUrl);

        centerContent.append(createh2El, createTemperatureDiv, createWindDiv, createHumidDiv, createWeatherIcon); // Appends all data to center container

    function createFiveDay() {
        // Creates 5 day weather forecast. 
                let createHeader = document.createElement('h2');
                createHeader.textContent = '5 Day Forecast: ';
                let weatherForecast = document.querySelector('.weather-forecast');
                weatherForecast.append(createHeader);
       for (let i = 0; i < data.list.length; i++) {
            if (i == 0 || i % 8 == 0) { 
                /* Since we only want to render the data for 5 days onto the screen, 
                we use the remainder (%) operator to take one operand (40) and divide by second operand (8). */
                
                let createBox = document.createElement('div');
                createBox.setAttribute('class', 'weather-boxes');
                weatherForecast.append(createBox);
                // Insert data for 5 day forecast.
                let currentTime = document.createElement('h2');
                currentTime.textContent = `Date: ${data.list[i].dt_txt.substring(0, 11)}`; // Renders the current date and removes the excess string we don't need when rendering to the page. In this case, the time format (i.e. 12:30:00). 
                // Create Temp
                let dateHeader = document.createElement('h2');
                dateHeader.textContent = `Temp: ${data.list[i].main.temp} F`;
                // Create Wind
                let windHeader = document.createElement('p');
                windHeader.textContent = `Wind: ${data.list[i].wind.gust} MPH`;
                createBox.append(currentTime, dateHeader, windHeader);
                // Create Humidity
                let createHumidity = document.createElement('p');
                createHumidDiv.textContent = `Humidity: ${data.list[i].wind.gust} %`;
                // Create weather icon
                let createIcon = document.createElement('img');
            }

    }
        }
        createFiveDay();
    })
}


document.getElementById('submit-btn').onclick = callGeoApi;

function callCityHistory(city) { 
    let existingCity = localStorage.getItem('city-search');
    if (existingCity != null) {
        let existingCityArr = JSON.parse(existingCity);
        existingCityArr.push(city);
        localStorage.setItem('city-search', JSON.stringify(existingCityArr));
    }
    else {
        let cityArray = [city];  // ['a', 1, 5]
        localStorage.setItem('city-search', JSON.stringify(cityArray));
    }
}

function createHistBtn() {
    let existingCity = localStorage.getItem('city-search');
    if (existingCity != null) {
        let existingCityArry = JSON.parse(existingCity);
        console.log(existingCityArry);

    }

}
createHistBtn();


// Add event listener to each button that calls geoAPI with the city name. 

document.getElementById('clear-btn').onclick = function() {
    localStorage.clear();
}