
// popup.js - Requests metadata and populates the popup UI
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ type: 'REQUEST_METADATA' }, (response) => {
    if (response && response.success) {
      const { title, description, tags } = response.data || {};
      document.getElementById('video-title').textContent = title || 'No title found';
      document.getElementById('video-description').textContent = description || 'No description found';
      document.getElementById('video-tags').textContent = tags?.join(', ') || 'No tags found';
    }
  });
});
