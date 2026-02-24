'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type ViewMode = 'simple' | 'expert';

const STORAGE_KEY = 'lovelab-view-mode';

interface ViewModeContextValue {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  isSimple: boolean;
  isExpert: boolean;
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

function getStoredMode(): ViewMode {
  if (typeof window === 'undefined') return 'expert';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'simple' || stored === 'expert') return stored;
  } catch {
    // ignore
  }
  return 'expert';
}

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>('expert');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setModeState(getStoredMode());
    setMounted(true);
  }, []);

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
    }
  }, []);

  const value: ViewModeContextValue = {
    mode: mounted ? mode : 'expert',
    setMode,
    isSimple: mounted && mode === 'simple',
    isExpert: mounted && mode === 'expert',
  };

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) {
    throw new Error('useViewMode must be used within ViewModeProvider');
  }
  return ctx;
}
