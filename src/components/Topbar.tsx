'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/campaigns': 'Campaign Deep Dive',
  '/google': 'Google Ads',
  '/meta': 'Meta Ads',
  '/ai': 'La Lumière AI Advisor',
  '/brand': 'Brand Health',
  '/markets': 'Market Strategy',
  '/collections': 'Collections',
};

export default function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname || '/'] || 'Dashboard';

  return (
    <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-gray-200 px-8 py-3.5 flex items-center justify-between">
      <h1 className="font-display text-xl font-semibold text-plum-dark">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-dot" />
          Live Data Connected
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}
