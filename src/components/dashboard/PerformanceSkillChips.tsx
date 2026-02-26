'use client';

import { TabId } from './TabNavigation';

const TAB_SKILLS: Record<TabId, { label: string; prompt: string }[]> = {
  overview: [
    { label: 'Weekly summary', prompt: 'Generate a weekly account summary for my Google and Meta accounts: key changes, top 3 issues, wins, and priority actions for this week.' },
    { label: 'ROAS forecast', prompt: 'Forecast ROAS for the next 30, 60, and 90 days based on my Google and Meta data. Include confidence ranges.' },
  ],
  campaigns: [
    { label: 'CPA diagnostics', prompt: 'Run CPA diagnostics on my Google campaigns: break down what is driving my cost per acquisition and rank factors by impact.' },
    { label: 'Budget split', prompt: 'Allocate my ad budget across Google campaigns: recommend split by campaign based on ROAS and goals.' },
  ],
  geography: [
    { label: 'Market expansion', prompt: 'Analyze my geographic performance and recommend which new markets I should expand into next, based on current ROAS and CPA trends.' },
    { label: 'Localize copy', prompt: 'Generate localized ad copy variations for my top 3 performing countries.' },
  ],
  'search-terms': [
    { label: 'Wasted spend', prompt: 'Find wasted spend in my Google search terms: identify terms with spend but no conversions and give me an exact negative keyword list.' },
    { label: 'Keyword cannibalization', prompt: 'Check my search terms for keyword cannibalization across campaigns.' },
  ],
  insights: [
    { label: 'Action plan', prompt: 'Based on the current insights and health scores, create a step-by-step action plan for me to execute this week.' },
    { label: 'Account audit', prompt: 'Run a full Google Ads account audit and prioritize the top 5 things I need to fix immediately.' },
  ],
  'meta-ads': [
    { label: 'Creative fatigue', prompt: 'Analyze my Meta ads for creative fatigue: identify ads that are losing performance and recommend when to rotate in new creative.' },
    { label: 'Audience overlap', prompt: 'Check my Meta campaigns for audience overlap and recommend consolidation strategies.' },
  ]
};

interface PerformanceSkillChipsProps {
  activeTab: TabId;
}

export default function PerformanceSkillChips({ activeTab }: PerformanceSkillChipsProps) {
  const skills = TAB_SKILLS[activeTab] || [];

  if (skills.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mr-1">Ask AI:</span>
      {skills.map((skill, i) => (
        <a
          key={i}
          href={`/ai?prompt=${encodeURIComponent(skill.prompt)}`}
          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-plum hover:text-plum flex items-center gap-1.5 shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {skill.label}
        </a>
      ))}
    </div>
  );
}