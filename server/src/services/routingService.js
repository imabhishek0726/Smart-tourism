import axios from "axios";

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
const ROUTING_URL = "https://api.geoapify.com/v1/routing";

/**
 * Returns estimated travel time in minutes between two lat/lon points.
 * Falls back to a haversine-distance estimate (assuming ~30km/h hill roads)
 * if no API key is set or the request fails.
 */
export async function getTravelTimeMinutes(from, to) {
  if (!GEOAPIFY_API_KEY) return haversineEstimate(from, to);

  try {
    const res = await axios.get(ROUTING_URL, {
      params: {
        waypoints: `${from.lat},${from.lon}|${to.lat},${to.lon}`,
        mode: "drive",
        apiKey: GEOAPIFY_API_KEY,
      },
      timeout: 5000,
    });

    const seconds = res.data?.features?.[0]?.properties?.time;
    if (typeof seconds === "number") return Math.round(seconds / 60);
    return haversineEstimate(from, to);
  } catch (err) {
    console.warn("[routingService] Falling back to distance estimate:", err.message);
    return haversineEstimate(from, to);
  }
}

function haversineEstimate(from, to) {
  const R = 6371; // km
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const avgSpeedKmh = 25; // mountain roads are slow
  return Math.max(5, Math.round((distanceKm / avgSpeedKmh) * 60));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
