
// background.js - Handles messages between content and popup
let cachedMetadata = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'YOUTUBE_METADATA') {
    cachedMetadata = message.payload;
    console.log('Metadata cached:', cachedMetadata);
  } else if (message.type === 'REQUEST_METADATA') {
    sendResponse({ success: true, data: cachedMetadata });
  }
});
