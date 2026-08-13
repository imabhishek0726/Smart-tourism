export default function Header({ onNavigateHome }) {
  return (
    <header className="border-b border-spruce-100 bg-mist-50/90 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group"
          aria-label="Trailshift home"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path
              d="M2 20 L7 10 L11 15 L15 6 L19 13 L24 8"
              stroke="#E8A33D"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="font-display text-xl font-semibold tracking-tight text-spruce-900 group-hover:text-spruce-600 transition-colors">
            Trailshift
          </span>
        </button>
        <span className="hidden sm:block font-mono text-[11px] uppercase tracking-widest text-spruce-400">
          Smart Tourism · Dynamic Itinerary
        </span>
      </div>
    </header>
  );
}
