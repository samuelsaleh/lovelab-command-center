'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CampaignData } from '@/data/google-ads-cache';

const COLORS = ['#5D3A5E', '#C9A665', '#D1B3E0'];

interface SpendPieChartProps {
  campaigns: CampaignData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload || !payload[0]) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-gray-700">{payload[0].name}</p>
      <p className="text-xs text-gray-500">{'\u20AC'}{payload[0].value.toFixed(2)}</p>
    </div>
  );
}

export default function SpendPieChart({ campaigns }: SpendPieChartProps) {
  const pieData = campaigns
    .filter((c) => c.spend > 0)
    .map((c) => ({ name: c.name, value: c.spend }));

  const totalSpend = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Spend Allocation</h3>
      <div className="flex items-center gap-4">
        <div className="h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                strokeWidth={0}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2.5">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <div>
                <p className="text-sm font-medium text-gray-700">{d.name}</p>
                <p className="text-xs text-gray-400">
                  {'\u20AC'}{d.value.toFixed(2)} ({((d.value / totalSpend) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
