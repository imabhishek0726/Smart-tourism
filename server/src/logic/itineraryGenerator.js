import { haversineKm } from "../utils/distance.js";
import { addMinutes } from "../utils/travelTime.js";

const DAY_START = "09:00";
const STOPS_PER_DAY = 3;

/**
 * Builds an initial day-wise itinerary using a simple greedy rule:
 * - pick highest-rated places matching interests first
 * - within a day, order stops by nearest-neighbor to minimize backtracking
 * - assign sequential time slots respecting each place's average visit duration
 *
 * This is intentionally rule-based (not ML) so it's fast, explainable, and
 * has no external dependency at generation time.
 */
export function generateItinerary({ days, people, interests = [] }, places) {
  const pool = rankPlaces(places, interests);
  const used = new Set();
  const itineraryDays = [];

  for (let d = 1; d <= days; d++) {
    const dayPlaces = pickStopsForDay(pool, used, STOPS_PER_DAY);
    const ordered = orderByProximity(dayPlaces);
    const stops = scheduleStops(ordered);

    itineraryDays.push({
      day: d,
      stops,
    });
  }

  return { days: itineraryDays };
}

function rankPlaces(places, interests) {
  return [...places].sort((a, b) => {
    const aMatch = interests.some((i) => a.tags?.includes(i)) ? 1 : 0;
    const bMatch = interests.some((i) => b.tags?.includes(i)) ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return (b.rating || 0) - (a.rating || 0);
  });
}

function pickStopsForDay(pool, used, count) {
  const picked = [];
  for (const place of pool) {
    if (picked.length >= count) break;
    if (used.has(place.id)) continue;
    picked.push(place);
    used.add(place.id);
  }
  return picked;
}

function orderByProximity(places) {
  if (places.length <= 1) return places;
  const remaining = [...places];
  const ordered = [remaining.shift()];

  while (remaining.length) {
    const last = ordered[ordered.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((p, idx) => {
      const dist = haversineKm(last, p);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });
    ordered.push(remaining.splice(nearestIdx, 1)[0]);
  }
  return ordered;
}

function scheduleStops(orderedPlaces) {
  let currentTime = DAY_START;
  return orderedPlaces.map((place, idx) => {
    const startTime = currentTime;
    const endTime = addMinutes(startTime, place.avgVisitMinutes);
    // simple fixed travel buffer between stops; refined later by routingService
    currentTime = addMinutes(endTime, idx < orderedPlaces.length - 1 ? 30 : 0);

    return {
      ...place,
      startTime,
      endTime,
    };
  });
}
