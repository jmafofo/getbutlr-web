import { scoreTitle, scoreTags, scoreDescription } from './utils/scoring.js';

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, 'GET_VIDEO_DATA', (data) => {
      if (!data) return;

      const { title, tags, description } = data;

      // 🧠 Score content
      const titleScore = scoreTitle(title);
      const tagScore = scoreTags(tags);
      const descScore = scoreDescription(description);

      const totalScore = Math.round((titleScore + tagScore + descScore) / 3);

      // 📊 Update UI
      document.getElementById('title-score').textContent = `🎯 Title Score: ${titleScore}%`;
      document.getElementById('tags-score').textContent = `🏷️ Tags Score: ${tagScore}%`;
      document.getElementById('desc-score').textContent = `🧾 Description Score: ${descScore}%`;
      document.getElementById('total-score').textContent = `⭐ Overall Score: ${totalScore}%`;
    });
  });
});
