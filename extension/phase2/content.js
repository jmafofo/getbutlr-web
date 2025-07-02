
// Detect if inside YouTube Studio video editor
function isVideoEditPage() {
  return window.location.href.includes("/video/");
}

// Inject GetButlr sidebar
function injectSidebar() {
  if (document.getElementById("getbutlr-sidebar")) return;

  const sidebar = document.createElement("div");
  sidebar.id = "getbutlr-sidebar";
  sidebar.innerHTML = `
    <div class="butlr-header">🔍 GetButlr Video Optimizer</div>
    <div class="butlr-section"><strong>✅ Title Score:</strong> 82%<br/><em>💡 Add a target keyword</em></div>
    <div class="butlr-section"><strong>🏷️ Tags Score:</strong> 64%<br/><em>💡 Add trending tags</em></div>
    <div class="butlr-section"><strong>📄 Description:</strong> 78%<br/><em>💡 Include CTA and link</em></div>
  `;
  document.body.appendChild(sidebar);
}

// Observe page changes
const observer = new MutationObserver(() => {
  if (isVideoEditPage()) {
    injectSidebar();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
