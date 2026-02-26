'use client';

import DataTable, { type ColumnDef } from './DataTable';
import SpendPieChart from './SpendPieChart';
import { CAMPAIGNS, KEYWORDS } from '@/data/google-ads-cache';
import type { CampaignData, KeywordData } from '@/data/google-ads-cache';

const campaignColumns: ColumnDef<CampaignData>[] = [
  {
    key: 'name',
    header: 'Campaign',
    render: (r) => <span className="font-medium text-gray-900">{r.name}</span>,
  },
  {
    key: 'type',
    header: 'Type',
    hideOnMobile: true,
    render: (r) => <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{r.type}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    hideOnMobile: true,
    render: (r) => (
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        r.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {r.status}
      </span>
    ),
  },
  {
    key: 'spend',
    header: 'Spend',
    align: 'right',
    render: (r) => <span className="text-gray-700">{'\u20AC'}{r.spend.toFixed(2)}</span>,
  },
  {
    key: 'impressions',
    header: 'Impr.',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{r.impressions.toLocaleString()}</span>,
  },
  {
    key: 'clicks',
    header: 'Clicks',
    align: 'right',
    render: (r) => <span className="text-gray-700">{r.clicks.toLocaleString()}</span>,
  },
  {
    key: 'ctr',
    header: 'CTR',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{r.ctr.toFixed(2)}%</span>,
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
      <span className={`font-semibold ${r.conversions > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {r.conversions}
      </span>
    ),
  },
  {
    key: 'costPerConversion',
    header: 'CPA',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{r.costPerConversion > 0 ? `\u20AC${r.costPerConversion.toFixed(2)}` : '\u2014'}</span>,
  },
  {
    key: 'convRate',
    header: 'Conv Rate',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{r.convRate > 0 ? `${r.convRate.toFixed(2)}%` : '\u2014'}</span>,
  },
  {
    key: 'roas',
    header: 'ROAS',
    align: 'right',
    render: (r) => (
      <span className={`font-semibold ${r.roas > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {r.roas > 0 ? `${r.roas.toFixed(2)}x` : '\u2014'}
      </span>
    ),
  },
];

const MATCH_TYPE_STYLES: Record<string, string> = {
  Exact: 'bg-plum-bg text-plum',
  Phrase: 'bg-amber-50 text-amber-700',
  Broad: 'bg-blue-50 text-blue-700',
};

const keywordColumns: ColumnDef<KeywordData>[] = [
  {
    key: 'keyword',
    header: 'Keyword',
    render: (r) => <span className="font-medium text-gray-900">{r.keyword}</span>,
  },
  {
    key: 'matchType',
    header: 'Match',
    render: (r) => (
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${MATCH_TYPE_STYLES[r.matchType] || 'bg-gray-100 text-gray-600'}`}>
        {r.matchType}
      </span>
    ),
  },
  {
    key: 'impressions',
    header: 'Impr.',
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
    key: 'ctr',
    header: 'CTR',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-gray-600">{r.ctr.toFixed(2)}%</span>,
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
    key: 'qualityScore',
    header: 'QS',
    align: 'right',
    hideOnMobile: true,
    render: (r) => (
      <span className={`font-semibold ${r.qualityScore >= 7 ? 'text-emerald-600' : r.qualityScore >= 5 ? 'text-amber-600' : 'text-red-500'}`}>
        {r.qualityScore}/10
      </span>
    ),
  },
  {
    key: 'impressionShare',
    header: 'Impr. Share',
    align: 'right',
    render: (r) => (
      <span className={`font-medium ${r.impressionShare < 40 ? 'text-red-500' : r.impressionShare < 70 ? 'text-amber-600' : 'text-gray-700'}`}>
        {r.impressionShare}%
      </span>
    ),
  },
];

export default function CampaignsTab() {
  return (
    <div className="space-y-6">
      <DataTable
        title="Campaign Performance"
        columns={campaignColumns}
        data={CAMPAIGNS}
        highlightRow={0}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendPieChart campaigns={CAMPAIGNS} />
        <DataTable
          title="Keyword Performance"
          columns={keywordColumns}
          data={KEYWORDS}
        />
      </div>
    </div>
  );
}
