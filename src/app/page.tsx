'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import AiChat from '@/components/AiChat';
import { useViewMode } from '@/context/ViewModeContext';
import { useDataRefresh } from '@/context/DataRefreshContext';
import { getSkillById } from '@/data/marketing-skills';
import { COLLECTIONS, MARKETS } from '@/data/brand';

interface PlatformData {
  totals: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions?: number;
    reach?: number;
  };
  campaigns?: any[];
  fetchedAt?: string;
}

const EXPERT_INSIGHTS = [
  { icon: '🚨', bg: 'bg-red-50', title: 'Conversion Rate Crisis — 0.14% on Google', text: 'With only 2 conversions from 1,043 clicks, your CPA is ~€96. Review landing pages and verify conversion tracking.', tag: 'High Priority', tagColor: 'bg-red-50 text-red-600' },
  { icon: '⚡', bg: 'bg-amber-50', title: 'PMax Campaign Underperforming', text: 'Performance Max has spent €25.76 with 0 conversions. Consider pausing or adding more creative assets.', tag: 'High Priority', tagColor: 'bg-red-50 text-red-600' },
  { icon: '💎', bg: 'bg-emerald-50', title: 'Meta Engagement is Exceptional', text: 'Valentine\'s creative: €0.02/video view, 8,043 engagements. Repurpose for Google Display & YouTube.', tag: 'Opportunity', tagColor: 'bg-blue-50 text-blue-600' },
  { icon: '🇫🇷', bg: 'bg-blue-50', title: 'France: Launch French Campaigns', text: 'Target "bracelet diamant", "bijoux diamant abordable" — high-intent French keywords not yet running.', tag: 'Strategic', tagColor: 'bg-amber-50 text-amber-600' },
  { icon: '🔄', bg: 'bg-amber-50', title: 'Cuty = B2C Entry Weapon', text: 'At €75, create a "Votre Première Lumière" campaign targeting 18-24 year olds in France.', tag: 'Growth', tagColor: 'bg-amber-50 text-amber-600' },
];

const SIMPLE_INSIGHTS = [
  { icon: '⚠️', bg: 'bg-red-50', title: 'Cost per sale is high', text: 'Few people who click are buying. Check your product pages and make sure tracking is working.', tag: 'Needs attention', tagColor: 'bg-red-50 text-red-600' },
  { icon: '💎', bg: 'bg-emerald-50', title: 'Social ads are doing well', text: 'Your video ads on Instagram/Facebook are getting lots of engagement. Good opportunity to grow.', tag: 'Opportunity', tagColor: 'bg-blue-50 text-blue-600' },
  { icon: '🇫🇷', bg: 'bg-blue-50', title: 'Try ads in France', text: 'France is a key market. Consider running campaigns in French to reach more customers.', tag: 'Idea', tagColor: 'bg-amber-50 text-amber-600' },
];

function Dashboard() {
  const { isSimple } = useViewMode();
  const { refreshKey } = useDataRefresh();
  const searchParams = useSearchParams();
  const skillId = searchParams.get('skill');
  const skill = skillId ? getSkillById(skillId) : null;
  const initialChatPrompt = skill?.promptTemplate ?? '';
  const [google, setGoogle] = useState<PlatformData | null>(null);
  const [meta, setMeta] = useState<PlatformData | null>(null);
  const [brandHealth, setBrandHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const [gRes, mRes, bRes] = await Promise.allSettled([
          fetch('/api/google-ads').then(r => r.json()),
          fetch('/api/meta-ads?type=insights').then(r => r.json()),
          fetch('/api/brand-health').then(r => r.json()),
        ]);

        if (gRes.status === 'fulfilled') setGoogle(gRes.value);
        if (mRes.status === 'fulfilled') setMeta(mRes.value);
        if (bRes.status === 'fulfilled') setBrandHealth(bRes.value);
      } catch (e) {
        console.error('Failed to fetch data:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const totalSpend = (google?.totals?.spend || 0) + (meta?.totals?.spend || 0);
  const totalImpressions = (google?.totals?.impressions || 0) + (meta?.totals?.impressions || 0);
  const totalClicks = (google?.totals?.clicks || 0) + (meta?.totals?.clicks || 0);
  const totalConversions = google?.totals?.conversions || 0;
  const insights = isSimple ? SIMPLE_INSIGHTS : EXPERT_INSIGHTS;

  return (
    <>
      {/* KPI Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {isSimple ? (
          <>
            <MetricCard
              label="Money spent on ads"
              value={`€${totalSpend.toFixed(2)}`}
              change="Last 30 days"
              icon="€"
              iconBg="bg-plum-bg"
              iconColor="text-plum"
            />
            <MetricCard
              label="People who saw your ads"
              value={totalImpressions.toLocaleString()}
              change="Impressions"
              changeType="up"
              icon="👁"
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
            <MetricCard
              label="Clicks on your ads"
              value={totalClicks.toLocaleString()}
              change="Total clicks"
              changeType="up"
              icon="👆"
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <MetricCard
              label="Sales from ads"
              value={totalConversions.toString()}
              change={totalConversions < 5 ? 'Needs work' : 'On track'}
              changeType={totalConversions < 5 ? 'down' : 'up'}
              icon="🎯"
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
          </>
        ) : (
          <>
            <MetricCard
              label="Total Ad Spend"
              value={`€${totalSpend.toFixed(2)}`}
              change="Combined Google + Meta (30 days)"
              icon="€"
              iconBg="bg-plum-bg"
              iconColor="text-plum"
            />
            <MetricCard
              label="Total Impressions"
              value={totalImpressions.toLocaleString()}
              change={`Google: ${(google?.totals?.impressions || 0).toLocaleString()} · Meta: ${(meta?.totals?.impressions || 0).toLocaleString()}`}
              changeType="up"
              icon="👁"
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
            <MetricCard
              label="Total Clicks"
              value={totalClicks.toLocaleString()}
              change={`Google: ${(google?.totals?.clicks || 0).toLocaleString()} · Meta: ${(meta?.totals?.clicks || 0).toLocaleString()}`}
              changeType="up"
              icon="👆"
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <MetricCard
              label="Conversions"
              value={totalConversions.toString()}
              change={totalConversions < 5 ? 'Needs optimization' : 'On track'}
              changeType={totalConversions < 5 ? 'down' : 'up'}
              icon="🎯"
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
          </>
        )}
      </div>

      {/* AI Recommendations + Brand Health */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-[15px]">
              <span className="text-plum">✦</span> {isSimple ? 'AI insights' : 'AI Recommendations'}
            </h3>
            <span className="rounded-md bg-plum-bg px-2 py-1 text-[10px] font-semibold text-plum">Live</span>
          </div>
          <div className="max-h-[420px] space-y-3.5 overflow-y-auto p-4 sm:p-5">
            {insights.map((insight, i) => (
              <div key={i} className="flex gap-3.5 border-b border-gray-100 pb-3.5 last:border-0 last:pb-0">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${insight.bg}`}>
                  {insight.icon}
                </div>
                <div>
                  <h4 className="mb-1 text-[13px] font-semibold">{insight.title}</h4>
                  <p className="text-[12px] leading-relaxed text-gray-500">{insight.text}</p>
                  <span className={`mt-1.5 inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${insight.tagColor}`}>{insight.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Health Score */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-[15px]">❤️ Brand Health Score</h3>
          </div>
          <div className="p-4 text-center sm:p-5">
            <div className="relative mx-auto mb-3 h-[100px] w-[100px] sm:h-[120px] sm:w-[120px]">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#6B3FA0" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="326.7" strokeDashoffset={326.7 - (326.7 * (brandHealth?.overall || 54) / 100)} />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-plum-dark sm:text-3xl">
                {brandHealth?.overall || 54}
              </div>
            </div>
            <div className="mb-4 text-sm text-gray-500">
              {isSimple ? (
                <span>
                  {brandHealth?.overall >= 70 ? '👍 Good' : brandHealth?.overall >= 50 ? '👌 OK — room to grow' : '👀 Needs work'}
                </span>
              ) : (
                brandHealth?.rating || 'Growing — Needs Attention'
              )}
            </div>
            {!isSimple && (
              <div className="space-y-2 text-left">
                {[
                  { label: 'Brand Awareness', pct: 35, color: 'bg-amber-400' },
                  { label: 'Engagement Rate', pct: 78, color: 'bg-emerald-500' },
                  { label: 'Conversion Efficiency', pct: 12, color: 'bg-red-500' },
                  { label: 'Market Penetration (FR)', pct: 15, color: 'bg-red-500' },
                  { label: 'Content Quality', pct: 82, color: 'bg-emerald-500' },
                  { label: 'Ad Spend Efficiency', pct: 45, color: 'bg-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{item.label}</span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-semibold">{item.pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collection Portfolio */}
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-[15px]">
            💎 {isSimple ? 'Collections' : 'Collection Portfolio — Ad Readiness'}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:p-5 md:grid-cols-3 lg:grid-cols-4">
          {COLLECTIONS.map(c => (
            <div key={c.id} className={`rounded-xl border border-gray-200 bg-gray-50 p-3 text-center transition-all hover:border-plum-light hover:shadow-md hover:shadow-plum/5 sm:p-4 ${c.comingSoon ? 'opacity-50' : ''}`}>
              <div className="font-display text-sm font-semibold text-plum-dark sm:text-base">{c.name}</div>
              {!isSimple && <div className="mb-2 text-[11px] italic text-gold">{c.taglineEN}</div>}
              <div className="text-base font-bold sm:text-lg">€{c.startingPrice} <span className="text-[11px] font-normal text-gray-400">starting</span></div>
              {!isSimple && (
                <>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-plum to-plum-light" style={{ width: `${c.adReadiness}%` }} />
                  </div>
                  <div className="mt-1 text-[10px] text-gray-400">{c.adReadiness}% Ad Ready{c.isBestseller ? ' · Bestseller' : ''}{c.comingSoon ? ' · Coming Soon' : ''}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-[15px]">💬 La Lumière AI — Ask Anything</h3>
          <span className="rounded-md bg-plum-bg px-2 py-1 text-[10px] font-semibold text-plum">Claude API</span>
        </div>
        <AiChat compact initialPrompt={initialChatPrompt} />
      </div>

      {/* Markets */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold sm:text-[15px]">
            🌍 {isSimple ? 'Markets' : 'B2C Market Entry Strategy'}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
          {MARKETS.slice(0, 6).map(m => (
            <div key={m.country} className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <div className="mb-1 text-2xl">{m.flag}</div>
              <div className="mb-1 text-sm font-semibold">{m.country}</div>
              <span className={`mb-2 inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${
                m.priority === 'primary' ? 'bg-plum-bg text-plum' :
                m.priority === 'secondary' ? 'bg-blue-50 text-blue-600' :
                'bg-gray-100 text-gray-500'
              }`}>{m.status}</span>
              {!isSimple && (
                <>
                  <div className="text-[12px] text-gray-500">Language: {m.language}</div>
                  <div className="text-[12px] text-gray-500">Budget: {m.budgetPct}% allocation</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[200px] items-center justify-center text-gray-500">Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
