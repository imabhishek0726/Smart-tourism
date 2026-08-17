import axios from "axios";
import { mockPlaces } from "../data/mockPlaces.js";

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
const GEOCODE_URL = "https://api.geoapify.com/v1/geocode/search";
const PLACES_URL = "https://api.geoapify.com/v2/places";

// Maps our simple interest tags to Geoapify place categories.
const CATEGORY_MAP = {
  nature: "natural,leisure.park",
  adventure: "sport,leisure",
  food: "catering.restaurant,catering.cafe",
  culture: "tourism.sights,entertainment.museum",
};

/**
 * Returns a list of candidate places for a destination + interests.
 * Falls back to mock data if no API key is configured or the request fails.
 */
export async function fetchPlaces(destination, interests = []) {
  if (!GEOAPIFY_API_KEY) {
    return { source: "mock", places: filterMockPlaces(interests) };
  }

  try {
    const geoRes = await axios.get(GEOCODE_URL, {
      params: { text: destination, apiKey: GEOAPIFY_API_KEY, limit: 1 },
      timeout: 5000,
    });

    const feature = geoRes.data?.features?.[0];
    if (!feature) return { source: "mock", places: filterMockPlaces(interests) };

    const [lon, lat] = feature.geometry.coordinates;
    const categories = interests
      .map((i) => CATEGORY_MAP[i])
      .filter(Boolean)
      .join(",") || "tourism.sights";

    const placesRes = await axios.get(PLACES_URL, {
      params: {
        categories,
        filter: `circle:${lon},${lat},15000`,
        bias: `proximity:${lon},${lat}`,
        limit: 20,
        apiKey: GEOAPIFY_API_KEY,
      },
      timeout: 5000,
    });

    const places = (placesRes.data?.features || []).map((f, idx) => ({
      id: f.properties.place_id || `live-${idx}`,
      name: f.properties.name || "Unnamed place",
      category: guessCategory(f.properties.categories),
      tags: interests,
      indoor: !(f.properties.categories || []).includes("natural"),
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      openHour: 9,
      closeHour: 18,
      avgCost: 200,
      avgVisitMinutes: 90,
      rating: 4.0,
      estimatedFields: [
  "openHour",
  "closeHour",
  "avgCost",
  "avgVisitMinutes",
  "rating",
],
      description: f.properties.address_line2 || "",
    }));

    return places.length
      ? { source: "live", places }
      : { source: "mock", places: filterMockPlaces(interests) };
  } catch (err) {
    console.warn("[placesService] Falling back to mock data:", err.message);
    return { source: "mock", places: filterMockPlaces(interests) };
  }
}

function guessCategory(categories = []) {
  if (categories.some((c) => c.includes("catering"))) return "food";
  if (categories.some((c) => c.includes("natural") || c.includes("leisure"))) return "nature";
  if (categories.some((c) => c.includes("sport"))) return "adventure";
  return "culture";
}

// Always return the full catalog (not just interest matches). Interest-based
// ranking happens later in the itinerary generator — but the *full* pool
// needs to stay available here so the re-plan engine always has fallback
// options (e.g. an indoor museum as a rain backup) even if it wasn't in the
// traveler's stated interests.
function filterMockPlaces() {
  return mockPlaces;
}
