import $ from "jquery";
import "../finite_scroll_style.css";

const extName = "Purpose Mode";
const settingToHandler = {
    "Enable":            onToggleEnable,

    "Desaturate":        onToggleDesaturate,

    "TwitterCompact":    onToggleTwitterCompact,
    // "TwitterReadOnly":   onToggleTwitterReadOnly,
    "TwitterClutter":    onToggleTwitterClutter,
    "TwitterInfinite":   onToggleTwitterInfinite,
    "TwitterNotif":      onToggleTwitterNotif,
    "TwitterRecomm":     onToggleTwitterRecomm,

    "LinkedInDeclutter": onToggleLinkedInDeclutter,
    "LinkedInRecomms":   onToggleLinkedInRecomms,
    "LinkedInInfinite":  onToggleLinkedInInfinite,
    "LinkedInNotif":     onToggleLinkedInNotif,

    "FacebookInfinite":  onToggleFacebookInfinite,
    "FacebookDeclutter": onToggleFacebookDeclutter,
    "FacebookRecomms":   onToggleFacebookRecomms,
    "FacebookNotif":     onToggleFacebookNotif,

    "YouTubeInfinite":   onToggleYouTubeInfinite,
    "YouTubeRecomm":     onToggleYouTubeRecomm,
    "YouTubeNotif":      onToggleYouTubeNotif,
    "YouTubeDeclutter":  onToggleYouTubeDeclutter,
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
        currentWindowURL === "https://www.youtube.com/" ||
        currentWindowURL === "https://www.linkedin.com/feed/"){
        return true;
    } else {
        return false;
    }
}

const currentPage = getCurrentPage();
function getContainer() {
    return new Promise((resolve) => {
        if (currentPage == "Twitter") {
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

/*
var mutationObserver = new MutationObserver(function(mutations) {
    let keys = [
        "TwitterReadOnly",
    ];
    // For each page mutation, invoke relevant toggle functions if enabled.
    mutations.forEach(function(mutation) {
        if (!isEnabled) {
            return;
        }
        for (const key of keys) {
            chrome.storage.local.get(key, (result) => {
                if (result[key] === true) {
                    settingToHandler[key](result[key], mutation.target);
                }
            });
        }
    });
});
*/

function toggleInfScrolling(toggled: boolean) {
    getContainer().then((container: JQuery<HTMLElement>) => {
        if (!toggled) {
            resetInfScrolling(container);
        } else {
            stopInfScrolling(container);
        }
    });
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

    button.click(() => showMore(container, button));
}
/*
// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
});

// Takes all changes which haven’t been fired so far.
var changes = mutationObserver.takeRecords();
*/

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
    chrome.storage.local.get("Enable", (result) => {
        setTimeout(() => {
            onToggleEnable(result.Enable);
          }, 300);
    });
}

function onToggleLinkedInDeclutter(toggled: boolean) {
    console.log("onToggleLinkedInDeclutter: " + toggled);

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
    if(!isHomePage()){
        elements.push($('footer.global-footer'));
    }
    if (toggled) {
        for (const e of elements) { e.hide() }
    } else {
        for (const e of elements) { e.show() }
    }
}

function onToggleLinkedInNotif(toggled: boolean) {
    console.log("onToggleLinkedInNotif: " + toggled);

    if (toggled) {
        // "Red dot" notification icon.
        $('span.notification-badge--show').each(function() {
            $( this ).hide();
        });
    } else {
        $('span.notification-badge--show').each(function() {
            $( this ).show();
        });
    }
}

function onToggleLinkedInRecomms(toggled: boolean) {
    console.log("onToggleLinkedInRecomms: " + toggled);

    let elements = [
        // LinkedIn news.
        // $('aside[aria-label="LinkedIn News"]'),
        $('section:has(>div>div#feed-news-module)'),
    ];
    if(!isHomePage()){
        // Profile recommendations.
        elements.push($('aside.scaffold-layout__aside'));
    }
    if (toggled) {
        for (const e of elements) { e.hide() }
    } else {
        for (const e of elements) { e.show() }
    }
}

function onToggleLinkedInInfinite(toggled: boolean) {
    if (getCurrentPage() !== "LinkedIn") {
        return;
    }
    toggleInfScrolling(toggled);
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
    ]
    if (toggled) {
        hideSelectors(selectors);
        // Notifications.
        $('div[aria-label*="unread"]').each(function(){
            $( this ).hide();
        });
    } else {
        showSelectors(selectors);
        // Notifications.
        $('div[aria-label*="unread"]').each(function(){
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
        $('form[aria-label="Search Twitter"]'),
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

function onToggleFacebookDeclutter(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }

    const selectors = [
        // Right column.
        $('div[role="complementary"]'),
        // Hamburger menu on the left.
        $('div[role="navigation"]:has(> div > div > div > h2:contains("Facebook Menu"))'),
        // Buttons at the top of the page.
        $('a[aria-label="Home"]'),
        // Watch button.
        $('a[aria-label="Watch"]'),
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

function onToggleFacebookRecomms(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }

    const selectors = [
        // "Stories" and "reels" videos at the top.
        $('div[aria-label="Stories"]').parent().parent(),
        // “Stories” and “Reels” buttons
        $('div[role="tablist"]:has(> div > div > div > div > div > span:contains("Stories"))'),
        // "Reels" and short video recommendations.
        $('div[aria-label="Reels"]').parent().parent().parent().parent(),
        // "People you may know".
        $('span:contains("People You May Know")').parent().parent().parent().parent().parent(),
        // Suggested groups.
        $('span:contains("Suggested groups")').parent().parent(),
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
    } else {
        for (const s of selectors) {
            s.each(() => { s.show() });
        }
    }
}

function onToggleYouTubeInfinite(toggled: boolean) {
    if (getCurrentPage() !== "YouTube") {
        return;
    }
    toggleInfScrolling(toggled);
}

function onToggleYouTubeRecomm(toggled: boolean) {
    if (getCurrentPage() !== "YouTube") {
        return;
    }

    let selectors = [];
    const currentWindow = window.top.location.href;
    // Landing page.
    if (currentWindow === "https://www.youtube.com/") {
        selectors = selectors.concat([
            // All recommended videos on the landing page.
            $('div[id=contents]'),
            // Recommendation tags on top of the page.
            $('div#scroll-container'),
            // "Next" button of the recommendation tags.
            $('button[aria-label="Next"]'),
            // VIdeo ad on the home page.
            $('div#masthead-ad'),
            // Shorts.
            $('ytd-rich-shelf-renderer[is-shorts]'),
            // Recommended primetime movies.
            $('a[title="Recommended Primetime movies"]').closest('ytd-rich-section-renderer'),
            // Top news.
            $('span[id="title"]:contains("Top news")').closest('ytd-rich-section-renderer'),
            // Breaking news.
            $('span[id="title"]:contains("Breaking news")').closest('ytd-rich-section-renderer'),
            // Latest YouTube posts.
            $('span[id="title"]:contains("Latest YouTube posts")').closest('ytd-rich-section-renderer'),
            // "Discover your next favorite movie".
            $('yt-formatted-string[id="item-title"]:contains("Discover your next favorite movie")').closest('ytd-rich-section-renderer'),
            // YouTube premium event
            $('yt-formatted-string[id="subtitle"]:contains("Premium membership")').closest('ytd-rich-section-renderer'),
        ]);
    // Recommendations on the "watch" page.
    } else if (currentWindow.includes("https://www.youtube.com/watch?")) {
        selectors = selectors.concat([
            // Video recommendations.
            $('div#secondary-inner'),
        ]);
    } else if (currentWindow.includes("results?search_query")) {
        selectors = selectors.concat([
            // "People also watched".
            $('span[id="title"]:contains("People also watched")').closest('ytd-shelf-renderer'),
            // "Channels new to you".
            $('span[id="title"]:contains("Channels new to you")').closest('ytd-shelf-renderer'),
            // "For you".
            $('span[id="title"]:contains("For you")').closest('ytd-shelf-renderer'),
            // "Previously watched".
            $('span[id="title"]:contains("Previously watched")').closest('ytd-shelf-renderer'),
            // "From related searches".
            $('span[id="title"]:contains("From related searches")').closest('ytd-shelf-renderer'),
            // "Top news"
            $('span[id="title"]:contains("Top news")').closest('ytd-shelf-renderer'),
            // Recently uploaded Shorts
            // $('span[id="title"]:contains("Recently uploaded Shorts")').closest('ytd-reel-shelf-renderer'),
            // People also search for
            $('yt-formatted-string[id="title"]:contains("People also search for")').closest('ytd-horizontal-card-list-renderer'),
        ]);
    }

    if (toggled) {
        hideSelectors(selectors);
        // all shorts
        $('ytd-reel-shelf-renderer').each(function(){
            $( this ).hide();
        });
    } else {
        showSelectors(selectors);
        $('ytd-reel-shelf-renderer').each(function(){
            $( this ).show();
        });
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
    const currentWindow = window.top.location.href;
    const selectors = [
        // Hamburger menu.
        $('div#guide-content'),
    ]
    if (currentWindow.includes("https://www.youtube.com/watch?")) {
        selectors.push($("ytd-comments#comments")); // Comments.
    }

    if (toggled) {
        hideSelectors(selectors);
    } else {
        showSelectors(selectors);
    }
}

function onToggleDesaturate(toggled: boolean) {
    console.log("onToggleDesaturate: " + toggled);
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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.name !== "toggle") {
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
        // runEnabledFeatures(result.Enable);
    });
}

console.log(__filename + " running.");
run();

export {};