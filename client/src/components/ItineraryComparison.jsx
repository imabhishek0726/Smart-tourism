export default function ItineraryComparison({ original, updated, onClose }) {
  if (!original?.length || !updated?.length) return null;

  return (
    <div className="bg-white border border-spruce-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-semibold text-spruce-900">
          Before → After
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm text-spruce-400 hover:text-spruce-900 transition-colors"
          >
            Close
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <ComparisonColumn label="Original plan" days={original} tone="muted" />
        <ComparisonColumn label="Updated plan" days={updated} tone="highlight" />
      </div>
    </div>
  );
}

function ComparisonColumn({ label, days, tone }) {
  return (
    <div>
      <p
        className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${
          tone === "highlight" ? "text-amber-600" : "text-spruce-400"
        }`}
      >
        {label}
      </p>
      <div className="space-y-4">
        {days.map((day) => (
          <div key={day.day}>
            <p className="text-xs font-medium text-spruce-600 mb-2">Day {day.day}</p>
            <ul className="space-y-1.5">
              {day.stops.map((stop, idx) => (
                <li
                  key={`${stop.id}-${idx}`}
                  className={`text-sm rounded-lg px-3 py-2 border ${
                    tone === "highlight"
                      ? "border-amber/30 bg-amber/5 text-spruce-900"
                      : "border-spruce-100 bg-mist-50 text-spruce-600"
                  }`}
                >
                  <span className="font-mono text-[11px] mr-2 text-spruce-400">
                    {stop.startTime}
                  </span>
                  {stop.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
