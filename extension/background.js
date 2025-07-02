// extension/background.js

// Storage for last scraped metadata
let lastMetadata = null;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_METADATA') {
    console.log('[GetButlr] Metadata received:', message.payload);
    lastMetadata = message.payload;
    return;
  }

  if (message.type === 'GET_METADATA') {
    sendResponse({ metadata: lastMetadata });
    return true; // Required for async sendResponse
  }
});

