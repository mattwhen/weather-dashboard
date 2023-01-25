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
        call5DayData(lat, lon);
    })
}

function call5DayData(lat, lon) {

    let fetchUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(fetchUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
}

document.getElementById('submit-btn').onclick = callGeoApi;
