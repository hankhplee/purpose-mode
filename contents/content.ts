import $ from "jquery";
import "../finite_scroll_style.css";

const extName = "Purpose Mode";
const settingToHandler = {
    "Enable":            onToggleEnable,

    "Desaturate":        onToggleDesaturate,

    "TwitterCompact":    onToggleTwitterCompact,
    "TwitterReadOnly":   onToggleTwitterReadOnly,
    "TwitterInfinite":   onToggleTwitterInfinite,

    "LinkedInDeclutter": onToggleLinkedInDeclutter,
    "LinkedInRecomms":   onToggleLinkedInRecomms,
    "LinkedInInfinite":  onToggleLinkedInInfinite,
    "LinkedInNotif":     onToggleLinkedInNotif,

    "FacebookInfinite":  onToggleFacebookInfinite,

    "YouTubeInfinite":   onToggleYouTubeInfinite,
}

let isEnabled = false;
let feedHeight = 2500;
let containerTop = 0;
const showMoreIncrement = 2500;

function getCurrentPage(): string {
    const currentWindowURL = window.location.href;
    console.log("current url", currentWindowURL);
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
    if (currentWindowURL === "https://twitter.com/home" ||
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
                const y = $('main[aria-label]');
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
                    if (key === "Desaturate") {
                        return;
                    }
                    console.log("Running handler for '" + key + "' = '" + result[key] + "'.");
                    settingToHandler[key](result[key]);
                }
            })
        }
    }
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
    ];
    if (toggled) {
        for (const e of elements) { e.hide() }
    } else {
        for (const e of elements) { e.show() }
    }
}

function onToggleLinkedInNotif(toggled: boolean) {
    console.log("onToggleLinkedInNotif: " + toggled);

    // "Red dot" notification icon.
    let e = $('span.notification-badge--show');
    if (toggled) {
        e.hide();
    } else {
        e.show();
    }
}

function onToggleLinkedInRecomms(toggled: boolean) {
    console.log("onToggleLinkedInRecomms: " + toggled);

    let elements = [
        // LinkedIn news.
        $('aside[aria-label="LinkedIn News"]'),
        // Profile recommendations.
        $('aside.scaffold-layout__aside'),
    ];
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

function onToggleFacebookInfinite(toggled: boolean) {
    if (getCurrentPage() !== "Facebook") {
        return;
    }
    toggleInfScrolling(toggled);
}

function onToggleYouTubeInfinite(toggled: boolean) {
    if (getCurrentPage() !== "YouTube") {
        return;
    }
    toggleInfScrolling(toggled);
}

function onToggleDesaturate(toggled: boolean) {
    console.log("onToggleDesaturate: " + toggled);
    let e = $("html");
    if (toggled) {
        // TODO: This does not work on Reddit. It also breaks the style on
        // YouTube.
        console.log("Existing CSS:");
        console.log(e.css("filter"));
        e.css({"cssText": "filter: saturate(10%)"});
    } else {
        e.css({"cssText": "filter: saturate(100%)"});
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
    });
}

console.log(__filename + " running.");
run();

export {};