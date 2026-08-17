import { Router } from "express";
import { fetchPlaces } from "../services/placesService.js";
import { fetchWeather } from "../services/weatherService.js";
import { generateItinerary } from "../logic/itineraryGenerator.js";
import { replanItinerary } from "../logic/replanEngine.js";
import { calculateBudget } from "../utils/budget.js";

import {
  validateGenerateBody,
  validateReplanBody,
} from "../utils/validation.js";
const router = Router();

// POST /api/itinerary/generate
router.post("/generate", async (req, res) => {
  try {
    const { destination, days, people, budget, interests } = req.body;

   const validation = validateGenerateBody(req.body);

if (!validation.valid) {
  return res.status(400).json({
    error: "Invalid request body.",
    details: validation.errors,
  });
}

    const [placesResult, weatherResult] = await Promise.all([
      fetchPlaces(destination, interests || []),
      fetchWeather(destination, Number(days)),
    ]);

    const itinerary = generateItinerary(
      { days: Number(days), people: Number(people), interests: interests || [] },
      placesResult.places
    );

    const budgetSummary = calculateBudget(itinerary.days, Number(people), Number(budget));

    res.json({
      destination,
      days: Number(days),
      people: Number(people),
      budget: Number(budget),
      interests: interests || [],
      itinerary: itinerary.days,
      weather: weatherResult.forecast,
      weatherSource: weatherResult.source,
      places: placesResult.places,
      placesSource: placesResult.source,
      budgetSummary,
    });
  } catch (err) {
    console.error("[POST /generate]", err);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
});

// POST /api/itinerary/replan
router.post("/replan", async (req, res) => {
  try {
    const { itinerary, places, weather, people, budget, trigger } = req.body;

   const validation = validateReplanBody(req.body);

if (!validation.valid) {
  return res.status(400).json({
    error: "Invalid request body.",
    details: validation.errors,
  });
}

    const result = await replanItinerary({
      itineraryDays: itinerary,
      places: places || [],
      weatherForecast: weather || [],
      people: Number(people) || 1,
      budget: Number(budget) || 0,
      trigger,
    });

    const budgetSummary =
      result.budgetSummary ||
      calculateBudget(result.updated, Number(people) || 1, Number(budget) || 0);

    res.json({
      original: result.original,
      updated: result.updated,
      changed: result.changed,
      changes: result.changes,
      budgetSummary,
    });
  } catch (err) {
    console.error("[POST /replan]", err);
    res.status(500).json({ error: "Failed to replan itinerary." });
  }
});

export default router;
