'use client';

import { useEffect, useState } from 'react';
import { useViewMode } from '@/context/ViewModeContext';

const BRAND_SCORES = [
  { label: 'Brand Awareness', simpleLabel: 'How well-known you are', pct: 35, color: 'bg-amber-400' },
  { label: 'Engagement Rate', simpleLabel: 'How much people interact', pct: 78, color: 'bg-emerald-500' },
  { label: 'Conversion Efficiency', simpleLabel: 'Ad click to purchase rate', pct: 12, color: 'bg-red-500' },
  { label: 'Market Penetration (FR)', simpleLabel: 'France reach', pct: 15, color: 'bg-red-500' },
  { label: 'Content Quality', simpleLabel: 'Quality of your creative', pct: 82, color: 'bg-emerald-500' },
  { label: 'Ad Spend Efficiency', simpleLabel: 'Value from your budget', pct: 45, color: 'bg-amber-400' },
];

export default function BrandHealthPage() {
  const { isSimple } = useViewMode();
  const [brandHealth, setBrandHealth] = useState<any>(null);

  useEffect(() => {
    fetch('/api/brand-health').then(r => r.json()).then(setBrandHealth).catch(() => {});
  }, []);

  const overall = brandHealth?.overall ?? 54;
  const scoreLabel = overall >= 70 ? 'Good — keep it up' : overall >= 50 ? 'Growing — room to improve' : 'Needs attention';
  const scoreEmoji = overall >= 70 ? '👍' : overall >= 50 ? '👌' : '👀';

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">Brand Health</h2>
        <p className="text-sm text-gray-500">
          {isSimple ? 'How your brand is performing overall' : 'LoveLab brand health score across 6 dimensions'}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Score circle */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8">
          <div className="relative mb-4 h-[140px] w-[140px] sm:h-[160px] sm:w-[160px]">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="#6B3FA0" strokeWidth="8" strokeLinecap="round"
                strokeDasharray="326.7" strokeDashoffset={326.7 - (326.7 * overall / 100)} />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-plum-dark sm:text-5xl">
              {overall}
            </div>
          </div>
          <div className="text-center">
            {isSimple ? (
              <p className="text-xl font-semibold">{scoreEmoji} {scoreLabel}</p>
            ) : (
              <>
                <p className="font-semibold text-gray-800">{brandHealth?.rating ?? 'Growing — Needs Attention'}</p>
                <p className="mt-1 text-sm text-gray-500">Overall brand health score</p>
              </>
            )}
          </div>
        </div>

        {/* Scores breakdown */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-gray-800">
            {isSimple ? 'What makes up your score' : 'Score breakdown'}
          </h3>
          <div className="space-y-4">
            {BRAND_SCORES.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-700">{isSimple ? item.simpleLabel : item.label}</span>
                  <span className="font-semibold">{item.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className={`h-full rounded-full transition-all ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isSimple && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-gray-800">Priority actions</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🚨', color: 'bg-red-50', title: 'Fix conversion tracking', text: 'Conversion rate of 0.14% is critically low. Verify Google Tag Manager and purchase event setup.' },
              { icon: '📢', color: 'bg-amber-50', title: 'Build brand awareness in France', text: 'Only 35% brand awareness. Run top-of-funnel campaigns with French-language creatives.' },
              { icon: '🎯', color: 'bg-emerald-50', title: 'Scale Meta engagement', text: '78% engagement is strong. Repurpose top Meta content for Google Display and YouTube.' },
            ].map((action, i) => (
              <div key={i} className={`rounded-xl p-4 ${action.color}`}>
                <div className="mb-2 text-2xl">{action.icon}</div>
                <h4 className="mb-1 text-sm font-semibold">{action.title}</h4>
                <p className="text-[12px] leading-relaxed text-gray-600">{action.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
