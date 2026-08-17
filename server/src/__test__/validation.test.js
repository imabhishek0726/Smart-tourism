import test from "node:test";
import assert from "node:assert/strict";

import {
  validateGenerateBody,
  validateReplanBody,
} from "../utils/validation.js";

test("valid generate body passes", () => {
  const result = validateGenerateBody({
    destination: "Manali",
    days: 5,
    people: 2,
    budget: 20000,
    interests: ["nature", "food"],
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("generate rejects empty destination", () => {
  const result = validateGenerateBody({
    destination: "",
    days: 5,
    people: 2,
    budget: 20000,
  });

  assert.equal(result.valid, false);
});

test("generate rejects invalid days", () => {
  const result = validateGenerateBody({
    destination: "Manali",
    days: 15,
    people: 2,
    budget: 20000,
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("days")));
});

test("generate rejects invalid people count", () => {
  const result = validateGenerateBody({
    destination: "Manali",
    days: 5,
    people: 21,
    budget: 20000,
  });

  assert.equal(result.valid, false);
});

test("generate rejects invalid budget", () => {
  const result = validateGenerateBody({
    destination: "Manali",
    days: 5,
    people: 2,
    budget: "abc",
  });

  assert.equal(result.valid, false);
});

test("generate rejects invalid interests", () => {
  const result = validateGenerateBody({
    destination: "Manali",
    days: 5,
    people: 2,
    budget: 20000,
    interests: ["shopping"],
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("invalid interests")));
});

test("valid replan body passes", () => {
  const result = validateReplanBody({
    itinerary: [],
    places: [],
    weather: [],
    people: 2,
    budget: 10000,
    trigger: {
      type: "auto",
    },
  });

  assert.equal(result.valid, true);
});

test("replan rejects non-array itinerary", () => {
  const result = validateReplanBody({
    itinerary: {},
    trigger: {
      type: "auto",
    },
  });

  assert.equal(result.valid, false);
});

test("replan rejects non-array places", () => {
  const result = validateReplanBody({
    itinerary: [],
    places: {},
    trigger: {
      type: "auto",
    },
  });

  assert.equal(result.valid, false);
});

test("replan rejects non-array weather", () => {
  const result = validateReplanBody({
    itinerary: [],
    weather: {},
    trigger: {
      type: "auto",
    },
  });

  assert.equal(result.valid, false);
});

test("replan rejects invalid people and budget", () => {
  const result = validateReplanBody({
    itinerary: [],
    people: 0,
    budget: -10,
    trigger: {
      type: "auto",
    },
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("people")));
  assert.ok(result.errors.some((e) => e.includes("budget")));
});

test("replan rejects invalid trigger type", () => {
  const result = validateReplanBody({
    itinerary: [],
    trigger: {
      type: "something-invalid",
    },
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("trigger.type")));
});

test("replan requires trigger-specific fields", () => {
  const closure = validateReplanBody({
    itinerary: [],
    trigger: {
      type: "closure",
    },
  });

  assert.equal(closure.valid, false);
  assert.ok(
    closure.errors.some((e) => e.includes("closedPlaceId"))
  );

  const addPlace = validateReplanBody({
    itinerary: [],
    trigger: {
      type: "add-place",
    },
  });

  assert.equal(addPlace.valid, false);

  const delay = validateReplanBody({
    itinerary: [],
    trigger: {
      type: "delay",
      dayNumber: 0,
      delayMinutes: -5,
    },
  });

  assert.equal(delay.valid, false);
});