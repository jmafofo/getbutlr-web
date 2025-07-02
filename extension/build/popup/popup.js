document.getElementById('analyze-btn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'analyze_page' }, (response) => {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = response?.result || 'No data received';
    });
  });
});
