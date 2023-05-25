const states = [
  "disabled",
  "purpose_mode",
  "reader_mode"
];

// If the user enables Purpose Mode while on a page, inject the content script
// into the current page.
document.getElementById("purpose_mode").addEventListener("click", onExtEnable);
// Update state when the user enables or disables the extension.
states.forEach(function(state) {
  document.getElementById(state).addEventListener("click", onExtStateChange);
})

// Initialize the buttons with our previously-saved state.
retrieveButtonState()

async function onExtEnable() {
  let queryOptions = {
    active: true,
    currentWindow: true
  };
  let tab = await chrome.tabs.query(queryOptions);
  let url = new URL(tab[0].url);
  let result = await chrome.storage.local.get(["supportedSites"]);
  if (!result.supportedSites.includes(url.hostname)) {
    console.log("Not injecting content script into unsupported site.");
    return
  }

  await chrome.scripting.executeScript({
    target: {
      tabId: tab[0].id
    },
    files: ["script.js"]
  });
  console.log("Injected content script into: " + url);
}

function onExtStateChange(event) {
  let state = event.srcElement.id;
  chrome.storage.local.set({"state": state}).then(
    console.log("Set extension state to: " + state)
  )
}

function retrieveButtonState() {
  chrome.storage.local.get(["state"], (result) => {
    document.getElementById(result.state).checked = true;
    console.log("Set button state to: " + result.state);
  })
}