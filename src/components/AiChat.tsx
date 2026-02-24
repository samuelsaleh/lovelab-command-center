'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiChat({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Bonjour Sam! I'm La Lumière AI, your LoveLab marketing advisor. I have access to your **live Google Ads** and **Meta Ads** data, your brand guidelines, all 7 collections, and B2C growth strategies. What would you like to work on today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <div className="border-2 border-plum-bg rounded-xl overflow-hidden bg-white">
      <div className={`overflow-y-auto p-4 ${compact ? 'max-h-80' : 'max-h-[500px]'}`}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 mb-4 ${msg.role === 'user' ? '' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-plum to-plum-light text-white'
                : 'bg-gold text-plum-dark'
            }`}>
              {msg.role === 'assistant' ? '✦' : 'S'}
            </div>
            <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed max-w-[80%] ${
              msg.role === 'assistant'
                ? 'bg-plum-bg border border-plum/10'
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
          <div className="flex gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-plum to-plum-light text-white flex items-center justify-center text-xs font-bold">✦</div>
            <div className="bg-plum-bg rounded-xl px-4 py-3 text-sm text-gray-500">
              Analyzing your data...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-2.5 p-3 border-t border-gray-200 bg-gray-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about campaigns, markets, collections, ad copy..."
          className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-plum transition-colors"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-plum hover:bg-plum-dark text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
