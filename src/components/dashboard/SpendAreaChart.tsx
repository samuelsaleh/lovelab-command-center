'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { DailyDataPoint } from '@/data/google-ads-cache';

interface SpendAreaChartProps {
  data: DailyDataPoint[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-gray-600">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{'\u20AC'}{entry.value.toFixed(2)}</span>
        </p>
      ))}
    </div>
  );
}

export default function SpendAreaChart({ data }: SpendAreaChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Daily Spend by Campaign</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradSearch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5D3A5E" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5D3A5E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPmax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A665" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#C9A665" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `\u20AC${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="searchBrand"
              name="Search - Brand"
              stackId="1"
              stroke="#5D3A5E"
              strokeWidth={2}
              fill="url(#gradSearch)"
            />
            <Area
              type="monotone"
              dataKey="pmax"
              name="PMax - 2"
              stackId="1"
              stroke="#C9A665"
              strokeWidth={2}
              fill="url(#gradPmax)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
