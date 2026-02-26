'use client';

import { useEffect, useRef, useState } from 'react';

interface ArtifactIframeProps {
  code: string;
  className?: string;
  onError?: (error: string) => void;
  onReady?: () => void;
}

export default function ArtifactIframe({ 
  code, 
  className = '',
  onError,
  onReady 
}: ArtifactIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasRendered = useRef(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      
      const { type, error: errorMsg } = event.data || {};
      
      if (type === 'artifact-ready') {
        setIsLoading(false);
        onReady?.();
        
        // Send the code to render
        if (code && !hasRendered.current) {
          hasRendered.current = true;
          iframe.contentWindow?.postMessage({ type: 'render', code }, '*');
        }
      }
      
      if (type === 'artifact-error') {
        setError(errorMsg);
        onError?.(errorMsg);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [code, onError, onReady]);

  // Re-render when code changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !code || isLoading) return;
    
    hasRendered.current = true;
    iframe.contentWindow?.postMessage({ type: 'render', code }, '*');
  }, [code, isLoading]);

  // Handle iframe load
  const handleLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    // Give the iframe a moment to initialize
    setTimeout(() => {
      if (code) {
        iframe.contentWindow?.postMessage({ type: 'render', code }, '*');
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-700 border-t-plum rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading artifact...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-10 p-4">
          <div className="max-w-md bg-red-950/50 border border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Render Error
            </div>
            <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono">{error}</pre>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src="/artifact-renderer.html"
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="Artifact Preview"
        onLoad={handleLoad}
      />
    </div>
  );
}
