'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string;
  subtext?: string;
  subtextType?: 'up' | 'down' | 'neutral';
  accentBorder?: boolean;
  sparklineData?: { v: number }[];
  sparklineColor?: string;
  icon?: ReactNode;
}

export default function KPICard({
  label,
  value,
  subtext,
  subtextType = 'neutral',
  accentBorder = false,
  sparklineData,
  sparklineColor = '#5D3A5E',
  icon,
}: KPICardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-white p-4 transition-all hover:shadow-md ${
        accentBorder ? 'border-t-2 border-t-plum border-gray-200' : 'border-gray-200'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        {icon && (
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-plum-bg text-plum">
            {icon}
          </span>
        )}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
          {subtext && (
            <div
              className={`mt-1 text-xs font-medium ${
                subtextType === 'up'
                  ? 'text-emerald-600'
                  : subtextType === 'down'
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}
            >
              {subtext}
            </div>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="h-[30px] w-[80px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={sparklineColor}
                  strokeWidth={1.5}
                  fill={`url(#spark-${label})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
