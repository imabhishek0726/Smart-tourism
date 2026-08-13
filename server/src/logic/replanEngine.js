import {
  applyWeatherRule,
  applyClosureRule,
  applyOpeningHoursRule,
  applyTravelTimeRule,
  applyBudgetRule,
  applyAddPlaceRule,
  applyDelayRule,
} from "./rules.js";

/**
 * Runs the relevant rules for a given trigger type against the current
 * itinerary and returns the updated itinerary plus a human-readable diff.
 *
 * trigger.type is one of:
 *   "weather" | "closure" | "travel-time" | "budget" | "add-place" | "delay" | "auto"
 * "auto" runs every rule in a sensible order (used for a general "re-check" button).
 */
export function replanItinerary({ itineraryDays, places, weatherForecast, people, budget, trigger }) {
  const usedIds = new Set(
    itineraryDays.flatMap((d) => d.stops.map((s) => s.id))
  );

  const context = { places, usedIds, weatherForecast, people, budget, trigger };

  const pipeline = selectPipeline(trigger?.type);

  let current = itineraryDays;
  const allChanges = [];
  let budgetSummary = null;

  for (const rule of pipeline) {
    const result = rule(current, context);
    current = result.itineraryDays;
    if (result.changes?.length) allChanges.push(...result.changes);
    if (result.budgetSummary) budgetSummary = result.budgetSummary;
  }

  return {
    original: itineraryDays,
    updated: current,
    changed: allChanges.length > 0,
    changes: allChanges,
    budgetSummary,
  };
}

function selectPipeline(triggerType) {
  switch (triggerType) {
    case "weather":
      return [applyWeatherRule, applyOpeningHoursRule];
    case "closure":
      return [applyClosureRule, applyOpeningHoursRule];
    case "travel-time":
      return [applyTravelTimeRule];
    case "budget":
      return [applyBudgetRule];
    case "add-place":
      return [applyAddPlaceRule, applyOpeningHoursRule];
    case "delay":
      return [applyDelayRule];
    case "auto":
    default:
      return [
        applyWeatherRule,
        applyClosureRule,
        applyOpeningHoursRule,
        applyTravelTimeRule,
        applyBudgetRule,
      ];
  }
}
