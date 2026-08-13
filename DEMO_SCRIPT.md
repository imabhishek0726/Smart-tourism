# Demo script — Trailshift (Smart Tourism)

**Target length: ~2 minutes.** Practice the click path until it's muscle memory —
judges remember a smooth demo far more than a feature list.

---

### 0. One-line pitch (10s)
> "Every travel app plans a trip once. Trailshift keeps re-planning it — live —
> when weather, closures, or budget get in the way, and tells you exactly why."

### 1. Generate the plan (20s)
- Land on the home page → click **Plan a trip**.
- The form is pre-filled with the demo route: **Manali, 3 days, 4 people,
  ₹20,000, nature/food/adventure**. Click **Generate itinerary**.
- Point out: day-wise timeline, real place names, weather forecast for all 3
  days, and the budget breakdown — say out loud that **Day 2 is forecast
  heavy rain** and the **budget is already tight**.

### 2. Trigger a weather re-plan (25s)
- In the left panel, click **Bad weather hits**.
- The itinerary updates instantly. Point at the amber highlight on the
  swapped stop in the Day 2 timeline.
- Click **View changes** on the yellow notice banner.
- Read the **Why this changed** panel out loud: *"Heavy rain forecast on Day
  2 — outdoor activity swapped for an indoor alternative."*
- Scroll to the **Before → After** comparison so judges see the diff, not
  just the end state.

### 3. Trigger a budget re-plan (20s)
- Click **Budget exceeded**.
- Show the budget card flip from "Over budget" to "On track" (or closer to
  it) as the engine swaps in cheaper stops — again with plain-language
  reasons in the Why panel.

### 4. Trigger a closure (15s)
- Scroll to any stop in the timeline, click **Simulate: mark this place
  closed today**.
- One stop swaps immediately, reason shown: *"X is closed today, so it was
  replaced with Y."*

### 5. Close (10s)
> "Every rule here — weather, closures, hours, travel time, budget, delays —
> is explainable in one sentence. That's the whole idea: a smart itinerary
> isn't one that never changes, it's one that changes *out loud*."

---

## Backup talking points (if a live API call is slow or offline)
- The app **never breaks** — every external API (weather, places, routing)
  has a mock fallback baked in server-side, so the demo works even with no
  wifi in the room.
- If judges ask "is this real AI?" — be upfront: it's a transparent
  **rule engine**, not a black-box model, which is a deliberate choice for
  explainability. Mention it could be layered with an LLM later for
  natural-language trip requests ("plan me something chill and cheap") on
  top of the same rule engine underneath.

## Suggested Q&A answers
- **"How does it scale to a real destination?"** — Swap `mockPlaces.js` /
  `mockWeather.js` for live Geoapify/OpenWeather calls (already wired, just
  needs API keys) and it works for any city with no code changes.
- **"Why rule-based instead of an LLM?"** — Determinism and speed: every
  re-plan is instant, free, and auditable. An LLM layer could sit on top for
  parsing loose natural-language requests, but the actual scheduling logic
  benefits from being predictable.
- **"What would you build next?"** — Persistence (MongoDB), multi-day drag
  reordering in the UI, collaborative trip editing for groups, and calendar
  export.
