const extName = "Purpose Mode";

// Initialize storage variables at installation time.
chrome.runtime.onInstalled.addListener(init);

function init() {
    console.log("Initializing " + extName + " background script.");

    // initialize local storage
    const keys = ["TwitterAutoplay",
                "SetTwitterAutoplay",
                "LinkedInAutoplay",
                "SetLinkedInAutoplay",
                "FacebookAutoplay",
                "SetFacebookAutoplay",
                "YouTubeAutoplay"
                ]

    chrome.storage.local.get(keys, (result) => {
        for (const key of keys) {
            let currentKeyValue = result[key];
            if (currentKeyValue === undefined) {
                let initKeyValue = false;
                chrome.storage.local.set({[key]: initKeyValue});
            }
        }
    });
}

function settingAutoPlay(site: string, toggled: boolean){
    console.log("Set autopaly on", site, "to", toggled);
    if (site.includes("Twitter")){
        chrome.storage.local.set({"SetTwitterAutoplay": toggled})
        .then(chrome.tabs.create({ url: "https://twitter.com/settings/autoplay"}));
    }
    else if(site.includes("LinkedIn")){
        chrome.storage.local.set({"SetLinkedInAutoplay": toggled})
        .then(chrome.tabs.create({ url: "https://www.linkedin.com/mypreferences/d/settings/autoplay-videos"}));
    }
    else if(site.includes("Facebook")){
        chrome.storage.local.set({"SetFacebookAutoplay": toggled})
        .then(chrome.tabs.create({ url: "https://www.facebook.com/settings?tab=videos"}));
    }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.name !== "autoplay") {
        console.log("Ignoring non-autoplay event.");
        return;
    }

    console.log("UI wants the autoplay of " + msg.body.site +
                "' changed to '" + msg.body.state + "'.");
    settingAutoPlay(msg.body.site,msg.body.state);
    
})

export {};
