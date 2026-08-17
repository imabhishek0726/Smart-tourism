import test from "node:test";
import assert from "node:assert/strict";

import {
  applyWeatherRule,
  applyClosureRule,
  applyOpeningHoursRule,
  applyBudgetRule,
  applyAddPlaceRule,
  applyDelayRule,
} from "../logic/rules.js";

function place(overrides = {}) {
  return {
    id: "p1",
    name: "Test Place",
    category: "nature",
    tags: ["nature"],
    indoor: false,
    openHour: 8,
    closeHour: 20,
    avgCost: 100,
    avgVisitMinutes: 60,
    rating: 4,
    lat: 32.24,
    lon: 77.17,
    startTime: "09:00",
    endTime: "10:00",
    ...overrides,
  };
}

function day(stops) {
  return {
    day: 1,
    stops,
  };
}

test("weather rule swaps an outdoor place during rain", () => {
  const outdoor = place({
    id: "p1",
    name: "Outdoor Trek",
    category: "nature",
    indoor: false,
  });

  const indoor = place({
    id: "p2",
    name: "Indoor Museum",
    category: "culture",
    indoor: true,
    tags: ["culture"],
  });

  const result = applyWeatherRule(
    [day([outdoor])],
    {
      weatherForecast: [
        {
          day: 1,
          rain: true,
          description: "Heavy rain",
        },
      ],
      places: [outdoor, indoor],
      usedIds: new Set(["p1"]),
    }
  );

  assert.equal(result.changed, true);
  assert.equal(result.itineraryDays[0].stops[0].name, "Indoor Museum");
});

test("weather rule does nothing when there is no rain", () => {
  const outdoor = place();

  const result = applyWeatherRule(
    [day([outdoor])],
    {
      weatherForecast: [
        {
          day: 1,
          rain: false,
          description: "Clear",
        },
      ],
      places: [outdoor],
      usedIds: new Set(["p1"]),
    }
  );

  assert.equal(result.changed, false);
  assert.equal(result.itineraryDays[0].stops[0].id, "p1");
});

test("closure rule replaces a closed place", () => {
  const closed = place({
    id: "p1",
    name: "Closed Place",
  });

  const alternative = place({
    id: "p2",
    name: "Alternative Place",
    category: "nature",
  });

  const result = applyClosureRule(
    [day([closed])],
    {
      trigger: {
        type: "closure",
        closedPlaceId: "p1",
      },
      places: [closed, alternative],
      usedIds: new Set(["p1"]),
    }
  );

  assert.equal(result.changed, true);
  assert.equal(result.itineraryDays[0].stops[0].name, "Alternative Place");
});

test("closure rule does nothing without a closed place id", () => {
  const result = applyClosureRule(
    [day([place()])],
    {
      trigger: {
        type: "closure",
      },
      places: [],
      usedIds: new Set(),
    }
  );

  assert.equal(result.changed, false);
});

test("opening-hours rule moves a visit into opening hours", () => {
  const closedNow = place({
    startTime: "06:00",
    endTime: "07:00",
    openHour: 9,
    closeHour: 18,
    avgVisitMinutes: 60,
  });

  const result = applyOpeningHoursRule([day([closedNow])]);

  assert.equal(result.changed, true);
  assert.equal(result.itineraryDays[0].stops[0].startTime, "09:00");
});

test("opening-hours rule leaves an already valid visit unchanged", () => {
  const openNow = place({
    startTime: "10:00",
    endTime: "11:00",
    openHour: 9,
    closeHour: 18,
  });

  const result = applyOpeningHoursRule([day([openNow])]);

  assert.equal(result.changed, false);
  assert.equal(result.itineraryDays[0].stops[0].startTime, "10:00");
});

test("budget rule replaces an expensive place with a cheaper alternative", () => {
  const expensive = place({
    id: "p1",
    name: "Expensive Place",
    avgCost: 5000,
  });

  const cheap = place({
    id: "p2",
    name: "Cheap Place",
    avgCost: 50,
  });

  const result = applyBudgetRule(
    [day([expensive])],
    {
      people: 1,
      budget: 1000,
      places: [expensive, cheap],
      usedIds: new Set(["p1"]),
    }
  );

  assert.equal(result.changed, true);
  assert.equal(result.itineraryDays[0].stops[0].name, "Cheap Place");
});

test("budget rule does not change an itinerary already within budget", () => {
  const cheap = place({
    avgCost: 10,
  });

  const result = applyBudgetRule(
    [day([cheap])],
    {
      people: 1,
      budget: 10000,
      places: [cheap],
      usedIds: new Set(["p1"]),
    }
  );

  assert.equal(result.changed, false);
});

test("add-place rule adds the new place", () => {
  const existing = place({
    id: "p1",
    name: "Existing Place",
  });

  const newPlace = place({
    id: "p2",
    name: "New Place",
  });

  const result = applyAddPlaceRule(
    [day([existing])],
    {
      trigger: {
        type: "add-place",
        newPlace,
      },
    }
  );

  assert.equal(result.changed, true);
  assert.equal(result.itineraryDays[0].stops.length, 2);
  assert.ok(
    result.itineraryDays[0].stops.some(
      (stop) => stop.id === "p2"
    )
  );
});

test("add-place rule does nothing without a new place", () => {
  const result = applyAddPlaceRule(
    [day([place()])],
    {
      trigger: {
        type: "add-place",
      },
    }
  );

  assert.equal(result.changed, false);
});

test("delay rule shifts the first stop", () => {
  const first = place({
    id: "p1",
    startTime: "09:00",
    endTime: "10:00",
  });

  const second = place({
    id: "p2",
    startTime: "10:30",
    endTime: "11:30",
  });

  const result = applyDelayRule(
    [day([first, second])],
    {
      trigger: {
        type: "delay",
        dayNumber: 1,
        delayMinutes: 30,
      },
    }
  );

  assert.equal(result.changed, true);
  assert.equal(result.itineraryDays[0].stops[0].startTime, "09:30");
});

test("delay rule does nothing for another day", () => {
  const result = applyDelayRule(
    [day([place()])],
    {
      trigger: {
        type: "delay",
        dayNumber: 2,
        delayMinutes: 30,
      },
    }
  );

  assert.equal(result.changed, false);
});

test("delay rule does nothing without delay information", () => {
  const result = applyDelayRule(
    [day([place()])],
    {
      trigger: {
        type: "delay",
      },
    }
  );

  assert.equal(result.changed, false);
});