'use client';

import KPICard from './KPICard';
import SpendAreaChart from './SpendAreaChart';
import DeviceDonut from './DeviceDonut';
import ClicksBarChart from './ClicksBarChart';
import {
  DAILY_SPEND,
  DAILY_CLICKS,
  DEVICE_DATA,
  TOTALS,
} from '@/data/google-ads-cache';

export default function OverviewTab() {
  const spendSparkline = DAILY_SPEND.map((d) => ({ v: d.total }));
  const clickSparkline = DAILY_CLICKS.map((d) => ({ v: d.total }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          label="Total Spend"
          value={`\u20AC${TOTALS.spend.toFixed(2)}`}
          subtext="Last 30 days"
          accentBorder
          sparklineData={spendSparkline}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 7.629A3 3 0 009.017 9.43c0 1.897 1.164 2.93 2.326 3.68 1.11.72 2.04 1.46 2.04 2.89a3 3 0 01-5.84.96M12 3v2.25m0 13.5V21" />
            </svg>
          }
        />
        <KPICard
          label="Total Clicks"
          value={TOTALS.clicks.toLocaleString()}
          subtext={`${TOTALS.ctr}% CTR`}
          sparklineData={clickSparkline}
          sparklineColor="#C9A665"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
          }
        />
        <KPICard
          label="Impressions"
          value={TOTALS.impressions.toLocaleString()}
          subtext="22.3K total"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <KPICard
          label="Avg. CPC"
          value={`\u20AC${TOTALS.avgCpc.toFixed(2)}`}
          subtext="Per click cost"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          }
        />
        <KPICard
          label="Conversions"
          value={TOTALS.conversions.toString()}
          subtext={`CPA \u20AC${TOTALS.costPerConversion.toFixed(2)}`}
          subtextType="down"
          accentBorder
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KPICard
          label="ROAS"
          value={`${TOTALS.roas.toFixed(2)}x`}
          subtext="Return on ad spend"
          subtextType={TOTALS.roas >= 3 ? 'up' : 'down'}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          }
        />
      </div>

      <SpendAreaChart data={DAILY_SPEND} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <DeviceDonut data={DEVICE_DATA} />
        </div>
        <div className="lg:col-span-3">
          <ClicksBarChart data={DAILY_CLICKS} />
        </div>
      </div>
    </div>
  );
}
