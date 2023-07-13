import surveyIcon from "data-base64:~assets/survey.png";
const extName = "Purpose Mode";

// Initialize storage variables at installation time.
chrome.runtime.onInstalled.addListener(init);

function init() {
    console.log("Initializing " + extName + " background script.");

    // initialize local storage
    chrome.storage.local.set({"TwitterAutoplay": false});
    chrome.storage.local.set({"SetTwitterAutoplay": false});
    chrome.storage.local.set({"LinkedInAutoplay": false});
    chrome.storage.local.set({"SetLinkedInAutoplay": false});
    chrome.storage.local.set({"FacebookAutoplay": false});
    chrome.storage.local.set({"SetFacebookAutoplay": false});
    chrome.storage.local.set({"YouTubeAutoplay": false});
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
    if (msg.name === "autoplay") {
        console.log("UI wants the autoplay of " + msg.body.site +
                "' changed to '" + msg.body.state + "'.");
        settingAutoPlay(msg.body.site,msg.body.state);
    }
    else if(msg.name === "test notification"){
        var timestamp = new Date().getTime();
        var questionnaireNotification = "questionnaire-notification" + timestamp;
        chrome.notifications.create(questionnaireNotification, {
            "type": "basic",
            "iconUrl": surveyIcon,
            "title": "You have a questionnaire to fill!",
            "message": "Click this notification to answer the questionnaire.",
        });
    }
})

export {};