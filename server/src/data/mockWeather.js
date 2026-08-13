// Fallback weather forecast used when OpenWeather is unavailable or no API key is set.
// Day 2 is intentionally "heavy rain" so the demo can trigger a re-plan live.

export function getMockWeather(days = 3) {
  const base = [
    { condition: "Clear", tempC: 18, rain: false, description: "Clear skies, good for outdoor activities" },
    { condition: "Heavy Rain", tempC: 12, rain: true, description: "Heavy rain expected through the afternoon" },
    { condition: "Partly Cloudy", tempC: 16, rain: false, description: "Partly cloudy, mild chance of light showers" },
    { condition: "Clear", tempC: 19, rain: false, description: "Sunny and clear" },
    { condition: "Cloudy", tempC: 15, rain: false, description: "Overcast, no rain expected" },
  ];

  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    ...base[i % base.length],
  }));
}
