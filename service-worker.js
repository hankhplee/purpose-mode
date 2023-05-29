// Our extension only supports the following sites.
const supportedSites = [
  "www.facebook.com",
  "twitter.com",
  "youtube.com",
];

// Initialize storage variables at installation time.
chrome.runtime.onInstalled.addListener(initStorageVars);
// (Un)register content script and swap extension icon upon state change.
chrome.storage.onChanged.addListener(updateState);

function initStorageVars() {
  let state = "disabled";
  chrome.storage.local.set({"state": state})
    .then(console.log("Set initial extension state to: " + state));
  chrome.storage.local.set({"supportedSites": supportedSites})
    .then(console.log("Set supported sites to: " + supportedSites));
}

function updateState(changes, area) {
  if (!changes.state || area !== "local") {
    console.log("Ignoring unrelated storage change.");
    return
  }

  var extName = "Purpose Mode";
  if (changes.state.newValue === "disabled") {
    chrome.scripting.unregisterContentScripts({ids: [extName]}) // check if the content script exist
      .then(console.log("Unregistered content script."));
    chrome.action.setIcon({path: {"128": "icons/purpose-mode-off.png"}});
  } else {
    chrome.scripting.registerContentScripts([{
        id: extName,
        matches: supportedSites.map((elem) => {
          return "https://" + elem + "/*"
        }),
        js: ["script.js"],
    }]).then(() => console.log("Registered content script."));
    chrome.action.setIcon({path: {"128": "icons/purpose-mode-on.png"}});
  }
}