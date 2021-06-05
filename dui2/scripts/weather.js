const KELVIN_DEGREE = 273;
let buttonSearch = document.getElementById('button-search');
let cityInput = document.getElementById('city-input');
cityInput.addEventListener('keydown', async (event) => {
    if (event.code === 'Enter') {
        try {
            await setWeatherInfo();
        } catch (error) { alert(error) }
    }
});

buttonSearch.addEventListener('click', async () => {
    try {
        await setWeatherInfo();
    } catch (error) { alert(error) }
});
async function setWeatherInfo() {
    let city;
    let cityName = cityInput.value;
    if (cityName === "") {
        city = localStorage.getItem('City', city) ? localStorage.getItem('City') : 'Минск';
    }
    else {
        city = cityName;
        cityInput.value = "";
    }
    let key = "486e0147678070208da42c6e90e65bef";
    let todayUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=ru`;
    let forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=ru`;

    let weatherToday;
    let weatherForecast;
    try {
        weatherToday = await getJsonData(todayUrl);
        weatherForecast = await getJsonData(forecastUrl);
        setTodayWeather(weatherToday);
        setForecast(weatherForecast);
        setPlace(weatherToday);
        localStorage.setItem("TimeZone", `${weatherToday.timezone}000`);
        localStorage.setItem('City', city);
    }
    catch (error) {
        alert(error.message)
    }
}
function setTodayWeather(weatherToday) {
    let path = `images/weather/${weatherToday.weather[0].main}.svg`;
    document.getElementById('today-temperature').textContent = `${Math.round(weatherToday.main.temp - KELVIN_DEGREE)}°`;
    document.getElementById("today-image").setAttribute("src", path);
    document.getElementById('description').textContent = weatherToday.weather[0].description;
    document.getElementById('feels-like').textContent = `Ощущается как: ${Math.round(weatherToday.main.feels_like - KELVIN_DEGREE)}°`;
    document.getElementById('wind').textContent = `Скорость ветра: ${weatherToday.wind.speed}`;
    document.getElementById('humidity').textContent = `Влажность: ${weatherToday.main.humidity}%`;
}
function setForecast(weatherForeast) {
    const searchForecast = (dt) => {
        let local_date = dt.toLocaleDateString('ko-KR', { year: "numeric", month: "2-digit", day: "2-digit" });
        local_date = local_date.replaceAll(". ", "-").replaceAll(".", "") + " 12:00:00";
        for (let item of weatherForeast.list) {
            if (item.dt_txt === local_date) {
                return item;
            }
        }
        throw new Error("Forecast not found!");
    };

    const setInfo = (forecast, day_offset) => {
        let path = `images/weather/${forecast.weather[0].main}.svg`;
        document.getElementById(`next_day_image_${day_offset}`).setAttribute("src", path);

        document.getElementById(`next_day_temperature_${day_offset}`).textContent =
            `${Math.round(forecast.main.temp - KELVIN_DEGREE)}°`;
    }

    try {
        let now = Date.now();
        let forecast1 = searchForecast(new Date(now + DAY));
        let forecast2 = searchForecast(new Date(now + 2 * DAY));
        let forecast3 = searchForecast(new Date(now + 3 * DAY));
        setInfo(forecast1, 1);
        setInfo(forecast2, 2);
        setInfo(forecast3, 3);
    } catch (error) { throw error }
}
function setPlace(weatherToday) {
    let country = weatherToday.sys.country;
    let regions = new Intl.DisplayNames(['ru'], { type: 'region' });
    country = regions.of(country);
    let city = weatherToday.name;
    let place = city !== country ? `${city}, ${country}` : country;
    document.getElementById('city').textContent = place;
}