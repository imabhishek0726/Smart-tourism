import { haversineKm } from "../utils/distance.js";
import { addMinutes, isOpenDuring, MAX_ACCEPTABLE_TRAVEL_MINUTES } from "../utils/travelTime.js";
import { calculateBudget, stopCost } from "../utils/budget.js";

const OUTDOOR_UNSAFE_CATEGORIES = ["adventure", "nature"];

/**
 * Every rule has the same shape:
 *   (itineraryDays, context) => { changed, itineraryDays, changes: [] }
 * context = { places, usedIds, weatherForecast, people, budget, trigger }
 * `changes` entries: { day, type, reason, before, after }
 */

export function applyWeatherRule(itineraryDays, context) {
  const { weatherForecast = [] } = context;
  const changes = [];

  const updated = itineraryDays.map((day) => {
    const dayWeather = weatherForecast.find((w) => w.day === day.day);
    if (!dayWeather?.rain) return day;

    const newStops = day.stops.map((stop) => {
      const isOutdoorRisky =
        !stop.indoor && OUTDOOR_UNSAFE_CATEGORIES.includes(stop.category);
      if (!isOutdoorRisky) return stop;

      const alt = findAlternative(stop, context, { preferIndoor: true });
      if (!alt) return stop;

      changes.push({
        day: day.day,
        type: "weather",
        reason: `Heavy rain forecast on Day ${day.day} (${dayWeather.description}). "${stop.name}" is an outdoor activity, so it was swapped for an indoor alternative.`,
        before: stop.name,
        after: alt.name,
      });

      return { ...alt, startTime: stop.startTime, endTime: recalcEnd(stop.startTime, alt.avgVisitMinutes) };
    });

    return { ...day, stops: newStops };
  });

  return { changed: changes.length > 0, itineraryDays: updated, changes };
}

export function applyClosureRule(itineraryDays, context) {
  const { trigger } = context;
  const closedId = trigger?.closedPlaceId;
  if (!closedId) return { changed: false, itineraryDays, changes: [] };

  const changes = [];
  const updated = itineraryDays.map((day) => {
    const newStops = day.stops.map((stop) => {
      if (stop.id !== closedId) return stop;

      const alt = findAlternative(stop, context, {});
      if (!alt) return stop;

      changes.push({
        day: day.day,
        type: "closure",
        reason: `"${stop.name}" is closed today, so it was replaced with "${alt.name}".`,
        before: stop.name,
        after: alt.name,
      });

      return { ...alt, startTime: stop.startTime, endTime: recalcEnd(stop.startTime, alt.avgVisitMinutes) };
    });
    return { ...day, stops: newStops };
  });

  return { changed: changes.length > 0, itineraryDays: updated, changes };
}

export function applyOpeningHoursRule(itineraryDays) {
  const changes = [];
  const updated = itineraryDays.map((day) => {
    let shiftedDay = false;
    const newStops = day.stops.map((stop) => {
      if (isOpenDuring(stop, stop.startTime, stop.avgVisitMinutes)) return stop;

      const newStart = `${String(stop.openHour).padStart(2, "0")}:00`;
      const newEnd = recalcEnd(newStart, stop.avgVisitMinutes);
      shiftedDay = true;

      changes.push({
        day: day.day,
        type: "opening-hours",
        reason: `"${stop.name}" is only open from ${stop.openHour}:00–${stop.closeHour}:00, so its visit time was moved from ${stop.startTime} to ${newStart}.`,
        before: `${stop.name} at ${stop.startTime}`,
        after: `${stop.name} at ${newStart}`,
      });

      return { ...stop, startTime: newStart, endTime: newEnd };
    });

    return shiftedDay ? { ...day, stops: resequence(newStops) } : day;
  });

  return { changed: changes.length > 0, itineraryDays: updated, changes };
}

export function applyTravelTimeRule(itineraryDays, context) {
  const changes = [];
  const updated = itineraryDays.map((day) => {
    if (day.stops.length < 2) return day;

    // detect any consecutive pair exceeding the acceptable travel threshold
    let hasLongHop = false;
    for (let i = 0; i < day.stops.length - 1; i++) {
      const distKm = haversineKm(day.stops[i], day.stops[i + 1]);
      const estMinutes = Math.round((distKm / 25) * 60); // mountain-road estimate
      if (estMinutes > MAX_ACCEPTABLE_TRAVEL_MINUTES) {
        hasLongHop = true;
        break;
      }
    }
    if (!hasLongHop) return day;

    const reordered = nearestNeighborOrder(day.stops);
    const rescheduled = resequence(reordered);

    changes.push({
      day: day.day,
      type: "travel-time",
      reason: `Travel time between stops on Day ${day.day} exceeded ${MAX_ACCEPTABLE_TRAVEL_MINUTES} minutes, so nearby stops were reordered to cut down on backtracking.`,
      before: day.stops.map((s) => s.name).join(" → "),
      after: rescheduled.map((s) => s.name).join(" → "),
    });

    return { ...day, stops: rescheduled };
  });

  return { changed: changes.length > 0, itineraryDays: updated, changes };
}

export function applyBudgetRule(itineraryDays, context) {
  const { people, budget } = context;
  let working = itineraryDays.map((d) => ({ ...d, stops: [...d.stops] }));
  const changes = [];

  let summary = calculateBudget(working, people, budget);
  let guard = 0;

  while (summary.exceeded && guard < 10) {
    guard++;
    const { dayIdx, stopIdx, stop } = findMostExpensiveStop(working);
    if (!stop) break;

    const alt = findAlternative(stop, { ...context, requireCheaper: true }, { maxCost: stop.avgCost });
    if (!alt) break;

    changes.push({
      day: working[dayIdx].day,
      type: "budget",
      reason: `Estimated cost exceeded the ₹${budget.toLocaleString("en-IN")} budget, so "${stop.name}" (₹${stopCost(stop, people).toLocaleString("en-IN")}) was swapped for the more affordable "${alt.name}" (₹${stopCost(alt, people).toLocaleString("en-IN")}).`,
      before: stop.name,
      after: alt.name,
    });

    working[dayIdx].stops[stopIdx] = {
      ...alt,
      startTime: stop.startTime,
      endTime: recalcEnd(stop.startTime, alt.avgVisitMinutes),
    };

    summary = calculateBudget(working, people, budget);
  }

  return { changed: changes.length > 0, itineraryDays: working, changes, budgetSummary: summary };
}

export function applyAddPlaceRule(itineraryDays, context) {
  const { trigger } = context;
  const newPlace = trigger?.newPlace;
  if (!newPlace) return { changed: false, itineraryDays, changes: [] };

  // insert into the day with the fewest stops (simple, explainable heuristic)
  let targetIdx = 0;
  itineraryDays.forEach((d, idx) => {
    if (d.stops.length < itineraryDays[targetIdx].stops.length) targetIdx = idx;
  });

  const updated = itineraryDays.map((d, idx) => {
    if (idx !== targetIdx) return d;
    const stops = resequence([...d.stops, { ...newPlace }]);
    return { ...d, stops };
  });

  return {
    changed: true,
    itineraryDays: updated,
    changes: [
      {
        day: updated[targetIdx].day,
        type: "add-place",
        reason: `"${newPlace.name}" was added to Day ${updated[targetIdx].day} — the day with the most open time — and the schedule was recalculated.`,
        before: "—",
        after: newPlace.name,
      },
    ],
  };
}

export function applyDelayRule(itineraryDays, context) {
  const { trigger } = context;
  const { dayNumber, delayMinutes } = trigger || {};
  if (!dayNumber || !delayMinutes) return { changed: false, itineraryDays, changes: [] };

  const changes = [];
  const updated = itineraryDays.map((day) => {
    if (day.day !== dayNumber) return day;

    const shifted = day.stops.map((stop, idx) => {
      if (idx === 0) {
        const newStart = addMinutes(stop.startTime, delayMinutes);
        return { ...stop, startTime: newStart, endTime: recalcEnd(newStart, stop.avgVisitMinutes) };
      }
      return stop;
    });
    const rescheduled = resequence(shifted);

    changes.push({
      day: day.day,
      type: "delay",
      reason: `A ${delayMinutes}-minute delay was reported on Day ${day.day}, so all following stops were shifted later.`,
      before: day.stops.map((s) => `${s.name} @ ${s.startTime}`).join(", "),
      after: rescheduled.map((s) => `${s.name} @ ${s.startTime}`).join(", "),
    });

    return { ...day, stops: rescheduled };
  });

  return { changed: changes.length > 0, itineraryDays: updated, changes };
}

// ---------- shared helpers ----------

function recalcEnd(startTime, durationMin) {
  return addMinutes(startTime, durationMin);
}

function resequence(stops) {
  let currentTime = stops[0]?.startTime || "09:00";
  return stops.map((stop, idx) => {
    const startTime = idx === 0 ? currentTime : currentTime;
    const endTime = addMinutes(startTime, stop.avgVisitMinutes);
    currentTime = addMinutes(endTime, idx < stops.length - 1 ? 30 : 0);
    return { ...stop, startTime, endTime };
  });
}

function nearestNeighborOrder(stops) {
  const remaining = [...stops];
  const ordered = [remaining.shift()];
  while (remaining.length) {
    const last = ordered[ordered.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((s, idx) => {
      const dist = haversineKm(last, s);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });
    ordered.push(remaining.splice(nearestIdx, 1)[0]);
  }
  return ordered;
}

function findMostExpensiveStop(days) {
  let result = { dayIdx: -1, stopIdx: -1, stop: null };
  let maxCost = -1;
  days.forEach((day, dayIdx) => {
    day.stops.forEach((stop, stopIdx) => {
      if ((stop.avgCost || 0) > maxCost) {
        maxCost = stop.avgCost || 0;
        result = { dayIdx, stopIdx, stop };
      }
    });
  });
  return result;
}

function findAlternative(stop, context, { preferIndoor, maxCost } = {}) {
  const { places = [], usedIds = new Set() } = context;

  const baseFilter = (p) => {
    if (p.id === stop.id) return false;
    if (usedIds.has(p.id)) return false;
    if (preferIndoor && !p.indoor) return false;
    if (typeof maxCost === "number" && (p.avgCost || 0) >= maxCost) return false;
    return true;
  };

  // Pass 1: same category or overlapping interest tags (best match).
  let candidates = places.filter(
    (p) => baseFilter(p) && (p.category === stop.category || p.tags?.some((t) => stop.tags?.includes(t)))
  );

  // Pass 2: relaxed fallback — e.g. any unused indoor place as a rain backup,
  // even if it doesn't match the original activity's category/interests.
  if (!candidates.length) {
    candidates = places.filter(baseFilter);
  }

  if (!candidates.length) return null;

  candidates.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const chosen = candidates[0];
  usedIds.add(chosen.id);
  return chosen;
}
