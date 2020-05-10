// gets current date
moment().format('L');

// function that calls for the current weather using the OpenWeather API credentials
function getCurrentWeather(cityName){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=659956b7dda15a19679ac1977908e812";
    var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=659956b7dda15a19679ac1977908e812";

    $.ajax({
        url: queryURL,
        method: "GET"
    }) .then(function (response) {
        console.log(response);
        console.log(queryURL);
        $("#current").empty();
        var date= moment().format('L');

        // creates all the HTML elements for city weather information
        var cityName= $("<h2>").text(response.name);
        var displayDate= cityName.append(" " + date);
        var temperature= $("<p>").text("Temperature: " + Math.floor(response.main.temp) + "°F");
        var humidity= $("<p>").text("Humidity: " + response.main.humidity + "%");
        var wind= $("<p>").text("Wind Speed: " + response.wind.speed + " mph");
        var weatherImg= response.weather[0].main;

        // all the weather icons used based on the weather conditions
        if (weatherImg === "Clear") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
        else if (weatherImg=== "Clouds") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
        else if (weatherImg === "Drizzle") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
        else if (weatherImg === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }  
         else if (weatherImg === "Snow") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
        // need to create the div element needed to add all of the HTML elements so that it will render on the page
        var newDiv = $('<div>');
        newDiv.append(displayDate, currentIcon, temperature, humidity, wind);
        $("#current").html(newDiv);

        // retrieves all the necessary data for the uv index information needed and calls the ajax method to get the information
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?&appid=ecc0be5fd92206da3aa90cc41c13ca56&lat=" + lat  + "&lon=" + lon;

        $.ajax({
            url: uvQueryURL,
            method: 'GET'
        }).then(function (response) {
            $('#uv-display').empty();
            var uvVal = response.value;
            // changes the background color of the uv index to indicate type of severity: favorable, moderate, severe
            if(uvVal <= 3){
                var uvIndex = $("<button class='btn bg-success'>").text("UV Index: " + uvVal);
            }
            else if (uvVal >= 4 && uvVal <= 8){
                var uvIndex = $("<button class='btn bg-warning'>").text("UV Index: " + uvVal);
            }
            else {
                var uvIndex = $("<button class='btn bg-danger'>").text("UV Index: " + uvVal);
            }
            // adds the div created to the HTML
            $('#uv-display').html(uvIndex);
    
        });

    });

    // this ajax call is for the five day forecast call of the city that was searched
    $.ajax({
        url: queryURLforecast,
        method: "GET"
    }).then(function(response){
        var results= response.list;
        $("#forecast5day").empty();
        for(var i=0; i<results.length; i+=8){
            // this creates the div cards for the five day weather forecast
            var forecastDiv= $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
            // this stores the date, temperature, and humidity responses (the only parameters shown for weather conditions)
            var date = results[i].dt_txt;
            var setD = date.substr(0,10)
            var temp = results[i].main.temp;
            var tempF= Math.floor(temp);
            var hum = results[i].main.humidity;
            // this creates the tags for the parameters so that they may be ultimately added to the HTML
            var h5date = $("<h5 class='card-title'>").text(setD);
            var pTemp = $("<p class='card-text'>").text("Temperature: " + tempF + "°F");;
            var pHum = $("<p class='card-text'>").text("Humidity: " + hum + "%");; 
            
            // this variable helps declare the value for the type of icon to depict based on weather conditions 
            var weather = results[i].weather[0].main

             if (weather === "Clear") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
            else if (weather === "Clouds") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } 
            else if (weather === "Drizzle") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
            else if (weather === "Rain") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } 
             else if (weather === "Snow") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }

            // after all the content is created and retrieved, they are now ready to be appended onto the forecast div in the HTML
            forecastDiv.append(h5date);
            forecastDiv.append(icon);
            forecastDiv.append(pTemp);
            forecastDiv.append(pHum);
            $("#forecast5day").append(forecastDiv);
        }
    });

}

// calls the page to load with the last searched city (if any) and begins to create the search history
pageLoad();

// the event handler when the city name is inputed and the user clicks the search button or presses enter
$("#select-city").on("click", function (event) {
    event.preventDefault();
    // stores the value of the city name
    var cityInput = $("#city-input").val().trim();

    //saves the city search term into local storage
    var textContent = $(this).siblings("input").val();
    var storearr = [];
    storearr.push(textContent);
    localStorage.setItem('cityName', JSON.stringify(storearr));
    
    // begins the call for getting the current weather for the city requested and begins a search history
    getCurrentWeather(cityInput);
    pageLoad();
});

// this calls the last stored city searched to populate when the page loads
function pageLoad () {
    var lastSearch = JSON.parse(localStorage.getItem("cityName"));
    var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
    var psearch = $("<div>");
    psearch.append(searchDiv)
    $("#searchhistory").prepend(psearch);
}

// an event delegation to allow search history cities to be selected again
$("#searchhistory").on('click', '.btn', function(event) {
event.preventDefault();
    getCurrentWeather($(this).text());

});
