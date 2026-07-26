function getWeatherCondition(weatherCode) {
  const codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",

    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",

    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",

    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",

    80: "Slight rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",

    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Severe thunderstorm"
  };

  return codes[weatherCode] || "Unknown";
}

function generateAdvice(weather) {

  const current = weather.current;
  const daily = weather.daily;

  const advice = [];

  const rainChance = daily.precipitation_probability_max[0];

  // Rain
  if (rainChance >= 80) {
    advice.push(
      "🌧 Heavy rainfall is expected today. Delay fertilizer application and reduce irrigation."
    );
  } else if (rainChance >= 50) {
    advice.push(
      "🌦 There is a moderate chance of rain. Monitor field conditions before planting."
    );
  } else {
    advice.push(
      "☀ Weather is suitable for planting and field activities."
    );
  }

  // Temperature
  if (current.temperature_2m >= 35) {
    advice.push(
      "🔥 High temperatures detected. Irrigate crops early morning or evening."
    );
  }

  // Humidity
  if (current.relative_humidity_2m >= 90) {
    advice.push(
      "🍃 Very high humidity increases the risk of fungal diseases. Inspect crops regularly."
    );
  }

  // Wind
  if (current.wind_speed_10m >= 20) {
    advice.push(
      "💨 Strong winds detected. Avoid spraying pesticides today."
    );
  }

  return {
    condition: getWeatherCondition(current.weather_code),
    recommendations: advice
  };
}

module.exports = {
  generateAdvice
};