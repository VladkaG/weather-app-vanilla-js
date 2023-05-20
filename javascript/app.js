function showDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];
  let currentHour = date.getHours();
  let currentMin = date.getMinutes();
  if (currentMin < 10) {
    currentMin = `0${currentMin}`;
  }

  if (currentHour > 4 && currentHour < 20) {
    document.querySelector("#background-video").src = `./images/day.mp4`;
  } else {
    document.querySelector("#background-video").src = `./images/night.mp4`;
  }

  return `${currentDay} ${currentHour}:${currentMin}`;
}

/*******************************************************************/

let apiKey = "5t4badf2211oab190e2bd035f7fefd1a";
let form = document.querySelector("#search-form");
let locationButton = document.querySelector("#location-button");
let celsiusTemperature = null;

function search(city) {
  let url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(url).then(displayWeather);
}
function displayWeather(response) {
  let iconUrl = `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/`;

  celsiusTemperature = response.data.temperature.current;
  document.querySelector("h1").innerHTML = response.data.city;

  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.temperature.feels_like
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.temperature.humidity
  );
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#current-time").innerHTML = showDate(
    response.data.time * 1000
  );
  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
    );
  document
    .querySelector("#weather-icon")
    .setAttribute("alt", `${response.data.condition.description}`);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  if (city === "") {
    alert("Write a city");
  } else {
    search(city);
  }
});

locationButton.addEventListener("click", function (event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather);
  });
});

search("Kharkiv");

/*******************************************************************/
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");
fahrenheitLink.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector("#temperature").innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
});
celsiusLink.addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
});

function displayForecast() {
  let forecastHTML = `<div class="row">`;
  let days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      ` <div class="col-2 forecast-card">
              <div class="forecast-day">${day}</div>
              <div class="forecast-image">
                <img class="icon" id="icon" src="images/cloudy.png" alt="" />
              </div>
              <div class="forecast-temp">
                <span id="max-temp">27</span>°
                <span class="min-temp" id="min-temp">14</span
                ><span class="min-temp">°</span>
              </div>
            </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  document.querySelector("#forecast").innerHTML = forecastHTML;
}

displayForecast();
