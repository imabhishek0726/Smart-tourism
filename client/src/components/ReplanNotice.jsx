export default function ReplanNotice({ changeCount, onViewChanges, onDismiss }) {
  if (!changeCount) return null;

  return (
    <div className="bg-amber/10 border border-amber/40 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-9 w-9 rounded-full bg-amber flex items-center justify-center text-spruce-900 font-display font-semibold shrink-0"
        >
          !
        </span>
        <div>
          <p className="font-medium text-spruce-900">
            Your itinerary was updated — {changeCount} change{changeCount > 1 ? "s" : ""} made
          </p>
          <p className="text-sm text-spruce-600">
            Something in the plan changed. Here's exactly what and why.
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onViewChanges}
          className="text-sm font-medium bg-spruce-900 text-mist-50 px-4 py-2 rounded-full hover:bg-spruce-600 transition-colors"
        >
          View changes
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-sm font-medium text-spruce-600 px-3 py-2 hover:text-spruce-900 transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
