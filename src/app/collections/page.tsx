'use client';

import { useViewMode } from '@/context/ViewModeContext';
import { COLLECTIONS } from '@/data/brand';

export default function CollectionsPage() {
  const { isSimple } = useViewMode();

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">
          {isSimple ? 'Collections' : 'Collection Portfolio — Ad Readiness'}
        </h2>
        <p className="text-sm text-gray-500">
          {isSimple ? 'All LoveLab jewellery collections' : 'All 7 LoveLab collections with ad readiness scores'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {COLLECTIONS.map((c) => (
          <div
            key={c.id}
            className={`overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md hover:shadow-plum/5 ${c.comingSoon ? 'opacity-60' : ''}`}
          >
            <div className="border-b border-gray-100 bg-plum-bg px-5 py-4">
              <div className="font-display text-lg font-semibold text-plum-dark">{c.name}</div>
              {!isSimple && <div className="text-[12px] italic text-gold">{c.taglineEN}</div>}
            </div>
            <div className="px-5 py-4">
              <div className="mb-3 text-2xl font-bold text-gray-900">
                €{c.startingPrice}
                <span className="ml-1 text-sm font-normal text-gray-400">starting</span>
              </div>
              {!isSimple && (
                <>
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span>Ad Readiness</span>
                    <span className="font-semibold text-plum">{c.adReadiness}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-plum to-plum-light"
                      style={{ width: `${c.adReadiness}%` }}
                    />
                  </div>
                </>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.isBestseller && (
                  <span className="rounded bg-gold/20 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Bestseller</span>
                )}
                {c.comingSoon && (
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">Coming Soon</span>
                )}
                {!isSimple && c.adReadiness >= 80 && !c.comingSoon && (
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">Ad Ready</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
