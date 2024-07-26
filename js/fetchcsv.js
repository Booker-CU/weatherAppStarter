
const csvFile = '../city_coordinates.csv';
const selectElement = document.getElementById("location-select");
const formElement = document.getElementById("location-form");

function processCSV(csvData) {
    const rows = csvData.split('\n');

    for (let i = 0; i < rows.length; i++) {

        if (i=== 0) continue;

        const rowData = rows[i].split(",");

        if (rowData.length < 4) {
            console.warn("Skipping row", i + 1, "due to missing data"); //  warning
            continue; // Skip rows with less than 4 values
        }

        const city = rowData[2];
        const country = rowData[3].trim();

        const option = document.createElement("option");
        option.value = `${rowData[0]}, ${rowData[1]}`;
        option.text = `${city}, ${country}`;
        selectElement.appendChild(option);
        console.log(option);
    }
}

fetch(csvFile)
.then(response => response.text())
.then(data => processCSV(data))
.catch(error => console.error("Error fetching CSV File",error))


selectElement.addEventListener("change", (e) => {
    const selectedOption = e.target.value;
    const [lat, lon] = selectedOption.split(", ");

    fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`)
    .then(response => response.json())
    .then(data => {

        const weather7Days = data.dataseries;

        const weatherDisplay = document.getElementById("weather-display");
        weatherDisplay.innerHTML = "";
        const weatherContent="";



        weather7Days.forEach(forecast => {

            const weatherDate = forecast.date;

            const weatherDateString = weatherDate.toString();

            const year = parseInt(weatherDateString.substring(0, 4), 10);
            const month = parseInt(weatherDateString.substring(4, 6), 10);
            const day = parseInt(weatherDateString.substring(6), 10);

            const dateNew = new Date(year, month -1, day);
            const dateStructure = {year: 'numeric', month: 'short', day: 'numeric'};

            const reformattedDate = new Intl.DateTimeFormat('en-GB', dateStructure).format(dateNew);

            const weather = forecast.weather;
            const max = forecast.temp2m.max;
            const min = forecast.temp2m.min;
            const weatherIcon = getWeatherIcon(weather);
            const weatherText = getWeatherDisplayText(weather);


            const weatherComponent = document.createElement('div');
            weatherComponent.classList.add("weather-card");

            const weatherContent = `
            <h1 class="weather-title"> ${ reformattedDate }</h1>
            <h1> ${weatherIcon}</h1>
            <h1 class="weather-title2"><span style="color:#faf6f6;" >${ weatherText }</span></h1>
            <h1 class="weather-title"> Max: ${ max } C </h1>
            <h1 class="weather-title"> Min: ${ min } C </h1>
            `;
            weatherComponent.innerHTML = weatherContent;
            weatherDisplay.appendChild(weatherComponent);
        });


        weatherDisplay.style.display = weather7Days ? 'flex' : 'none'; // Show weather if available
        weatherDisplay.style.justifyContent = "center";
        weatherDisplay.style.flexWrap = "wrap";

        const footer = document.getElementById('footer');
        if (footer) {
          footer.style.paddingTop = '20px';
        } else  {
          console.error('Footer element not found');
        }

    })
    .catch(error => console.error("Error fetching weather data", error))
})

function getWeatherIcon(weather) {

    const weatherIcon = {
        clear: "../images/clear2.png",
        cloudy: "../images/cloudy2.png",
        fog: "../images/fog.png",
        humid: "../images/humid.png",
        ishower: "../images/ishower.png",
        lightrain: "../images/lightrain.png",
        lightsnow: "../images/lightsnow.png",
        mcloudy: "../images/mcloudy.png",
        oshower: "../images/oshower.png",
        pcloudy: "../images/pcloudy.png",
        rain: "../images/rain.png",
        rainsnow: "../images/rainsnow.png",
        snow: "../images/snow.png",
        tsrain: "../images/tsrain.png",
        tstorm: "../images/tstorm.png",
        windy: "../images/windy.png"
    };
    const iconPath = weatherIcon[weather] || "❓.png";
    return `<img class="weatherIcon" src="${iconPath}" alt="${weather}"`
}

function getWeatherDisplayText(weather) {

    const weatherText = {
        clear: "Clear",
        cloudy: "Cloudy",
        fog: "Fog",
        humid: "Humid",
        ishower: "Isolated Showers",
        lightrain: "Light Rain",
        lightsnow: "Light Snow",
        mcloudy: "Mostly Cloudy",
        oshower: "Overcast Showers",
        pcloudy: "Partly Cloudy",
        rain: "Rain",
        rainsnow: "Rain and Snow",
        snow: "Snow",
        tsrain: "Thunderstorm",
        tstorm: "Thunderstorm",
        windy: "Windy"
    };
    return weatherText[weather] || "Unknown";

}

