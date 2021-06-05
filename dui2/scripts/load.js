async function loadPage() {
    await setWeatherInfo();
    if (localStorage.getItem("Image") === null) {
        localStorage.setItem("Image", "images/hilton.png")
    }
    let image = localStorage.getItem("Image");
    background.style.backgroundImage = `url(${image})`;
    dateTime();
    setInterval(dateTime,1000);
    dayForecast();
    setInterval(dayForecast,1000);
}
window.addEventListener("load", loadPage()); 