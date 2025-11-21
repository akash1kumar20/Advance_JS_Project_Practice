let currentTheme = JSON.parse(localStorage.getItem("theme"));
if (currentTheme === null) {
  currentTheme = true; // default = light mode
}
function applyTheme() {
  if (currentTheme) {
    document.getElementById("lightTheme").style.display = "flex";
    document.getElementById("darkTheme").style.display = "none";
  } else {
    document.getElementById("lightTheme").style.display = "none";
    document.getElementById("darkTheme").style.display = "flex";
  }
  document.body.style.backgroundColor = currentTheme ? "white" : "black";
}
function toggleTheme() {
  currentTheme = !currentTheme;
  applyTheme();
  localStorage.setItem("theme", JSON.stringify(currentTheme));
}
applyTheme();

let city = "" || localStorage.getItem("lastCitySearch");

//unitToggle
let degree = localStorage.getItem("degree") || "°C"; //default = "°C"
function convertUnitToC() {
  degree = "°C";
  localStorage.setItem("degree", degree);
  checkWeather(city);
}
function convertUnitToF() {
  degree = "°F";
  localStorage.setItem("degree", degree);
  checkWeather(city);
}

//citySearch
function searchCityFn(e) {
  e.preventDefault();
  city = e.target.city.value;
  checkWeather(city);
  document.getElementById("city-input").value = " ";
}

//weattherApiCalling
const apiKey = "65d485af57b04e73939162556251911";
const apiUrl = "http://api.weatherapi.com/v1/current.json?";
async function checkWeather(city) {
  localStorage.setItem("lastCitySearch", city);
  if (city.length >= 3) {
    document.querySelector(".weather-display").style.display = "block";
    document.querySelector(".display_alert").style.display = "none";
  } else {
    return;
  }
  document.querySelector(".loader").style.display = "block";
  try {
    let res = await fetch(apiUrl + `&q=${city}` + `&key=${apiKey}`);
    let data = await res.json();
    if (res.status === 404) {
      document.querySelector(".weather-display").style.display = "none";
      document.querySelector(".hidden").style.display = "block";
    } else {
      displayForecast(city, degree);
      document.querySelector(".city-name").innerHTML =
        data.location.name.toUpperCase();
      localStorage.setItem("lastCitySearch", data.name);
      document.querySelector(".region").innerHTML =
        data.location.region.toUpperCase();
      document.querySelector(".temperature").innerHTML =
        degree === "°F"
          ? Math.round(data.current.temp_f) + "°F"
          : Math.round(data.current.temp_c) + "°C";
      document.querySelector("#weather-icon").src = data.current.condition.icon;
      document.querySelector(".description").innerHTML =
        data.current.condition.text.toUpperCase();
      document.querySelector("#country").innerHTML =
        data.location.country.toUpperCase();
      document.querySelector("#humidity").innerHTML = data.current.humidity;
      document.querySelector("#wind").innerHTML = data.current.wind_kph;
      document.querySelector("#wind_direction").innerHTML =
        data.current.wind_dir;
      document.getElementById("feels-like").innerHTML =
        degree === "°F"
          ? Math.round(data.current.feelslike_f) + " °F"
          : Math.round(data.current.feelslike_c) + " °C";
    }
    document.querySelector(".loader").style.display = "none";
  } catch (err) {
    document.querySelector(".weather-display").style.display = "none";
    document.querySelector(".loader").innerHTML = "Site down! Try later...";
  }
}

//dateFormatting
function formatForecastDate(str) {
  let d = new Date(str);

  let date = d.getDate();
  let month = d.toLocaleString("en-US", { month: "short" });
  let day = d.toLocaleString("en-US", { weekday: "short" });

  return `${date}/${month},${day}`;
}

//forecastApiCalling
const apiUrlForecast =
  "https://api.weatherapi.com/v1/forecast.json?days=5&aqi=yes&alerts=no";

async function displayForecast(city, degree) {
  try {
    const res = await fetch(`${apiUrlForecast}&key=${apiKey}&q=${city}`);
    const data = await res.json();

    const container = document.getElementById("forecast_container");
    container.innerHTML = ""; // clear previous results

    data.forecast.forecastday.forEach((day) => {
      // Create forecast card
      const card = document.createElement("div");
      card.className = "forecast_card";

      const formattedDate = formatForecastDate(day.date);

      card.innerHTML = `
        <p class="forecast_date">${formattedDate}</p>
        <img src="https:${day.day.condition.icon}" alt="${
        day.day.condition.text
      }" />
        <p class="forecast_temp">  ${
          degree === "°C"
            ? `${Math.round(day.day.maxtemp_c)}° ${Math.round(
                day.day.mintemp_c
              )}°`
            : `${Math.round(day.day.maxtemp_f)}° ${Math.round(
                day.day.mintemp_f
              )}°`
        }
       </p> 
        <p class="forecast_weather">${day.day.condition.text}</p>
        <p class="forecast_humidity">Humidity: ${day.day.avghumidity}%</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.log("Forecast error:", err);
  }
}
