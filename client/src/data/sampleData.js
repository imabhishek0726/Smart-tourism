// Used only if the backend is completely unreachable, so the UI still has
// something to show during a demo. The backend's own mock fallback is the
// primary safety net (see server/src/data/); this is a last-resort mirror.

export const sampleGenerateResponse = {
  destination: "Manali",
  days: 3,
  people: 4,
  budget: 20000,
  interests: ["nature", "food", "adventure"],
  weatherSource: "mock",
  weather: [
    { day: 1, condition: "Clear", tempC: 18, rain: false, description: "Clear skies, good for outdoor activities" },
    { day: 2, condition: "Heavy Rain", tempC: 12, rain: true, description: "Heavy rain expected through the afternoon" },
    { day: 3, condition: "Partly Cloudy", tempC: 16, rain: false, description: "Partly cloudy, mild chance of light showers" },
  ],
  placesSource: "mock",
  places: [],
  itinerary: [
    {
      day: 1,
      stops: [
        { id: "p6", name: "Rohtang Pass Day Trip", category: "adventure", tags: ["adventure", "nature"], indoor: false, lat: 32.3719, lon: 77.2492, openHour: 7, closeHour: 16, avgCost: 1500, avgVisitMinutes: 300, rating: 4.7, description: "High-altitude mountain pass, weather dependent.", startTime: "09:00", endTime: "14:00" },
        { id: "p2", name: "Solang Valley", category: "adventure", tags: ["adventure", "nature"], indoor: false, lat: 32.3175, lon: 77.1548, openHour: 8, closeHour: 17, avgCost: 800, avgVisitMinutes: 180, rating: 4.6, description: "Paragliding, zorbing and cable car rides.", startTime: "14:30", endTime: "17:30" },
      ],
    },
    {
      day: 2,
      stops: [
        { id: "p3", name: "Old Manali Cafes", category: "food", tags: ["food", "culture"], indoor: true, lat: 32.2497, lon: 77.1737, openHour: 9, closeHour: 23, avgCost: 400, avgVisitMinutes: 90, rating: 4.4, description: "Riverside cafes with local and international food.", startTime: "09:00", endTime: "10:30" },
        { id: "p9", name: "Great Himalayan National Park Viewpoint", category: "nature", tags: ["nature", "adventure"], indoor: false, lat: 32.15, lon: 77.35, openHour: 7, closeHour: 17, avgCost: 200, avgVisitMinutes: 150, rating: 4.4, description: "Scenic viewpoint and light trekking trail.", startTime: "11:00", endTime: "13:30" },
      ],
    },
    {
      day: 3,
      stops: [
        { id: "p4", name: "Manali Sanctuary Nature Walk", category: "nature", tags: ["nature"], indoor: false, lat: 32.2599, lon: 77.1719, openHour: 7, closeHour: 18, avgCost: 100, avgVisitMinutes: 90, rating: 4.2, description: "Forest trail along the Beas river.", startTime: "09:00", endTime: "10:30" },
        { id: "p5", name: "Vashisht Hot Springs & Temple", category: "culture", tags: ["culture", "nature"], indoor: true, lat: 32.2617, lon: 77.1892, openHour: 6, closeHour: 20, avgCost: 50, avgVisitMinutes: 60, rating: 4.1, description: "Natural hot springs beside an old stone temple.", startTime: "11:00", endTime: "12:00" },
      ],
    },
  ],
  budgetSummary: {
    activityCost: 10400,
    foodCost: 6000,
    stayCost: 9600,
    localTravelCost: 900,
    totalEstimated: 26900,
    totalBudget: 20000,
    remaining: -6900,
    exceeded: true,
  },
};
