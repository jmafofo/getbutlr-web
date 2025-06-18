import { useState } from 'react';

export default function Popup() {
  const [suggestion, setSuggestion] = useState<string | null>(null);

  async function handleClick() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id!, { type: 'SEO_CHECK', payload: { title: '', description: '' } }, (response) => {
      setSuggestion(response.suggestedTitle);
    });
  }

  return (
    <div style={{ padding: '16px', width: '300px' }}>
      <h2>GetButlr Assistant</h2>
      <button onClick={handleClick}>Check SEO</button>
      {suggestion && <p style={{ marginTop: '12px' }}><strong>Suggestion:</strong> {suggestion}</p>}
    </div>
  );
}

