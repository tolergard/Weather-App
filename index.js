//VISA VÄDER SOM FINNS I LOCAL STORAGE - DET SENASTE SOM ANVÄNDAREN SÖKTE PÅ
function showSavedData() {
  let cityName = localStorage.getItem("cityName");
  let temperature = localStorage.getItem("temperature");
  let feelsLike = localStorage.getItem("feelsLike");
  let weatherImg = localStorage.getItem("weatherImg");
  let weatherDescription = localStorage.getItem("weatherDescription");
  let maxTemp = localStorage.getItem("maxTemp");
  let minTemp = localStorage.getItem("minTemp");
  let windSpeed = localStorage.getItem("windSpeed");
  let humidity = localStorage.getItem("humidity");

  document.querySelector("#store-city").textContent = cityName;
  document.querySelector("#store-temp").textContent = temperature;
  document.querySelector("#store-img").src = weatherImg;
  document.querySelector("#store-feels-like").textContent = feelsLike;
  document.querySelector("#store-weather-details").textContent =
    weatherDescription;
  document.querySelector("#max-temp-number").textContent = maxTemp;
  document.querySelector("#min-temp-number").textContent = minTemp;
  document.querySelector("#wind-number").textContent = windSpeed;
  document.querySelector("#humidity-number").textContent = humidity;
}

window.addEventListener("load", showSavedData);

//DEKLARERAR VARIABLER FÖR ATT KOMMA ÅT HTML-ELEMENT
let input = document.querySelector("#input");
let buttonSearch = document.querySelector("#button-search");
let weatherPlace = document.querySelector("#city-temp");
let weatherIcon = document.querySelector("#weather-icon");
let specWeatherIcon = document.querySelector(".spec-weather-icon");
let sortIcon = document.querySelector(".sort-icon");
let weatherDetails = document.querySelector("#weather-details");
let weatherContainer = document.querySelector("#weather-container");
let searchContainer = document.querySelector("#search-container");
let moreWeatherInfo = document.querySelector("#more-weather-info");
let mainContainer = document.querySelector("#main-container");
let forecast = document.querySelector("#forecast");
let diagramChartJs = document.querySelector("#diagram-chart-js");
let topLeft = document.querySelector("#top-left");
let topRight = document.querySelector("#top-right");
let bottomLeft = document.querySelector("#bottom-left");
let bottomRight = document.querySelector("#bottom-right");
let maxTempNumber = document.querySelector("#max-temp-number");
let minTempNumber = document.querySelector("#min-temp-number");
let windNumber = document.querySelector("#wind-number");
let humidityNumber = document.querySelector("#humidity-number");
let myChart = document.querySelector("#diagram-chart-js");

//LYSSNA EFTER KLICK ELLER ENTER-KNAPPEN VID SÖKNING
buttonSearch.addEventListener("click", function () {
  performSearch();
});

input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    performSearch();
  }
});

//RENSA TIDIGARE SÖKNINGAR, CHART OCH LOCAL STORAGE
function performSearch() {
  weatherPlace.innerHTML = "";
  weatherDetails.innerHTML = "";
  weatherIcon.innerHTML = "";
  humidityNumber.innerHTML = "";
  minTempNumber.innerHTML = "";
  windNumber.innerHTML = "";
  maxTempNumber.innerHTML = "";
  myChart.innerHTML = '<canvas id="myChart"></canvas>';
  //FÖR ATT NOLLSTÄLLA CANVASEN HITTADE JAG INFO HÄR: https://stackoverflow.com/questions/40056555/destroy-chart-js-bar-graph-to-redraw-other-graph-in-same-canvas
  getWeather(input.value);
  getWeatherForecast(input.value);
}

function getWeather(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9e52936988af5a9745589d048709a390`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => showWeather(data));
}

function showWeather(weather) {
  console.log(weather);
  //OM FELMEDDELANDE (404) RETURNERAS, VISA FELMEDDELANDE SAMT ALIEN-BILD
  //ANNARS FORTSÄTT VISA VÄDER FÖR RÄTT STAD
  if (weather.cod == 404) {
    document.querySelector("#alien-div").style.display = "block";
    document.querySelector("#error-message").style.display = "block";
  } else {
    document.querySelector("#error-message").style.display = "none";

    let cityName = document.createElement("h2");
    cityName.textContent = weather.name;
    weatherPlace.appendChild(cityName);

    let showTemperature = document.createElement("p");
    showTemperature.textContent = Math.round(weather.main.temp) + " °C";
    weatherPlace.append(showTemperature);

    let feelLikeTemp = document.createElement("p");
    feelLikeTemp.textContent =
      "Feels like " + Math.round(weather.main.feels_like) + " °C";
    weatherDetails.append(feelLikeTemp);

    let detailedTypeOfWeather = document.createElement("p");
    detailedTypeOfWeather.textContent = weather.weather[0].description;
    weatherDetails.append(detailedTypeOfWeather);

    //OM DET FINNS DATA FÖR REGN ELLER SNÖ (1H) VISA DETTA
    if (weather.rain && weather.rain["1h"] !== undefined) {
      let howMuchRain = document.createElement("p");
      howMuchRain.textContent = weather.rain["1h"] + " mm/h";
      weatherDetails.append(howMuchRain);
    } else if (weather.snow && weather.snow["1h"] !== undefined) {
      let howMuchSnow = document.createElement("p");
      howMuchSnow.textContent = weather.snow["1h"] + " mm/h";
      weatherDetails.append(howMuchSnow);
    }

    let maxTemp = document.createElement("p");
    maxTemp.textContent = weather.main.temp_max.toFixed(1) + " °C";
    maxTempNumber.append(maxTemp);

    let minTemp = document.createElement("p");
    minTemp.textContent = weather.main.temp_min.toFixed(1) + " °C";
    minTempNumber.append(minTemp);

    let showWind = document.createElement("p");
    showWind.textContent = weather.wind.speed.toFixed(1) + " m/s";
    windNumber.append(showWind);

    let humidity = document.createElement("p");
    humidity.textContent = weather.main.humidity + " %";
    humidityNumber.append(humidity);

    //SWITCH MED ALLA TYPER AV MAIN-VÄDER SOM VISAR BILDER FÖR RÄTT VÄDERTYP
    let weatherMain = weather.weather[0].main;
    let weatherImgSrc = "";

    switch (weatherMain) {
      case "Clear":
        weatherImgSrc = "weather_icons/clear.svg";
        break;
      case "Thunderstorm":
        weatherImgSrc = "weather_icons/thunderstorm.svg";
        break;
      case "Drizzle":
        weatherImgSrc = "weather_icons/drizzle.svg";
        break;
      case "Rain":
        weatherImgSrc = "weather_icons/drizzle.svg";
        break;
      case "Snow":
        weatherImgSrc = "weather_icons/snow.svg";
        break;
      case "Clouds":
        weatherImgSrc = "weather_icons/clouds.svg";
        break;
      case "Mist":
        weatherImgSrc = "weather_icons/fog_mist.svg";
        break;
      case "Smoke":
        weatherImgSrc = "weather_icons/smoke.svg";
        break;
      case "Haze":
        weatherImgSrc = "weather_icons/haze.svg";
        break;
      case "Dust":
        weatherImgSrc = "weather_icons/dust.svg";
        break;
      case "Fog":
        weatherImgSrc = "weather_icons/fog_mist.svg";
        break;
      case "Sand":
        weatherImgSrc = "weather_icons/dust.svg";
        break;
      case "Ash":
        weatherImgSrc = "weather_icons/ash.svg";
        break;
      case "Squall":
        weatherImgSrc = "weather_icons/squall.svg";
        break;
      case "Tornado":
        weatherImgSrc = "weather_icons/tornado.svg";
        break;
      default:
        return "";
    }

    let weatherImg = document.createElement("img");
    weatherImg.src = weatherImgSrc;
    weatherIcon.appendChild(weatherImg);

    //LAGRA VÄDER I LOCALSTORE
    localStorage.setItem("cityName", weather.name);
    localStorage.setItem("temperature", Math.round(weather.main.temp) + " °C");
    localStorage.setItem(
      "feelsLike",
      "Feels like " + Math.round(weather.main.feels_like) + " °C"
    );
    localStorage.setItem("weatherImg", weatherImgSrc);
    localStorage.setItem("weatherDescription", weather.weather[0].description);
    localStorage.setItem("maxTemp", weather.main.temp_max.toFixed(1) + " °C");
    localStorage.setItem("minTemp", weather.main.temp_min.toFixed(1) + " °C");
    localStorage.setItem("windSpeed", weather.wind.speed.toFixed(1) + " m/s");
    localStorage.setItem("humidity", weather.main.humidity + " %");
  }
}
