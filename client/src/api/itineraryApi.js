import axios from "axios";

// In dev, Vite proxies /api -> http://localhost:5000 (see vite.config.js).
const client = axios.create({ baseURL: import.meta.env.VITE_API_URL, });

export async function generateItinerary({ destination, days, people, budget, interests }) {
  const { data } = await client.post("/itinerary/generate", {
    destination,
    days,
    people,
    budget,
    interests,
  });
  return data;
}

/**
 * trigger examples:
 *  { type: "weather" }
 *  { type: "closure", closedPlaceId: "p2" }
 *  { type: "travel-time" }
 *  { type: "budget" }
 *  { type: "add-place", newPlace: {...} }
 *  { type: "delay", dayNumber: 1, delayMinutes: 90 }
 *  { type: "auto" }
 */
export async function replanItinerary({ itinerary, places, weather, people, budget, trigger }) {
  const { data } = await client.post("/itinerary/replan", {
    itinerary,
    places,
    weather,
    people,
    budget,
    trigger,
  });
  return data;
}

export async function fetchPlaces(destination, interests = []) {
  const { data } = await client.get("/places", {
    params: { destination, interests: interests.join(",") },
  });
  return data;
}

export async function fetchWeather(destination, days = 3) {
  const { data } = await client.get("/weather", {
    params: { destination, days },
  });
  return data;
}
