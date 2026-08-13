export default function Home({ onStart }) {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 sm:pt-24 sm:pb-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-600 mb-4">
          Smart Tourism · Hackathon MVP
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] text-spruce-900 max-w-3xl">
          Plans a trip, then re-plans it the moment reality doesn't cooperate.
        </h1>
        <p className="mt-6 text-lg text-spruce-600 max-w-xl">
          Trailshift builds a day-wise itinerary for your trip, then watches for rain,
          closures, blown budgets, and delays — and rewrites the plan on the spot,
          showing exactly what changed and why.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onStart}
            className="bg-spruce-900 text-mist-50 font-body font-medium px-6 py-3 rounded-full hover:bg-spruce-600 transition-colors"
          >
            Plan a trip
          </button>
          <span className="font-mono text-xs text-spruce-400">
            Demo route preloaded → Manali · 3 days · 4 people · ₹20,000
          </span>
        </div>
      </section>

      <div className="ridge-divider max-w-6xl mx-auto" aria-hidden="true" />

      <section className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-3 gap-8">
        <FeatureCard
          eyebrow="Generate"
          title="A real day-wise plan"
          body="Interest-ranked stops, ordered by proximity, scheduled with realistic visit windows — not a random list of attractions."
        />
        <FeatureCard
          eyebrow="Detect"
          title="What's about to go wrong"
          body="Heavy rain on an outdoor day, a place that's shut, a budget that's already blown, a hop across town that eats the afternoon."
        />
        <FeatureCard
          eyebrow="Re-plan"
          title="With a visible reason"
          body="Every swap comes with a plain-language explanation and a before/after view, so the change is never a mystery."
        />
      </section>
    </div>
  );
}

function FeatureCard({ eyebrow, title, body }) {
  return (
    <div className="border-t-2 border-spruce-900 pt-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-amber-600 mb-2">
        {eyebrow}
      </p>
      <h3 className="font-display text-xl font-medium text-spruce-900 mb-2">{title}</h3>
      <p className="text-sm text-spruce-600 leading-relaxed">{body}</p>
    </div>
  );
}
