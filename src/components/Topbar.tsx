'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { useDataRefresh } from '@/context/DataRefreshContext';
import ViewModeToggle from '@/components/ViewModeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/performance': 'Marketing Performance',
  '/ai': 'AI Advisor',
  '/simple': 'Dashboard',
  '/expert': 'Dashboard',
};

function HamburgerButton() {
  const { toggle } = useMobileMenu();
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-plum-dark hover:bg-gray-50 lg:hidden"
      aria-label="Open menu"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

function RefreshButton() {
  const { refresh, isRefreshing } = useDataRefresh();
  return (
    <button
      type="button"
      onClick={refresh}
      disabled={isRefreshing}
      className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition-colors hover:border-plum hover:text-plum disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Refresh data"
      title="Re-fetch live data from Google & Meta"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`h-3.5 w-3.5 transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
      >
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span className="hidden sm:inline">{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
    </button>
  );
}

export default function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname || '/'] || 'Dashboard';
  const [dateStr, setDateStr] = useState<string | null>(null);

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).replace(/,/g, '')
    );
  }, []);

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-lovelab-border bg-[#FDF7FA]/90 px-4 py-3 backdrop-blur-xl sm:px-6 md:px-6 lg:px-8 lg:py-3.5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <HamburgerButton />
        <h1 className="truncate font-display text-lg font-semibold text-plum-dark sm:text-xl">{title}</h1>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
        <ViewModeToggle />
        <RefreshButton />
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1.5 text-emerald-600 sm:px-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span className="text-[10px] font-semibold sm:text-xs">Live Data</span>
        </div>
        {dateStr !== null && (
          <div className="hidden text-right text-xs text-gray-500 sm:block sm:text-sm" suppressHydrationWarning>
            {dateStr}
          </div>
        )}
      </div>
    </div>
  );
}
