# Trailshift — Smart Tourism Dynamic Itinerary Planner

A hackathon-ready MVP for the "Smart Tourism" theme. It plans a day-wise trip
itinerary, then **re-plans it live** when conditions change — bad weather, a
closed attraction, a blown budget, excessive travel time, a user-reported
delay, or a newly added stop — and shows exactly what changed and why.

Demo route baked in as the default: **Manali · 3 days · 4 people · ₹20,000 ·
nature/food/adventure**.

---

## 1. Architecture overview

```
Browser (React SPA)
   │  fetch /api/*  (proxied by Vite in dev)
   ▼
Express API (Node.js)
   │
   ├─ services/  → calls OpenWeather + Geoapify, with automatic mock fallback
   ├─ logic/     → rule-based itinerary generator + re-plan rule engine
   └─ data/      → offline demo dataset (Manali) used as fallback
```

- **Frontend**: React 18 + Vite + Tailwind CSS. No routing library — a single
  `App.jsx` swaps between the landing page and the planner view.
- **Backend**: Node + Express, ES modules. No database — itinerary state is
  round-tripped through the API from the browser (stateless server, good for
  a demo, easy to swap in MongoDB later if you want persistence).
- **Rule engine, not ML**: every re-plan decision comes from an explicit,
  readable rule in `server/src/logic/rules.js`. This is intentional — it's
  fast, has zero external dependency at runtime, and every decision can be
  explained in one sentence (which is exactly what the "why changed" panel
  shows).
- **API keys never touch the frontend.** They live only in `server/.env` and
  are read server-side. If they're missing, every service transparently
  falls back to realistic mock data, so the whole app works offline.

---

## 2. Folder structure

```
smart-tourism/
├── server/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js                 # Express app entry point
│       ├── routes/
│       │   ├── itinerary.js         # POST /generate, POST /replan
│       │   ├── places.js            # GET /places
│       │   └── weather.js           # GET /weather
│       ├── services/
│       │   ├── weatherService.js    # OpenWeather + fallback
│       │   ├── placesService.js     # Geoapify + fallback
│       │   └── routingService.js    # Geoapify routing + haversine fallback
│       ├── logic/
│       │   ├── itineraryGenerator.js # builds the initial day-wise plan
│       │   ├── rules.js              # individual re-plan rules
│       │   └── replanEngine.js       # orchestrates rules, produces diff
│       ├── utils/
│       │   ├── budget.js
│       │   ├── travelTime.js
│       │   └── distance.js
│       └── data/
│           ├── mockPlaces.js         # 15-place Manali demo dataset
│           └── mockWeather.js        # 3-day forecast, Day 2 = heavy rain
│
└── client/
    ├── package.json
    ├── vite.config.js                # dev proxy: /api → localhost:5000
    ├── tailwind.config.js            # design tokens (color/type)
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── itineraryApi.js       # every backend call, in one file
        ├── pages/
        │   ├── Home.jsx              # landing page
        │   └── TripPlanner.jsx       # main app screen, owns all state
        ├── components/
        │   ├── Header.jsx
        │   ├── TripForm.jsx
        │   ├── ItineraryTimeline.jsx
        │   ├── WeatherCards.jsx
        │   ├── BudgetSummary.jsx
        │   ├── PlacesList.jsx
        │   ├── ReplanNotice.jsx
        │   ├── ItineraryComparison.jsx  # before/after view
        │   ├── WhyChangedPanel.jsx      # plain-language reasons
        │   └── ReplanControls.jsx       # demo scenario buttons
        └── data/
            └── sampleData.js         # last-resort offline fallback for the UI
```

---

## 3. API reference

| Method | Endpoint                  | Purpose                                   |
|--------|----------------------------|--------------------------------------------|
| GET    | `/api/health`              | Liveness check                            |
| POST   | `/api/itinerary/generate`  | Build the initial day-wise itinerary      |
| POST   | `/api/itinerary/replan`    | Re-plan given a trigger (see below)       |
| GET    | `/api/places`              | Raw places lookup for a destination       |
| GET    | `/api/weather`             | Raw forecast lookup for a destination     |

**`POST /api/itinerary/generate`** body:
```json
{ "destination": "Manali", "days": 3, "people": 4, "budget": 20000, "interests": ["nature","food","adventure"] }
```

**`POST /api/itinerary/replan`** body:
```json
{
  "itinerary": [ /* current day-wise itinerary, as returned by /generate */ ],
  "places": [ /* the places array from /generate */ ],
  "weather": [ /* the weather array from /generate */ ],
  "people": 4,
  "budget": 20000,
  "trigger": { "type": "weather" }
}
```

`trigger.type` is one of:
- `"weather"` — re-checks the forecast, swaps risky outdoor stops on rainy days
- `"closure"` — requires `closedPlaceId`; replaces that one stop
- `"travel-time"` — reorders a day's stops if a hop exceeds 45 minutes
- `"budget"` — swaps the priciest stops for cheaper alternatives until under budget
- `"add-place"` — requires `newPlace` (a place object); inserts it into the lightest day
- `"delay"` — requires `dayNumber` and `delayMinutes`; shifts that day's remaining stops later
- `"auto"` — runs every rule in sequence (used by the "Run full re-check" button)

Response includes `original`, `updated`, `changed`, `changes[]` (each with a
`day`, `type`, and a plain-English `reason`), and a recalculated `budgetSummary`.

---

## 4. Setup & run

### Prerequisites
- Node.js 18+ and npm

### Backend
```bash
cd server
npm install
cp .env.example .env
# Optional: add real keys to .env (OPENWEATHER_API_KEY, GEOAPIFY_API_KEY).
# The app runs perfectly fine with these left blank — it uses mock data.
npm run dev        # http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev         # http://localhost:5173
```

Open **http://localhost:5173**. The Vite dev server proxies `/api/*` requests
to `http://localhost:5000`, so no CORS configuration is needed locally
(the backend also has `cors()` enabled regardless).

### Getting free API keys (optional — not required for the demo)
- OpenWeather: https://openweathermap.org/api (free tier, instant signup)
- Geoapify: https://www.geoapify.com/ (free tier, instant signup)

If a key is missing or a request fails for any reason (no internet during
judging, rate limit, etc.), the corresponding service **silently falls back
to mock data** — the demo never breaks.

---

## 5. Integration notes

- The frontend never talks to OpenWeather/Geoapify directly — it only calls
  its own backend, which is exactly why the keys are safe.
- The itinerary is **not stored server-side**. The browser holds the current
  itinerary in React state and sends it back with every `/replan` call. This
  keeps the backend stateless and trivial to scale/deploy for a hackathon,
  at the cost of not persisting across a page refresh — acceptable for an
  MVP demo. (If you want persistence, the natural next step is to add a
  MongoDB `trips` collection and an itinerary `id` you fetch/save by.)
- Every place object carries its own `lat`/`lon`, `openHour`/`closeHour`,
  `avgCost`, and `avgVisitMinutes` — this is the shared vocabulary between
  the generator, the rule engine, and the UI, so no field ever needs
  re-deriving on the frontend.
