import React, { useEffect, useState } from 'react';
import './styles/popup.css';

type ScoreCardProps = {
  label: string;
  score: number;
  suggestions?: string[];
};

const ScoreCard = ({ label, score, suggestions }: ScoreCardProps) => (
  <div className="score-card">
    <h4>{label}: <span>{score}%</span></h4>
    {suggestions && suggestions.length > 0 && (
      <ul>
        {suggestions.map((s, idx) => <li key={idx}>✓ {s}</li>)}
      </ul>
    )}
  </div>
);

export default function Popup() {
  const [platform, setPlatform] = useState('');
  const [metrics, setMetrics] = useState({
    titleScore: 78,
    tagScore: 66,
    thumbnailScore: 84,
    suggestions: {
      tags: ['Use trending tags like #viralshorts', 'Avoid repeating tags'],
      title: ['Add power words like “Ultimate”', 'Shorten the title to < 60 characters'],
    }
  });

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'getPlatform' }, (response) => {
      setPlatform(response.platform || 'Unknown');
    });
  }, []);

  return (
    <div className="popup-container">
      <h3>📊 GetButlr Quick Score</h3>
      <p>Detected: <strong>{platform}</strong></p>
      <div className="metrics">
        <ScoreCard label="Title Score" score={metrics.titleScore} suggestions={metrics.suggestions.title} />
        <ScoreCard label="Tag Score" score={metrics.tagScore} suggestions={metrics.suggestions.tags} />
        <ScoreCard label="Thumbnail Score" score={metrics.thumbnailScore} />
      </div>
      <a href="https://getbutlr.ai/dashboard" target="_blank" className="open-studio">
        Open GetButlr Studio
      </a>
    </div>
  );
}

