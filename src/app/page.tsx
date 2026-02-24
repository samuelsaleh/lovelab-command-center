'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import AiChat from '@/components/AiChat';
import { COLLECTIONS, MARKETS, PERSONAS } from '@/data/brand';

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

export default function Dashboard() {
  const [google, setGoogle] = useState<PlatformData | null>(null);
  const [meta, setMeta] = useState<PlatformData | null>(null);
  const [brandHealth, setBrandHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSpend = (google?.totals?.spend || 0) + (meta?.totals?.spend || 0);
  const totalImpressions = (google?.totals?.impressions || 0) + (meta?.totals?.impressions || 0);
  const totalClicks = (google?.totals?.clicks || 0) + (meta?.totals?.clicks || 0);
  const totalConversions = google?.totals?.conversions || 0;

  return (
    <>
      {/* KPI Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
      </div>

      {/* AI Recommendations + Brand Health */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* AI Insights */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold flex items-center gap-2">
              <span className="text-plum">✦</span> AI Recommendations
            </h3>
            <span className="text-[10px] px-2 py-1 rounded-md bg-plum-bg text-plum font-semibold">Live Analysis</span>
          </div>
          <div className="p-5 space-y-3.5 max-h-[420px] overflow-y-auto">
            {[
              { icon: '🚨', bg: 'bg-red-50', title: 'Conversion Rate Crisis — 0.14% on Google', text: 'With only 2 conversions from 1,043 clicks, your CPA is ~€96. Review landing pages and verify conversion tracking.', tag: 'High Priority', tagColor: 'bg-red-50 text-red-600' },
              { icon: '⚡', bg: 'bg-amber-50', title: 'PMax Campaign Underperforming', text: 'Performance Max has spent €25.76 with 0 conversions. Consider pausing or adding more creative assets.', tag: 'High Priority', tagColor: 'bg-red-50 text-red-600' },
              { icon: '💎', bg: 'bg-emerald-50', title: 'Meta Engagement is Exceptional', text: 'Valentine\'s creative: €0.02/video view, 8,043 engagements. Repurpose for Google Display & YouTube.', tag: 'Opportunity', tagColor: 'bg-blue-50 text-blue-600' },
              { icon: '🇫🇷', bg: 'bg-blue-50', title: 'France: Launch French Campaigns', text: 'Target "bracelet diamant", "bijoux diamant abordable" — high-intent French keywords not yet running.', tag: 'Strategic', tagColor: 'bg-amber-50 text-amber-600' },
              { icon: '🔄', bg: 'bg-amber-50', title: 'Cuty = B2C Entry Weapon', text: 'At €75, create a "Votre Première Lumière" campaign targeting 18-24 year olds in France.', tag: 'Growth', tagColor: 'bg-amber-50 text-amber-600' },
            ].map((insight, i) => (
              <div key={i} className="flex gap-3.5 pb-3.5 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${insight.bg}`}>
                  {insight.icon}
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold mb-1">{insight.title}</h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{insight.text}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold inline-block mt-1.5 ${insight.tagColor}`}>{insight.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Health Score */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-[15px] font-semibold flex items-center gap-2">❤️ Brand Health Score</h3>
          </div>
          <div className="p-5 text-center">
            <div className="relative w-[120px] h-[120px] mx-auto mb-3">
              <svg viewBox="0 0 120 120" className="w-[120px] h-[120px] -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#6B3FA0" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="326.7" strokeDashoffset={326.7 - (326.7 * (brandHealth?.overall || 54) / 100)} />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-plum-dark">
                {brandHealth?.overall || 54}
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-4">{brandHealth?.rating || 'Growing — Needs Attention'}</div>
            <div className="text-left space-y-2">
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
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="font-semibold w-8 text-right">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collection Portfolio */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-[15px] font-semibold flex items-center gap-2">💎 Collection Portfolio — Ad Readiness</h3>
        </div>
        <div className="p-5 grid grid-cols-4 gap-3">
          {COLLECTIONS.map(c => (
            <div key={c.id} className={`bg-gray-50 rounded-xl p-4 text-center border border-gray-200 hover:border-plum-light hover:shadow-md hover:shadow-plum/5 transition-all ${c.comingSoon ? 'opacity-50' : ''}`}>
              <div className="font-display text-base font-semibold text-plum-dark">{c.name}</div>
              <div className="text-[11px] text-gold italic mb-2">{c.taglineEN}</div>
              <div className="text-lg font-bold">€{c.startingPrice} <span className="text-[11px] text-gray-400 font-normal">starting</span></div>
              <div className="h-1 bg-gray-200 rounded-full mt-2.5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-plum to-plum-light" style={{ width: `${c.adReadiness}%` }} />
              </div>
              <div className="text-[10px] text-gray-400 mt-1">{c.adReadiness}% Ad Ready{c.isBestseller ? ' · Bestseller' : ''}{c.comingSoon ? ' · Coming Soon' : ''}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold flex items-center gap-2">💬 La Lumière AI — Ask Anything</h3>
          <span className="text-[10px] px-2 py-1 rounded-md bg-plum-bg text-plum font-semibold">Claude API</span>
        </div>
        <AiChat compact />
      </div>

      {/* Markets */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-[15px] font-semibold flex items-center gap-2">🌍 B2C Market Entry Strategy</h3>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3">
          {MARKETS.slice(0, 6).map(m => (
            <div key={m.country} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="text-2xl mb-1">{m.flag}</div>
              <div className="text-sm font-semibold mb-1">{m.country}</div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded inline-block mb-2 ${
                m.priority === 'primary' ? 'bg-plum-bg text-plum' :
                m.priority === 'secondary' ? 'bg-blue-50 text-blue-600' :
                'bg-gray-100 text-gray-500'
              }`}>{m.status}</span>
              <div className="text-[12px] text-gray-500">Language: {m.language}</div>
              <div className="text-[12px] text-gray-500">Budget: {m.budgetPct}% allocation</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
