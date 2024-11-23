document.getElementById("toggle-mode").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("dark-mode", isDarkMode);

  if (document.getElementById("toggle-mode").textContent == "☀️") {
    alteraTexto("🌑");
  } else {
    alteraTexto("☀️");
  }
});

// Apply the saved preference on page load
window.addEventListener("load", function () {
  const savedMode = localStorage.getItem("dark-mode") === "true";
  if (savedMode) {
    document.body.classList.add("dark-mode");
    alteraTexto("🌑");
  } else {
    alteraTexto("☀️");
  }
});

function alteraTexto(txt) {
  document.getElementById("toggle-mode").textContent = txt;
}
