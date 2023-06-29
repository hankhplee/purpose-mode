import $ from "jquery";

const extName = "Purpose Mode";
const settingToHandler = {
    "Enable":            onToggleEnable,
    "Desaturate":        onToggleDesaturate,
    "Compact":           onToggleCompact,
    "TwitterReadOnly":   onToggleTwitterReadOnly,
    "LinkedInDeclutter": onToggleLinkedInDeclutter,
    "LinkedInRecomms":   onToggleLinkedInRecomms,
    "LinkedInNotif":     onToggleLinkedInNotif,
}

function onToggleEnable(toggled: boolean) {
    console.log("onToggleEnable: " + toggled);

    chrome.storage.local.get(null, (result) => {
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
                console.log("Setting '" + key + "' to '" + result[key] + "'.");
                settingToHandler[key](result[key]);
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

function onToggleTwitterReadOnly(toggled: boolean) {
    console.log("onToggleTwitterReadOnly: " + toggled);
    if (toggled) {
        $("div[aria-label*=Reply]").each(function(i) {
            $(this).parent().parent().hide();
        });
    } else {
        $("div[aria-label*=Reply]").each(function(i) {
            $(this).parent().parent().show();
        });
    }
}

function onToggleCompact(toggled: boolean) {
    console.log("onToggleCompact: " + toggled);
    // Send a message to the second content script, which runs in the main
    // world.  Upon receiving this message, the script is going to
    // monkey-patch the window and document API.
    window.postMessage({
        type:  "FROM_CONTENT_SCRIPT",
        toggle: toggled
    }, "*");
}

function onToggleDesaturate(toggled: boolean) {
    console.log("onToggleDesaturate: " + toggled);
    let e = $("html");
    if (toggled) {
        // TODO: This does not work on Reddit.
        e.css({"cssText": "filter: saturate(10%) !important"});
    } else {
        e.css({"cssText": "filter: saturate(100%) !important"});
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
    // Iterate over local state and enable whatever feature is set.
    for (const key in settingToHandler) {
        chrome.storage.local.get(key, (result) => {
            console.log("Setting '" + key + "' to '" + result[key] + "'.");
            settingToHandler[key](result[key]);
        })
    }
}

console.log(__filename + " running.");
run();

export {};