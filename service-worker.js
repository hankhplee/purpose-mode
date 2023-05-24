// Initialize state at installation time.
chrome.runtime.onInstalled.addListener(setInitialState);
// (Un)register content script and swap extension icon upon state change.
chrome.storage.onChanged.addListener(updateState);

function setInitialState() {
  let state = "disabled";
  chrome.storage.local.set({"state": state}, () => {
    console.log("Set initial extension state to: " + state);
  })
}

function updateState(changes, area) {
  if (!changes.state || area !== "local") {
    console.log("Ignoring unrelated storage change.");
    return
  }

  var extName = "Purpose Mode";
  if (changes.state.newValue === "disabled") {
    chrome.scripting.unregisterContentScripts({ids: [extName]});
    console.log("Unregistered content script.");
    chrome.action.setIcon({path: {"128": "icons/purpose-mode-off.png"}});
  } else {
    chrome.scripting.registerContentScripts([{
        id: extName,
        matches: ["<all_urls>"],
        js: ["script.js"],
    }]);
    console.log("Registered content script.");
    chrome.action.setIcon({path: {"128": "icons/purpose-mode-on.png"}});
  }
}