'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import { useViewMode } from '@/context/ViewModeContext';
import { useDataRefresh } from '@/context/DataRefreshContext';

interface MetaData {
  totals?: {
    spend?: number;
    impressions?: number;
    clicks?: number;
    reach?: number;
  };
  campaigns?: Array<{
    name: string;
    spend: number;
    impressions: number;
    clicks: number;
    reach: number;
  }>;
}

export default function MetaAdsPage() {
  const { isSimple } = useViewMode();
  const { refreshKey } = useDataRefresh();
  const [data, setData] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/meta-ads?type=insights')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const spend = data?.totals?.spend ?? 0;
  const impressions = data?.totals?.impressions ?? 0;
  const clicks = data?.totals?.clicks ?? 0;
  const reach = data?.totals?.reach ?? 0;
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  const cpm = impressions > 0 ? ((spend / impressions) * 1000).toFixed(2) : '—';

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">Meta Ads</h2>
        <p className="text-sm text-gray-500">Facebook & Instagram — last 30 days</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {isSimple ? (
          <>
            <MetricCard label="Money spent" value={`€${spend.toFixed(2)}`} icon="€" iconBg="bg-plum-bg" iconColor="text-plum" />
            <MetricCard label="People reached" value={reach.toLocaleString()} icon="👥" iconBg="bg-blue-50" iconColor="text-blue-600" changeType="up" />
            <MetricCard label="Clicks" value={clicks.toLocaleString()} icon="👆" iconBg="bg-emerald-50" iconColor="text-emerald-600" changeType="up" />
            <MetricCard label="Ad views" value={impressions.toLocaleString()} icon="👁" iconBg="bg-amber-50" iconColor="text-amber-600" changeType="up" />
          </>
        ) : (
          <>
            <MetricCard label="Ad Spend" value={`€${spend.toFixed(2)}`} change="30-day total" icon="€" iconBg="bg-plum-bg" iconColor="text-plum" />
            <MetricCard label="Reach" value={reach.toLocaleString()} change="Unique accounts" icon="👥" iconBg="bg-blue-50" iconColor="text-blue-600" changeType="up" />
            <MetricCard label="Clicks" value={clicks.toLocaleString()} change={`CTR: ${ctr}%`} icon="👆" iconBg="bg-emerald-50" iconColor="text-emerald-600" changeType="up" />
            <MetricCard label="Impressions" value={impressions.toLocaleString()} change={`CPM: €${cpm}`} icon="👁" iconBg="bg-amber-50" iconColor="text-amber-600" changeType="up" />
          </>
        )}
      </div>

      {/* Campaigns */}
      {data?.campaigns && data.campaigns.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="text-sm font-semibold sm:text-[15px]">
              {isSimple ? 'Your campaigns' : 'Campaigns — 30 day breakdown'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Campaign</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Spend</th>
                  {!isSimple && <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">Reach</th>}
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((c, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="max-w-[180px] truncate px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-right text-gray-700">€{(c.spend ?? 0).toFixed(2)}</td>
                    {!isSimple && <td className="hidden px-4 py-3 text-right text-gray-600 sm:table-cell">{(c.reach ?? 0).toLocaleString()}</td>}
                    <td className="px-4 py-3 text-right text-gray-700">{(c.clicks ?? 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">Loading Meta Ads data…</div>
      )}
    </>
  );
}
