'use client';

import DataTable, { type ColumnDef } from './DataTable';
import AlertBox from './AlertBox';
import { SEARCH_TERMS } from '@/data/google-ads-cache';
import type { SearchTermData } from '@/data/google-ads-cache';

const VERDICT_STYLES: Record<string, { dot: string; label: string }> = {
  keep: { dot: 'bg-emerald-500', label: 'Keep' },
  monitor: { dot: 'bg-amber-400', label: 'Monitor' },
  exclude: { dot: 'bg-red-500', label: 'Exclude' },
};

const searchColumns: ColumnDef<SearchTermData>[] = [
  {
    key: 'term',
    header: 'Search Term',
    render: (r) => <span className="font-medium text-gray-900">{r.term}</span>,
  },
  {
    key: 'campaign',
    header: 'Campaign',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600 text-xs">{r.campaign}</span>,
  },
  {
    key: 'impressions',
    header: 'Impr.',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{r.impressions}</span>,
  },
  {
    key: 'clicks',
    header: 'Clicks',
    align: 'right',
    render: (r) => <span className="text-gray-700">{r.clicks}</span>,
  },
  {
    key: 'ctr',
    header: 'CTR',
    align: 'right',
    render: (r) => (
      <span className={`font-medium ${r.ctr > 5 ? 'text-emerald-600' : 'text-gray-600'}`}>
        {r.ctr.toFixed(2)}%
      </span>
    ),
  },
  {
    key: 'avgCpc',
    header: 'Avg CPC',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{'\u20AC'}{r.avgCpc.toFixed(2)}</span>,
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
    key: 'verdict',
    header: 'Verdict',
    align: 'center',
    render: (r) => {
      const v = VERDICT_STYLES[r.verdict];
      return (
        <div className="flex items-center justify-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${v.dot}`} />
          <span className="text-xs font-medium text-gray-600">{v.label}</span>
        </div>
      );
    },
  },
];

export default function SearchTermsTab() {
  const wastedSpend = SEARCH_TERMS
    .filter((t) => t.verdict === 'exclude')
    .reduce((sum, t) => sum + t.clicks * t.avgCpc, 0);

  return (
    <div className="space-y-6">
      <DataTable
        title="Search Term Analysis"
        columns={searchColumns}
        data={SEARCH_TERMS}
        headerRight={
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Keep
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Monitor
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Exclude
            </span>
          </div>
        }
      />

      <AlertBox
        title="Wasted Spend Alert"
        text={`An estimated \u20AC${wastedSpend.toFixed(2)}/month is spent on non-converting, irrelevant search terms ("cheap diamonds", "diamond certification", "natural vs lab diamonds"). Adding these as negative keywords could save 4-7% of your monthly budget.`}
        type="warning"
      />
    </div>
  );
}
