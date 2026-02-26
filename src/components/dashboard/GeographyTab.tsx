'use client';

import DataTable, { type ColumnDef } from './DataTable';
import HorizontalBarChart from './HorizontalBarChart';
import InsightCallout from './InsightCallout';
import { GEO_DATA } from '@/data/google-ads-cache';
import type { GeoData } from '@/data/google-ads-cache';

const geoColumns: ColumnDef<GeoData>[] = [
  {
    key: 'country',
    header: 'Country',
    render: (r) => <span className="font-medium text-gray-900">{r.country}</span>,
  },
  {
    key: 'impressions',
    header: 'Impressions',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{r.impressions.toLocaleString()}</span>,
  },
  {
    key: 'clicks',
    header: 'Clicks',
    align: 'right',
    render: (r) => <span className="text-gray-700">{r.clicks}</span>,
  },
  {
    key: 'spend',
    header: 'Spend',
    align: 'right',
    render: (r) => <span className="text-gray-700">{'\u20AC'}{r.spend.toFixed(2)}</span>,
  },
  {
    key: 'conversions',
    header: 'Conv.',
    align: 'right',
    render: (r) => (
      <span className={`font-semibold ${r.conversions > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
        {r.conversions}
      </span>
    ),
  },
  {
    key: 'ctr',
    header: 'CTR',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{r.ctr.toFixed(2)}%</span>,
  },
];

export default function GeographyTab() {
  return (
    <div className="space-y-6">
      <DataTable
        title="Performance by Country"
        columns={geoColumns}
        data={GEO_DATA}
        highlightRow={0}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <HorizontalBarChart data={GEO_DATA} />
        <InsightCallout
          title="Key Geographic Insight"
          text="France dominates with 46% of total spend (\u20AC156.23) and accounts for 2 of 3 total conversions. However, Belgium\u2014your home market\u2014receives only 29% of spend. Consider increasing Belgium bids by +20% and reducing France by -15% to test if local traffic converts better."
        />
      </div>
    </div>
  );
}
