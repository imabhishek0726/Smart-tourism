export default function PlacesList({ places, usedIds = new Set(), onAddPlace }) {
  if (!places?.length) return null;

  const available = places.filter((p) => !usedIds.has(p.id));

  return (
    <div className="bg-white border border-spruce-100 rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-spruce-900 mb-1">
        More places nearby
      </h3>
      <p className="text-sm text-spruce-600 mb-4">
        Not in your itinerary yet — add one to see the plan adapt.
      </p>
      <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {available.map((place) => (
          <li
            key={place.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-spruce-100 px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-medium text-spruce-900">{place.name}</p>
              <p className="text-xs text-spruce-400 capitalize">
                {place.category} · {place.avgCost ? `₹${place.avgCost}` : "Free"}
              </p>
            </div>
            {onAddPlace && (
              <button
                onClick={() => onAddPlace(place)}
                className="text-xs font-medium bg-mist-50 hover:bg-spruce-100 text-spruce-900 px-3 py-1.5 rounded-full shrink-0 transition-colors"
              >
                Add
              </button>
            )}
          </li>
        ))}
        {!available.length && (
          <p className="text-sm text-spruce-400">Every nearby place is already in the plan.</p>
        )}
      </ul>
    </div>
  );
}
