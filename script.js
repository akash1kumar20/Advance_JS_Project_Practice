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

//unitToggle
let degree = localStorage.getItem("degree") || "°C"; //default = "°C"
function convertUnitToC() {
  degree = "°C";
  localStorage.setItem("degree", degree);
  checkWeather();
}
function convertUnitToF() {
  degree = "°F";
  localStorage.setItem("degree", degree);
  checkWeather();
}

//citySearch
let city = "";
function searchCityFn(e) {
  e.preventDefault();
  city = e.target.city_input.value;
  checkWeather(city);
  document.getElementById("city-input").value = " ";
}

//weattherApiCalling
const apiKey = "1a37e5386d52f2e853aed05d97d1595c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";
async function checkWeather(city) {
  city = city || localStorage.getItem("lastCitySearch");
  if (city.length >= 3) {
    document.querySelector(".weather-display").style.display = "block";
    document.querySelector(".display_alert").style.display = "none";
  } else {
    return;
  }
  document.querySelector(".loader").style.display = "block";
  try {
    let res = await fetch(apiUrl + `&q=${city}` + `&appid=${apiKey}`);
    let data = await res.json();
    if (data.cod === "404") {
      document.querySelector(".weather-display").style.display = "none";
      document.querySelector(".hidden").style.display = "block";
    } else {
      document.querySelector(".temperature").innerHTML =
        degree === "°F"
          ? Math.round((data.main.temp = (data.main.temp * 9) / 5 + 32)) + "°F"
          : Math.round(data.main.temp) + "°C";
      document.querySelector(".city-name").innerHTML = data.name.toUpperCase();
      localStorage.setItem("lastCitySearch", data.name);
      document.querySelector(".country").innerHTML = data.sys.country;
      document.querySelector(".description").innerHTML =
        data.weather[0].description.toUpperCase();
      document.querySelector("#humidity").innerHTML = data.main.humidity;
      document.querySelector("#wind").innerHTML = data.wind.speed;
      document.getElementById("feels-like").innerHTML = data.main.feels_like;
      let sunrise = data.sys.sunrise;
      document.getElementById("sunrise").innerHTML = new Date(
        sunrise * 1000
      ).toLocaleTimeString();
      let sunset = data.sys.sunset;
      document.getElementById("sunset").innerHTML = new Date(
        sunset * 1000
      ).toLocaleTimeString();
    }
    document.querySelector(".loader").style.display = "none";
  } catch (err) {
    document.querySelector(".weather-display").style.display = "none";
    document.querySelector(".loader").innerHTML = "Site down! Try later...";
  }
}
