import axios from "axios";
import { getMockWeather } from "../data/mockWeather.js";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

/**
 * Returns a day-wise weather forecast for a destination.
 * Falls back to mock data if no API key is configured or the request fails,
 * so the app always works in a demo/offline setting.
 */
export async function fetchWeather(destination, days = 3) {
  if (!OPENWEATHER_API_KEY) {
    return { source: "mock", forecast: getMockWeather(days) };
  }

  try {
    const geoRes = await axios.get(GEOCODE_URL, {
      params: { q: destination, limit: 1, appid: OPENWEATHER_API_KEY },
      timeout: 5000,
    });

    if (!geoRes.data?.length) {
      return { source: "mock", forecast: getMockWeather(days) };
    }

    const { lat, lon } = geoRes.data[0];

    const forecastRes = await axios.get(FORECAST_URL, {
      params: { lat, lon, appid: OPENWEATHER_API_KEY, units: "metric" },
      timeout: 5000,
    });

    // OpenWeather free tier returns 3-hour steps; collapse into daily summaries.
    const dailyMap = new Map();
    for (const entry of forecastRes.data.list) {
      const date = entry.dt_txt.split(" ")[0];
      if (!dailyMap.has(date)) dailyMap.set(date, []);
      dailyMap.get(date).push(entry);
    }

    const dayKeys = Array.from(dailyMap.keys()).slice(0, days);
    const forecast = dayKeys.map((date, i) => {
      const entries = dailyMap.get(date);
      const avgTemp =
        entries.reduce((sum, e) => sum + e.main.temp, 0) / entries.length;
      const rain = entries.some(
        (e) => e.weather[0].main === "Rain" || e.rain?.["3h"] > 0
      );
      const condition = entries[Math.floor(entries.length / 2)].weather[0].main;

      return {
        day: i + 1,
        date,
        condition: rain ? "Rain" : condition,
        tempC: Math.round(avgTemp),
        rain,
        description: entries[Math.floor(entries.length / 2)].weather[0].description,
      };
    });

    return { source: "live", forecast };
  } catch (err) {
     console.error(
    "[weatherService] OpenWeather failed:",
    err.response?.status,
    err.response?.data || err.message
  );
    return { source: "mock", forecast: getMockWeather(days) };
  }
}
