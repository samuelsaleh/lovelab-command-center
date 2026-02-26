'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { GeoData } from '@/data/google-ads-cache';

const BAR_COLORS = ['#5D3A5E', '#C9A665', '#D486C3', '#8957AF', '#D1B3E0', '#C4A084'];

interface HorizontalBarChartProps {
  data: GeoData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: GeoData }> }) {
  if (!active || !payload || !payload[0]) return null;
  const geo = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-gray-700">{geo.country}</p>
      <p className="text-xs text-gray-500">Spend: {'\u20AC'}{geo.spend.toFixed(2)}</p>
      <p className="text-xs text-gray-500">Clicks: {geo.clicks} &middot; CTR: {geo.ctr}%</p>
    </div>
  );
}

export default function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Spend by Country</h3>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `\u20AC${v}`}
            />
            <YAxis
              type="category"
              dataKey="country"
              tick={{ fontSize: 12, fill: '#374151' }}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="spend" radius={[0, 4, 4, 0]} barSize={22}>
              {data.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
