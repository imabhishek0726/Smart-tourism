function formatINR(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function BudgetSummary({ summary }) {
  if (!summary) return null;

  const { activityCost, foodCost, stayCost, localTravelCost, totalEstimated, totalBudget, remaining, exceeded } =
    summary;

  const rows = [
    { label: "Activities", value: activityCost },
    { label: "Food", value: foodCost },
    { label: "Stay", value: stayCost },
    { label: "Local travel", value: localTravelCost },
  ];

  const maxVal = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="bg-white border border-spruce-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-spruce-900">Budget</h3>
        <span
          className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
            exceeded ? "bg-red-50 text-red-700" : "bg-spruce-50 text-spruce-600"
          }`}
        >
          {exceeded ? "Over budget" : "On track"}
        </span>
      </div>

      <div className="space-y-3 mb-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-spruce-600">{row.label}</span>
              <span className="font-tabular font-medium text-spruce-900">
                {formatINR(row.value)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-mist-50 overflow-hidden">
              <div
                className="h-full bg-spruce-400 rounded-full"
                style={{ width: `${(row.value / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-spruce-100 pt-4 flex items-baseline justify-between">
        <span className="text-sm font-medium text-spruce-900">Estimated total</span>
        <span className="font-tabular font-display text-xl font-semibold text-spruce-900">
          {formatINR(totalEstimated)}
        </span>
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <span className="text-xs text-spruce-400">Budget: {formatINR(totalBudget)}</span>
        <span
          className={`font-tabular text-xs font-medium ${
            exceeded ? "text-red-600" : "text-spruce-400"
          }`}
        >
          {exceeded ? `${formatINR(Math.abs(remaining))} over` : `${formatINR(remaining)} left`}
        </span>
      </div>
    </div>
  );
}
