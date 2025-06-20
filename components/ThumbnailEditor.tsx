'use client';
import { useState } from 'react';

type Props = { onClose: () => void };

export default function ThumbnailEditor({ onClose }: Props) {
  const [selectedEditor, setSelectedEditor] = useState<'pixlr' | 'canva'>('pixlr');

  return (
    <div className="editor-overlay">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            className={`mr-2 px-4 py-2 rounded ${selectedEditor === 'pixlr' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedEditor('pixlr')}
          >
            Pixlr
          </button>
          <button
            className={`px-4 py-2 rounded ${selectedEditor === 'canva' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedEditor('canva')}
          >
            Canva
          </button>
        </div>
        <button className="close-btn text-xl font-bold" onClick={onClose}>×</button>
      </div>

      {selectedEditor === 'pixlr' && (
        <iframe
          title="Pixlr Thumbnail Editor"
          src={`/api/pixlr/token`}
          width="100%"
          height="600"
          className="rounded border"
        />
      )}

      {selectedEditor === 'canva' && (
        <iframe
          title="Canva Thumbnail Editor"
          src="https://www.canva.com/design/YOUR_CANVA_ID/view?embed"
          width="100%"
          height="600"
          className="rounded border"
        />
      )}
    </div>
  );
}

