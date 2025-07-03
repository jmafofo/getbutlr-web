console.log('[GetButlr] Content script loaded');

function extractYouTubeStudioData() {
  const data = {
    title: '',
    tags: [],
    description: '',
  };

  const titleInput = document.querySelector('input#title-textarea, textarea#title-textarea');
  const descriptionInput = document.querySelector('textarea#description-textarea');
  const tagInput = document.querySelector('input#text-input');

  if (titleInput) data.title = titleInput.value || titleInput.textContent || '';
  if (descriptionInput) data.description = descriptionInput.value || descriptionInput.textContent || '';

  // Tags are inside editable divs or inputs under the tags section
  if (tagInput) {
    const rawTags = tagInput.value || '';
    data.tags = rawTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  return data;
}

function sendToPopupOrBackground(data) {
  chrome.runtime.sendMessage({ type: 'BUTLR_VIDEO_DATA', payload: data });
}

// Detect if we're on YouTube Studio
if (window.location.hostname.includes('studio.youtube.com')) {
  const observer = new MutationObserver(() => {
    const data = extractYouTubeStudioData();
    if (data.title || data.description || data.tags.length > 0) {
      console.log('[GetButlr] Extracted data:', data);
      sendToPopupOrBackground(data);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Manual message request (e.g., from popup.js)
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === 'GET_VIDEO_DATA') {
      const data = extractYouTubeStudioData();
      sendResponse(data);
    }
  });
}

