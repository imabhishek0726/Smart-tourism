import "dotenv/config";
import express from "express";
import cors from "cors";

import itineraryRoutes from "./routes/itinerary.js";
import placesRoutes from "./routes/places.js";
import weatherRoutes from "./routes/weather.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests that don't send an Origin header
      // (curl, Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);  
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
