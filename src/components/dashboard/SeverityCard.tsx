'use client';

import type { InsightCard } from '@/data/google-ads-cache';

const SEVERITY_STYLES = {
  CRITICAL: {
    border: 'border-l-red-500',
    badge: 'bg-red-50 text-red-700',
    icon: (
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  WARNING: {
    border: 'border-l-amber-400',
    badge: 'bg-amber-50 text-amber-700',
    icon: (
      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  INFO: {
    border: 'border-l-blue-400',
    badge: 'bg-blue-50 text-blue-700',
    icon: (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
  },
} as const;

export default function SeverityCard({ severity, title, detail, action }: InsightCard) {
  const style = SEVERITY_STYLES[severity];

  return (
    <div className={`rounded-lg border border-gray-200 border-l-4 ${style.border} bg-white p-4 transition-all hover:shadow-sm`}>
      <div className="mb-2 flex items-center gap-2">
        {style.icon}
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
          {severity}
        </span>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-gray-600">{detail}</p>
      <div className="rounded-lg bg-gray-50 px-3 py-2.5">
        <p className="text-xs font-medium text-gray-500">
          Recommended action
        </p>
        <p className="mt-0.5 text-sm text-gray-700">{action}</p>
      </div>
    </div>
  );
}
