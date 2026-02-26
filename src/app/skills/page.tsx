'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useViewMode } from '@/context/ViewModeContext';
import {
  MARKETING_SKILLS,
  SKILL_CATEGORIES,
  type SkillCategory,
  type SkillPlatform,
  type MarketingSkill,
} from '@/data/marketing-skills';

const PLATFORM_BADGE: Record<SkillPlatform, { label: string; cls: string }> = {
  google: { label: 'Google', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  meta: { label: 'Meta', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  both: { label: 'Google + Meta', cls: 'bg-plum-bg text-plum border-plum/20' },
  linkedin: { label: 'LinkedIn', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  reddit: { label: 'Reddit', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
};

function SkillCard({ skill, isSimple }: { skill: MarketingSkill; isSimple: boolean }) {
  const badge = PLATFORM_BADGE[skill.platform];

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-plum/30 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-plum-dark">
          {skill.name}
        </h3>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-gray-500 flex-1">
        {isSimple ? skill.simpleLabel : skill.description}
      </p>

      {!isSimple && (
        <p className="mb-4 text-[11px] text-lovelab-muted">
          <span className="font-medium">When to use:</span> {skill.whenToUse}
        </p>
      )}

      <Link
        href={`/ai?prompt=${encodeURIComponent(skill.promptTemplate)}`}
        className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-plum px-4 py-2 text-xs font-medium text-white transition-all hover:bg-plum-dark hover:shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Run Skill
      </Link>
    </div>
  );
}

export default function SkillsPage() {
  const { isSimple } = useViewMode();
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list: MarketingSkill[] = MARKETING_SKILLS;
    if (activeCategory !== 'all') {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.simpleLabel.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeCategory, search]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MARKETING_SKILLS.length };
    for (const cat of SKILL_CATEGORIES) {
      counts[cat] = MARKETING_SKILLS.filter((s) => s.category === cat).length;
    }
    return counts;
  }, []);

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">
          Skills Library
        </h2>
        <p className="text-sm text-gray-400">
          {MARKETING_SKILLS.length} AI marketing skills across {SKILL_CATEGORIES.length} categories.
          Click &quot;Run Skill&quot; to send it to the AI Advisor.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <svg className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-plum focus:ring-1 focus:ring-plum/30"
        />
      </div>

      {/* Category filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            activeCategory === 'all'
              ? 'border-plum bg-plum text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-plum/40 hover:text-plum'
          }`}
        >
          All ({categoryCounts.all})
        </button>
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'border-plum bg-plum text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-plum/40 hover:text-plum'
            }`}
          >
            {cat} ({categoryCounts[cat]})
          </button>
        ))}
      </div>

      {/* Results count */}
      {search && (
        <p className="mb-4 text-xs text-gray-400">
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <svg className="mb-3 w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm text-gray-400">No skills match your search.</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all'); }}
            className="mt-2 text-xs font-medium text-plum hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} isSimple={isSimple} />
          ))}
        </div>
      )}
    </>
  );
}
