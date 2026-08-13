import "dotenv/config";
import express from "express";
import cors from "cors";

import itineraryRoutes from "./routes/itinerary.js";
import placesRoutes from "./routes/places.js";
import weatherRoutes from "./routes/weather.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://smart-tourism-beta.vercel.app'
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "smart-tourism-server" });
});

app.use("/api/itinerary", itineraryRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/weather", weatherRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Smart Tourism server running on http://localhost:${PORT}`);
});
