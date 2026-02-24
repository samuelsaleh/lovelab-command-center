'use client';

import { useViewMode } from '@/context/ViewModeContext';
import { MARKETS } from '@/data/brand';

export default function MarketsPage() {
  const { isSimple } = useViewMode();

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">
          {isSimple ? 'Markets' : 'B2C Market Entry Strategy'}
        </h2>
        <p className="text-sm text-gray-500">
          {isSimple ? 'Countries where LoveLab is active or expanding' : 'LoveLab expansion strategy across 6 target markets'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MARKETS.map((m) => (
          <div key={m.country} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
              <span className="text-3xl">{m.flag}</span>
              <div>
                <div className="font-semibold text-gray-900">{m.country}</div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-block ${
                  m.priority === 'primary' ? 'bg-plum-bg text-plum' :
                  m.priority === 'secondary' ? 'bg-blue-50 text-blue-600' :
                  'bg-gray-100 text-gray-500'
                }`}>{m.status}</span>
              </div>
            </div>
            <div className="px-4 py-3 text-sm text-gray-600 sm:px-5 sm:py-4">
              {isSimple ? (
                <p className="text-sm">{m.priority === 'primary' ? 'Main focus market' : m.priority === 'secondary' ? 'Growing market' : 'Future market'}</p>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Language</span>
                    <span className="font-medium text-gray-800">{m.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium text-gray-800">{m.budgetPct}% of total</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Priority</span>
                    <span className="font-medium capitalize text-gray-800">{m.priority}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
