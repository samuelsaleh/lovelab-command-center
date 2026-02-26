'use client';

import { useState } from 'react';
import ArtifactIframe from './ArtifactIframe';
import type { ParsedArtifact } from './ArtifactRenderer';
import { saveArtifact } from '@/lib/artifact-store';

interface ArtifactViewerProps {
  artifact: ParsedArtifact;
  onClose: () => void;
}

export default function ArtifactViewer({ artifact, onClose }: ArtifactViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveArtifact(artifact);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const typeLabel = artifact.type === 'jsx' ? 'React Component'
    : artifact.type === 'html' ? 'HTML' : 'Data';

  return (
    <div
      className={`flex flex-col bg-plum-dark transition-all duration-300 ease-in-out z-40 ${
        isFullscreen
          ? 'fixed inset-0 w-full h-full'
          : 'fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-[60%] xl:w-[65%] md:relative md:flex-1'
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-plum-dark">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              title="Close"
            />
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
              title="Minimize"
            />
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            />
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gold/20 text-gold-light">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-white">{artifact.title}</span>
              <span className="text-xs text-white/50 ml-2">{typeLabel}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Save */}
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              saved
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
            }`}
          >
            {saved ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                Saved
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save
              </>
            )}
          </button>

          {/* Toggle code view */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showCode 
                ? 'bg-gold/20 text-gold-light' 
                : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Code
          </button>
          
          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5-5M4 4v5m11 11l5 5m0 0l-5-5m5 5v-5" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors md:hidden"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {showCode ? (
          <div className="h-full overflow-auto bg-plum-dark/80 p-4">
            <pre className="text-xs font-mono text-white/80 whitespace-pre-wrap">
              {artifact.code}
            </pre>
          </div>
        ) : (
          <div className="h-full">
            {artifact.type === 'jsx' && (
              <ArtifactIframe code={artifact.code} className="w-full h-full" />
            )}
            {artifact.type === 'html' && (
              <iframe
                srcDoc={artifact.code}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
                title="HTML Artifact"
              />
            )}
            {artifact.type === 'json' && (
              <div className="h-full overflow-auto bg-plum-dark/80 p-4">
                <pre className="text-xs font-mono text-white/80 whitespace-pre-wrap">
                  {JSON.stringify(JSON.parse(artifact.code), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
