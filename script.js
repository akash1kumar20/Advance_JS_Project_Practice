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
