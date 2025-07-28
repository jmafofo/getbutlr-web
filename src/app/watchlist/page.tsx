'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function WatchlistPage() {
  const [keyword, setKeyword] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      setUser(session?.user);
      if (session?.user) {
        fetchList(session.user.id);
      }
    }
    fetchSession();
  }, []);
  
  async function fetchList(uid: string) {
    const res = await fetch(`/api/watchlist?user_id=${uid}`);
    const { watches } = await res.json();
    setList(watches);
  }

  async function addWatch() {
    if (!user || !keyword.trim()) return;
    setLoading(true);
    await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, keyword })
    });
    setKeyword('');
    await fetchList(user.id);
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Trend Watchlist</h1>
      <div className="flex gap-2 mb-4">
        <input value={keyword} disabled={loading} onChange={e => setKeyword(e.target.value)}
          placeholder="Enter keyword..." className="border p-2 flex-grow" />
        <button disabled={loading} onClick={addWatch} className="btn-primary px-4">
          {loading ? 'Adding…' : 'Watch'}
        </button>
      </div>
      
      <ul className="space-y-2">
        {list.map(w => (
          <li key={w.id} className="flex justify-between">
            <span><strong>{w.keyword}</strong></span>
            <span className="text-gray-500 text-sm">
              {w.last_notified_at ? new Date(w.last_notified_at).toLocaleString() : 'Never Checked'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

