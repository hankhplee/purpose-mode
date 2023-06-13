// Our extension only supports the following sites.
const supportedSites = [
  "www.facebook.com",
  "twitter.com",
  "www.youtube.com",
  "www.linkedin.com"
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
    // Refresh the page, with Purpose Mode disabled.  Note that this only works
    // for the tab that's currently open.  Other tabs will still have Purpose
    // Mode lingering in them.  To work around this, we need the content script
    // to periodically poll the service worker to learn if Purpose Mode is still
    // enabled.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  } else {
    chrome.scripting.registerContentScripts([{
        id: extName,
        world: 'MAIN', /* Necessary for monkey patching the 'window' object. */
        matches: supportedSites.map((elem) => {
          return "https://" + elem + "/*"
        }),
        js: ["content-script.js"],
    }]).then(() => console.log("Registered content script."));
    chrome.action.setIcon({path: {"128": "icons/purpose-mode-on.png"}});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  }
}
