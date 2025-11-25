//themeToggle
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

//helpers
function show(sel) {
  const el = document.querySelector(sel);
  if (el) el.style.display = "block";
}
function hide(sel) {
  const el = document.querySelector(sel);
  if (el) el.style.display = "none";
}
function innerText(sel, text) {
  const el = document.querySelector(sel);
  if (el) el.innerHTML = text;
}

//unit_and_citySearch
let city = localStorage.getItem("lastCitySearch") ?? "";

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

//last search
function showLastSearch() {
  show(".lastSearch");
  innerText(".lastSearchCity", city.toUpperCase());
}
if (city.length > 1) showLastSearch();
function useLastSearch() {
  checkWeather(city);
}

//citySearch
function searchCityFn(e) {
  e.preventDefault();
  city = e.target.city.value.trim();
  if (!city) return;
  document.getElementById("city-input").value = "";
  checkWeather(city);
}

//weattherApiCalling
const apiKey = "65d485af57b04e73939162556251911";
const apiUrl = "https://api.weatherapi.com/v1/current.json?";

async function checkWeather(city) {
  localStorage.setItem("lastCitySearch", city);

  if (city.length >= 3) {
    show(".weather-display");
    hide(".display_alert");
  } else {
    return;
  }

  show(".loader");

  try {
    let res = await fetch(apiUrl + `&q=${city}` + `&key=${apiKey}`);
    let data = await res.json();
    if (!res.ok) {
      hide(".weather-display");
      show("#error-message");
    } else {
      hide("#error-message");
      await displayForecast();
      show(".unit-toggle");
      innerText(".city-name", data.location.name.toUpperCase());
      //saving lastCitySearch Name in the local storage
      localStorage.setItem("lastCitySearch", data.location.name);
      innerText(".region", data.location.region.toUpperCase());
      innerText(
        ".temperature",
        degree === "°F"
          ? Math.round(data.current.temp_f) + "°F"
          : Math.round(data.current.temp_c) + "°C"
      );
      document.querySelector("#weather-icon").src = data.current.condition.icon;
      innerText(".description", data.current.condition.text.toUpperCase());
      innerText("#country", data.location.country.toUpperCase());
      innerText("#humidity", data.current.humidity);
      innerText("#wind", data.current.wind_kph);
      innerText("#wind_direction", data.current.wind_dir);
      innerText(
        "#feels-like",
        degree === "°F"
          ? Math.round(data.current.feelslike_f) + " °F"
          : Math.round(data.current.feelslike_c) + " °C"
      );
    }
    hide(".loader");
  } catch (err) {
    hide(".weather-display");
    innerText(".loader", "Site down! Try later...");
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
let lastForecastData = null;
const apiUrlForecast =
  "https://api.weatherapi.com/v1/forecast.json?days=5&aqi=yes&alerts=no";

async function displayForecast() {
  let city = localStorage.getItem("lastCitySearch");
  if (!city) return;

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

//geoLocation
const useLocationBtn = document.getElementById("use-location-btn");

// Settings for geolocation
const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 300000, // 5 minutes
};

function requestLocation() {
  if (useLocationBtn) {
    useLocationBtn.disabled = true;
    useLocationBtn.textContent = "Locating...";
  }

  if (!("geolocation" in navigator)) {
    // Browser doesn't support geolocation
    alert("Geolocation is not supported by your browser.");
    restoreLocationBtn();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        city = `${lat},${lon}`;
        localStorage.setItem("lastCitySearch", city);
        await checkWeather(city);

        //to indicate we used geolocation
        const info = document.getElementById("location-info");
        if (info) info.textContent = "Using device location";
      } catch (err) {
        console.error("Error after getting position:", err);
      } finally {
        restoreLocationBtn();
      }
    },
    (error) => {
      //geolocation errors
      restoreLocationBtn();
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert(
            "Permission denied. Please allow location access or search by city."
          );
          break;
        case error.POSITION_UNAVAILABLE:
          alert(
            "Position unavailable. Try again later or enter a city manually."
          );
          break;
        case error.TIMEOUT:
          alert("Location request timed out. Try again.");
          break;
        default:
          alert("Unable to retrieve your location.");
      }
    },
    GEO_OPTIONS
  );
}

function restoreLocationBtn() {
  if (!useLocationBtn) return;
  useLocationBtn.disabled = false;
  useLocationBtn.innerHTML = `<img src="Assests/pngegg.png" alt="location" width="16" height="16" /> Use my location`;
}
