'use client';
import { useState } from 'react';

export default function ChatPanel() {
  const [msgs, setMsgs] = useState([
    { text: 'Hello, trending looks good today!', in: true },
    { text: 'Thanks! Optimization paid off.', in: false },
    { text: 'Nice work! 🚀', in: true },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const send = () => {
    if (!newMsg) return;
    setMsgs([...msgs, { text: newMsg, in: false }]);
    setNewMsg('');
  };

  return (
    <section className="chat">
      <div className="chat-header">Analytics Bot • Live</div>
      <div className="chat-body">
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.in ? 'incoming' : 'outgoing'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message…" />
        <button onClick={send}>Send</button>
      </div>
    </section>
  );
}

