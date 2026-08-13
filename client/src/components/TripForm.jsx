import { useState } from "react";

const INTEREST_OPTIONS = [
  { id: "nature", label: "Nature" },
  { id: "adventure", label: "Adventure" },
  { id: "food", label: "Food" },
  { id: "culture", label: "Culture" },
];

const DEFAULT_FORM = {
  destination: "Manali",
  days: 3,
  people: 4,
  budget: 20000,
  interests: ["nature", "food", "adventure"],
};

export default function TripForm({ onSubmit, loading }) {
  const [form, setForm] = useState(DEFAULT_FORM);

  function toggleInterest(id) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter((i) => i !== id)
        : [...f.interests, id],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-spruce-100 rounded-2xl p-6 sm:p-8 shadow-sm"
    >
      <h2 className="font-display text-2xl font-semibold text-spruce-900 mb-1">
        Set up your trip
      </h2>
      <p className="text-sm text-spruce-600 mb-6">
        Defaults are pre-filled with the demo route — change anything you like.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Destination">
          <input
            type="text"
            required
            value={form.destination}
            onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
            className="input"
            placeholder="e.g. Manali"
          />
        </Field>

        <Field label="Days">
          <input
            type="number"
            min={1}
            max={7}
            required
            value={form.days}
            onChange={(e) => setForm((f) => ({ ...f, days: Number(e.target.value) }))}
            className="input font-tabular"
          />
        </Field>

        <Field label="Travelers">
          <input
            type="number"
            min={1}
            max={20}
            required
            value={form.people}
            onChange={(e) => setForm((f) => ({ ...f, people: Number(e.target.value) }))}
            className="input font-tabular"
          />
        </Field>

        <Field label="Budget (₹, total)">
          <input
            type="number"
            min={0}
            step={500}
            required
            value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
            className="input font-tabular"
          />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-spruce-900 mb-3">Interests</legend>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => {
            const active = form.interests.includes(opt.id);
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => toggleInterest(opt.id)}
                aria-pressed={active}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-spruce-900 border-spruce-900 text-mist-50"
                    : "bg-white border-spruce-100 text-spruce-600 hover:border-spruce-400"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full sm:w-auto bg-amber hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-spruce-900 font-semibold px-6 py-3 rounded-full transition-colors"
      >
        {loading ? "Building itinerary…" : "Generate itinerary"}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-spruce-900 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
