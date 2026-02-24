'use client';

import { useViewMode } from '@/context/ViewModeContext';

export default function ViewModeToggle() {
  const { mode, setMode } = useViewMode();

  return (
    <div
      className="flex shrink-0 rounded-full border border-gray-200 bg-gray-50 p-0.5"
      role="tablist"
      aria-label="View mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'simple'}
        aria-label="Simple view"
        onClick={() => setMode('simple')}
        className={`min-h-[36px] rounded-full px-3 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
          mode === 'simple'
            ? 'bg-white text-plum shadow-sm ring-1 ring-gray-200'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Simple
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'expert'}
        aria-label="Expert view"
        onClick={() => setMode('expert')}
        className={`min-h-[36px] rounded-full px-3 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
          mode === 'expert'
            ? 'bg-white text-plum shadow-sm ring-1 ring-gray-200'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Expert
      </button>
    </div>
  );
}
