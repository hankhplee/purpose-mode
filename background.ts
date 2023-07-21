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

    // data logging and questionnaire sampling
    chrome.storage.local.set({"sampled_esm": null});
    chrome.storage.local.set({"last_esm_time": 0});
    chrome.storage.local.set({"esm_counter_today": 0});
    chrome.storage.local.set({"esm_counter_total": 0});
    chrome.storage.local.set({"last_active_date": null});
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
    console.log("cache ESM in background...");
    esm['esm_screenshot'] = webpage_screenshot;
    // console.log("screenshot: ",webpage_screenshot);
    chrome.storage.local.set({"sampled_esm": esm});
    var timestamp = new Date().getTime();
    var questionnaireNotification = "questionnaire-notification" + timestamp;
    console.log("send notification for a new ESM...");
    chrome.notifications.create(questionnaireNotification, {
        "type": "basic",
        "iconUrl": surveyIcon,
        "title": "User study questionnaire",
        "message": "Click this notification to answer the questionnaire.",
    });
    chrome.notifications.onClicked.addListener((notificationId) => {
        if (notificationId == questionnaireNotification) {
            chrome.tabs.create({ url: chrome.runtime.getURL("tabs/esm.html")});
        }
    });
    chrome.action.setBadgeText({ text: "+" });
}

function openQuestionnaire(){
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/esm.html")});
}

// check ESM status every 1 minute
setInterval(function () {
    var current_time = new Date().getTime()/1000;
    var current_date = new Date(Date.now());
    const keys = ["sampled_esm","last_active_date"];
    chrome.storage.local.get(keys).then(function (status) {
        //check if ESM expire
        if(status.sampled_esm !== null){
            var esm_time = status.sampled_esm["esm_time_unix_second"];
            if(current_time - esm_time > 5*60){
                console.log("sampled ESM expired (5 min), clear sampled ESM...");
                chrome.storage.local.set({"sampled_esm": null});
                chrome.action.setBadgeText({ text: "" });
            }
        }
        else{
            chrome.action.setBadgeText({ text: ""});
        }
        //check if daily ESM counter needs to be upated
        if(status.last_active_date !== current_date.getDate()){
            console.log("reset ESM daily counter...");
            chrome.storage.local.set({"esm_counter_today": 0});
            chrome.storage.local.set({"last_active_date": current_date.getDate()});
        }
    });
}, 60 * 1000);

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
            "title": "User study questionnaire",
            "message": "Click this notification to answer the questionnaire.",
        });
    }
    else if(msg.name === "open questionnaire"){
        openQuestionnaire();
    }
    else if(msg.name === "cache ESM"){
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
})

export {};