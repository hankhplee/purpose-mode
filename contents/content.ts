import $ from "jquery";
import "../finite_scroll_style.css";
import twitterIcon from "data-base64:~assets/twitter.ico";
import { sendToBackground } from "@plasmohq/messaging"

const extName = "Purpose Mode";
const settingToHandler = {
    "Enable":            onToggleEnable,

    "Desaturate":        onToggleDesaturate,

    "TwitterCompact":    onToggleTwitterCompact,
    // "TwitterReadOnly":   onToggleTwitterReadOnly,
    // "TwitterClutter":    onToggleTwitterClutter,
    // "TwitterRecomm":     onToggleTwitterRecomm,
    "TwitterInfinite":   onToggleTwitterInfinite,
    "TwitterNotif":      onToggleTwitterNotif,
    "TwitterFeed":       onToggleTwitterFeed,
    "TwitterDesaturate": onToggleTwitterDesaturate,

    "LinkedInCompact":   onToggleLinkedInCompact,
    // "LinkedInDeclutter": onToggleLinkedInDeclutter,
    // "LinkedInRecomms":   onToggleLinkedInRecomms,
    "LinkedInInfinite":  onToggleLinkedInInfinite,
    "LinkedInNotif":     onToggleLinkedInNotif,
    "LinkedInFeed":      onToggleLinkedInFeed,
    "LinkedInDesaturate":onToggleLinkedInDesaturate,

    "FacebookCompact":   onToggleFacebookCompact,
    // "FacebookDeclutter": onToggleFacebookDeclutter,
    // "FacebookRecomms":   onToggleFacebookRecomms,
    "FacebookInfinite":  onToggleFacebookInfinite,
    "FacebookNotif":     onToggleFacebookNotif,
    "FacebookFeed":      onToggleFacebookFeed,
    "FacebookDesaturate":onToggleFacebookDesaturate,

    "YouTubeAutoplay":   onYouTubeAutoPlay,
    "YouTubeCompact":    onToggleYouTubeCompact,
    // "YouTubeDeclutter":  onToggleYouTubeDeclutter,
    // "YouTubeRecomm":     onToggleYouTubeRecomm,
    "YouTubeInfinite":   onToggleYouTubeInfinite,
    "YouTubeNotif":      onToggleYouTubeNotif,
    "YouTubeFeed":       onToggleYouTubeFeed,
    "YouTubeDesaturate": onToggleYouTubeDesaturate,
}

let isEnabled = false;
let feedHeight = 2500;
let containerTop = 0;
const showMoreIncrement = 2500;

function hideSelectors(selectors: Array<JQuery>) {
    for (const s of selectors) {
        s.each(() => { s.hide() });
    }
}

function showSelectors(selectors: Array<JQuery>) {
    for (const s of selectors) {
        s.each(() => { s.show() });
    }
}

function getCurrentPage(): string {
    const currentWindowURL = window.location.href;
    // console.log("current url", currentWindowURL);
    if (currentWindowURL.includes("twitter.com")){
        return "Twitter";
    }
    else if (currentWindowURL.includes("facebook.com")){
        return "Facebook";
    }
    else if (currentWindowURL.includes("youtube.com")){
        return "YouTube";
    }
    else if (currentWindowURL.includes("linkedin.com")){
        return "LinkedIn";
    } else {
        return "NA";
    }
}

function isHomePage(): boolean {
    const currentWindowURL = window.location.href;
    if (currentWindowURL.includes("https://twitter.com/home") ||
        currentWindowURL === "https://www.facebook.com/" ||
        currentWindowURL === "https://www.youtube.com/" || currentWindowURL === "https://www.youtube.com/?bp=wgUCEAE%3D" ||
        currentWindowURL === "https://www.linkedin.com/feed/"){
        return true;
    } else {
        return false;
    }
}

function isYouTubeVideo(): boolean{
    const currentWindowURL = window.location.href;
    if (currentWindowURL.includes("https://www.youtube.com/watch?")){
        return true;
    }
    else{
        return false;
    }
}

function isYouTubeSearch(): boolean{
    const currentWindowURL = window.location.href;
    if (currentWindowURL.includes("results?search_query")){
        return true;
    }
    else{
        return false;
    }
}

function isAutoPlaySettingPage() : boolean {
    const currentWindowURL = window.location.href;
    if (currentWindowURL.includes("https://twitter.com/settings/autoplay") || 
        currentWindowURL.includes("https://www.linkedin.com/mypreferences/d/settings/autoplay-videos") || 
        currentWindowURL.includes("https://www.facebook.com/settings?tab=videos")
        ){
        return true;
    } else {
        return false;
    }
}

const currentPage = getCurrentPage();
function getContainer() {
    return new Promise((resolve) => {
        const currentWindowURL = window.location.href;
        // Twitter autoplay setting page
        if(currentWindowURL.includes("https://twitter.com/settings/autoplay")){
            const y = document;
            resolve(y);
        }
        else if (currentPage == "Twitter") {
            const x = $('section[aria-labelledby]');
            if (x.length === 0 || x.find("article").length === 0) {
                setTimeout(() => { resolve(getContainer()); }, 100);
                return;
            }
            const y = x.children("div[aria-label]").first().children().first();
            resolve(y);
        } else if (currentPage == "Facebook") {
            const y = $('div[role="main"]');
            if (y.length === 0) {
                setTimeout(() => { resolve(getContainer()); }, 100);
                return;
            }
            resolve(y);
        } else if (currentPage == "YouTube") {
            const y = $("#content");
            if (y.length === 0) {
                setTimeout(() => { resolve(getContainer()); }, 100);
                return;
            }
            resolve(y);
        } else if (currentPage == "LinkedIn") {
            if (isHomePage()) {
                // const y = $('main[aria-label]');
                const y = $('div.application-outlet');
                if (y.length === 0) {
                    setTimeout(() => { resolve(getContainer()); }, 100);
                    return;
                }
                resolve(y);
            } else {
                const y = document;
                resolve(y);
            }
        } else {
            console.error("Unknown page to enable purpose mode.");
        }
    });
}

function isAlreadyManipulated(container: JQuery<HTMLElement>) {
    const button = $("#tisd-show-more");
    return !!button.length;
};

const updateFacebookShowMore = (container) => {
    const button = $("#tisd-show-more");
    feedHeight = parseInt(container.css('height'));
    container.css("max-height", `${feedHeight}px`);
    button.css("top", `${feedHeight+containerTop-100}px`);
}

function showMore(container: JQuery<HTMLElement>, button: JQuery<HTMLElement>) {
    feedHeight += showMoreIncrement;
    container.css("max-height", `${feedHeight}px`);
    if (currentPage == "Facebook"
        && parseInt(container.css('height')) < feedHeight) {
        const button = $("#tisd-show-more");
        feedHeight = parseInt(container.css('height'));
        container.css("max-height", `${feedHeight}px`);
        button.css("top", `${feedHeight+containerTop-100}px`);
    }
    if (currentPage == "Twitter") {
        container.css("min-height", `${feedHeight}px`);
    }
    button.css("top", `${feedHeight+containerTop-100}px`);
};


var mutationObserver = new MutationObserver(function(mutations) {
    // let keys = [
    //     "TwitterReadOnly",
    // ];
    let keys = [
        // "TwitterCompact",
        // "TwitterClutter",
        // "TwitterRecomm",
        // "TwitterInfinite",
        "TwitterNotif",
        "TwitterFeed",

        "LinkedInCompact",
        // "LinkedInDeclutter",
        // "LinkedInRecomms",
        // "LinkedInInfinite",
        "LinkedInNotif",
        "LinkedInFeed",

        "FacebookCompact",
        // "FacebookDeclutter",
        // "FacebookRecomms",
        // "FacebookInfinite",
        "FacebookNotif",
        "FacebookFeed",

        "YouTubeAutoplay",
        "YouTubeCompact",
        // "YouTubeRecomm",
        // "YouTubeDeclutter",
        "YouTubeInfinite",
        "YouTubeNotif",
        "YouTubeFeed",
    ]

    // For each page mutation, invoke relevant toggle functions if enabled.
    mutations.forEach(function(mutation) {
        if (!isEnabled) {
            return;
        }
        for (const key of keys) {
            chrome.storage.local.get(key, (result) => {
                if (result[key] === true) {
                    if(key === "FacebookCompact"){
                        onToggleFacebookCompactDynamic(true);
                    }
                    else if(key === "LinkedInCompact"){
                        onToggleLinkedInCompactDynamic(true);
                    } 
                    else {
                        settingToHandler[key](result[key], mutation.target);
                    }
                }
            });
        }
    });

    // For autoplay page, invoke autoplay setting
    if(isAutoPlaySettingPage() && currentPage!="Facebook"){
        setAutoPlay();
    }
});


function toggleInfScrolling(toggled: boolean) {
    getContainer().then((container: JQuery<HTMLElement>) => {
        if (!toggled) {
            resetInfScrolling(container);
        } else {
            stopInfScrolling(container);
        }
    });
}

const checkBackgroundColorDark = () => {
    if(currentPage == "Twitter"){
        const bgColor = $("body").css("background-color");
        if (bgColor === "rgb(21, 32, 43)" || bgColor === "rgb(0, 0, 0)") {
            return true;
        }
        else{
            return false;
        }
    }
    else if(currentPage == "Facebook"){
        const bgColor = $("body").css("background-color");
        if (bgColor === "rgb(24, 25, 26)") {
            return true;
        }
        else{
            return false;
        }
    }
    else if (currentPage == "YouTube"){
        const bgColor = $("ytd-app").css("background");
        if (bgColor.includes("rgb(15, 15, 15)")) {
            return true;
        }
        else{
            return false;
        }
    }
    else if (currentPage == "LinkedIn"){
        const bgColor = $("body").css("background-color");
        if (bgColor.includes("rgb(0, 0, 0)")){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        console.error("Unknown page to enable purpose mode!");
    }
}

function resetInfScrolling(container: JQuery<HTMLElement>) {
    container.css({
        "max-height": "none",
        "min-height": "auto",
        overflow: "auto"
    });

    const button = $("#tisd-show-more");
    if(button){
        button.remove();
    }
    feedHeight = 2500;
}

function stopInfScrolling(container: JQuery<HTMLElement>) {
    if (!isHomePage()) {
        return;
    }

    if (currentPage === "Twitter") {
        container.css("min-height", `${feedHeight}px`);
    }
    container.css("max-height", `${feedHeight}px`);
    if (currentPage === "Facebook"
        && parseInt(container.css('height')) < feedHeight) {
        updateFacebookShowMore(container);
    }
    containerTop = 0;
    if (container){
        var position = container.position();
        if (position){containerTop = position.top;}
    }

    if (isAlreadyManipulated(container)) {
        return;
    }

    container.css({
        "max-height": `${feedHeight}px`,
        "overflow":   "hidden",
    });
    if (currentPage === "Twitter") {
        container.css("min-height", `${feedHeight}px`);
    }

    const button = $(`
        <div id="tisd-show-more">
            <button type="button">Show more</button>
        </div>
    `);
    button.css({
        width: container.width(),
        top: `${feedHeight+containerTop-100}px`
    });
    container.prepend(button);

    if (checkBackgroundColorDark()){
        button.children("button").css({"color": "rgb(255, 255, 255)", "background-color": "rgba(0 , 0, 0, 0.7)"});
    }
    else{
        button.children("button").css({"color": "rgb(0, 0, 0)", "background-color": "rgba(255 , 255, 255, 0.7)"});
    }

    button.click(() => showMore(container, button));
}

// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
});

// Takes all changes which haven’t been fired so far.
var changes = mutationObserver.takeRecords();


function onToggleEnable(toggled: boolean) {
    isEnabled = toggled;
    chrome.storage.local.get(null, (result) => {
        console.log(extName + " configuration: ");
        console.log(result);
    });

    if (!toggled) {
        console.log("Disabling " + extName + ".");
        // Disable all settings.
        for (const key in settingToHandler) {
            if (key === "Enable") {
                continue;
            }
            settingToHandler[key](false);
        }
    } else {
        console.log("Enabling " + extName + ".");
        // Run whatever settings were previously enabled.
        for (const key in settingToHandler) {
            if (key === "Enable") {
                continue;
            }
            chrome.storage.local.get(key, (result) => {
                if (result.hasOwnProperty(key)) {
                    // if (key === "Desaturate") {
                    //     return;
                    // }
                    console.log("Running handler for '" + key + "' = '" + result[key] + "'.");
                    settingToHandler[key](result[key]);
                }
            })
        }
    }
}

function onToggleLinkedInCompactDynamic(toggled: boolean){
    if (getCurrentPage() != "LinkedIn") {
        return;
    }
    if (toggled) {
        if($('div.scaffold-layout__sidebar').css('display') !== 'none'){
            onToggleLinkedInCompact(toggled);
        }
        let elements = [
            // Messaging.
            $('aside#msg-overlay'),
        ];
        for (const e of elements) { e.hide() }
    }
}

function onToggleLinkedInCompact(toggled: boolean){
    if (getCurrentPage() != "LinkedIn") {
        return;
    }
    onToggleLinkedInDeclutter(toggled);
    onToggleLinkedInRecomms(toggled);
}

function onToggleLinkedInDeclutter(toggled: boolean) {
    if (getCurrentPage() != "LinkedIn") {
        return;
    }

    let elements = [
        // Messaging.
        $('aside#msg-overlay'),
        // Left column profile and links.
        $('div.scaffold-layout__sidebar'),
        // LinkedIn Premium ads (upper right).
        $('div.premium-upsell-link'),
        // "For Business" button.
        $('li.global-nav__primary-item:has(> button > span[title="For Business"])'),
        // Footer
        $('footer[aria-label="LinkedIn Footer Content"]'),
    ];
    if(isHomePage()){
        elements.push($('aside[aria-label="LinkedIn News"]'));
    }
    else{
        elements.push($('footer.global-footer'));
    }

    if (toggled) {
        for (const e of elements) { e.hide() }
    } else {
        for (const e of elements) { e.show() }
    }
}

function onToggleLinkedInNotif(toggled: boolean) {
    if (getCurrentPage() != "LinkedIn") {
        return;
    }

    let elements = [
        // DM notification
        $('mark.msg-overlay-bubble-header__unread-count'),
    ];

    if (toggled) {
        for (const e of elements) { e.hide() }
        // "Red dot" notification icon.
        $('span.notification-badge--show').each(function() {
            $( this ).hide();
        });
        // reset window title
        if(document.title !== "LinkedIn"){
            document.title = "LinkedIn";
        }
    } else {
        for (const e of elements) { e.show() }
        // "Red dot" notification icon.
        $('span.notification-badge--show').each(function() {
            $( this ).show();
        });
    }
}

function onToggleLinkedInRecomms(toggled: boolean) {
    if (getCurrentPage() != "LinkedIn") {
        return;
    }

    let elements = [
        // LinkedIn news.
        $('section:has(>div>div#feed-news-module)'),
    ];
    if(!isHomePage()){
        // Profile recommendations.
        $('aside.scaffold-layout__aside').children('section').each(function(){
            elements.push($( this ));
        });
        $('aside.scaffold-layout__aside').children('div').each(function(){
            if(!this.className.includes("profile-info-section")){
                elements.push($( this ));
            }
        });
        // Profile advertisements
        elements.push($('aside.scaffold-layout__aside[aria-label="Advertisement"]'));
    }
    if (toggled) {
        for (const e of elements) { e.hide() }
    } else {
        for (const e of elements) { e.show() }
    }
}

function onToggleLinkedInInfinite(toggled: boolean) {
    const currentWindow = window.top.location.href;
    if (!currentWindow.includes("https://www.linkedin.com/feed/")) {
        return;
    }
    toggleInfScrolling(toggled);
}

function onToggleLinkedInFeed(toggled: boolean){
    const currentWindow = window.top.location.href;
    if (!currentWindow.includes("https://www.linkedin.com/feed/")) {
        return;
    }
    const selectors = [
        // newsfeed
        $('main[aria-label="Main Feed"] > div:has(>h1)'),
        // newsfeed sort button
        $('div:has( > button> div > svg[aria-label="Sort order dropdown button"])'),
        // "See More" button when finite scrolling is activated
        $("#tisd-show-more"),
    ];
    if (toggled) {
        hideSelectors(selectors);
    } else {
        showSelectors(selectors);
    }
}

function onToggleTwitterReadOnly(toggled: boolean, node: Node) {
    if (getCurrentPage() != "Twitter") {
        return;
    }
    let selectors = [
        $("div[aria-label*=Reply]", node).parent().parent(),
        $("div[role=progressbar]", node).parent(),
        $("a[aria-label=Tweet]", node),
    ];
    if (toggled) {
        for (const s of selectors) {
            s.each(() => { s.hide() });
        }
    } else {
        for (const s of selectors) {
            s.each(() => { s.show() });
        }
    }
}

function onToggleTwitterCompact(toggled: boolean) {
    if (getCurrentPage() != "Twitter") {
        return;
    }

    // Send a message to the second content script, which runs in the main
    // world.  Upon receiving this message, the script is going to
    // monkey-patch the window and document API.
    window.postMessage({
        type:  "FROM_CONTENT_SCRIPT",
        toggle: toggled
    }, "*");
}

function onToggleTwitterInfinite(toggled: boolean) {
    if (getCurrentPage() !== "Twitter") {
        return;
    }
    toggleInfScrolling(toggled);
}

function onToggleTwitterNotif(toggled: boolean) {
    if (getCurrentPage() !== "Twitter") {
        return;
    }
    const selectors = [
        // Blue notification circle on top of home icon.
        $('div[aria-label="undefined unread items"]'),
        // Blue button that promotes new tweets.
        $('div[aria-label="New Tweets are available. Push the period key to go to the them."]'),
        // DM box notification
        $('svg[aria-label="New Direct Message"]'),
    ]
    if (toggled) {
        hideSelectors(selectors);
        // Notifications.
        $('div[aria-label*="unread"]').each(function(){
            $( this ).hide();
        });
        if(document.title !== "Twitter"){
            // reset window title
            document.title = "Twitter";
            // reset window icon
            var icon = document.querySelector("link[rel~='icon']");
            icon.setAttribute('href',twitterIcon);
        }
    } else {
        showSelectors(selectors);
        // Notifications.
        $('div[aria-label*="unread"]').each(function(){
            $( this ).show();
        });
    }
}

function onToggleTwitterFeed(toggled: boolean) {
    const currentWindow = window.location.href;
    if (!currentWindow.includes("https://twitter.com/home")) {
        return;
    }

    const feeds = $('div[aria-label="Timeline: Your Home Timeline"]');
    const selectors = $('div[role="presentation"]:has(> a[role="tab"])'); // "For you" and "Following" tabs
    if (toggled) {
        feeds.css({
            "visibility": "hidden"
        });
        selectors.each(function(){
            $( this ).hide();
        });
    } else {
        feeds.css({
            "visibility": "visible"
        });
        selectors.each(function(){
            $( this ).show();
        });
    }
}

function onToggleTwitterRecomm(toggled: boolean) {
    if (getCurrentPage() !== "Twitter") {
        return;
    }

    const selectors = [
        // "What's happening" column on the right.
        $('div[aria-label="Timeline: Trending now"]'),
        // "Who to follow" column on the right.
        $('div:has(> div > aside[aria-label="Who to follow"])'),
    ];
    if (toggled) {
        hideSelectors(selectors);
    } else {
        showSelectors(selectors);
    }
}

function onToggleTwitterClutter(toggled: boolean) {
    if (getCurrentPage() !== "Twitter") {
        return;
    }

    const selectors = [
        // ToS, privacy policy, etc.
        $('nav[aria-label="Footer"]'),
        // "Get verified" promotion.
        $('div:has(> aside[aria-label="Get Verified"])'),
        // DM.
        $('div[data-testid="DMDrawer"]'),
        // Search
        // $('form[aria-label="Search Twitter"]'),
    ];
    if (toggled) {
        hideSelectors(selectors);
    } else {
        showSelectors(selectors);
    }
}

function onToggleFacebookInfinite(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }
    toggleInfScrolling(toggled);
}

function onToggleFacebookCompactDynamic(toggled: boolean){
    if (getCurrentPage() !== "Facebook") {
        return;
    }
    const selectors = [
        /* Declutter */
        // Additional chat boxes.
        $('div[aria-label*="additional chats"]'),
        // New message box.
        $('div[aria-label="New message"'),

        /* Remove recommendations */
        // "Reels" and short video recommendations.
        // $('div[aria-label="Reels"]').parent().parent().parent().parent(),
        // "People you may know".
        $('span:contains("People You May Know")').parent().parent().parent().parent().parent(),
        $('span:contains("People you may know")').parent().parent().parent().parent().parent(),
        // Suggested groups.
        $('span:contains("Suggested groups")').parent().parent(),
    ];

    if (toggled) {
        // check if need to run FacebookCompactDynamic
        if($('div[aria-label="Stories"]').parent().parent().css('display') !== 'none'){
            onToggleFacebookCompact(toggled);
            console.log("Run FacebookCompact");
            return;
        }
        else{
            console.log("Run FacebookCompactDynamic");
        }

        for (const s of selectors) {
            s.each(() => { s.hide() });
        }
        // Messenger boxes.
        $('div[aria-label*="Open chat"').each(function(){
            $( this ).hide();
        });
        // "Reels" and short video recommendations. (optimal solution; comment out due to performance issue)
        $('div[aria-label="Reels"]').each(function(){
            $( this ).parent().parent().parent().parent().hide();
        });
    } else {
        for (const s of selectors) {
            s.each(() => { s.show() });
        }
        // Messenger boxes.
        $('div[aria-label*="Open chat"').each(function(){
            $( this ).show();
        });
        // // "Reels" and short video recommendations.
        $('div[aria-label="Reels"]').each(function(){
            $( this ).parent().parent().parent().parent().show();
        });
    }
}

function onToggleFacebookCompact(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }
    onToggleFacebookRecomms(toggled);
    onToggleFacebookDeclutter(toggled);
}

function onToggleFacebookDeclutter(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }
    const currentWindowURL = window.location.href;

    const selectors = [
        // Hamburger menu on the left.
        $('div[role="navigation"]:has(> div > div > div > h2:contains("Facebook Menu"))'),
        // Buttons at the top of the page.
        $('a[aria-label="Home"]'),
        // Watch button.
        $('a[aria-label="Watch"]'),
        // Watch button.
        $('a[aria-label="Video"]'),
        // Marketplace button.
        $('a[aria-label="Marketplace"]'),
        // Groups button.
        $('a[aria-label="Groups"]'),
        // Gaming button.
        $('a[aria-label="Gaming"]'),
        // Additional chat boxes.
        $('div[aria-label*="additional chats"]'),
        // New message box.
        $('div[aria-label="New message"'),
    ];
    if(!currentWindowURL.includes("/photo/")){
        // Right column.
        selectors.push($('div[role="complementary"]'));
    }
    if (toggled) {
        for (const s of selectors) {
            s.each(() => { s.hide() });
        }
        // Messenger boxes.
        $('div[aria-label*="Open chat"').each(function(){
            $( this ).hide();
        });
    } else {
        for (const s of selectors) {
            s.each(() => { s.show() });
        }
        // Messenger boxes.
        $('div[aria-label*="Open chat"').each(function(){
            $( this ).show();
        });
    }
}

function onToggleFacebookFeed(toggled: boolean){
    const currentWindow = window.top.location.href;
    if (currentWindow !== "https://www.facebook.com/") {
        return;
    }
    const selectors = [
        // "Stories" and "reels" videos at the top.
        $('div[aria-label="Stories"]').parent().parent(),
        // “Stories” and “Reels” buttons
        $('div[role="tablist"]:has(> div > div > div > div > div > span:contains("Stories"))'),
        // newsfeed
        $('div:has(>span[id="ssrb_feed_start"])'),
        // "See More" button when finite scrolling is activated
        $("#tisd-show-more"),

    ];
    if (toggled) {
        hideSelectors(selectors);
    } else {
        showSelectors(selectors);
    }
}

function onToggleFacebookRecomms(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }

    const selectors = [
        // "Stories" and "reels" videos at the top.
        $('div[aria-label="Stories"]').parent().parent(),
        // “Stories” and “Reels” buttons
        $('div[role="tablist"]:has(> div > div > div > div > div > span:contains("Stories"))'),
        // "People you may know".
        $('span:contains("People You May Know")').parent().parent().parent().parent().parent(),
        $('span:contains("People you may know")').parent().parent().parent().parent().parent(),
        // Suggested groups.
        $('span:contains("Suggested groups")').parent().parent(),
    ];
    if (toggled) {
        for (const s of selectors) {
            s.each(() => { s.hide() });
        }
        // "Reels" and short video recommendations.
        $('div[aria-label="Reels"]').each(function(){
            $( this ).parent().parent().parent().parent().hide();
        });
    } else {
        for (const s of selectors) {
            s.each(() => { s.show() });
        }
        // "Reels" and short video recommendations.
        $('div[aria-label="Reels"]').each(function(){
            $( this ).parent().parent().parent().parent().show();
        });
    }
}

function onToggleFacebookNotif(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }

    const selectors = [
        // "Red dot" update notification.
        $('div[aria-label*="Notifications"][tabindex="-1"]'),
        // "Red dot" notification for Messenger.
        $('div[aria-label*="Messenger"][tabindex="-1"]'),
        // "New posts" push notification
        $('button:has(> div > span:contains("New posts"))'),
    ];
    if (toggled) {
        for (const s of selectors) {
            s.each(() => { s.hide() });
        }
        // DM bubble
        $('div[aria-label*="Open chat"]').find('div[aria-label*="unread"]').each(function() {
            $( this ).hide();
        });
        if(document.title !== "Facebook"){
            // reset window title
            document.title = "Facebook";
        }
    } else {
        for (const s of selectors) {
            s.each(() => { s.show() });
        }
        // DM bubble
        $('div[aria-label*="Open chat"]').find('div[aria-label*="unread"]').each(function() {
            $( this ).show();
        });
    }
}

function onToggleYouTubeInfinite(toggled: boolean) {
    if (getCurrentPage() !== "YouTube") {
        return;
    }
    if(toggled && isHomePage()){
        toggleInfScrolling(true);
    }
    else{
        toggleInfScrolling(false);
    }
}

function onToggleYouTubeFeed(toggled: boolean){
    if (getCurrentPage() !== "YouTube"){
        return;
    }
    const selectors = [
        // All recommended videos on the landing page.
        $('div[id=contents]'),
        // Recommendation tags on top of the page.
        $('div#scroll-container'),
        // "Next" button of the recommendation tags.
        $('button[aria-label="Next"]'),
        // "See More" button when finite scrolling is activated
        $("#tisd-show-more"),
    ];
    if (toggled && isHomePage()) {
        hideSelectors(selectors);
    } else {
        showSelectors(selectors);
    }
}

function onToggleYouTubeCompact(toggled: boolean){
    if (getCurrentPage() !== "YouTube") {
        return;
    }
    
    onToggleYouTubeRecomm(toggled);
    onToggleYouTubeDeclutter(toggled);
}

function onToggleYouTubeRecomm(toggled: boolean) {
    if (getCurrentPage() !== "YouTube") {
        return;
    }

    let selectors = [];
    const homePage = isHomePage();
    const watchPage = isYouTubeVideo();
    const searchPage = isYouTubeSearch();
    // Landing page.
    if (homePage) {
        selectors = selectors.concat([
            // Recommendation tags on top of the page.
            $('div#scroll-container'),
            // "Next" button of the recommendation tags.
            $('button[aria-label="Next"]'),
            // Video ad on the home page.
            $('div#masthead-ad'),
            // promotion banner
            $('ytd-banner-promo-renderer'),
            $('ytd-statement-banner-renderer'),
        ]);
    // Recommendations on the "watch" page.
    } else if (watchPage) {
        selectors = selectors.concat([
            // Video recommendations.
            $('div#secondary-inner'),
        ]);
    } 

    if (toggled) {
        hideSelectors(selectors);
        if(homePage){
            // all section drawers on landing page
            $('ytd-rich-section-renderer').each(function(){
                $( this ).hide();
            });
        }
        else if(searchPage){
            // all shorts on search
            $('ytd-reel-shelf-renderer').each(function(){
                $( this ).hide();
            });
            // add ads on serach
            $('ytd-in-feed-ad-layout-renderer').each(function(){
                $( this ).hide();
            });
            // all shelf recommendations
            $('ytd-shelf-renderer').each(function(){
                $( this ).hide();
            });
            // card list recommendations
            $('ytd-horizontal-card-list-renderer').each(function(){
                $( this ).hide();
            });
        }
    } else {
        showSelectors(selectors);
        if(homePage){
            // all section drawers on landing page
            $('ytd-rich-section-renderer').each(function(){
                $( this ).show();
            });
        }
        else if(searchPage){
            // all shorts on search
            $('ytd-reel-shelf-renderer').each(function(){
                $( this ).show();
            });
            // add ads on serach
            $('ytd-in-feed-ad-layout-renderer').each(function(){
                $( this ).show();
            });
            // all shelf recommendations
            $('ytd-shelf-renderer').each(function(){
                $( this ).show();
            });
            // card list recommendations
            $('ytd-horizontal-card-list-renderer').each(function(){
                $( this ).show();
            });
        }
    }
}

function onToggleYouTubeNotif(toggled: boolean) {
    if (getCurrentPage() !== "YouTube") {
        return;
    }

    const selectors = [
        // Notification icons.
        $("div.yt-spec-icon-badge-shape__badge"),
        // "Newness" dot.
        $("div[id=newness-dot]"),
    ]
    if (toggled) {
        hideSelectors(selectors);
        if(document.title !== "YouTube"){
            // reset window title
            document.title = "YouTube";
        }
    } else {
        // Only show the first selector. Showing the second selector results
        // in every category incorrectly displaying a notification icon. To fix
        // this, we would have to remember which categories originally had a
        // notification.
        showSelectors([selectors[0]]);
    }
}

function onToggleYouTubeDeclutter(toggled: boolean) {
    if (getCurrentPage() !== "YouTube") {
        return;
    }
    const selectors = [
        // Hamburger menu.
        $('div#guide-content'),
    ]
    if (isYouTubeVideo()) {
        selectors.push($("ytd-comments#comments")); // Comments.
    }

    if (toggled) {
        hideSelectors(selectors);
    } else {
        showSelectors(selectors);
    }
}

function onToggleDesaturate(toggled: boolean) {
    if (getCurrentPage() !== "Twitter" && getCurrentPage() !== "Facebook" && getCurrentPage() !== "YouTube" && getCurrentPage() !== "LinkedIn") {
        return;
    }
    let e = $("html");
    if (toggled) {
        // TODO: This does not work on Reddit. It also breaks the style on
        // YouTube.
        console.log("Existing CSS:");
        console.log(e.css("filter"));
        // e.css({"cssText": "filter: saturate(10%)"});
        e.css({"filter": "saturate(10%)"});
    } else {
        // e.css({"cssText": "filter: saturate(100%)"});
        e.css({"filter": "saturate(100%)"});
    }
}

function onToggleFacebookDesaturate(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }
    let e = $("html");
    if (toggled) {
        e.css({"filter": "saturate(10%)"});
    } else {
        e.css({"filter": "saturate(100%)"});
    }
}

function onToggleLinkedInDesaturate(toggled: boolean) {
    if (getCurrentPage() !== "LinkedIn") {
        return;
    }
    let e = $("html");
    if (toggled) {
        e.css({"filter": "saturate(10%)"});
    } else {
        e.css({"filter": "saturate(100%)"});
    }
}

function onToggleTwitterDesaturate(toggled: boolean) {
    if (getCurrentPage() !== "Twitter") {
        return;
    }
    let e = $("html");
    if (toggled) {
        e.css({"filter": "saturate(10%)"});
    } else {
        e.css({"filter": "saturate(100%)"});
    }
}

function onToggleYouTubeDesaturate(toggled: boolean) {
    if (getCurrentPage() !== "YouTube") {
        return;
    }
    let e = $("html");
    if (toggled) {
        e.css({"filter": "saturate(10%)"});
    } else {
        e.css({"filter": "saturate(100%)"});
    }
}


function onToggleTwitterAutoplay(toggled: boolean){
    if (getCurrentPage() !== "Twitter") {
        return;
    }
    let autoPlayToggle;
    let alertMessage;
    if(toggled === true){
        // autoPlayToggle = $('input:radio[name="video_autoplay"]:nth(1)');
        autoPlayToggle = $('input[aria-posinset="2"]');
        alertMessage = "Autoplay on Twitter has been turned OFF.\nTo turn it back on, please go to the Purpose Mode setting.";
    }else{
        autoPlayToggle = $('input[aria-posinset="1"]');
        alertMessage = "Autoplay on Twitter has been turned ON.\nTo turn it off, please go to the Purpose Mode setting.";
    }
    // let toggleFlag = autoPlayToggle.is(':checked');
    if(autoPlayToggle.is(':checked') === false){
        console.log("suppose to click button");
        autoPlayToggle.parent().on('click', function (){
            // if(toggleFlag === false){
            //     toggleFlag = true;
            //     chrome.storage.local.set({"TwitterAutoplay": toggled});
            //     alert(alertMessage);
            // }
            // });
            chrome.storage.local.set({"TwitterAutoplay": toggled});
            alert(alertMessage);
            });
        autoPlayToggle.parent().click();
    }
    chrome.storage.local.set({"TwitterAutoplay": toggled});
    
}

function onToggleFacebookAutoplay(toggled: boolean){
    if (getCurrentPage() !== "Facebook") {
        return;
    }
    chrome.storage.local.set({"FacebookAutoplay": toggled});
    let currentToggle;
    let alertMessage;
    
    if(toggled === true){
        alertMessage = 'Autoplay on Facebook has been turned OFF.\nTo turn it back on, please go to the Purpose Mode setting.\n\n[NOTICE]: To avoid mulfunction, please confirm if "Auto-Play Videos" is set to "Off". If not, please manually do so.';
    } else{
        alertMessage = 'Autoplay on Facebook has been turned ON.\nTo turn it off, please go to the Purpose Mode setting.\n\n[NOTICE]: To avoid mulfunction, please confirm if "Auto-Play Videos" is set to "Default". If not, please manually do so.';
    }
    let currentToggleTarget;
    setTimeout(() => {
        currentToggleTarget = $('iframe').contents().find('span[id="autoplay_setting"]');
        if(currentToggleTarget.length === 0){
            currentToggleTarget = $('span[id="autoplay_setting"]');
        }
        // let currentToggleText = document.querySelector('span[id="autoplay_setting"]').innerHTML;
        console.log("currentToggleText: ", currentToggleTarget.text());
        if(currentToggleTarget.text().includes("Off")){
            currentToggle = true;
        } else if(currentToggleTarget.text().includes("On") || currentToggleTarget.text().includes("Default")){
            currentToggle = false;
        } else {
            return;
        }

        if(currentToggle !== toggled){
            // $('iframe').contents().find('span[id="autoplay_setting"]').click();
            // $('iframe').contents().find('span[id="autoplay_setting"]').click();
            currentToggleTarget.click();
            
            console.log("currentToggleTarget", currentToggleTarget);
            setTimeout(() => {
                console.log("Delayed for 1 second for the page to refresh.");
                let autoPlayToggle;
                if(toggled === true){
                    autoPlayToggle = $('iframe').contents().find('a:has(>span>span:contains("Off"))').parent();// turn off autoplay
                    if(autoPlayToggle.length === 0){
                        autoPlayToggle = $('a:has(>span>span:contains("Off"))').parent();
                    }
                } else {
                    autoPlayToggle = autoPlayToggle = $('iframe').contents().find('a:has(>span>span:contains("Default"))').parent(); // turn on autoplay
                    if(autoPlayToggle.length === 0){
                        autoPlayToggle = $('a:has(>span>span:contains("Default"))').parent();
                    }
                }
                console.log("autoPlayToggle",autoPlayToggle);
                autoPlayToggle.click();
                alert(alertMessage);
            }, 1000);
        }
    }, 1000);
    // }else{
    //     alert(alertMessage);
    // }
}

function onToggleLinkedInAutoplay(toggled: boolean){
    if (getCurrentPage() !== "LinkedIn") {
        return;
    }
    let currentToggle;
    let alertMessage;
    
    if(toggled === true){
        alertMessage = "Autoplay on LinkedIn has been turned OFF.\nTo turn it back on, please go to the Purpose Mode setting.";
    } else{
        alertMessage = "Autoplay on LinkedIn has been turned ON.\nTo turn it off, please go to the Purpose Mode setting.";
    }
    
    const autoPlayToggle = $('div[data-control-name="toggle_button"]');
    const currentToggleText = $('span.artdeco-toggle__text').text();
    if(currentToggleText.includes("Off")){
        currentToggle = true;
    } else if(currentToggleText.includes("On")){
        currentToggle = false;
    } else{
        return;
    }
    
    if(currentToggle !== toggled){
        autoPlayToggle.click();
        alert(alertMessage);
    }
    // }else{
    //     alert(alertMessage);
    // }
    chrome.storage.local.set({"LinkedInAutoplay": toggled});
}


function setAutoPlay(){
    if (getCurrentPage() == "Twitter") {
        const key = "SetTwitterAutoplay";
        chrome.storage.local.get(key, (result) => {
            console.log("Set Twitter autoplay:",result.SetTwitterAutoplay);
            onToggleTwitterAutoplay(result.SetTwitterAutoplay);
        });
    }
    else if(getCurrentPage() == "LinkedIn"){
        const key = "SetLinkedInAutoplay";
        chrome.storage.local.get(key, (result) => {
            console.log("Set LinkedIn autoplay:",result.SetLinkedInAutoplay);
            onToggleLinkedInAutoplay(result.SetLinkedInAutoplay);
        });
    }
    else if(getCurrentPage() == "Facebook"){
        const key = "SetFacebookAutoplay";
        chrome.storage.local.get(key, (result) => {
            console.log("Set Facebook autoplay:",result.SetFacebookAutoplay);
            onToggleFacebookAutoplay(result.SetFacebookAutoplay);
        });
    }
}

function onYouTubeAutoPlay(toggled: boolean){
    if(!isYouTubeVideo()){
        return;
    }
    let autoPlayTarget;
    const autoPlayTargetOn = $('button[aria-label="Autoplay is on"]');
    const autoPlayTargetOff = $('button[aria-label="Autoplay is off"]');
    if(autoPlayTargetOn.length === 0 && autoPlayTargetOff.length === 0){
        setTimeout(() => {onYouTubeAutoPlay(toggled);}, 500);
        return;
    }
    if(toggled === true){
        console.log("Turn off autoplay on YouTube: ",autoPlayTarget);
        if(autoPlayTargetOn){
            autoPlayTargetOn.click();
        }
    }else {
        console.log("Turn on autoplay on YouTube: ",autoPlayTarget);
        if(autoPlayTargetOff){
            autoPlayTargetOff.click();
        }
    }
}

function detectVideos(){
    var currentSite = getCurrentPage();
    if(currentSite === "Twitter" || currentSite === "Facebook" || currentSite === "LinkedIn"){
        const videos = $('video');
        if(videos.length > 0){
            return true;
        }
        else{
            return false;
        }
    }
    else if(currentSite === "YouTube"){
        const currentWindowURL = window.location.href;
        if (currentWindowURL.includes("https://www.youtube.com/watch?")){
            return true;
        }
        else{
            return false;
        }
    }
}

function detectNotifications(){
    var currentSite = getCurrentPage();
    if(currentSite === "Twitter"){
        const selectors = [
            // Blue notification circle on top of home icon.
            $('div[aria-label="undefined unread items"]'),
            // Blue button that promotes new tweets. (this button will be on the page even when unvisible)
            // $('div[aria-label="New Tweets are available. Push the period key to go to the them."]'),
            // DM box notification
            $('svg[aria-label="New Direct Message"]'),
            // Notifications
            $('div[aria-label*="unread"]')
        ]
        for (const s of selectors) {
            if(s.length>0){
                return true;
            }
        }
        return false;
    }
    else if(currentSite === "Facebook"){
        const selectors = [
            // "Red dot" update notification.
            $('div[aria-label*="Notifications"][aria-label*="unread"][tabindex="-1"]'),
            // "Red dot" notification for Messenger.
            $('div[aria-label*="Messenger"][aria-label*="unread"][tabindex="-1"]'),
            // "New posts" push notification
            $('button:has(> div > span:contains("New posts"))'),
            // DM bubble
            $('div[aria-label*="Open chat"]').find('div[aria-label*="unread"]'),
        ]
        for (const s of selectors) {
            if(s.length>0){
                return true;
            }
        }
        return false;
    }
    else if(currentSite === "LinkedIn"){
        const selectors = [
            // DM notification
            $('mark.msg-overlay-bubble-header__unread-count'),
            // "Red dot" notification icon.
            $('span.notification-badge--show'),
        ]
        for (const s of selectors) {
            if(s.length>0){
                return true;
            }
        }
        return false;
    }
    else if(currentSite === "YouTube"){
        const currentWindowURL = window.location.href;
        const selectors = [
            // Notification icons.
            $("div.yt-spec-icon-badge-shape__badge"),
        ]
        for (const s of selectors) {
            if(s.length>0){
                return true;
            }
        }
        if(isHomePage()){ // check newnessDot only on landing page
            var newnessDotCheck = false;
            $("div[id=newness-dot]").each(function(){
                if($( this ).css('display') !== 'none'){
                    newnessDotCheck = true;
                }
            });
            if(newnessDotCheck === true){
                return true;
            }
        }
        return false;
    }
}

function distractionDetection(){
    var distractions = {};
    // Infinite newsfeed scrolling
    distractions['infinite_newsfeed_scrolling'] = isHomePage();
    // Autoplay video
    distractions['autoplay_video'] = detectVideos();
    // Notifications
    distractions['notifications'] = detectNotifications();
    // Newsfeed recommendations
    distractions['newsfeed_recommendations'] = isHomePage();
    // Cluttered layout
    distractions['cluttered_layout'] = true;
    // Saturation
    distractions['saturation'] = true;

    console.log("distractions:", distractions);
    return distractions;
}

function getCurrentFeatures(currentSite){
    return new Promise((resolve) =>{
        var compact_key;
        var finite_key;
        var feed_key;
        var notif_key;
        var desaturate_key;
        var autoplay_key;

        if(currentSite === "Twitter"){
            compact_key = "TwitterCompact";
            finite_key  = "TwitterInfinite";
            notif_key   = "TwitterNotif";
            feed_key    = "TwitterFeed";
            desaturate_key = "TwitterDesaturate";
            autoplay_key   = "TwitterAutoplay";
            const keys = [compact_key,finite_key,notif_key,feed_key,desaturate_key,autoplay_key];
            chrome.storage.local.get(keys).then(function (features) {
                var current_features = {};
                current_features["compact_layout"] = features.TwitterCompact;
                current_features["hide_notification"] = features.TwitterNotif;
                current_features["finite_newsfeed_scrolling"] = features.TwitterInfinite;
                current_features["hide_newsfeed"] = features.TwitterFeed;
                current_features["desaturate"] = features.TwitterDesaturate;
                current_features["block_autoplay"] = features.TwitterAutoplay;
                console.log("Current feature:", current_features);
                resolve(current_features);
            });
        }
        else if(currentSite === "Facebook"){
            compact_key = "FacebookCompact";
            notif_key   = "FacebookNotif";
            finite_key  = "FacebookInfinite";
            feed_key    = "FacebookFeed";
            desaturate_key = "FacebookDesaturate";
            autoplay_key   = "FacebookAutoplay";
            const keys = [compact_key,finite_key,notif_key,feed_key,desaturate_key,autoplay_key];
            chrome.storage.local.get(keys).then(function (features) {
                var current_features = {};
                current_features["compact_layout"] = features.FacebookCompact;
                current_features["hide_notification"] = features.FacebookNotif;
                current_features["finite_newsfeed_scrolling"] = features.FacebookInfinite;
                current_features["hide_newsfeed"] = features.FacebookFeed;
                current_features["desaturate"] = features.FacebookDesaturate;
                current_features["block_autoplay"] = features.FacebookAutoplay;
                console.log("Current feature:", current_features);
                resolve(current_features);
            });
        }
        else if(currentSite === "LinkedIn"){
            compact_key = "LinkedInCompact";
            notif_key   = "LinkedInNotif";
            finite_key  = "LinkedInInfinite";
            feed_key    = "LinkedInFeed";
            desaturate_key = "LinkedInDesaturate";
            autoplay_key   = "LinkedInAutoplay";
            const keys = [compact_key,finite_key,notif_key,feed_key,desaturate_key,autoplay_key];
            chrome.storage.local.get(keys).then(function (features) {
                var current_features = {};
                current_features["compact_layout"] = features.LinkedInCompact;
                current_features["hide_notification"] = features.LinkedInNotif;
                current_features["finite_newsfeed_scrolling"] = features.LinkedInInfinite;
                current_features["hide_newsfeed"] = features.LinkedInFeed;
                current_features["desaturate"] = features.LinkedInDesaturate;
                current_features["block_autoplay"] = features.LinkedInAutoplay;
                console.log("Current feature:", current_features);
                resolve(current_features);
            });
        }
        else if(currentSite === "YouTube"){
            compact_key = "YouTubeCompact";
            notif_key   = "YouTubeNotif";
            finite_key  = "YouTubeInfinite";
            feed_key    = "YouTubeFeed";
            desaturate_key = "YouTubeDesaturate";
            autoplay_key   = "YouTubeAutoplay";
            const keys = [compact_key,finite_key,notif_key,feed_key,desaturate_key,autoplay_key];
            chrome.storage.local.get(keys).then(function (features) {
                var current_features = {};
                current_features["compact_layout"] = features.YouTubeCompact;
                current_features["hide_notification"] = features.YouTubeNotif;
                current_features["finite_newsfeed_scrolling"] = features.YouTubeInfinite;
                current_features["hide_newsfeed"] = features.YouTubeFeed;
                current_features["desaturate"] = features.YouTubeDesaturate;
                current_features["block_autoplay"] = features.YouTubeAutoplay;
                console.log("Current feature:", current_features);
                resolve(current_features);
            });
        }
        else{
            console.error("Unknown page for purpose mode.");
        }
    });
}

function adjustedDistractionDetection(distractions,current_features){
    var adjusted_distractions = {};

    var infinite_newsfeed_scrolling = distractions["infinite_newsfeed_scrolling"];
    var autoplay_video              = distractions["autoplay_video"];
    var notifications               = distractions["notifications"];
    var newsfeed_recommendations    = distractions["newsfeed_recommendations"];

    var compact = current_features["compact_layout"];
    var finite  = current_features["finite_newsfeed_scrolling"];
    var feed    = current_features["hide_newsfeed"];
    var notif   = current_features["hide_notification"];
    var desaturate = current_features["desaturate"];
    var autoplay   = current_features["block_autoplay"];

    // Adjusted infinite scrolling
    adjusted_distractions['adj_infinite_newsfeed_scrolling'] = infinite_newsfeed_scrolling && (!finite) && (!feed);
    // Adjusted autoplay video
    if(newsfeed_recommendations && feed){
        adjusted_distractions['adj_autoplay_video'] = false; // autoplay video will also be removed when newsfeeds are remvoed
    }
    else{
        adjusted_distractions['adj_autoplay_video'] = autoplay_video && (!autoplay);
    }
    // Adjusted notifications
    adjusted_distractions['adj_notifications'] = notifications && (!notif);
    // Adjusted newsfeed recommendations
    adjusted_distractions['adj_newsfeed_recommendations'] = newsfeed_recommendations && (!feed);
    // Adjusted cluttered layout
    adjusted_distractions['adj_cluttered_layout'] = (!compact);
    // Adjusted Saturation
    adjusted_distractions['adj_saturation'] = (!desaturate);

    console.log("Adjsuted distractions:", adjusted_distractions);
    return adjusted_distractions;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.name === "create ESM" && window.self === window.top){ // only capture the top window's browsing context
        var currentSite = getCurrentPage();
        if (currentSite !== "Twitter" && currentSite !== "Facebook" && currentSite !== "YouTube" && currentSite !== "LinkedIn") {
            return;
        }
        console.log("Create ESM");
        var currentWindowURL = window.location.href;
        var date = new Date(Date.now());
        var current_time = date.toString().replace(/ \(.*\)/ig, '');//.replace(/(-|:|\.\d*)/g,'');//format: yyyyMMddThhmmssZ eg:19930728T183907Z
        getCurrentFeatures(currentSite).then((features: JSON) => {
            var esm = {};
            esm['esm_url'] = currentWindowURL;
            esm['esm_site'] = currentSite;
            esm['esm_time'] = current_time;
            esm['distractions'] = distractionDetection();
            esm['features'] = features;
            esm['adjusted_distractions'] = adjustedDistractionDetection(esm['distractions'],features);
            const resp = sendToBackground({
                name: "cache ESM",
                esm: esm,
            })
        });
        return;
    }
    else if (msg.name !== "toggle") {
        console.log("Ignoring non-toggle event.");
        return;
    }
    console.log("UI wants '" + msg.body.button +
                "' changed to '" + msg.body.state + "'.");
    settingToHandler[msg.body.button](msg.body.state);
})

function run() {
    const key = "Enable";
    chrome.storage.local.get(key, (result) => {
        if (!result.hasOwnProperty(key)) {
            console.error("'" + key + "' property unset in configuration.");
            return
        }
        onToggleEnable(result.Enable);
    });
    if(isAutoPlaySettingPage()){
        setAutoPlay();
    }
    // if(isYouTubeVideo()){
    //     chrome.storage.local.get("YouTubeAutoplay", (result) => {
    //         setTimeout(() => {
    //             onYouTubeAutoPlay(result.YouTubeAutoplay);
    //         }, 7000);
    //     });
    // }
}

console.log(__filename + " running.");
run();

export {};