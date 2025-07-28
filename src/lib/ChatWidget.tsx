'use client';
import { useState } from 'react';

export default function ChatWidget() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  async function send() {
    if (!input) return;
    const userMsg = { role: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    setInput('');

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
      headers: { 'Content-Type': 'application/json' },
    });

    const { reply } = await res.json();
    setMessages((msgs) => [...msgs, { role: 'assistant', text: reply }]);
    setLoading(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <div
          className="w-10 h-10 bg-slate-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => setIsMinimized(false)}
          title="Chat with us!"
        >
          💬
        </div>
      ) : (
        <div className="w-80 bg-white shadow-xl rounded-lg border border-gray-300 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-600 px-3 py-2 font-semibold flex justify-between items-center">
            <span>Need Help?</span>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-500 hover:text-black transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="p-2 h-64 overflow-auto space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm p-2 rounded ${
                  m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-sm italic text-gray-500">Typing...</div>}
          </div>

          {/* Input */}
          <div className="p-2 flex border-t">
            <input
              className="w-full p-2 rounded bg-slate-600 text-white border border-slate-600"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message..."
            />
            <button
              className="ml-2 px-4 bg-blue-600 text-white rounded"
              disabled={loading}
              onClick={send}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
