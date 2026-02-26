'use client';

import type { HealthScore } from '@/data/google-ads-cache';

function getScoreColor(score: number): { bg: string; text: string; ring: string } {
  if (score <= 3) return { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-200' };
  if (score <= 5) return { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' };
  if (score <= 7) return { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' };
}

export default function HealthScoreCard({ category, score, maxScore }: HealthScore) {
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm">
      <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ring-4 ${color.bg} ${color.ring}`}>
        <span className={`text-xl font-bold ${color.text}`}>{score}</span>
      </div>
      <span className="text-center text-xs font-medium text-gray-500">
        {category}
      </span>
      <span className="mt-0.5 text-[10px] text-gray-400">out of {maxScore}</span>
    </div>
  );
}
