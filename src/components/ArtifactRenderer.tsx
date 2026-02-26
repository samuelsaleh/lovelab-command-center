'use client';

import { useState } from 'react';
import { saveArtifact } from '@/lib/artifact-store';

export interface ParsedArtifact {
  type: 'jsx' | 'html' | 'json';
  code: string;
  title?: string;
  truncated?: boolean;
}

function tryCloseComponent(code: string): string {
  let braceDepth = 0;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '{') braceDepth++;
    else if (ch === '}') braceDepth--;
  }
  let closed = code;
  while (braceDepth > 0) {
    closed += '\n}';
    braceDepth--;
  }
  return closed;
}

export function parseArtifact(content: string): { 
  artifact: ParsedArtifact | null; 
  textWithoutArtifact: string;
} {
  const jsxMatch = content.match(/```(?:jsx|tsx|javascript|js)\n([\s\S]*?)```/);
  if (jsxMatch) {
    const code = jsxMatch[1].trim();
    const textWithoutArtifact = content.replace(jsxMatch[0], '').trim();
    const componentMatch = code.match(/export default function (\w+)/);
    const title = componentMatch ? componentMatch[1] : 'Interactive Dashboard';
    return { artifact: { type: 'jsx', code, title }, textWithoutArtifact };
  }

  const truncatedMatch = content.match(/```(?:jsx|tsx|javascript|js)\n([\s\S]+)$/);
  if (truncatedMatch) {
    const rawCode = truncatedMatch[1].trim();
    if (rawCode.includes('export default function') || (rawCode.includes('function ') && rawCode.includes('return'))) {
      const code = tryCloseComponent(rawCode);
      const textWithoutArtifact = content.replace(truncatedMatch[0], '').trim();
      const componentMatch = code.match(/export default function (\w+)/);
      const title = componentMatch ? componentMatch[1] : 'Interactive Dashboard';
      return { artifact: { type: 'jsx', code, title, truncated: true }, textWithoutArtifact };
    }
  }

  const htmlMatch = content.match(/```(?:html)\n([\s\S]*?)```/);
  if (htmlMatch) {
    const code = htmlMatch[1].trim();
    const textWithoutArtifact = content.replace(htmlMatch[0], '').trim();
    return { artifact: { type: 'html', code, title: 'HTML Artifact' }, textWithoutArtifact };
  }

  const artifactMatch = content.match(/```artifact\n([\s\S]*?)```/);
  if (artifactMatch) {
    const raw = artifactMatch[1].trim();
    const textWithoutArtifact = content.replace(artifactMatch[0], '').trim();
    if (raw.startsWith('<') || raw.startsWith('<!')) {
      return { artifact: { type: 'html', code: raw, title: 'HTML Artifact' }, textWithoutArtifact };
    }
    try {
      const parsed = JSON.parse(raw);
      return { artifact: { type: 'json', code: raw, title: parsed.title || 'Data' }, textWithoutArtifact };
    } catch {
      return { artifact: null, textWithoutArtifact: content };
    }
  }

  return { artifact: null, textWithoutArtifact: content };
}

interface ArtifactRendererProps {
  content: string;
  onOpenArtifact?: (artifact: ParsedArtifact) => void;
}

export default function ArtifactRenderer({ content, onOpenArtifact }: ArtifactRendererProps) {
  const { artifact } = parseArtifact(content);
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!artifact) return null;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveArtifact(artifact);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const typeConfig = {
    jsx: {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      label: 'React Dashboard',
      description: 'Interactive React component with charts and data',
    },
    html: {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      label: 'HTML',
      description: 'Static HTML content',
    },
    json: {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      label: 'Data',
      description: 'Structured data',
    },
  };

  const config = typeConfig[artifact.type];

  return (
    <div
      className={`mt-4 overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
        isHovered ? 'border-plum/40 shadow-xl scale-[1.01]' : 'border-lovelab-border shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenArtifact?.(artifact)}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 -skew-x-12 pointer-events-none ${
        isHovered ? 'translate-x-full' : '-translate-x-full'
      }`} />

      {/* Header */}
      <div className="relative bg-gradient-to-r from-plum to-plum-dark px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 text-white backdrop-blur-sm">
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  {config.label}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span className="text-[10px] font-medium text-white/70">Interactive</span>
              </div>
              <h3 className="text-sm font-semibold text-white">{artifact.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                saved
                  ? 'bg-emerald-500/30 text-emerald-200'
                  : 'bg-white/15 text-white/80 hover:bg-white/25'
              }`}
              title={saved ? 'Saved' : 'Save artifact'}
            >
              {saved ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              )}
              {saved ? 'Saved' : 'Save'}
            </button>

            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm transition-all duration-200 ${
                isHovered ? 'bg-gold text-plum-dark shadow-lg' : 'hover:bg-white/30'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              Open
            </button>
          </div>
        </div>
      </div>

      {/* Preview area */}
      <div className="bg-plum-dark/95 p-4">
        <div className="flex items-center gap-3 text-white/40">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs font-mono">{artifact.title}.jsx</span>
        </div>
        
        <div className="mt-3 font-mono text-xs leading-relaxed">
          <div className="text-gold-light">export default function</div>
          <div className="text-white/60 ml-2">{artifact.title}() {'{'}</div>
          <div className="text-white/30 ml-4">// Interactive dashboard with charts...</div>
          <div className="text-white/30 ml-4">// Click &quot;Open&quot; to view live</div>
          <div className="text-white/60 ml-2">{'}'}</div>
        </div>
      </div>

      {artifact.truncated && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-950/40 border-t border-amber-800/40">
          <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-[11px] text-amber-300/80">Dashboard may be incomplete — response was truncated</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-plum-dark border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{config.description}</span>
        </div>
        <span className="text-[10px] text-gold/70 font-medium">Click to interact</span>
      </div>
    </div>
  );
}
