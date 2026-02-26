'use client';

import { useState, useEffect } from 'react';
import { useViewMode } from '@/context/ViewModeContext';
import AiChat from '@/components/AiChat';
import ArtifactViewer from '@/components/ArtifactViewer';
import type { ParsedArtifact } from '@/components/ArtifactRenderer';
import { getArtifacts, deleteArtifact, artifactToParseFormat, type SavedArtifact } from '@/lib/artifact-store';

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

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function AiAdvisorPage() {
  const { isSimple } = useViewMode();
  const presets = isSimple ? SIMPLE_PRESETS : EXPERT_PRESETS;
  const [activeArtifact, setActiveArtifact] = useState<ParsedArtifact | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [savedList, setSavedList] = useState<SavedArtifact[]>([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('pending-artifact');
      if (stored) {
        sessionStorage.removeItem('pending-artifact');
        setActiveArtifact(JSON.parse(stored));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (showSaved) setSavedList(getArtifacts());
  }, [showSaved]);

  const handleLoadSaved = (saved: SavedArtifact) => {
    setActiveArtifact(artifactToParseFormat(saved));
    setShowSaved(false);
  };

  const handleDeleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteArtifact(id);
    setSavedList((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex h-[calc(100vh-80px)] -m-4 sm:-m-5 lg:-m-6">
      {/* Left side: Chat */}
      <div className={`flex flex-col flex-1 p-4 sm:p-5 lg:p-6 overflow-hidden transition-all duration-300 ${activeArtifact ? 'md:w-1/2 lg:w-[40%] xl:w-[35%] flex-none' : 'w-full'}`}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">
              AI Advisor
            </h2>
            <p className="text-sm text-gray-400">
              {isSimple
                ? 'Ask anything about your ads in plain language.'
                : 'Claude Opus 4.5 with live Google Ads + Meta Ads data. Creates interactive dashboards.'}
            </p>
          </div>

          {/* Saved Artifacts toggle */}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              showSaved
                ? 'border-plum bg-plum/10 text-plum'
                : 'border-gray-200 bg-white text-gray-500 hover:border-plum/40 hover:text-plum'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Saved
          </button>
        </div>

        {/* Saved Artifacts dropdown */}
        {showSaved && (
          <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <span className="text-xs font-semibold text-plum-dark">Saved Artifacts</span>
              <button
                onClick={() => setShowSaved(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {savedList.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No saved artifacts yet. Click &quot;Save&quot; on any artifact card to keep it here.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                {savedList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLoadSaved(item)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-plum-bg"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-plum/10 text-plum">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{item.title}</div>
                      <div className="text-[11px] text-gray-400">{formatDate(item.savedAt)}</div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSaved(e, item.id)}
                      className="shrink-0 rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {presets.map((p) => (
            <a
              key={p.label}
              href={`/ai?prompt=${encodeURIComponent(p.prompt)}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-all hover:border-plum hover:text-plum hover:shadow-sm"
            >
              {p.label}
            </a>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white flex-1 flex flex-col shadow-lg">
          <AiChat 
            compact={false} 
            onArtifactOpen={(artifact) => setActiveArtifact(artifact)}
          />
        </div>
      </div>

      {/* Right side: Artifact Viewer */}
      {activeArtifact && (
        <ArtifactViewer 
          artifact={activeArtifact}
          onClose={() => setActiveArtifact(null)} 
        />
      )}
    </div>
  );
}
