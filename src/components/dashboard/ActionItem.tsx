'use client';

import type { ActionStep } from '@/data/google-ads-cache';

const TIMELINE_COLORS: Record<string, string> = {
  Immediate: 'bg-red-50 text-red-700',
  Today: 'bg-amber-50 text-amber-700',
  'This week': 'bg-blue-50 text-blue-700',
  'Next week': 'bg-plum-bg text-plum',
  'Next month': 'bg-gray-100 text-gray-600',
};

export default function ActionItem({ step, title, description, timeline }: ActionStep) {
  const timelineStyle = TIMELINE_COLORS[timeline] || 'bg-gray-100 text-gray-600';

  return (
    <div className="flex gap-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum text-sm font-bold text-white">
        {step}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${timelineStyle}`}>
            {timeline}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
    </div>
  );
}
