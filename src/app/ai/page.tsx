'use client';

import { useViewMode } from '@/context/ViewModeContext';
import AiChat from '@/components/AiChat';

const EXPERT_PRESETS = [
  { label: 'CPA diagnostics', prompt: 'Run CPA diagnostics on my Google and Meta data: break down what is driving my cost per acquisition and rank factors by impact.' },
  { label: 'Wasted spend', prompt: 'Find wasted spend in my Google and Meta accounts: identify search terms, placements, and audiences with spend but no conversions and give me exclusion lists.' },
  { label: 'Weekly summary', prompt: 'Generate a weekly account summary for my Google and Meta accounts: key changes, top 3 issues, wins, and priority actions for this week.' },
  { label: 'ROAS forecast', prompt: 'Forecast ROAS for the next 30, 60, and 90 days based on my Google and Meta data. Include confidence ranges.' },
  { label: 'Budget split', prompt: 'Allocate my ad budget across Google and Meta: recommend split by campaign and platform based on ROAS and goals.' },
  { label: 'Creative fatigue', prompt: 'Analyze my Meta ads for creative fatigue: identify ads that are losing performance and recommend when to rotate in new creative.' },
];

const SIMPLE_PRESETS = [
  { label: 'Why is my cost high?', prompt: 'Explain in simple terms why my advertising costs might be high and what I can do about it.' },
  { label: 'Weekly report', prompt: 'Give me a plain-English summary of how my ads performed this week and what to focus on.' },
  { label: 'Where am I wasting money?', prompt: 'Tell me where I might be wasting ad budget and what I should turn off.' },
];

export default function AiAdvisorPage() {
  const { isSimple } = useViewMode();
  const presets = isSimple ? SIMPLE_PRESETS : EXPERT_PRESETS;

  return (
    <>
      <div className="mb-5">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">
          AI advisor
        </h2>
        <p className="text-sm text-gray-400">
          {isSimple
            ? 'Ask anything about your ads in plain language.'
            : 'Claude Opus 4.5 with live Google Ads + Meta Ads data and 44 marketing skills.'}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {presets.map((p) => (
          <a
            key={p.label}
            href={`/ai?prompt=${encodeURIComponent(p.prompt)}`}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-plum hover:text-plum"
          >
            {p.label}
          </a>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <AiChat compact={false} />
      </div>
    </>
  );
}
