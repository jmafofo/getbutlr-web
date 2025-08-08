'use client';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatWidget() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    const history = messages.filter(m => m.role === 'user' || m.role === 'assistant');

    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    setInput('');

    try {
      const res = await fetch('/api/chatbot-ollama', {
        method: 'POST',
        body: JSON.stringify({ query: input, history }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      setMessages((msgs) => [...msgs, { role: 'assistant', text: data.markdown }]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { role: 'assistant', text: '_Something went wrong. Please try again._' },
      ]);
    }
    setLoading(false);
  }

  // Custom renderer for Markdown links -> styled buttons
  const MarkdownComponents = {
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition mt-2"
      >
        {children}
      </a>
    ),
  };

  // Fix API output: turns [Label]slug into [Label](/tools/slug)
  const fixLinks = (text: string) => {
    return text.replace(/\[([^\]]+)\]([^\s),]+)/g, (_match, label, slug) => {
      // Remove trailing punctuation
      let cleanSlug = slug.replace(/[.,]+$/, '');
  
      // Remove surrounding parentheses if present
      cleanSlug = cleanSlug.replace(/^\(+|\)+$/g, '');
  
      // If full URL or starts with "/", keep as-is
      if (cleanSlug.startsWith('/') || cleanSlug.startsWith('http')) {
        return `[${label}](${cleanSlug})`;
      }
  
      // If starts with "tools/", ensure format is /tools/slug
      if (cleanSlug.startsWith('tools/')) {
        return `[${label}](/${cleanSlug})`;
      }
  
      // Default: prefix /tools/
      return `[${label}](/tools/${cleanSlug})`;
    });
  };  

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          title="Chat with us!"
          className="w-12 h-12 rounded-full overflow-hidden shadow-lg hover:scale-105 transform transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img src="/butlr_icon.jpg" alt="Chat Icon" className="w-full h-full object-cover" />
        </button>
      ) : (
        <div className="flex flex-col w-80 max-h-[500px] bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Need Help?</h2>
            <button
              onClick={() => setIsMinimized(true)}
              aria-label="Close chat"
              className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={i}
                  className={`max-w-[75%] break-words ${isUser ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-3xl text-sm whitespace-pre-wrap ${
                      isUser
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    {m.role === 'assistant' ? (
                      <ReactMarkdown components={MarkdownComponents}>
                        {fixLinks(m.text)}
                      </ReactMarkdown>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="text-gray-400 italic text-sm max-w-[75%] ml-auto">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="bg-white px-3 py-3 border-t border-gray-200 flex items-center space-x-3"
          >
            <input
              type="text"
              className="flex-grow rounded-full border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type a message..."
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              autoFocus
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`bg-blue-600 text-white px-3 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition`}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
