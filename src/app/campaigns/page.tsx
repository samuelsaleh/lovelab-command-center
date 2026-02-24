'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import { IconEuro, IconClick, IconTarget } from '@/components/icons';
import { useViewMode } from '@/context/ViewModeContext';

interface Campaign {
  name: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions?: number;
  reach?: number;
}

export default function CampaignsPage() {
  const { isSimple } = useViewMode();
  const [googleCampaigns, setGoogleCampaigns] = useState<Campaign[]>([]);
  const [metaCampaigns, setMetaCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/google-ads').then(r => r.json()),
      fetch('/api/meta-ads?type=campaigns').then(r => r.json()),
    ]).then(([gRes, mRes]) => {
      if (gRes.status === 'fulfilled' && gRes.value?.campaigns) setGoogleCampaigns(gRes.value.campaigns);
      if (mRes.status === 'fulfilled' && mRes.value?.campaigns) setMetaCampaigns(mRes.value.campaigns);
    }).finally(() => setLoading(false));
  }, []);

  const allCampaigns = [
    ...googleCampaigns.map(c => ({ ...c, platform: 'Google' as const })),
    ...metaCampaigns.map(c => ({ ...c, platform: 'Meta' as const })),
  ];

  const totalSpend = allCampaigns.reduce((s, c) => s + (c.spend ?? 0), 0);
  const totalClicks = allCampaigns.reduce((s, c) => s + (c.clicks ?? 0), 0);
  const totalConv = googleCampaigns.reduce((s, c) => s + (c.conversions ?? 0), 0);

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">
          {isSimple ? 'All campaigns' : 'Campaign Deep Dive'}
        </h2>
        <p className="text-sm text-gray-500">Google Ads + Meta Ads campaigns — last 30 days</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <MetricCard label={isSimple ? 'Total spent' : 'Total Spend'} value={`€${totalSpend.toFixed(2)}`} icon={<IconEuro className="w-3.5 h-3.5" />} change="All campaigns" />
        <MetricCard label={isSimple ? 'Clicks' : 'Total Clicks'} value={totalClicks.toLocaleString()} icon={<IconClick className="w-3.5 h-3.5" />} changeType="up" />
        <MetricCard label={isSimple ? 'Sales' : 'Conversions'} value={totalConv.toString()} icon={<IconTarget className="w-3.5 h-3.5" />} changeType={totalConv < 3 ? 'down' : 'up'} />
      </div>

      {allCampaigns.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="text-sm font-semibold sm:text-[15px]">
              {isSimple ? 'All your campaigns' : `${allCampaigns.length} active campaigns`}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Campaign</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">Platform</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Spend</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Clicks</th>
                  {!isSimple && <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">Conv.</th>}
                </tr>
              </thead>
              <tbody>
                {allCampaigns.map((c, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="max-w-[160px] truncate px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                        c.platform === 'Google' ? 'bg-blue-50 text-blue-600' : 'bg-sky-50 text-sky-600'
                      }`}>{c.platform}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">€{(c.spend ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{(c.clicks ?? 0).toLocaleString()}</td>
                    {!isSimple && <td className="hidden px-4 py-3 text-right font-semibold text-plum md:table-cell">{c.conversions ?? '—'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">Loading campaign data…</div>
      )}

      {!loading && allCampaigns.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
          No campaign data available yet. Check your API connections.
        </div>
      )}
    </>
  );
}
