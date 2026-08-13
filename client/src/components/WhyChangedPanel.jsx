const TYPE_LABEL = {
  weather: "Weather",
  closure: "Closure",
  "opening-hours": "Opening hours",
  "travel-time": "Travel time",
  budget: "Budget",
  "add-place": "Added place",
  delay: "Delay",
};

const TYPE_ICON = {
  weather: "🌧️",
  closure: "🚫",
  "opening-hours": "🕒",
  "travel-time": "🚗",
  budget: "💰",
  "add-place": "➕",
  delay: "⏱️",
};

export default function WhyChangedPanel({ changes }) {
  if (!changes?.length) return null;

  return (
    <div className="bg-white border border-spruce-100 rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-spruce-900 mb-1">
        Why this changed
      </h3>
      <p className="text-sm text-spruce-600 mb-5">
        Every automatic edit, explained in plain language.
      </p>

      <ul className="space-y-4">
        {changes.map((c, idx) => (
          <li key={idx} className="flex gap-3">
            <span
              aria-hidden="true"
              className="h-8 w-8 rounded-full bg-mist-50 flex items-center justify-center shrink-0 text-sm"
            >
              {TYPE_ICON[c.type] || "•"}
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 mb-1">
                {TYPE_LABEL[c.type] || c.type} · Day {c.day}
              </p>
              <p className="text-sm text-spruce-900 leading-relaxed">{c.reason}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
