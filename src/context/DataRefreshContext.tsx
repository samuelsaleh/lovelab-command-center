'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface DataRefreshContextValue {
  refreshKey: number;
  refresh: () => void;
  isRefreshing: boolean;
}

const DataRefreshContext = createContext<DataRefreshContextValue | null>(null);

export function DataRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    // Give pages time to re-fetch before clearing the spinner
    setTimeout(() => setIsRefreshing(false), 2000);
  }, []);

  return (
    <DataRefreshContext.Provider value={{ refreshKey, refresh, isRefreshing }}>
      {children}
    </DataRefreshContext.Provider>
  );
}

export function useDataRefresh() {
  const ctx = useContext(DataRefreshContext);
  if (!ctx) throw new Error('useDataRefresh must be used within DataRefreshProvider');
  return ctx;
}
