import confetti from 'canvas-confetti';

export function sendMessageToBackground(msg: any) {
  chrome.runtime.sendMessage(msg, response => {
    if (msg.type === 'SEO_CHECK' && response?.score > 90) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.2 } });
    }
  });
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg.type === 'SEO_CHECK') {
    fetch('https://your-site.com/api/seo-suggest', {
      method: 'POST',
      body: JSON.stringify(msg.payload)
    })
      .then(res => res.json())
      .then(data => sendResponse(data))
      .catch(err => sendResponse({ error: true }));
    return true;
  }
});

