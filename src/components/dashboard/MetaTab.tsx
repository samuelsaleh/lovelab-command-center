'use client';

import { META_CACHED_DATA } from '@/data/meta-cache';
import KPICard from './KPICard';
import DataTable, { ColumnDef } from './DataTable';
import InsightCallout from './InsightCallout';

export default function MetaTab() {
  const columns: ColumnDef<any>[] = [
    { key: 'name', header: 'Campaign Name', render: (row) => <span className="font-medium text-gray-900">{row.campaignName}</span> },
    { key: 'status', header: 'Status', render: (row) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
        row.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {row.status}
      </span>
    )},
    { key: 'spend', header: 'Spend', align: 'right', render: (row) => `€${row.metrics.spend.toFixed(2)}` },
    { key: 'impressions', header: 'Impressions', align: 'right', render: (row) => row.metrics.impressions.toLocaleString(), hideOnMobile: true },
    { key: 'clicks', header: 'Clicks', align: 'right', render: (row) => row.metrics.clicks.toLocaleString() },
    { key: 'ctr', header: 'CTR', align: 'right', render: (row) => `${row.metrics.ctr.toFixed(2)}%`, hideOnMobile: true },
    { key: 'reach', header: 'Reach', align: 'right', render: (row) => row.metrics.reach.toLocaleString(), hideOnMobile: true },
    { key: 'frequency', header: 'Frequency', align: 'right', render: (row) => row.metrics.frequency.toFixed(2) },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
        <KPICard
          label="Total Spend"
          value={`€${META_CACHED_DATA.totals.spend.toFixed(2)}`}
          subtext="+5.2%"
          subtextType="up"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 7.629A3 3 0 009.017 9.43c-.023.212-.047.425-.047.636 0 .211.024.424.047.636a3 3 0 005.104 1.801m-5.104-1.801a3 3 0 00-5.104-1.801" />
            </svg>
          }
        />
        <KPICard
          label="Impressions"
          value={META_CACHED_DATA.totals.impressions.toLocaleString()}
          subtext="+12.1%"
          subtextType="up"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <KPICard
          label="Clicks"
          value={META_CACHED_DATA.totals.clicks.toLocaleString()}
          subtext="+3.4%"
          subtextType="up"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          }
        />
        <KPICard
          label="Engagement"
          value={META_CACHED_DATA.totals.engagement.toLocaleString()}
          subtext="+8.7%"
          subtextType="up"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
        />
      </div>

      <InsightCallout 
        title="Meta Ads Performance" 
        text="The Valentine's Day campaign drove significant engagement (8,043 interactions) and video views (7,743) at a very low cost per engagement (€0.017). Consider creating a retargeting audience based on these video viewers for the next conversion-focused campaign."
      />

      {/* Campaigns Table */}
      <DataTable
        title="Meta Campaigns"
        columns={columns}
        data={META_CACHED_DATA.campaigns}
      />
    </div>
  );
}