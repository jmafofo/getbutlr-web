// extension/content.js

// Helper to detect platform
function detectPlatform() {
  const host = window.location.hostname;
  if (host.includes('youtube.com')) return 'YouTube';
  if (host.includes('instagram.com')) return 'Instagram';
  if (host.includes('tiktok.com')) return 'TikTok';
  if (host.includes('facebook.com')) return 'Facebook';
  return 'Unknown';
}

// Sample metadata extractor for YouTube Studio (can be expanded)
function extractYouTubeStudioData() {
  const title = document.querySelector('input#title')?.value || '';
  const description = document.querySelector('textarea#description')?.value || '';
  const tags = Array.from(document.querySelectorAll('[data-tag]')).map(el => el.textContent.trim());

  return {
    platform: 'YouTube',
    title,
    description,
    tags,
    url: window.location.href,
  };
}

// General metadata handler
function extractMetadata() {
  const platform = detectPlatform();
  if (platform === 'YouTube') return extractYouTubeStudioData();
  // Future platform-specific extractors
  return { platform, error: 'Metadata extractor not yet implemented' };
}

// Send to popup or background for scoring
chrome.runtime.sendMessage({ type: 'PAGE_METADATA', payload: extractMetadata() });

