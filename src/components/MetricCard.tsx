'use client';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: string;
  iconBg?: string;
  iconColor?: string;
}

export default function MetricCard({ label, value, change, changeType = 'neutral', icon, iconBg, iconColor }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg hover:shadow-plum/5 md:p-5">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-gray-500 sm:text-xs">
        {icon && (
          <span className={`flex h-4 w-4 items-center justify-center rounded text-[10px] ${iconBg} ${iconColor}`}>
            {icon}
          </span>
        )}
        {label}
      </div>
      <div className="text-[22px] font-bold tracking-tight text-gray-900 md:text-[28px]">{value}</div>
      {change && (
        <div className={`mt-1.5 text-xs font-medium ${
          changeType === 'up' ? 'text-emerald-600' :
          changeType === 'down' ? 'text-red-500' :
          'text-gray-500'
        }`}>
          {change}
        </div>
      )}
    </div>
  );
}
