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
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:shadow-plum/5 transition-shadow">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wide mb-2">
        {icon && (
          <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${iconBg} ${iconColor}`}>
            {icon}
          </span>
        )}
        {label}
      </div>
      <div className="text-[28px] font-bold text-gray-900 tracking-tight">{value}</div>
      {change && (
        <div className={`text-xs mt-1.5 font-medium ${
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
