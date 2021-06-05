const settings = {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC"
};
const DAY = 86400000;
const MINSK_TIME_ZONE = 10800000;
function dateTime() {
    let currentTime = Date.now()
    let timeZone = localStorage.getItem("TimeZone") || MINSK_TIME_ZONE;
    let dt = new Date(currentTime + parseInt(timeZone));
    document.getElementById("date-time").textContent = dt.toLocaleDateString('ru-Ru', settings).replaceAll(",", "");
}
function dayForecast() {
    let currentTime = Date.now()
    let timeZone = localStorage.getItem("TimeZone") || MINSK_TIME_ZONE;
    const setDayForecast = (day_offset) => {
        document.getElementById(`next_day_${day_offset}`).textContent =
            new Date(currentTime + parseInt(timeZone) + day_offset * DAY)
                .toLocaleDateString("ru-RU", { weekday: "long" });
    }
    setDayForecast(1);
    setDayForecast(2);
    setDayForecast(3);
}