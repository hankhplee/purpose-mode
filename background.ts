const extName = "Purpose Mode";
const settings = ["Enable", "Desaturate", "Compact", "TwitterReadOnly"];

// Initialize storage variables at installation time.
chrome.runtime.onInstalled.addListener(init);

function init() {
    console.log("Initializing " + extName + " background script.");

    let falseVal = JSON.stringify(false);
    for (const key of settings) {
        console.log("Setting '" + key + "' to '" + falseVal + "'.");
        chrome.storage.local.set({key: falseVal});
    }
}

export {};