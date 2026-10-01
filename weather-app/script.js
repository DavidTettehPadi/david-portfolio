const API_BASE = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const weatherCodes = {
  0: ["Clear sky", "☀"],
  1: ["Mainly clear", "◒"],
  2: ["Partly cloudy", "◒"],
  3: ["Overcast", "☁"],
  45: ["Fog", "≋"],
  48: ["Rime fog", "≋"],
  51: ["Light drizzle", "☂"],
  53: ["Drizzle", "☂"],
  55: ["Heavy drizzle", "☂"],
  56: ["Freezing drizzle", "❄"],
  57: ["Heavy freezing drizzle", "❄"],
  61: ["Light rain", "☂"],
  63: ["Rain", "☂"],
  65: ["Heavy rain", "☂"],
  66: ["Freezing rain", "❄"],
  67: ["Heavy freezing rain", "❄"],
  71: ["Light snow", "❄"],
  73: ["Snow", "❄"],
  75: ["Heavy snow", "❄"],
  77: ["Snow grains", "❄"],
  80: ["Light showers", "☂"],
  81: ["Rain showers", "☂"],
  82: ["Heavy showers", "☂"],
  85: ["Snow showers", "❄"],
  86: ["Heavy snow showers", "❄"],
  95: ["Thunderstorm", "ϟ"],
  96: ["Thunderstorm with hail", "ϟ"],
  99: ["Severe thunderstorm", "ϟ"]
};

const elements = {
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#location-search"),
  locationButton: document.querySelector("#location-button"),
  status: document.querySelector("#status-message"),
  results: document.querySelector("#search-results"),
  empty: document.querySelector("#empty-state"),
  content: document.querySelector("#weather-content"),
  units: [...document.querySelectorAll(".unit-button")]
};

let temperatureUnit = "celsius";
let windUnit = "km/h";
let latestForecast = null;

function weatherFor(code) {
  return weatherCodes[code] ?? ["Conditions unavailable", "·"];
}

function formatTemperature(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return Math.round(value);
}

function formatClock(isoTime, timezone) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone
  }).format(new Date(isoTime));
}

function formatDay(date, timezone) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    timeZone: timezone
  }).format(new Date(`${date}T12:00:00`));
}

function directionFor(degrees) {
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(degrees / 45) % 8];
}

function uvDescription(value) {
  if (value < 3) return "Low exposure";
  if (value < 6) return "Moderate exposure";
  if (value < 8) return "High exposure";
  if (value < 11) return "Very high exposure";
  return "Extreme exposure";
}

function setStatus(message = "") {
  elements.status.textContent = message;
}

function showForecast(forecast, place) {
  latestForecast = { forecast, place };
  const { current, hourly, daily } = forecast;
  const timezone = forecast.timezone;
  const conditions = weatherFor(current.weather_code);
  const unitLabel = temperatureUnit === "celsius" ? "°C" : "°F";

  elements.empty.hidden = true;
  elements.content.hidden = false;
  document.querySelector("#location-name").textContent = place.name;
  document.querySelector("#location-region").textContent = [place.admin1, place.country].filter(Boolean).join(", ");
  document.querySelector("#local-date").textContent = new Intl.DateTimeFormat("en", {
    weekday: "long", month: "long", day: "numeric", timeZone: timezone
  }).format(new Date(current.time));
  document.querySelector("#updated-time").textContent = `Local time ${formatClock(current.time, timezone)}`;
  document.querySelector("#current-condition").textContent = conditions[0];
  document.querySelector("#current-symbol").textContent = conditions[1];
  document.querySelector("#current-temperature").textContent = formatTemperature(current.temperature_2m);
  document.querySelector("#feels-like").textContent = formatTemperature(current.apparent_temperature);
  document.querySelector("#wind-speed").textContent = Math.round(current.wind_speed_10m);
  document.querySelector("#wind-unit").textContent = windUnit;
  document.querySelector("#wind-direction").textContent = `${directionFor(current.wind_direction_10m)} wind`;
  document.querySelector("#humidity").textContent = Math.round(current.relative_humidity_2m);
  document.querySelector("#uv-index").textContent = Math.round(current.uv_index ?? 0);
  document.querySelector("#uv-label").textContent = uvDescription(current.uv_index ?? 0);
  document.querySelector("#current-summary").textContent = `${conditions[0]} · ${formatTemperature(current.temperature_2m)}${unitLabel} · Feels like ${formatTemperature(current.apparent_temperature)}${unitLabel}`;
  document.querySelector("#coordinates").textContent = `${Number(place.latitude).toFixed(2)}°, ${Number(place.longitude).toFixed(2)}°`;

  const currentHour = hourly.time.findIndex((time) => time >= current.time.slice(0, 13));
  const hours = hourly.time.slice(Math.max(0, currentHour), Math.max(0, currentHour) + 8);
  const hourlyMarkup = hours.map((time, index) => {
    const dataIndex = Math.max(0, currentHour) + index;
    const label = index === 0 ? "Now" : formatClock(time, timezone);
    const icon = weatherFor(hourly.weather_code[dataIndex])[1];
    const rainChance = hourly.precipitation_probability[dataIndex];
    return `<div class="hour-item"><span class="hour-time">${label}</span><span class="hour-symbol" aria-label="${weatherFor(hourly.weather_code[dataIndex])[0]}">${icon}</span><span class="hour-temp">${formatTemperature(hourly.temperature_2m[dataIndex])}°</span><span class="hour-rain">${rainChance > 0 ? `${rainChance}% rain` : ""}</span></div>`;
  }).join("");
  document.querySelector("#hourly-forecast").innerHTML = hourlyMarkup;

  const dailyMarkup = daily.time.map((date, index) => {
    const label = index === 0 ? "Today" : formatDay(date, timezone);
    const weather = weatherFor(daily.weather_code[index]);
    const rainChance = daily.precipitation_probability_max[index];
    return `<div class="day-item"><span class="day-name">${label}</span><span class="day-symbol" aria-label="${weather[0]}">${weather[1]}</span><span class="day-rain">${rainChance > 0 ? `${rainChance}%` : ""}</span><span class="day-high">${formatTemperature(daily.temperature_2m_max[index])}°</span><span class="day-low">${formatTemperature(daily.temperature_2m_min[index])}°</span></div>`;
  }).join("");
  document.querySelector("#daily-forecast").innerHTML = dailyMarkup;
}

function forecastUrl(place) {
  const url = new URL(API_BASE);
  url.search = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index",
    hourly: "temperature_2m,precipitation_probability,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    temperature_unit: temperatureUnit,
    wind_speed_unit: windUnit === "km/h" ? "kmh" : "mph",
    forecast_days: "7",
    timezone: "auto"
  });
  return url;
}

async function loadForecast(place) {
  setStatus("Loading the latest forecast…");
  elements.results.hidden = true;
  try {
    const response = await fetch(forecastUrl(place));
    if (!response.ok) throw new Error("The forecast service is temporarily unavailable.");
    const data = await response.json();
    if (!data.current || !data.daily || !data.hourly) throw new Error("A complete forecast was not returned.");
    setStatus();
    showForecast(data, place);
  } catch (error) {
    setStatus(error.message || "Could not load weather. Check your connection and try again.");
  }
}

async function searchLocations(query) {
  setStatus("Searching locations…");
  elements.results.hidden = true;
  try {
    const url = new URL(GEOCODING_BASE);
    url.search = new URLSearchParams({ name: query, count: "5", language: "en", format: "json" });
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location search is temporarily unavailable.");
    const data = await response.json();
    const places = data.results ?? [];
    if (!places.length) {
      setStatus("No matching places found. Try another city or postcode.");
      return;
    }
    setStatus();
    elements.results.innerHTML = places.map((place, index) => {
      const region = [place.admin1, place.country].filter(Boolean).join(", ");
      return `<button class="search-result" type="button" role="option" data-place-index="${index}"><span class="result-name">${place.name}</span><span class="result-region">${region}</span></button>`;
    }).join("");
    elements.results.hidden = false;
    elements.results.querySelectorAll(".search-result").forEach((button, index) => {
      button.addEventListener("click", () => {
        elements.searchInput.value = "";
        loadForecast(places[index]);
      });
    });
  } catch (error) {
    setStatus(error.message || "Could not search for that place. Check your connection and try again.");
  }
}

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = elements.searchInput.value.trim();
  if (query.length < 2) {
    setStatus("Enter at least two characters to search.");
    return;
  }
  searchLocations(query);
});

elements.locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    setStatus("Location is not available in this browser. Search for a city instead.");
    return;
  }
  setStatus("Finding your location…");
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => loadForecast({
      name: "Your location",
      latitude: coords.latitude,
      longitude: coords.longitude
    }),
    () => setStatus("Location access was unavailable. Search for a city instead."),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
});

elements.units.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedUnit = button.dataset.unit;
    if (selectedUnit === temperatureUnit) return;
    temperatureUnit = selectedUnit;
    windUnit = selectedUnit === "celsius" ? "km/h" : "mph";
    elements.units.forEach((unitButton) => {
      const isActive = unitButton === button;
      unitButton.classList.toggle("is-active", isActive);
      unitButton.setAttribute("aria-pressed", String(isActive));
    });
    if (latestForecast) loadForecast(latestForecast.place);
  });
});

document.addEventListener("click", (event) => {
  if (!elements.results.contains(event.target) && !elements.searchForm.contains(event.target)) {
    elements.results.hidden = true;
  }
});