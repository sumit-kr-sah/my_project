chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.aiHelpEnabled) {
      const newState = changes.aiHelpEnabled.newValue;
      console.log(`AI Help state changed to: ${newState ? "ON" : "OFF"}`);
      // Add logic to toggle AI Help feature in your app.
    }
  });
  