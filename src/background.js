// Chrome Extension Background Script
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: 'addToBucket',
    title: 'Add to Bucket',
    contexts: ['selection', 'link', 'page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'addToBucket') {
    let data = {};
    
    if (info.selectionText) {
      data = {
        type: 'text',
        title: info.selectionText.substring(0, 50) + '...',
        content: info.selectionText
      };
    } else if (info.linkUrl) {
      data = {
        type: 'link',
        title: info.linkUrl,
        content: info.linkUrl,
        url: info.linkUrl
      };
    } else {
      data = {
        type: 'text',
        title: tab.title || 'Page',
        content: tab.url || ''
      };
    }
    
    // Send message to popup
    chrome.runtime.sendMessage({
      action: 'addToBucket',
      data: data
    });
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {
    sendResponse({ success: true });
  }
});