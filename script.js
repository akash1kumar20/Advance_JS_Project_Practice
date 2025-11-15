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

//weattherApiCalling
const apiKey = "1a37e5386d52f2e853aed05d97d1595c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";
let city = "";
let degree = "°C";

async function checkWeather() {
  city = "meerut";
  document.querySelector(".loader").style.display = "block";
  try {
    let res = await fetch(apiUrl + `&q=${city}` + `&appid=${apiKey}`);
    let data = await res.json();
    console.log(data);
    document.querySelector(".temperature").innerHTML =
      Math.round(data.main.temp) + ` ${degree}`;
    document.querySelector(".city-name").innerHTML = data.name;
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
    document.querySelector(".loader").style.display = "none";
  } catch (err) {
    document.querySelector(".hidden").style.visible = "block";
  }
}

checkWeather();
