const CONDITION_ICON = {
  Clear: "☀️",
  Sunny: "☀️",
  "Partly Cloudy": "⛅",
  Cloudy: "☁️",
  Rain: "🌧️",
  "Heavy Rain": "🌧️",
  Clouds: "☁️",
};

export default function WeatherCards({ forecast, source }) {
  if (!forecast?.length) return null;

  return (
    <div className="bg-white border border-spruce-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-spruce-900">
          Weather forecast
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-spruce-400">
          {source === "mock" ? "Demo data" : "Live · OpenWeather"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {forecast.map((day) => (
          <div
            key={day.day}
            className={`rounded-xl border p-4 ${
              day.rain
                ? "border-rain/30 bg-rain/5"
                : "border-spruce-100 bg-mist-50"
            }`}
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-spruce-400 mb-1">
              Day {day.day}
            </p>
            <div className="flex items-center gap-2 mb-1">
              <span aria-hidden="true">{CONDITION_ICON[day.condition] || "🌤️"}</span>
              <span className="font-medium text-spruce-900">{day.condition}</span>
            </div>
            <p className="font-tabular text-2xl font-display font-semibold text-spruce-900">
              {day.tempC}°C
            </p>
            <p className="text-xs text-spruce-600 mt-1 leading-snug">{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
