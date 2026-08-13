import { useState } from "react";
import TripForm from "../components/TripForm.jsx";
import WeatherCards from "../components/WeatherCards.jsx";
import BudgetSummary from "../components/BudgetSummary.jsx";
import PlacesList from "../components/PlacesList.jsx";
import ItineraryTimeline from "../components/ItineraryTimeline.jsx";
import ReplanNotice from "../components/ReplanNotice.jsx";
import WhyChangedPanel from "../components/WhyChangedPanel.jsx";
import ItineraryComparison from "../components/ItineraryComparison.jsx";
import ReplanControls from "../components/ReplanControls.jsx";
import { generateItinerary, replanItinerary } from "../api/itineraryApi.js";
import { sampleGenerateResponse } from "../data/sampleData.js";

export default function TripPlanner() {
  const [trip, setTrip] = useState(null); // { destination, days, people, budget, interests }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [weather, setWeather] = useState(null);
  const [weatherSource, setWeatherSource] = useState(null);
  const [places, setPlaces] = useState([]);
  const [itinerary, setItinerary] = useState(null); // current, live itinerary
  const [budgetSummary, setBudgetSummary] = useState(null);

  const [lastChange, setLastChange] = useState(null); // { original, updated, changes }
  const [showChanges, setShowChanges] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [replanLoading, setReplanLoading] = useState(false);

  async function handleGenerate(form) {
    setLoading(true);
    setError(null);
    setLastChange(null);
    setShowChanges(false);
    setShowComparison(false);

    try {
      const result = await generateItinerary(form);
      applyGenerateResult(result, form);
    } catch (err) {
      console.warn("Falling back to sample data:", err.message);
      setError(
        "Couldn't reach the backend, so this is showing demo data. Start the server to generate a live plan."
      );
      applyGenerateResult(sampleGenerateResponse, form);
    } finally {
      setLoading(false);
    }
  }

  function applyGenerateResult(result, form) {
    setTrip({
      destination: result.destination,
      days: result.days,
      people: result.people,
      budget: result.budget,
      interests: result.interests,
    });
    setWeather(result.weather);
    setWeatherSource(result.weatherSource || "mock");
    setPlaces(result.places);
    setItinerary(result.itinerary);
    setBudgetSummary(result.budgetSummary);
  }

  async function handleTrigger(trigger) {
    if (!itinerary || !trip) return;
    setReplanLoading(true);
    setError(null);

    try {
      const result = await replanItinerary({
        itinerary,
        places,
        weather,
        people: trip.people,
        budget: trip.budget,
        trigger,
      });

      if (result.changed) {
        setLastChange({
          original: result.original,
          updated: result.updated,
          changes: result.changes,
        });
        setItinerary(result.updated);
        setBudgetSummary(result.budgetSummary);
        setShowChanges(true);
      } else {
        setLastChange({ original: itinerary, updated: itinerary, changes: [] });
        setError("Nothing needed to change for that scenario — the current plan already handles it.");
      }
    } catch (err) {
      setError("Re-plan request failed: " + err.message);
    } finally {
      setReplanLoading(false);
    }
  }

  function handleMarkClosed(stop) {
    handleTrigger({ type: "closure", closedPlaceId: stop.id });
  }

  function handleAddPlace(place) {
    handleTrigger({ type: "add-place", newPlace: place });
  }

  const usedIds = new Set(
    (itinerary || []).flatMap((d) => d.stops.map((s) => s.id))
  );
  const changedStopIds = new Set(
    (lastChange?.changes || [])
      .map((c) => c.after)
      .flatMap((name) =>
        (itinerary || [])
          .flatMap((d) => d.stops)
          .filter((s) => s.name === name)
          .map((s) => s.id)
      )
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 sm:py-14">
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-spruce-900">
          Trip planner
        </h1>
        <p className="text-spruce-600 mt-2 max-w-2xl">
          Fill in a trip below, generate the plan, then try a scenario to see the
          itinerary re-plan itself.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rain/30 bg-rain/5 px-4 py-3 text-sm text-spruce-900">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <div className="space-y-6 lg:sticky lg:top-24">
          <TripForm onSubmit={handleGenerate} loading={loading} />
          {itinerary && (
            <ReplanControls
              onTrigger={handleTrigger}
              loading={replanLoading}
              dayNumbers={itinerary.map((d) => d.day)}
            />
          )}
        </div>

        <div className="space-y-6">
          {!itinerary && !loading && (
            <div className="border border-dashed border-spruce-100 rounded-2xl p-12 text-center">
              <p className="text-spruce-400">
                Generate an itinerary to see the day-wise plan, weather, and budget here.
              </p>
            </div>
          )}

          {lastChange && (
            <ReplanNotice
              changeCount={lastChange.changes.length}
              onViewChanges={() => {
                setShowChanges(true);
                setShowComparison(true);
              }}
              onDismiss={() => setLastChange(null)}
            />
          )}

          {showComparison && lastChange?.changes.length > 0 && (
            <ItineraryComparison
              original={lastChange.original}
              updated={lastChange.updated}
              onClose={() => setShowComparison(false)}
            />
          )}

          {showChanges && lastChange?.changes.length > 0 && (
            <WhyChangedPanel changes={lastChange.changes} />
          )}

          {itinerary && (
            <ItineraryTimeline
              days={itinerary}
              onMarkClosed={handleMarkClosed}
              changedStopIds={changedStopIds}
            />
          )}

          {weather && <WeatherCards forecast={weather} source={weatherSource} />}

          {budgetSummary && <BudgetSummary summary={budgetSummary} />}

          {places?.length > 0 && (
            <PlacesList places={places} usedIds={usedIds} onAddPlace={handleAddPlace} />
          )}
        </div>
      </div>
    </div>
  );
}
