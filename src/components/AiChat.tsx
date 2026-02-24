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
      content: `Bonjour Sam! I'm La Lumière AI, your LoveLab marketing advisor. I have access to your **live Google Ads** and **Meta Ads** data, your brand guidelines, all 7 collections, and B2C growth strategies. What would you like to work on today?`,
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
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error — make sure the server is running and the API key is set.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border-2 border-plum-bg bg-white">
      <div className={`overflow-y-auto p-3 sm:p-4 ${compact ? 'max-h-64 sm:max-h-80' : 'max-h-[400px] sm:max-h-[500px]'}`}>
        {messages.map((msg, i) => (
          <div key={i} className="mb-4 flex gap-2.5">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:h-8 sm:w-8 ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-plum to-plum-light text-white'
                : 'bg-gold text-plum-dark'
            }`}>
              {msg.role === 'assistant' ? '✦' : 'S'}
            </div>
            <div className={`max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-relaxed sm:max-w-[80%] sm:px-4 sm:py-3 ${
              msg.role === 'assistant'
                ? 'border border-plum/10 bg-plum-bg'
                : 'bg-gray-100'
            }`}>
              <div dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-plum">$1</strong>')
                  .replace(/\n/g, '<br/>')
              }} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-4 flex gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-plum to-plum-light text-xs font-bold text-white sm:h-8 sm:w-8">✦</div>
            <div className="rounded-xl bg-plum-bg px-3 py-2.5 text-sm text-gray-500 sm:px-4 sm:py-3">
              Analyzing your data...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {chipsToShow.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-gray-200 bg-gray-50/80 px-3 py-2 sm:px-3 sm:py-2">
          {chipsToShow.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => setInput(skill.promptTemplate)}
              className="rounded-lg border border-plum/20 bg-white px-3 py-1.5 text-[11px] font-medium text-plum transition-colors hover:border-plum hover:bg-plum-bg sm:text-xs"
            >
              {isSimple ? skill.simpleLabel : skill.name}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:gap-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask about campaigns, markets, collections, ad copy..."
          className="min-h-[44px] flex-1 rounded-lg border border-gray-200 px-3.5 py-2.5 text-base outline-none transition-colors focus:border-plum disabled:opacity-60 sm:min-h-0 sm:text-sm"
          disabled={loading}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={loading}
          className="min-h-[44px] shrink-0 rounded-lg bg-plum px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-plum-dark disabled:opacity-50 sm:min-h-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
