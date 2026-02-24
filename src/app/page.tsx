'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import AiChat from '@/components/AiChat';
import { IconEuro, IconEye, IconClick, IconTarget } from '@/components/icons';
import { useViewMode } from '@/context/ViewModeContext';
import { useDataRefresh } from '@/context/DataRefreshContext';
import { getSkillById } from '@/data/marketing-skills';
import Link from 'next/link';

interface PlatformData {
  totals: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions?: number;
    reach?: number;
  };
  campaigns?: any[];
  fetchedAt?: string;
}

const ACTIONS = [
  {
    priority: 'high' as const,
    title: 'Conversion rate is 0.14% on Google',
    text: '2 conversions from 1,043 clicks. Check landing pages and verify your conversion tracking is firing.',
    prompt: 'Run CPA diagnostics on my Google Ads data. My conversion rate is 0.14% — 2 conversions from 1,043 clicks. Break down what is driving this and give me the top 3 fixes.',
  },
  {
    priority: 'high' as const,
    title: 'Performance Max has no conversions',
    text: '€25.76 spent with zero conversions. Pause it or add stronger creative assets before next week.',
    prompt: 'My Performance Max campaign spent €25.76 with 0 conversions. Should I pause it or fix it? What creative assets should I add?',
  },
  {
    priority: 'opportunity' as const,
    title: 'Meta video engagement is strong',
    text: '€0.02 per video view, 8,043 engagements. Repurpose this creative for Google Display and YouTube.',
    prompt: 'My Meta Valentine\'s creative has exceptional engagement (€0.02/view, 8,043 engagements). How do I repurpose this for Google Display and YouTube?',
  },
];

const SIMPLE_ACTIONS = [
  {
    priority: 'high' as const,
    title: 'Cost per sale is too high',
    text: 'Most people who click are not buying. Your product pages or ad targeting may need adjusting.',
    prompt: 'My ads are getting clicks but very few sales. In simple terms, what should I check first?',
  },
  {
    priority: 'opportunity' as const,
    title: 'Social media ads are working well',
    text: 'Your Instagram and Facebook video ads are getting a lot of engagement at a low cost.',
    prompt: 'My Meta video ads are performing well. How do I grow on this?',
  },
  {
    priority: 'info' as const,
    title: 'France is an untapped market',
    text: 'You are not running any French-language campaigns yet. This could be a big growth opportunity.',
    prompt: 'I want to start advertising in France. What campaigns should I run first and in which language?',
  },
];

const PRIORITY_STYLES = {
  high: 'border-l-red-400 bg-red-50/40',
  opportunity: 'border-l-emerald-400 bg-emerald-50/40',
  info: 'border-l-blue-400 bg-blue-50/40',
};

const PRIORITY_LABELS = {
  high: { text: 'Action needed', color: 'text-red-600 bg-red-50' },
  opportunity: { text: 'Opportunity', color: 'text-emerald-700 bg-emerald-50' },
  info: { text: 'Insight', color: 'text-blue-700 bg-blue-50' },
};

function Dashboard() {
  const { isSimple } = useViewMode();
  const { refreshKey } = useDataRefresh();
  const searchParams = useSearchParams();
  const skillId = searchParams.get('skill');
  const skill = skillId ? getSkillById(skillId) : null;
  const initialChatPrompt = skill?.promptTemplate ?? '';
  const [google, setGoogle] = useState<PlatformData | null>(null);
  const [meta, setMeta] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const [gRes, mRes] = await Promise.allSettled([
          fetch('/api/google-ads').then(r => r.json()),
          fetch('/api/meta-ads?type=insights').then(r => r.json()),
        ]);
        if (gRes.status === 'fulfilled') setGoogle(gRes.value);
        if (mRes.status === 'fulfilled') setMeta(mRes.value);
      } catch (e) {
        console.error('Failed to fetch data:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const totalSpend = (google?.totals?.spend || 0) + (meta?.totals?.spend || 0);
  const totalImpressions = (google?.totals?.impressions || 0) + (meta?.totals?.impressions || 0);
  const totalClicks = (google?.totals?.clicks || 0) + (meta?.totals?.clicks || 0);
  const totalConversions = google?.totals?.conversions || 0;
  const actions = isSimple ? SIMPLE_ACTIONS : ACTIONS;

  return (
    <>
      {/* KPI Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {isSimple ? (
          <>
            <MetricCard
              label="Money spent"
              value={`€${totalSpend.toFixed(0)}`}
              change="Last 30 days"
              icon={<IconEuro className="w-3.5 h-3.5" />}
            />
            <MetricCard
              label="People reached"
              value={totalImpressions.toLocaleString()}
              icon={<IconEye className="w-3.5 h-3.5" />}
            />
            <MetricCard
              label="Ad clicks"
              value={totalClicks.toLocaleString()}
              icon={<IconClick className="w-3.5 h-3.5" />}
            />
            <MetricCard
              label="Sales from ads"
              value={totalConversions.toString()}
              change={totalConversions < 5 ? 'Needs improvement' : 'On track'}
              changeType={totalConversions < 5 ? 'down' : 'up'}
              icon={<IconTarget className="w-3.5 h-3.5" />}
            />
          </>
        ) : (
          <>
            <MetricCard
              label="Total spend"
              value={`€${totalSpend.toFixed(2)}`}
              change={`Google €${(google?.totals?.spend || 0).toFixed(2)} · Meta €${(meta?.totals?.spend || 0).toFixed(2)}`}
              icon={<IconEuro className="w-3.5 h-3.5" />}
            />
            <MetricCard
              label="Impressions"
              value={totalImpressions.toLocaleString()}
              change={`Google ${(google?.totals?.impressions || 0).toLocaleString()} · Meta ${(meta?.totals?.impressions || 0).toLocaleString()}`}
              icon={<IconEye className="w-3.5 h-3.5" />}
            />
            <MetricCard
              label="Clicks"
              value={totalClicks.toLocaleString()}
              change={`Google ${(google?.totals?.clicks || 0).toLocaleString()} · Meta ${(meta?.totals?.clicks || 0).toLocaleString()}`}
              icon={<IconClick className="w-3.5 h-3.5" />}
            />
            <MetricCard
              label="Conversions"
              value={totalConversions.toString()}
              change={totalConversions < 5 ? 'Needs optimization' : 'On track'}
              changeType={totalConversions < 5 ? 'down' : 'up'}
              icon={<IconTarget className="w-3.5 h-3.5" />}
            />
          </>
        )}
      </div>

      {/* Action Items */}
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {isSimple ? 'What to focus on' : 'Priority actions'}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              {isSimple ? 'Three things worth your attention right now' : 'Based on your live data — updated every 5 minutes'}
            </p>
          </div>
          <Link
            href="/ai"
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-plum hover:text-plum"
          >
            Open AI
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {actions.map((action, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 border-l-4 px-5 py-4 ${PRIORITY_STYLES[action.priority]}`}
            >
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_LABELS[action.priority].color}`}>
                    {PRIORITY_LABELS[action.priority].text}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{action.text}</p>
              </div>
              <Link
                href={`/ai?prompt=${encodeURIComponent(action.prompt)}`}
                className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-plum hover:text-plum"
              >
                Ask AI
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">AI advisor</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              {isSimple ? 'Ask anything about your ads' : 'Claude Opus 4.5 — live data, brand context, 44 marketing skills'}
            </p>
          </div>
          <Link
            href="/ai"
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-plum hover:text-plum"
          >
            Full screen
          </Link>
        </div>
        <AiChat compact initialPrompt={initialChatPrompt} />
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[200px] items-center justify-center text-sm text-gray-400">Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
