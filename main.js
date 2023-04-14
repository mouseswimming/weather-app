import { getWeather } from "./weather";
import { ICON_MAP } from "./iconMap";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch((e) => {
      console.log(e);
      alert("Error getting weather data from API");
    });
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page"
  );
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
}

function renderCurrentWeather(current) {
  const header = document.querySelector("header");

  header.innerHTML = `
      <!-- current weather -->
      <div class="header-left">
        <img class="weather-icon large" src="${getIconUrl(
          current.iconCode
        )}" data-current-icon />
        <div class="header-current-temperature">
          <span data-current-temperature>${current.currentTemp}</span>&deg;
        </div>
      </div>
      <!-- detail weather info -->
      <div class="header-right">
        <div class="info-group">
          <label for="current-high-temperature">High</label>
          <div id="current-high-temperature">
            <span data-current-high-temperature>${current.highTemp}</span>&deg;
          </div>
        </div>
        <div class="info-group">
          <label for="current-feellike-high-temperature">FL High</label>
          <div id="current-feellike-high-temperature">
            <span data-current-feellike-high-temperature>${
              current.highFeelsLike
            }</span>&deg;
          </div>
        </div>
        <div class="info-group">
          <label for="current-wind">Wind</label>
          <div id="current-wind">
            <span data-current-wind>${current.windSpeed}</span><sub>mph</sub>
          </div>
        </div>
        <div class="info-group">
          <label for="current-low-temperature">Low</label>
          <div id="current-low-temperature">
            <span data-current-low-temperature>${current.lowTemp}</span>&deg;
          </div>
        </div>
        <div class="info-group">
          <label for="current-feellike-low-temperature">FL Low</label>
          <div id="current-feellike-low-temperature">
            <span data-current-feellike-low-temperature>${
              current.lowFeelsLike
            }</span>&deg;
          </div>
        </div>
        <div class="info-group">
          <label for="current-precip">Precip</label>
          <div id="current-precip">
            <span data-current-precip>${current.preci}</span><sub>in</sub>
          </div>
        </div>
      </div>  
  `;
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" });

function renderDailyWeather(dail) {
  const daySection = document.querySelector(".day-section");
  let html = "";
  dail.forEach((day) => {
    html += `
      <div class="day-card">
        <img src="${getIconUrl(day.iconCode)}" class="weather-icon" />
        <div class="day-card-day">${DAY_FORMATTER.format(day.timestamp)}</div>
        <div>${day.highTemp}&deg;</div>
      </div>    
    `;
  });

  daySection.innerHTML = html;
}

function renderHourlyWeather(hourly) {
  const hourSectionBody = document.querySelector(".hour-section-body");
  let html = "";

  hourly.forEach((hour) => {
    html += `
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <label>${DAY_FORMATTER.format(hour.timestamp)}</label>
              <div>${HOUR_FORMATTER.format(hour.timestamp)}</div>
            </div>
          </td>
          <td>
            <img src="${getIconUrl(hour.iconCode)}" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <label>Temp</label>
              <div>${hour.temp}&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <label>FL Temp</label>
              <div>>${hour.feelslike}&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <label>Wind</label>
              <div>>${hour.windSpeed}<sub>mph</sub></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <label>Precip</label>
              <div>>${hour.preci}<sub>in</sub></div>
            </div>
          </td>
        </tr>    
    `;
  });

  hourSectionBody.innerHTML = html;

  document.querySelector(".hour-options").classList.remove("hidden");
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}
