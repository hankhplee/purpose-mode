const states = [
  "disabled",
  "purpose_mode",
  "reader_mode"
];

function retrieveButtonState() {
  chrome.storage.local.get(["state"], (result) => {
    console.log("Setting radio buttons to state: " + result.state);
    document.getElementById(result.state).checked = true;
  })
}

// Install event listeners for when state is changed.
states.forEach(function(state) {
  document.getElementById(state).addEventListener("click", function(event) {
    chrome.storage.local.set({"state": state}, result => {
      console.log("Setting extension state to: " + state);

      // Nothing to do here if we disabled the extension.
      if (state === "disabled") {
        return
      }


      let queryOptions = { active: true, currentWindow: true };
      (async () => {
        let tab = await chrome.tabs.query(queryOptions);
        chrome.scripting.executeScript({
          target: { tabId: tab[0].id },
          files: ["script.js"]
        }).then(() => console.log("Successfully injected content script into: " + tab[0].url));
      })()

    })
  })
});

// This function is called each time the extension's UI is opened.
retrieveButtonState()
