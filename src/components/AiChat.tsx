'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useViewMode } from '@/context/ViewModeContext';
import { getChatPresetSkills } from '@/data/marketing-skills';
import ArtifactRenderer, { parseArtifact, ParsedArtifact } from '@/components/ArtifactRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiChat({ 
  compact = false, 
  initialPrompt = '',
  onArtifactOpen 
}: { 
  compact?: boolean; 
  initialPrompt?: string;
  onArtifactOpen?: (artifact: ParsedArtifact) => void;
}) {
  const router = useRouter();
  const { isSimple } = useViewMode();
  const presetSkills = getChatPresetSkills();
  const chipsToShow = isSimple ? presetSkills.slice(0, 3) : presetSkills;

  const handleArtifactOpen = (artifact: ParsedArtifact) => {
    if (onArtifactOpen) {
      onArtifactOpen(artifact);
    } else {
      try { sessionStorage.setItem('pending-artifact', JSON.stringify(artifact)); } catch {}
      router.push('/ai');
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello Sam. I'm La Lumière AI, your LoveLab marketing advisor. I have access to your live Google Ads and Meta Ads data, brand guidelines, all 7 collections, and 44 marketing diagnostic skills.

Ask me to run a **CPA diagnostic**, find **wasted spend**, generate a **weekly summary**, or any other analysis. I'll create an interactive dashboard you can explore.`,
    },
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAppliedInitial = useRef(false);

  useEffect(() => {
    if (initialPrompt && !hasAppliedInitial.current) {
      setInput(initialPrompt);
      hasAppliedInitial.current = true;
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });

      const data = await response.json();

      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I encountered an issue connecting to the AI service. Please check your ANTHROPIC_API_KEY in the .env file.',
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error — make sure the server is running and the API key is set.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    const result: string[] = [];
    let inCodeBlock = false;
    let inTable = false;
    let tableRows: string[] = [];

    const escapeHtml = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const inlineFormat = (line: string) =>
      line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">$1</code>');

    const flushTable = () => {
      if (tableRows.length === 0) return;
      const headerCells = tableRows[0].split('|').filter(c => c.trim());
      const dataRows = tableRows.slice(2);
      let html = '<div class="overflow-x-auto my-2"><table class="w-full text-xs border-collapse">';
      html += '<thead><tr>';
      headerCells.forEach(c => { html += `<th class="text-left px-2 py-1.5 border-b border-gray-200 font-semibold text-gray-700">${inlineFormat(c.trim())}</th>`; });
      html += '</tr></thead><tbody>';
      dataRows.forEach(row => {
        const cells = row.split('|').filter(c => c.trim());
        if (cells.length > 0) {
          html += '<tr>';
          cells.forEach(c => { html += `<td class="px-2 py-1 border-b border-gray-100 text-gray-600">${inlineFormat(c.trim())}</td>`; });
          html += '</tr>';
        }
      });
      html += '</tbody></table></div>';
      result.push(html);
      tableRows = [];
      inTable = false;
    };

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          result.push('</code></pre>');
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          result.push('<pre class="bg-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-xs"><code>');
        }
        continue;
      }

      if (inCodeBlock) {
        result.push(escapeHtml(line) + '\n');
        continue;
      }

      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) inTable = true;
        tableRows.push(line);
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (line.startsWith('### ')) {
        result.push(`<h3 class="text-sm font-bold text-gray-800 mt-3 mb-1">${inlineFormat(line.slice(4))}</h3>`);
      } else if (line.startsWith('## ')) {
        result.push(`<h2 class="text-base font-bold text-gray-900 mt-4 mb-1.5">${inlineFormat(line.slice(3))}</h2>`);
      } else if (line.startsWith('# ')) {
        result.push(`<h1 class="text-lg font-bold text-gray-900 mt-4 mb-2">${inlineFormat(line.slice(2))}</h1>`);
      } else if (line.startsWith('---')) {
        result.push('<hr class="my-3 border-gray-200" />');
      } else if (line.match(/^[-*] /)) {
        result.push(`<div class="flex gap-1.5 ml-1 my-0.5"><span class="text-gray-400 shrink-0">&#8226;</span><span>${inlineFormat(line.slice(2))}</span></div>`);
      } else if (line.match(/^\d+\.\s/)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          result.push(`<div class="flex gap-1.5 ml-1 my-0.5"><span class="text-gray-400 shrink-0 font-mono text-xs">${match[1]}.</span><span>${inlineFormat(match[2])}</span></div>`);
        }
      } else if (line.trim() === '') {
        result.push('<div class="h-2"></div>');
      } else {
        result.push(`<p class="my-0.5">${inlineFormat(line)}</p>`);
      }
    }

    if (inTable) flushTable();
    if (inCodeBlock) result.push('</code></pre>');

    return result.join('');
  };

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Messages */}
      <div className={`overflow-y-auto p-4 sm:p-5 flex-1 ${compact ? 'max-h-64 sm:max-h-72' : ''}`}>
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-plum to-purple-700 text-white shadow-lg'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {msg.role === 'assistant' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              ) : 'S'}
            </div>
            <div className={`max-w-[85%] ${msg.role === 'user' ? '' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-gray-50 text-gray-800'
                  : 'bg-plum text-white'
              }`}>
                {msg.role === 'assistant' ? (
                  <>
                    {(() => {
                      const { textWithoutArtifact, artifact } = parseArtifact(msg.content);
                      return (
                        <>
                          {textWithoutArtifact && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: formatText(textWithoutArtifact),
                              }}
                            />
                          )}
                          {artifact && (
                            <ArtifactRenderer 
                              content={msg.content} 
                              onOpenArtifact={handleArtifactOpen} 
                            />
                          )}
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatText(msg.content),
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="mb-4 flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-plum to-purple-700 text-white shadow-lg">
              <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-plum rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-plum rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-plum rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-500">Building your dashboard...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Skill chips */}
      {chipsToShow.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-gray-100 bg-gray-50/60 px-4 py-2.5">
          {chipsToShow.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => setInput(skill.promptTemplate)}
              className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:border-plum hover:text-plum hover:shadow-sm"
            >
              {isSimple ? skill.simpleLabel : skill.name}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 border-t border-gray-100 p-3 sm:p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={isSimple ? 'Ask anything about your ads...' : 'Run CPA diagnostic, find wasted spend, weekly summary...'}
          className="min-h-[44px] flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-plum focus:ring-2 focus:ring-plum/20 disabled:opacity-60"
          disabled={loading}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="min-h-[44px] shrink-0 rounded-xl bg-gradient-to-r from-plum to-purple-700 px-5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
        >
          Send
        </button>
      </div>
    </div>
  );
}
