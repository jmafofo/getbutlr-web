
// content.js - Extract metadata from YouTube Studio pages
function extractMetadata() {
  const title = document.querySelector('input#textbox[aria-label="Title"]')?.value || '';
  const description = document.querySelector('ytcp-mention-textbox[aria-label="Description"]')?.value || '';
  const tags = []; // Add logic to extract tags if available
  return { title, description, tags };
}

setTimeout(() => {
  const metadata = extractMetadata();
  chrome.runtime.sendMessage({ type: 'YOUTUBE_METADATA', payload: metadata });
}, 2000);
