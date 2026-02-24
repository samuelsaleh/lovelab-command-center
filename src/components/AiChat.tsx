'use client';

import { useState, useRef, useEffect } from 'react';
import { useViewMode } from '@/context/ViewModeContext';
import { getChatPresetSkills } from '@/data/marketing-skills';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiChat({ compact = false, initialPrompt = '' }: { compact?: boolean; initialPrompt?: string }) {
  const { isSimple } = useViewMode();
  const presetSkills = getChatPresetSkills();
  const chipsToShow = isSimple ? presetSkills.slice(0, 3) : presetSkills;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello Sam. I'm your LoveLab marketing advisor. I have access to your live Google Ads and Meta Ads data, brand guidelines, all 7 collections, and B2C growth strategies. What would you like to work on today?`,
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

  return (
    <div className="bg-white">
      {/* Messages */}
      <div className={`overflow-y-auto p-4 sm:p-5 ${compact ? 'max-h-64 sm:max-h-72' : 'max-h-[460px] sm:max-h-[540px]'}`}>
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
              msg.role === 'assistant'
                ? 'bg-plum text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {msg.role === 'assistant' ? 'AI' : 'S'}
            </div>
            <div className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
              msg.role === 'assistant'
                ? 'bg-gray-50 text-gray-800'
                : 'bg-plum text-white'
            }`}>
              <div dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br/>')
              }} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-4 flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-plum text-[10px] font-bold text-white">AI</div>
            <div className="rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-400">
              Analyzing your data...
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
              className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:border-plum hover:text-plum"
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
          placeholder={isSimple ? 'Ask anything about your ads...' : 'Ask about campaigns, budgets, creative, markets...'}
          className="min-h-[42px] flex-1 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-plum disabled:opacity-60"
          disabled={loading}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="min-h-[42px] shrink-0 rounded-lg bg-plum px-5 text-sm font-semibold text-white transition-colors hover:bg-plum-dark disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
