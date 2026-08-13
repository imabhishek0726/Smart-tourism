import { useState } from "react";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import TripPlanner from "./pages/TripPlanner.jsx";

export default function App() {
  const [view, setView] = useState("home"); // "home" | "planner"

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigateHome={() => setView("home")} />
      <main className="flex-1">
        {view === "home" ? (
          <Home onStart={() => setView("planner")} />
        ) : (
          <TripPlanner />
        )}
      </main>
      <footer className="border-t border-spruce-100 py-6">
        <div className="max-w-6xl mx-auto px-6 text-xs text-spruce-400 font-mono">
          Trailshift — built for the Smart Tourism hackathon track.
        </div>
      </footer>
    </div>
  );
}
