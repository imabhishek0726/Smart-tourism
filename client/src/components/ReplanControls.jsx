import { useState } from "react";

export default function ReplanControls({ onTrigger, loading, dayNumbers = [1] }) {
  const [delayDay, setDelayDay] = useState(dayNumbers[0] || 1);
  const [delayMinutes, setDelayMinutes] = useState(90);

  return (
    <div className="bg-spruce-900 text-mist-50 rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold mb-1">Simulate a scenario</h3>
      <p className="text-sm text-spruce-100/70 mb-5">
        Trigger a real-world disruption and watch the itinerary re-plan itself.
      </p>

      <div className="grid sm:grid-cols-2 gap-2.5">
        <ScenarioButton
          label="Bad weather hits"
          hint="Checks the forecast, swaps outdoor stops"
          onClick={() => onTrigger({ type: "weather" })}
          disabled={loading}
        />
        <ScenarioButton
          label="Travel time too long"
          hint="Reorders stops to cut backtracking"
          onClick={() => onTrigger({ type: "travel-time" })}
          disabled={loading}
        />
        <ScenarioButton
          label="Budget exceeded"
          hint="Swaps in cheaper alternatives"
          onClick={() => onTrigger({ type: "budget" })}
          disabled={loading}
        />
        <ScenarioButton
          label="Run full re-check"
          hint="Applies every rule at once"
          onClick={() => onTrigger({ type: "auto" })}
          disabled={loading}
        />
      </div>

      <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-spruce-100/70 mb-1">Day delayed</label>
          <select
            value={delayDay}
            onChange={(e) => setDelayDay(Number(e.target.value))}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-tabular"
          >
            {dayNumbers.map((d) => (
              <option key={d} value={d} className="text-spruce-900">
                Day {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-spruce-100/70 mb-1">Minutes late</label>
          <input
            type="number"
            min={15}
            step={15}
            value={delayMinutes}
            onChange={(e) => setDelayMinutes(Number(e.target.value))}
            className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-tabular"
          />
        </div>
        <button
          disabled={loading}
          onClick={() =>
            onTrigger({ type: "delay", dayNumber: delayDay, delayMinutes })
          }
          className="bg-amber hover:bg-amber-600 disabled:opacity-60 text-spruce-900 font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
        >
          Report delay
        </button>
      </div>
    </div>
  );
}

function ScenarioButton({ label, hint, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-left bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed border border-white/10 rounded-xl px-4 py-3 transition-colors"
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-spruce-100/60 mt-0.5">{hint}</p>
    </button>
  );
}
