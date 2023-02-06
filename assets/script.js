let centerContent = document.querySelector('.center-content');
let searchContainer = document.querySelector('.search-container');
let searchBar = document.querySelector('#search-city');
let weatherStatus = document.querySelector('.weather-status');
let cityArray = JSON.parse(localStorage.getItem('search-history')); 
let recentSearch = document.querySelector('.recent-searches');

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
        weatherStatus.innerHTML = '';
        let currentDate = document.createElement('h2');
        currentDate.textContent = data.list[0].dt_txt;
        // Creates div for displaying Temperature in Fahrenheit.
        let tempHeader = document.createElement('h2');
        tempHeader.textContent = 'Temp: ' + data.list[0].main.temp + ' F';
        // Creates div for wind measurement.
        let windHeader = document.createElement('h2');
        windHeader.textContent = 'Wind: ' + data.list[0].wind.speed + ' MPH';
        // Creates div for humidity. 
        let createHumidity = document.createElement('h2');
        createHumidity.textContent = 'Humidity: ' + data.list[0].wind.gust + ' %';
        // Creates img element and displays weather icon as the content.
        let weatherIcon = data.list[0].weather[0].icon; // Stores the weather icon from data
        let createWeatherIcon = document.createElement('img');
        let weatherIconUrl = 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png';
        createWeatherIcon.setAttribute('src', weatherIconUrl);

        weatherStatus.append(currentDate, tempHeader, windHeader, createHumidity, createWeatherIcon); // Appends all data to center container

    function createFiveDay() {
        // Creates 5 day weather forecast. 
        let weatherForecast = document.querySelector('.weather-forecast');
        weatherForecast.innerHTML = ''; 
       for (let i = 0; i < data.list.length; i++) {
            if (i == 0 || i % 8 == 0) {

               
                let createBox = document.createElement('div');
                createBox.setAttribute('class', 'weather-boxes');
                weatherForecast.append(createBox);
                // Insert data for 5 day forecast.

                // Create date header
                let currentDate = document.createElement('h2');
                currentDate.textContent = `${data.list[i].dt_txt.substring(0, 11)}`;
                // Create weather icon
                let createIcon = document.createElement('img');
                let weatherIcon = data.list[i].weather[0].icon; // Stores the weather icon from data
                let weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
                createIcon.setAttribute('src', weatherIconUrl);
                // Create Temperature header
                let tempHeader = document.createElement('h2');
                tempHeader.textContent = `Temp: ${data.list[i].main.temp} F`;
                // Create Wind header
                let windHeader = document.createElement('h2');
                windHeader.textContent = `Wind: ${data.list[i].wind.gust} MPH`;
                // Create Humidity header
                let createHumidity = document.createElement('h2');
                createHumidity.textContent = `Humidity: ${data.list[i].wind.gust} %`;
                // Append all the headers in each weather box. 
                createBox.append(currentDate, createIcon, tempHeader, windHeader, createHumidity);
            }

    }
        }
        createFiveDay();
    })
}


document.getElementById('submit-btn').onclick = callGeoApi;

function callCityHistory(city) {  
    let existingCity = localStorage.getItem('city-search');

    if (existingCity != null) { // Does data already exist in LS? 
        let existingCityArr = JSON.parse(existingCity);
        existingCityArr.push(city);
        localStorage.setItem('city-search', JSON.stringify(existingCityArr));
    }
    else { 
        let cityArray = [city];  // ['a', 1, 5]
        localStorage.setItem('city-search', JSON.stringify(cityArray));
    }
    createHistBtn();
}

function createHistBtn() {
    let existingCity = localStorage.getItem('city-search');
    let existingCityArr = JSON.parse(existingCity);
    console.log(existingCityArr);
    recentSearch.innerHTML = ' '; 
    for (let i = existingCityArr.length - 1; i >= 0; i--) {
        let createBtn = document.createElement('button');
        createBtn.setAttribute('type', 'button');
        createBtn.textContent = existingCityArr[i];
        recentSearch.append(createBtn);
    }

    let recentSearches = document.querySelector('.recent-searches');
    // for (let i = 0; i < existingCityArr.length; i++) {
    //     let createBtn = document.createElement('button');
    //     createBtn.setAttribute('class', 'btn btn-secondary btn-md history-btn');
    //     createBtn.textContent = existingCity;
    //     recentSearches.append(createBtn);
    // }
    // if (existingCity != null) {
    //     let existingCityArry = JSON.parse(existingCity);

    //     console.log(existingCityArry);

    // }

}
createHistBtn(); // Renders to the page automatically to show recent searches. 


// Add event listener to each button that calls geoAPI with the city name. 

document.getElementById('clear-btn').onclick = function() {
    localStorage.clear();
}