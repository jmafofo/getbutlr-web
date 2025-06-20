'use client';
import { useState, useEffect } from 'react';

type Props = { onClose: () => void };

export default function ThumbnailEditor({ onClose }: Props) {
  const [pixlrUrl, setPixlrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPixlrToken() {
      try {
        const res = await fetch('/api/pixlr/token');
        const json = await res.json();
        setPixlrUrl(json.url);
      } catch (err) {
        console.error('Error fetching Pixlr URL:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPixlrToken();
  }, []);

  return (
    <div className="editor-overlay">
      <div className="editor-content">
        <button className="close-btn" onClick={onClose}>×</button>

        {loading && <p className="loading">Loading editor…</p>}

        {pixlrUrl && (
          <iframe
            title="Pixlr Thumbnail Editor"
            src={pixlrUrl}
            width="100%"
            height="600"
          />
        )}

        <div className="divider">— OR —</div>

        <iframe
          title="Canva Thumbnail Editor"
          src="https://www.canva.com/design/YOUR_CANVA_ID/view?embed"
          width="100%"
          height="600"
        />
      </div>
    </div>
  );
}

