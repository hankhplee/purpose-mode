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

    // Create an alarm that fires every periodInMinutes minutes.
    // Our event handler sends a ping to the backend every time the event fires.
    chrome.alarms.create(extName + " ping", {
        delayInMinutes: 0,
        periodInMinutes: 1,
    }, () => {
        console.log("Created repeating alarm for backend pings.");
    });

    // initialize local storage
    // init value false
    const toggle_keys = [
        "Enable",
        "enableIntervention",

        "TwitterCompact",
        "TwitterInfinite",
        "TwitterNotif",
        "TwitterFeed",
        "TwitterDesaturate",
            
        "FacebookCompact",
        "FacebookInfinite",
        "FacebookNotif",
        "FacebookFeed",
        "FacebookDesaturate",

        "LinkedInCompact",
        "LinkedInInfinite",
        "LinkedInNotif",
        "LinkedInFeed",
        "LinkedInDesaturate",

        "YouTubeCompact",
        "YouTubeComments",
        "YouTubeInfinite",
        "YouTubeNotif",
        "YouTubeFeed",
        "YouTubeDesaturate",
        
        "TwitterAutoplay",
        "SetTwitterAutoplay",
        "LinkedInAutoplay",
        "SetLinkedInAutoplay",
        "FacebookAutoplay",
        "SetFacebookAutoplay",
        "YouTubeAutoplay",

        // feature questionnaire sampling
        "sampling_feature_lock"
        ]
    
    // init value null
    const temp_storage_keys =[
        // data logging and questionnaire sampling
        "last_active_date",
        "sampled_esm",
        "esm_in_progress",

        // feature questionnaire sampling
        "sampling_feature_site",
        "feature_before",
        "sampled_feature_questioinnaire",
        "sampled_feature_questioinnaire_in_progress"

    ]

    // init value 0
    const counter_keys = [
        // data logging and questionnaire sampling
        "last_esm_time",
        "esm_counter_today",
        "esm_counter_total",

        // feature questionnaire sampling
        "sampling_feature_lock_timer",
        "last_feature_questionnaire_time",
        "feature_questionnaire_counter_total",

        // feature use
        "TwitterSeeMoreClick",
        "FacebookSeeMoreClick",
        "YouTubeSeeMoreClick",
        "LinkedInSeeMoreClick"
    ]

    chrome.storage.local.get([...toggle_keys,...temp_storage_keys,...counter_keys], (result) => {
        console.log(result);
        // set init value to false
        for (const key of toggle_keys) {
            let currentKeyValue = result[key];
            if (currentKeyValue === undefined) {
                let initKeyValue = false;
                chrome.storage.local.set({[key]: initKeyValue});
            }
        }
        // set init value to null
        for (const key of temp_storage_keys) {
            let currentKeyValue = result[key];
            if (currentKeyValue === undefined) {
                let initKeyValue = null;
                chrome.storage.local.set({[key]: initKeyValue});
            }
        }
        // set init value to 0
        for (const key of counter_keys) {
            let currentKeyValue = result[key];
            if (currentKeyValue === undefined) {
                let initKeyValue = 0;
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
            openQuestionnaire();
        }
    });
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeTextColor({ color: "white"});
    chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
}

function openQuestionnaire(){
    // move the sampled esm into in progress cache
    chrome.storage.local.get("sampled_esm").then(function (esm) {
        chrome.storage.local.set({"esm_in_progress": esm.sampled_esm});
        chrome.tabs.create({ url: chrome.runtime.getURL("tabs/esm.html")});
    });
}

function openFeatureQuestionnaire(){
    chrome.storage.local.get("sampled_feature_questioinnaire").then(function (questionnaire) {
        chrome.storage.local.set({"sampled_feature_questioinnaire_in_progress": questionnaire.sampled_feature_questioinnaire});
        chrome.tabs.create({ url: chrome.runtime.getURL("tabs/feature_feedback.html")});
    });
}

function diffAfterFeature(feature_before,feature_after){
    var diff = {};
    for (const [key, value] of Object.entries(feature_after)) {
        if(feature_before[key] != feature_after[key]){
            diff[key] = feature_after[key];
        }
    }
    return diff;
}

function createFeatureQuestionnaire(){
    console.log("attempt to create feature questionnarie after 3 minutes...");
    
    const keys = ["sampling_feature_lock","feature_before","sampling_feature_site",
    "TwitterCompact","TwitterInfinite","TwitterNotif","TwitterFeed","TwitterDesaturate","TwitterAutoplay",
    "LinkedInCompact","LinkedInInfinite","LinkedInNotif","LinkedInFeed","LinkedInDesaturate","LinkedInAutoplay",
    "FacebookCompact","FacebookInfinite","FacebookNotif","FacebookFeed","FacebookDesaturate","FacebookAutoplay",
    "YouTubeCompact","YouTubeComments","YouTubeInfinite","YouTubeNotif","YouTubeFeed","YouTubeDesaturate","YouTubeAutoplay",
    ];
    chrome.storage.local.get(keys).then(function (status) {
        var sampled_site = status.sampling_feature_site;
        var feature_before = status.feature_before;
        var feature_after = {};
        if(sampled_site === "Twitter"){
            feature_after["Compact"]     = status.TwitterCompact;
            feature_after["Infinite"]    = status.TwitterInfinite;
            feature_after["Notif"]       = status.TwitterNotif;
            feature_after["Feed"]        = status.TwitterFeed; 
            feature_after["Desaturate"]  = status.TwitterDesaturate;
            feature_after["Autoplay"]    = status.TwitterAutoplay;
        }
        else if(sampled_site === "Facebook"){
            feature_after["Compact"]     = status.FacebookCompact;
            feature_after["Infinite"]    = status.FacebookInfinite;
            feature_after["Notif"]       = status.FacebookNotif;
            feature_after["Feed"]        = status.FacebookFeed; 
            feature_after["Desaturate"]  = status.FacebookDesaturate;
            feature_after["Autoplay"]    = status.FacebookAutoplay;
        }
        else if(sampled_site === "LinkedIn"){
            feature_after["Compact"]     = status.LinkedInCompact;
            feature_after["Infinite"]    = status.LinkedInInfinite;
            feature_after["Notif"]       = status.LinkedInNotif;
            feature_after["Feed"]        = status.LinkedInFeed; 
            feature_after["Desaturate"]  = status.LinkedInDesaturate;
            feature_after["Autoplay"]    = status.LinkedInAutoplay;
        }
        else if(sampled_site === "YouTube"){
            feature_after["Compact"]     = status.YouTubeCompact;
            feature_after["Comments"]    = status.YouTubeComments;
            feature_after["Infinite"]    = status.YouTubeInfinite;
            feature_after["Notif"]       = status.YouTubeNotif;
            feature_after["Feed"]        = status.YouTubeFeed; 
            feature_after["Desaturate"]  = status.YouTubeDesaturate;
            feature_after["Autoplay"]    = status.YouTubeAutoplay;
        }
        // compare features before and after
        var sampled_feature_questioinnaire = {};
        var feature_changed = {};
        var feature_has_changed = false;
        for (const [key, value] of Object.entries(feature_before)) {
            if(feature_after[key] !== feature_before[key]){
                feature_changed[key] = feature_after[key];
                feature_has_changed = true;
            }
        }
        if(feature_has_changed){
            console.log("changed features: ",feature_changed);
            var current_time = new Date().getTime()/1000;
            var date = new Date(Date.now());
            var sampled_time = date.toString().replace(/ \(.*\)/ig, '');//.replace(/(-|:|\.\d*)/g,'');//format: yyyyMMddThhmmssZ eg:19930728T183907Z
            sampled_feature_questioinnaire["sampled_time_unix_second"] = current_time;
            sampled_feature_questioinnaire["sampled_time"] = sampled_time;
            sampled_feature_questioinnaire["sampled_site"] = sampled_site;
            sampled_feature_questioinnaire["feature_changed"] = feature_changed;
            chrome.storage.local.set({"sampled_feature_questioinnaire": sampled_feature_questioinnaire});
            var questionnaireNotification = "questionnaire-notification" + current_time;
            console.log("send notification for a new feature questionnaire...");
            chrome.notifications.create(questionnaireNotification, {
                "type": "basic",
                "iconUrl": surveyIcon,
                "title": "It seems that you made some change(s) on purpose mode!",
                "message": "Click this notification to answer the questionnaire and let us know why!",
            });
            chrome.notifications.onClicked.addListener((notificationId) => {
                if (notificationId == questionnaireNotification) {
                    openFeatureQuestionnaire();
                }
            });
            chrome.action.setBadgeText({ text: "!" });
            chrome.action.setBadgeTextColor({ color: "white"});
            chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        }
        else{
            console.log("no feature changes at the end of the lock...");
            // reset feature change cache
            chrome.storage.local.set({"sampled_feature_questioinnaire": null});
            chrome.storage.local.set({"sampling_feature_lock": false});
        }
    });
}

// This callback sends a ping to our backend containing all the variables that
// are set in the extension's local storage. For the purposes of the ping
// message, we need to know:
//   1) The time spent on the sites we're analyzing.
//   2) What features are toggled.
//   3) The user's UID.
chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get(null, (result) => {
        /* update questionnaire status */
        console.log("check ESM status...");
        var current_time = new Date().getTime()/1000;
        var current_date = new Date(Date.now());
        
        //check if ESM expires
        if(result.sampled_esm !== null){
            var esm_time = result.sampled_esm["esm_time_unix_second"];
            if(current_time - esm_time > 5*60){
                console.log("sampled ESM expired (5 min), clear sampled ESM...");
                chrome.storage.local.set({"sampled_esm": null});
                if(result.sampled_feature_questioinnaire === null){
                    chrome.action.setBadgeText({ text: "" });
                }
            }
        }
        else{
            if(result.sampled_feature_questioinnaire === null){
                chrome.action.setBadgeText({ text: "" });
            }
        }

        //check if daily ESM counter needs to be upated
        if(result.last_active_date !== current_date.getDate()){
            console.log("reset ESM daily counter...");
            chrome.storage.local.set({"esm_counter_today": 0});
            chrome.storage.local.set({"last_active_date": current_date.getDate()});
        }

        // check if feature questionnaire clock is up and try to create a questionnaire
        if(result.sampling_feature_lock && result.sampled_feature_questioinnaire === null && current_time-result.sampling_feature_lock_timer > 180){
            console.log("create a feature questionnaire");
            createFeatureQuestionnaire();
        }

        // check if feature questionnaire expires
        if(result.sampled_feature_questioinnaire !== null){
            var qusetionnaire_time = result.sampled_feature_questioinnaire["sampled_time_unix_second"];
            if(current_time - qusetionnaire_time > 30*60){
                console.log("sampled feature questionnaire expired (30 min), clear sampled feature questionnaire...");
                // reset feature change cache
                chrome.storage.local.set({"sampled_feature_questioinnaire": null});
                chrome.storage.local.set({"sampling_feature_lock": false});
                if(result.sampled_esm === null){
                    chrome.action.setBadgeText({ text: "" });
                }
            }
        }
        else{
            if(result.sampled_esm === null){
                chrome.action.setBadgeText({ text: "" });
            }
        }
        
        /* process ping */
        // add timestamp
        var date = new Date(Date.now());
        var localReadableTime = date.toString().replace(/ \(.*\)/ig, '');//.replace(/(-|:|\.\d*)/g,'');//format: yyyyMMddThhmmssZ eg:19930728T183907Z
        result["timestamp"] = new Date().getTime();
        result["local_readable_time"] = localReadableTime;

        // To preserve privacy, don't send the screenshot and window URL
        // that's part of the ESM data.
        const esmAttr = "sampled_esm";
        if (esmAttr in result && result[esmAttr] !== null) {
            result[esmAttr].esm_screenshot = undefined;
            result[esmAttr].esm_url = undefined;
        }
        // remove esm in progress to ping
        const esmInProgress = "esm_in_progress";
        if (esmInProgress in result) {
            result[esmInProgress] = undefined;
        }


        // Make it clear to the backend that this is a ping message.
        result.type = "ping";
        let blob = new Blob(
            [JSON.stringify(result)],
            { type: "application/json" }
        )
        fetch("https://purpose-mode-backend.nymity.ch/submit", {
            method: "POST",
            body: blob,
        }).then((response) => {
            console.log("Backend responded to ping with status code: " +
                        response.status);
        })
    });
});

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
    else if(msg.name === "open feature questionnaire"){
        openFeatureQuestionnaire();
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
    else if(msg.name === "feature change"){
        console.log("Changed feature:", msg.body["changed_feature"]);
        console.log("Value before change:", msg.body["initial_value"]);
        const keys = ["sampling_feature_lock","last_feature_questionnaire_time",
        "TwitterCompact","TwitterInfinite","TwitterNotif","TwitterFeed","TwitterDesaturate","TwitterAutoplay",
        "LinkedInCompact","LinkedInInfinite","LinkedInNotif","LinkedInFeed","LinkedInDesaturate","LinkedInAutoplay",
        "FacebookCompact","FacebookInfinite","FacebookNotif","FacebookFeed","FacebookDesaturate","FacebookAutoplay",
        "YouTubeCompact","YouTubeComments","YouTubeInfinite","YouTubeNotif","YouTubeFeed","YouTubeDesaturate","YouTubeAutoplay",
        ];
        chrome.storage.local.get(keys).then(function (lock) {
            var current_time = new Date().getTime()/1000;
            var last_esm_time_diff = current_time - lock.last_feature_questionnaire_time;
            if(lock.sampling_feature_lock || last_esm_time_diff < 30*60){
                console.log("does not meet the feature changes sampling criteria:");
                console.log("sampling lock:",lock.sampling_feature_lock);
                console.log("since last feature questionnaire submitted (seconds):",last_esm_time_diff);
                return;
            }else{
                chrome.storage.local.set({"sampling_feature_lock": true});
                chrome.storage.local.set({"sampling_feature_lock_timer": current_time});
                var sample_site;
                var feature_before = {};
                // determine the sampling site and log current site-specific features
                if(msg.body["changed_feature"].includes("Twitter")){
                    sample_site = "Twitter";
                    feature_before["Compact"]     = lock.TwitterCompact;
                    feature_before["Infinite"]    = lock.TwitterInfinite;
                    feature_before["Notif"]       = lock.TwitterNotif;
                    feature_before["Feed"]        = lock.TwitterFeed; 
                    feature_before["Desaturate"]  = lock.TwitterDesaturate;
                    feature_before["Autoplay"]    = lock.TwitterAutoplay;
                }
                else if(msg.body["changed_feature"].includes("Facebook")){
                    sample_site = "Facebook";
                    feature_before["Compact"]     = lock.FacebookCompact;
                    feature_before["Infinite"]    = lock.FacebookInfinite;
                    feature_before["Notif"]       = lock.FacebookNotif;
                    feature_before["Feed"]        = lock.FacebookFeed; 
                    feature_before["Desaturate"]  = lock.FacebookDesaturate;
                    feature_before["Autoplay"]    = lock.FacebookAutoplay;
                }
                else if(msg.body["changed_feature"].includes("LinkedIn")){
                    sample_site = "LinkedIn";
                    feature_before["Compact"]     = lock.LinkedInCompact;
                    feature_before["Infinite"]    = lock.LinkedInInfinite;
                    feature_before["Notif"]       = lock.LinkedInNotif;
                    feature_before["Feed"]        = lock.LinkedInFeed; 
                    feature_before["Desaturate"]  = lock.LinkedInDesaturate;
                    feature_before["Autoplay"]    = lock.LinkedInAutoplay;
                }
                else if(msg.body["changed_feature"].includes("YouTube")){
                    sample_site = "YouTube";
                    feature_before["Compact"]     = lock.YouTubeCompact;
                    feature_before["Comments"]    = lock.YouTubeComments;
                    feature_before["Infinite"]    = lock.YouTubeInfinite;
                    feature_before["Notif"]       = lock.YouTubeNotif;
                    feature_before["Feed"]        = lock.YouTubeFeed; 
                    feature_before["Desaturate"]  = lock.YouTubeDesaturate;
                    feature_before["Autoplay"]    = lock.YouTubeAutoplay;
                }
                // update the changed value
                for (const [key, value] of Object.entries(feature_before)) {
                    if(msg.body["changed_feature"].includes(key)){
                        feature_before[key] = msg.body["initial_value"];
                    }
                }
                console.log("before change setting:", feature_before);
                chrome.storage.local.set({"sampling_feature_site": sample_site});
                chrome.storage.local.set({"feature_before": feature_before});
            }
        });
    }
})

export {};
