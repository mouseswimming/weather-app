import axios from "axios";

const WEATHER_API =
  "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&precipitation_unit=inch&timeformat=unixtime";

export async function getWeather(lat, lon, timezone) {
  return axios
    .get(WEATHER_API, {
      params: {
        latitude: lat,
        longitude: lon,
        timezone,
      },
    })
    .then(({ data }) => {
      return {
        current: pareseCurrentWeather(data),
        daily: pareseDailyWeather(data),
        hourly: pareseHourlyWeather(data),
      };
    });
}

function pareseCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    weathercode: iconCode,
    windspeed: windSpeed,
  } = current_weather;

  const {
    temperature_2m_max: [highTemp],
    temperature_2m_min: [lowTemp],
    apparent_temperature_max: [highFeelsLike],
    apparent_temperature_min: [lowFeelsLike],
    precipitation_sum: [preci],
  } = daily;

  return {
    iconCode,
    currentTemp: Math.round(currentTemp),
    windSpeed: Math.round(windSpeed),
    highTemp: Math.round(highTemp),
    lowTemp: Math.round(lowTemp),
    highFeelsLike: Math.round(highFeelsLike),
    lowFeelsLike: Math.round(lowFeelsLike),
    preci: Math.round(preci * 100) / 100,
  };
}

function pareseDailyWeather({ daily }) {
  return daily.time.map((time, index) => {
    return {
      timestamp: time * 1000,
      iconCode: daily.weathercode[index],
      highTemp: Math.round(daily.temperature_2m_max[index]),
    };
  });
}

function pareseHourlyWeather({ hourly, current_weather }) {
  return hourly.time
    .map((time, index) => {
      return {
        timestamp: time * 1000,
        iconCode: hourly.weathercode[index],
        temp: Math.round(hourly.temperature_2m[index]),
        feelslike: Math.round(hourly.apparent_temperature[index]),
        windSpeed: Math.round(hourly.windspeed_10m[index]),
        preci: Math.round(hourly.precipitation[index] * 100) / 100,
      };
    })
    .filter(({ timestamp }) => timestamp >= current_weather.time * 1000)
    .slice(0, 24);
}
