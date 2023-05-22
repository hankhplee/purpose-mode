const extName = "Purpose Mode"

// Initialize state at installation time.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({"state": "disabled"}, () => {
    console.log("Set initial extension state to: 'disabled'");
  })
})

// (Un)register content script when the user turns the extension on or off.
chrome.storage.onChanged.addListener(function (changes, area) {
  if (!changes.state) {
    console.log("Ignoring changes to non-state storage.");
    return
  }
  if (area !== "local") {
    console.log("Ignoring changes to non-local storage.")
    return
  }

  if (changes.state.newValue === "disabled") {
    chrome.scripting.unregisterContentScripts({ids: [extName]});
    console.log("Unregistered content script.");
  } else {
    chrome.scripting.registerContentScripts([{
        id: extName,
        matches: ["<all_urls>"],
        js: ["script.js"],
    }]);
    console.log("Registered content script.");
  }

  console.log("Set extension state from '" + changes.state.oldValue +
              "' to '" + changes.state.newValue + "'.");
})
