document.addEventListener('DOMContentLoaded', () => {
  const messageCard = document.getElementById('messageCard');
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    
    if (!tab) {
      messageCard.innerHTML = `
        <div class="icon-wrapper">
          <div class="warning-icon">!</div>
        </div>
        <div class="message-text">No active tab detected</div>
        <div class="message-hint">Please ensure you have an active browser tab open</div>
      `;
      return;
    }
    
    const url = tab.url;
    let videoId = null;
    let studyUrl = null;
    
    // Check for youtube-nocookie.com embed
    if (url.includes('youtube-nocookie.com/embed/')) {
      try {
        // Extract video ID from embed URL
        const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
        if (embedMatch && embedMatch[1]) {
          videoId = embedMatch[1];
          studyUrl = `https://app.youlearn.ai/add/https://www.youtube.com/watch?v=${videoId}`;
        }
      } catch (e) {
        console.error('Error parsing embed URL:', e);
      }
    }
    // Check for regular YouTube watch page
    else if (url.includes('youtube.com/watch?v=')) {
      try {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
        if (videoId) {
          studyUrl = `https://app.youlearn.ai/add/https://www.youtube.com/watch?v=${videoId}`;
        }
      } catch (e) {
        console.error('Error parsing watch URL:', e);
      }
    }
    
    // If no video ID found, show error
    if (!videoId || !studyUrl) {
      messageCard.innerHTML = `
        <div class="icon-wrapper">
          <div class="warning-icon">!</div>
        </div>
        <div class="message-text">Please navigate to a YouTube video to get started</div>
        <div class="message-hint">Open youtube.com and play any educational video you want to study</div>
      `;
      return;
    }
    
    // Show success message
    messageCard.innerHTML = `
      <div class="icon-wrapper">
        <div class="success-icon">✓</div>
      </div>
      <div class="success-message">
        Launching your study session<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>
        <br><br>
        Your new tab is opening now!
      </div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    `;
    
    // Open in new tab
    chrome.tabs.create({ url: studyUrl });
    
    // Close popup after a short delay
    setTimeout(() => {
      window.close();
    }, 1200);
    
  });
});