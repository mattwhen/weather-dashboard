let centerContent = document.querySelector('.center-content');
let searchHistory = document.querySelector('#search-city');


// How do I hide the API key?
let apiKey = 'fffae12063e8e68b76c3c77004656139';

// Call the GeoAPI after user clicks on the search button 
function callGeoApi() {

    let userInput = document.getElementById('search-city').value; // target the search button by it's ID
    let fetchUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=1&appid=' + apiKey;

    fetch(fetchUrl)

    .then(function(response) {
        return response.json();
    })

    .then(function(data) {
        console.log(data);
        let lat = data[0].lat;
        let lon = data[0].lon;
        call5DayData(lat, lon); // Call the 5 day weather forecast API with the variables that have the stored latitude and longitude as an argument. 
    })
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
        createh2El.textContent = data.list[0].dt_txt;

       let createTemperatureDiv = document.createElement('div');
       createTemperatureDiv.textContent = 'Temp: ' + data.list[0].main.temp + ' F';
       centerContent.appendChild(createTemperatureDiv);

       let createWindDiv = document.createElement('div');
       createWindDiv.textContent = 'Wind: ' + data.list[0].wind.speed + ' MPH';
       centerContent.appendChild(createWindDiv);

       let createHumidDiv = document.createElement('div');
       createHumidDiv.textContent = 'Humidity: ' + data.list[0].wind.gust + ' %';
       centerContent.appendChild(createHumidDiv);


       
       for (let i = 0; i < 5; i++) {
           let weatherForecast = document.querySelector('.weather-forecast');
           let createDiv = document.createElement('div');
           createDiv.setAttribute('class', 'weather-boxes');
            createDiv.textContent = "Test";
           weatherForecast.appendChild(createDiv);
        }


    })
}

function appendHistory() {
    
    localStorage.setItem('recent-search', searchHistory.value);
}


document.getElementById('submit-btn').onclick = callGeoApi;

document.getElementById('clear-btn').onclick = function() {
    centerContent.textContent = "";
}