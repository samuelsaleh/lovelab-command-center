'use client';

import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
}

export default function MetricCard({ label, value, change, changeType = 'neutral', icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-lovelab-border hover:shadow-sm md:p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
            {icon}
          </span>
        )}
        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</span>
      </div>
      <div className="text-[22px] font-bold tracking-tight text-gray-900 md:text-[26px]">{value}</div>
      {change && (
        <div className={`mt-1.5 text-xs font-medium ${
          changeType === 'up' ? 'text-emerald-600' :
          changeType === 'down' ? 'text-red-500' :
          'text-gray-400'
        }`}>
          {change}
        </div>
      )}
    </div>
  );
}
