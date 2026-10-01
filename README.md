# David Tetteh Padi | Portfolio

Personal portfolio for **David Tetteh Padi**, an aspiring full-stack developer with a background in healthcare and mental health. The site introduces my work, skills, and development journey.

## Live Portfolio

[Visit the portfolio](https://davidtettehpadi.github.io/david-portfolio/)

## Featured Projects

| Project | Live demo | Source |
| --- | --- | --- |
| Adepa Pharmacy | [Open the pharmacy website](https://davidtettehpadi.github.io/adepa-pharmacy/) | [GitHub repository](https://github.com/DavidTettehPadi/adepa-pharmacy) |
| My Digital Clock | [Open the clock](https://davidtettehpadi.github.io/my-digital-clock/) | [GitHub repository](https://github.com/DavidTettehPadi/my-digital-clock) |
| Local Weather | [Open the weather app](https://davidtettehpadi.github.io/david-portfolio/weather-app/) | [Weather app source](https://github.com/DavidTettehPadi/WeatherApp) |

The project section is a responsive horizontal carousel. On wider screens it displays two projects at a time; on smaller screens it displays one card and supports touch scrolling. Each project card includes a live preview and links to the demo or source.

## Built With

- HTML5
- CSS3
- Tailwind CSS via CDN
- Vanilla JavaScript
- Open-Meteo forecast and geocoding APIs for the weather project
- GitHub Pages

## Run Locally

From the portfolio directory, start a local static server:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The portfolio and weather app are static files; live weather lookup requires an internet connection. Device location is available on secure contexts such as `localhost` and HTTPS.

## Project Structure

```text
David-portfolio/
├── images/
├── weather-app/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── README.md
├── index.html
├── script.js
├── style.css
└── README.md
```

## About

The portfolio is built to present responsive, accessible web experiences and the projects I am developing as I grow my skills in front-end and full-stack development.