'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useViewMode } from '@/context/ViewModeContext';
import {
  MARKETING_SKILLS,
  SKILL_CATEGORIES,
  getSkillsForSimpleMode,
  getSkillById,
  type MarketingSkill,
  type SkillCategory,
  type SkillPlatform,
} from '@/data/marketing-skills';

const PLATFORM_LABELS: Record<SkillPlatform, string> = {
  google: 'Google',
  meta: 'Meta',
  both: 'Google + Meta',
  linkedin: 'LinkedIn',
  reddit: 'Reddit',
};

const SIMPLE_GROUPS: { label: string; ids: string[] }[] = [
  { label: 'Fix problems', ids: ['cpa-diagnostics', 'wasted-spend-finder', 'creative-fatigue-detection', 'landing-page-audit'] },
  { label: 'Find opportunities', ids: ['roas-forecasting', 'channel-mix-optimizer', 'ad-copy-variant-generator', 'icp-research-assistant', 'search-term-mining'] },
  { label: 'Get reports', ids: ['weekly-account-summary', 'client-report-narratives'] },
];

function SkillCard({ skill, runSkillHref }: { skill: MarketingSkill; runSkillHref: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:border-plum-light hover:shadow-md hover:shadow-plum/5 sm:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded bg-plum-bg px-2 py-0.5 text-[10px] font-semibold text-plum sm:text-xs">
          {PLATFORM_LABELS[skill.platform]}
        </span>
      </div>
      <h3 className="mb-1.5 font-display text-base font-semibold text-plum-dark sm:text-lg">{skill.name}</h3>
      <p className="mb-3 flex-1 text-[12px] leading-relaxed text-gray-600 sm:text-[13px]">{skill.description}</p>
      <Link
        href={runSkillHref}
        className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-plum-dark"
      >
        Run skill
      </Link>
    </div>
  );
}

export default function SkillsPage() {
  const { isSimple } = useViewMode();
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<SkillPlatform | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | ''>('');

  const skillsToShow = useMemo(() => {
    if (isSimple) {
      const simpleSkills = getSkillsForSimpleMode();
      if (!search.trim() && !platformFilter && !categoryFilter) return simpleSkills;
      return simpleSkills.filter((s) => {
        const matchSearch = !search.trim() || s.name.toLowerCase().includes(search.toLowerCase()) || s.simpleLabel.toLowerCase().includes(search.toLowerCase());
        const matchPlatform = !platformFilter || s.platform === platformFilter || (platformFilter === 'both' && s.platform === 'both');
        const matchCategory = !categoryFilter || s.category === categoryFilter;
        return matchSearch && matchPlatform && matchCategory;
      });
    }
    let list = MARKETING_SKILLS;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.simpleLabel.toLowerCase().includes(q));
    }
    if (platformFilter) list = list.filter((s) => s.platform === platformFilter);
    if (categoryFilter) list = list.filter((s) => s.category === categoryFilter);
    return list;
  }, [isSimple, search, platformFilter, categoryFilter]);

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">
          {isSimple ? 'Marketing tools' : 'Skills library'}
        </h2>
        <p className="text-sm text-gray-400">
          {isSimple
            ? 'Run these to fix problems, find opportunities, and get reports.'
            : '44 pre-built marketing skills for Google Ads, Meta Ads, and more. Each one runs against your live data.'}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <input
          type="search"
          placeholder={isSimple ? 'Search skills…' : 'Search by name or description…'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-[44px] flex-1 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-plum"
        />
        {!isSimple && (
          <>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter((e.target.value || '') as SkillPlatform | '')}
              className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-plum"
            >
              <option value="">All platforms</option>
              {(['google', 'meta', 'both', 'linkedin', 'reddit'] as const).map((p) => (
                <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter((e.target.value || '') as SkillCategory | '')}
              className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-plum"
            >
              <option value="">All categories</option>
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {isSimple ? (
        <div className="space-y-8">
          {SIMPLE_GROUPS.map((group) => {
            const skills = group.ids.map((id) => getSkillById(id)).filter(Boolean) as MarketingSkill[];
            const visible = skills.filter((s) => skillsToShow.some((t) => t.id === s.id));
            if (visible.length === 0) return null;
            return (
              <section key={group.label}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{group.label}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} runSkillHref={`/?skill=${skill.id}`} />
                  ))}
                </div>
              </section>
            );
          })}
          {skillsToShow.length === 0 && (
            <p className="text-sm text-gray-500">No skills match your search.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {SKILL_CATEGORIES.map((category) => {
            const inCategory = skillsToShow.filter((s) => s.category === category);
            if (inCategory.length === 0) return null;
            return (
              <section key={category}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{category}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {inCategory.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} runSkillHref={`/?skill=${skill.id}`} />
                  ))}
                </div>
              </section>
            );
          })}
          {skillsToShow.length === 0 && (
            <p className="text-sm text-gray-500">No skills match your filters.</p>
          )}
        </div>
      )}
    </>
  );
}
