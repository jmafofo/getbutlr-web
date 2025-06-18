'use client';
import { useState } from 'react';

export default function ChatWidget() {
  const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input) return;
    const userMsg = { role: 'user', text: input };
    setMessages([...messages, userMsg]);
    setLoading(true);
    setInput('');

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
      headers: { 'Content-Type': 'application/json' },
    });
    const { reply } = await res.json();
    setMessages(msgs => [...msgs, { role: 'assistant', text: reply }]);
    setLoading(false);
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-2 bg-gray-200 font-bold">Need Help?</div>
      <div className="p-2 h-64 overflow-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm p-2 rounded ${m.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100'}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="text-sm italic text-gray-500">Typing...</div>}
      </div>
      <div className="p-2 flex">
        <input
          className="flex-grow border rounded px-2 py-1"
          value={input} disabled={loading}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="ml-2 px-4 bg-blue-600 text-white rounded" disabled={loading} onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}

