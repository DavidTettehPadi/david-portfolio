# Local Weather

A responsive local forecast app with city search, optional browser geolocation, current conditions, an hourly outlook, and a seven-day forecast.

## Live Demo

[Open Local Weather](https://davidtettehpadi.github.io/david-portfolio/weather-app/)

## Features

- Search for cities, towns, or postcodes
- Use browser location when permission is granted
- Current temperature, feels-like temperature, wind, humidity, and UV index
- Eight-hour forecast with precipitation chances
- Seven-day high/low forecast with weather conditions
- Celsius/Fahrenheit and matching wind-speed units
- Responsive desktop and mobile layouts
- Clear status messages when location or network access is unavailable

## Data Source

Forecast and place-search data are provided by [Open-Meteo](https://open-meteo.com/). No API key is required. The app needs an internet connection for search and forecasts. Weather forecasts are estimates and are not guarantees of future conditions.

## Run Locally

From this directory, start a static HTTP server:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Browser geolocation works on HTTPS or `localhost` and requires user permission.

## Built With

- HTML5
- CSS3
- Vanilla JavaScript
- Open-Meteo geocoding and forecast APIs

## Source

This app is part of the [David Tetteh Padi portfolio repository](https://github.com/DavidTettehPadi/david-portfolio/tree/main/weather-app).