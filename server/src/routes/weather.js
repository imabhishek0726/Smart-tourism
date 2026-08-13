import { Router } from "express";
import { fetchWeather } from "../services/weatherService.js";

const router = Router();

// GET /api/weather?destination=Manali&days=3
router.get("/", async (req, res) => {
  try {
    const { destination, days } = req.query;
    if (!destination) {
      return res.status(400).json({ error: "destination query param is required." });
    }
    const result = await fetchWeather(destination, Number(days) || 3);
    res.json(result);
  } catch (err) {
    console.error("[GET /weather]", err);
    res.status(500).json({ error: "Failed to fetch weather." });
  }
});

export default router;
