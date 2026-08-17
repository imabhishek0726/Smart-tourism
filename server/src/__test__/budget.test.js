import test from "node:test";
import assert from "node:assert/strict";

import { calculateBudget, stopCost } from "../utils/budget.js";

const makeStop = (avgCost) => ({
  id: "p1",
  name: "Test Place",
  avgCost,
  avgVisitMinutes: 60,
});

const makeDays = (stops = []) => [
  {
    day: 1,
    stops,
  },
];

test("calculateBudget returns zero activity cost for empty itinerary", () => {
  const result = calculateBudget([], 2, 10000);

  assert.equal(result.activityCost, 0);
  assert.equal(result.totalEstimated, 0);
});

test("calculateBudget calculates activity cost correctly", () => {
  const itinerary = [
    {
      day: 1,
      stops: [makeStop(200), makeStop(300)],
    },
  ];

  const result = calculateBudget(itinerary, 2, 10000);

  assert.equal(result.activityCost, 1000);
});

test("calculateBudget calculates food cost", () => {
  const result = calculateBudget(makeDays(), 3, 10000);

  assert.equal(result.foodCost, 750);
});

test("calculateBudget calculates stay cost", () => {
  const result = calculateBudget(makeDays(), 3, 10000);

  assert.equal(result.stayCost, 1500);
});

test("calculateBudget calculates local travel cost", () => {
  const itinerary = [
    { day: 1, stops: [] },
    { day: 2, stops: [] },
  ];

  const result = calculateBudget(itinerary, 2, 10000);

  assert.equal(result.localTravelCost, 400);
});

test("calculateBudget calculates remaining budget and exceeded status", () => {
  const result = calculateBudget(makeDays(), 1, 1000);

  assert.equal(result.totalEstimated, 950);
  assert.equal(result.remaining, 50);
  assert.equal(result.exceeded, false);
});

test("stopCost calculates the cost for multiple people", () => {
  const stop = makeStop(500);

  assert.equal(stopCost(stop, 4), 2000);
});