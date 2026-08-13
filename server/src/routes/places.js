import { Router } from "express";
import { fetchPlaces } from "../services/placesService.js";

const router = Router();

// GET /api/places?destination=Manali&interests=nature,food
router.get("/", async (req, res) => {
  try {
    const { destination, interests } = req.query;
    if (!destination) {
      return res.status(400).json({ error: "destination query param is required." });
    }
    const interestList = interests ? interests.split(",") : [];
    const result = await fetchPlaces(destination, interestList);
    res.json(result);
  } catch (err) {
    console.error("[GET /places]", err);
    res.status(500).json({ error: "Failed to fetch places." });
  }
});

export default router;
