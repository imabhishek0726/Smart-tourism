import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateBudget } from './budget.js';

test('sample Manali itinerary stays within a ₹20,000 trip budget', () => {
  const itineraryDays = [
    { day: 1, stops: [{ avgCost: 1500 }, { avgCost: 800 }] },
    { day: 2, stops: [{ avgCost: 400 }, { avgCost: 200 }] },
    { day: 3, stops: [{ avgCost: 100 }, { avgCost: 50 }] },
  ];

  const summary = calculateBudget(itineraryDays, 4, 22000);

  assert.equal(summary.exceeded, false);
  assert.equal(summary.totalEstimated, 21800);
  assert.equal(summary.remaining, 200);
});
