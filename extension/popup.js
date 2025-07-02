// extension/popup.js

chrome.runtime.sendMessage({ type: 'GET_METADATA' }, (response) => {
  const metadata = response?.metadata;

  if (!metadata) {
    document.getElementById('video-title').innerText = 'No data found';
    return;
  }

  document.getElementById('video-title').innerText = metadata.title || 'N/A';
  document.getElementById('video-description').innerText = metadata.description || 'N/A';
  document.getElementById('video-tags').innerText = metadata.tags?.join(', ') || 'None';

  const seoScore = (metadata.title?.length > 20 ? 80 : 50) +
                   (metadata.tags?.length > 5 ? 20 : 0);

  document.getElementById('seo-score').innerText = `${seoScore}/100`;

  document.getElementById('title-feedback').innerText =
    metadata.title?.length > 40
      ? '✅ Strong title'
      : '⚠️ Consider adding keywords';

  document.getElementById('hashtag-feedback').innerText =
    metadata.tags?.length > 4
      ? '✅ Great tag coverage'
      : '⚠️ Add more relevant tags';
});
