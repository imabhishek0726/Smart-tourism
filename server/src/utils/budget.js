/**
 * Computes a budget breakdown for a generated itinerary.
 * activityCost = sum of avgCost * people for every stop.
 * Food/stay are rough per-day-per-person estimates kept deliberately modest so
 * the default demo budget stays realistic and does not falsely flag every trip as
 * over budget.
 */
export function calculateBudget(itineraryDays, people, totalBudget) {
  let activityCost = 0;
  for (const day of itineraryDays) {
    for (const stop of day.stops) {
      activityCost += (stop.avgCost || 0) * people;
    }
  }

  const days = itineraryDays.length;
  const foodCost = days * people * 250; // ₹250/person/day estimate
  const stayCost = days * people * 500; // ₹500/person/day estimate
  const localTravelCost = days * 200; // flat estimate per day

  const totalEstimated = activityCost + foodCost + stayCost + localTravelCost;

  return {
    activityCost,
    foodCost,
    stayCost,
    localTravelCost,
    totalEstimated,
    totalBudget,
    remaining: totalBudget - totalEstimated,
    exceeded: totalEstimated > totalBudget,
  };
}

/** Cost of a single stop for `people` travelers. */
export function stopCost(stop, people) {
  return (stop.avgCost || 0) * people;
}
