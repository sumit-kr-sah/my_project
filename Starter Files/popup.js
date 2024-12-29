document.getElementById('on-btn').addEventListener('click', () => {
    chrome.storage.local.set({ aiHelpEnabled: true }, () => {
      alert('AI Help is now ON!');
    });
  });
  
  document.getElementById('off-btn').addEventListener('click', () => {
    chrome.storage.local.set({ aiHelpEnabled: false }, () => {
      alert('AI Help is now OFF!');
    });
  });
  