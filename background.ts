import surveyIcon from "data-base64:~assets/survey.png";
import { sendToContentScript } from "@plasmohq/messaging"
const extName = "Purpose Mode";

// show welcome page upon installation
chrome.runtime.onInstalled.addListener(function (details) {
    console.log("details:",details);
    if (details.reason === "install") {
      chrome.tabs.create({ url: chrome.runtime.getURL("tabs/start.html")});
    }
  });

// Initialize storage variables at installation time.
chrome.runtime.onInstalled.addListener(init);

function init() {
    console.log("Initializing " + extName + " background script.");

    /* initialize local storage */
    chrome.storage.local.set({"TwitterCompact": false});
    chrome.storage.local.set({"TwitterInfinite": false});
    chrome.storage.local.set({"TwitterNotif": false});
    chrome.storage.local.set({"TwitterFeed": false});
    chrome.storage.local.set({"TwitterDesaturate": false});

    chrome.storage.local.set({"FacebookCompact": false});
    chrome.storage.local.set({"FacebookInfinite": false});
    chrome.storage.local.set({"FacebookNotif": false});
    chrome.storage.local.set({"FacebookFeed": false});
    chrome.storage.local.set({"FacebookDesaturate": false});

    chrome.storage.local.set({"LinkedInCompact": false});
    chrome.storage.local.set({"LinkedInInfinite": false});
    chrome.storage.local.set({"LinkedInNotif": false});
    chrome.storage.local.set({"LinkedInFeed": false});
    chrome.storage.local.set({"LinkedInDesaturate": false});

    chrome.storage.local.set({"YouTubeCompact": false});
    chrome.storage.local.set({"YouTubeInfinite": false});
    chrome.storage.local.set({"YouTubeNotif": false});
    chrome.storage.local.set({"YouTubeFeed": false});
    chrome.storage.local.set({"YouTubeDesaturate": false});

    // autoplay setting
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

function cacheESM(esm, webpage_screenshot) {
    esm['esm_screenshot'] = webpage_screenshot;
    // console.log("screenshot: ",webpage_screenshot);
    chrome.storage.local.set({"sampled_esm": esm});

    // for ESM testing
    openTestQuestionnaire();
}

function openQuestionnaire(){
    /* send message to content script to capture the current browsing context*/
    const resp = sendToContentScript({
        name: "create ESM",
    })

    /* comment out the following code for the actual study*/
    // console.log("open questionnaire");
    // console.log(chrome.runtime.getURL("tabs/esm.html"));
    // chrome.tabs.create({ url: chrome.runtime.getURL("tabs/esm.html")});
}

function openTestQuestionnaire(){
    console.log("open test questionnaire");
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/esm.html")});
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
    else if(msg.name === "open questionnaire"){
        openQuestionnaire();
    }
    else if(msg.name === "cache ESM"){
        console.log("cache ESM");
        if (msg.esm) {
            chrome.tabs.query({
                url: msg.esm["esm_url"],
                active: true,
                lastFocusedWindow: true,
            }).then(tabs => {
              if (tabs.length > 0) {
                var current_tab = tabs[0];
                chrome.tabs.captureVisibleTab(current_tab.windowId).then(webpage_screenshot => {
                    cacheESM(msg.esm,webpage_screenshot); 
                });
              }
              else {
                console.error('no tab to screenshot');
              }
            });
          }
    }
    // for ESM questionnaire testing
    else if(msg.name === "open test questionnaire"){
        openTestQuestionnaire();
    }
})

export {};