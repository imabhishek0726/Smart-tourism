import { useState } from "react";

const CATEGORY_ICON = {
  nature: "🌲",
  adventure: "🧗",
  food: "🍽️",
  culture: "🛕",
};

export default function ItineraryTimeline({ days, onMarkClosed, changedStopIds = new Set() }) {
  const [activeDay, setActiveDay] = useState(1);
  const current = days.find((d) => d.day === activeDay) || days[0];

  if (!days?.length) return null;

  return (
    <div className="bg-white border border-spruce-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-lg font-semibold text-spruce-900">Itinerary</h3>
      </div>

      <div className="flex gap-2 mb-5 mt-3">
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeDay === d.day
                ? "bg-spruce-900 border-spruce-900 text-mist-50"
                : "bg-white border-spruce-100 text-spruce-600 hover:border-spruce-400"
            }`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      <ol className="relative pl-6">
        <span
          aria-hidden="true"
          className="absolute left-[9px] top-2 bottom-2 w-px bg-spruce-100"
        />
        {current.stops.map((stop, idx) => {
          const flagged = changedStopIds.has(stop.id);
          return (
            <li key={`${stop.id}-${idx}`} className="relative pb-6 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute -left-6 top-1 h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center text-[10px] ${
                  flagged
                    ? "bg-amber border-amber-600"
                    : "bg-white border-spruce-400"
                }`}
              />
              <div
                className={`rounded-xl border p-4 ${
                  flagged ? "border-amber/50 bg-amber/5" : "border-spruce-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] text-spruce-400 mb-1">
                      {stop.startTime} – {stop.endTime}
                    </p>
                    <h4 className="font-display text-base font-medium text-spruce-900 flex items-center gap-1.5">
                      <span aria-hidden="true">{CATEGORY_ICON[stop.category] || "📍"}</span>
                      {stop.name}
                    </h4>
                    {stop.description && (
                      <p className="text-sm text-spruce-600 mt-1">{stop.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-tabular text-sm font-medium text-spruce-900">
                      {stop.avgCost ? `₹${stop.avgCost}/person` : "Free"}
                    </p>
                    <p className="text-xs text-spruce-400 mt-0.5">
                      {stop.indoor ? "Indoor" : "Outdoor"}
                    </p>
                  </div>
                </div>

                {onMarkClosed && (
                  <button
                    onClick={() => onMarkClosed(stop)}
                    className="mt-3 text-xs font-medium text-rain hover:text-spruce-900 underline underline-offset-2"
                  >
                    Simulate: mark this place closed today
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
