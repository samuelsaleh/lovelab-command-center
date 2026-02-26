'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { DeviceData } from '@/data/google-ads-cache';

const COLORS = ['#5D3A5E', '#C9A665', '#D486C3'];

interface DeviceDonutProps {
  data: DeviceData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { spend: number } }> }) {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-gray-700">{d.name}</p>
      <p className="text-xs text-gray-500">{d.value}% of traffic</p>
      <p className="text-xs text-gray-500">{'\u20AC'}{d.payload.spend.toFixed(2)} spend</p>
    </div>
  );
}

export default function DeviceDonut({ data }: DeviceDonutProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Device Breakdown</h3>
      <div className="flex items-center gap-4">
        <div className="h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="percentage"
                nameKey="device"
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((d, i) => (
            <div key={d.device} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <div>
                <p className="text-sm font-medium text-gray-700">{d.device}</p>
                <p className="text-xs text-gray-400">
                  {d.percentage}% &middot; {d.clicks} clicks &middot; {'\u20AC'}{d.spend.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
