"use strict";

const getContainer = () => new Promise((resolve) => {
    if(currentPage == "Twitter"){
        const x = $('section[aria-labelledby]');
        if (x.length === 0 || x.find("article").length === 0) {
            setTimeout(() => { resolve(getContainer()); }, 100);
            return;
        }
        const y = x.children("div[aria-label]").first().children().first();
        resolve(y);
    }
    else if(currentPage == "Facebook"){
        const y = $('h3:contains("News Feed posts")').parent();
        resolve(y);
    }
    else if (currentPage == "YouTube"){
        const y = $("#content");
        resolve(y);
    }
    else if (currentPage == "LinkedIn"){
        const y = $('main[aria-label]');
        resolve(y);
    }
    else{
        console.error("Unknown page to enable purpose mode.");
    }
});

const showMore = (container, button) => {
    feedHeight += showMoreIncrement;
    container.css("max-height", `${feedHeight}px`);
    container.css("min-height", `${feedHeight}px`);
    button.css("top", `${feedHeight+container_top-100}px`);
};

// const manipulateContainer = (container) => {
//     // remove infinite scrolling
//     removeInfiniteScrolling(container);
// };

const removeYouTubeDistractions= (container) => {

    if(isHomePage){ // distraction removal applied to the home page only
        // recommendation tags on top of the page
        const recc_tag = $('#scroll-container');
        recc_tag.css({
            "display": "none",
            "visibility": "hidden"
        });

        // video ad on the home page
        const home_page_video_ad = $('div#masthead-ad');
        home_page_video_ad.css({
            "display": "none",
            "visibility": "hidden"
        });

        // shorts
        const shorts = $('ytd-rich-shelf-renderer[is-shorts]');
        shorts.css({
            "display": "none",
            "visibility": "hidden"
        });

        // Recommended Primetime movies
        const primetimeMovie = $('a[title="Recommended Primetime movies"]');
        if(primetimeMovie){
            primetimeMovie.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }

        // Top news
        const topNews = $('span[id="title"]:contains("Top news")');
        if(topNews){
            topNews.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
        // Breaking news
        const breakingNews = $('span[id="title"]:contains("Breaking news")');
        if(breakingNews){
            breakingNews.closest('ytd-rich-section-renderer').css({
                "display": "none",
                "visibility": "hidden"
            });
        }
    }

    // remove notifications button on the top right
    const home_notification_video = $('ytd-topbar-menu-button-renderer:has(> div > a > yt-icon-button > button[aria-label="Create"])');
    home_notification_video.css({
        "display": "none",
        "visibility": "hidden"
    });

    const home_notification_noti = $('ytd-notification-topbar-button-renderer');
    home_notification_noti.css({
        "display": "none",
        "visibility": "hidden"
    });
}

const removeTwitterDistractions = (container) => {
    // "What's happening" column on the right.
    const col_what = $('div[aria-label="Timeline: Trending now"]');
    col_what.css({
        "display": "none",
        "visibility": "hidden"
    });

    // "Who to follow" column on the right.
    const col_who = $('div:has(> div > aside[aria-label="Who to follow"])');
    col_who.css({
        "display": "none",
        "visibility": "hidden"
    });

    // ToS, privacy policy, etc.
    const col_footer = $('nav[aria-label="Footer"]');
    col_footer.css({
        "display": "none",
        "visibility": "hidden"
    });

    // "Get Verified" promotion
    const col_verify = $('div:has(> aside[aria-label="Get Verified"])');
    col_verify.css({
        "display": "none",
        "visibility": "hidden"
    });

    // DM
    const DM = $('div[data-testid="DMDrawer"]');
    DM.css({
        "display": "none",
        "visibility": "hidden"
    });
    

    // Blue notification circle, e.g., on top of home icon.
    const home_notification = $('div[aria-label="undefined unread items"]');
    home_notification.css({
        "display": "none",
        "visibility": "hidden"
    });

    // Blue button that promotes new tweets, i.e., on top of the page
    const tweet_notification = $('div[aria-label="New Tweets are available. Push the period key to go to the them."]');
    tweet_notification.css({
        "display": "none",
        "visibility": "hidden"
    });
}

const removeLinkedInDistractions = (container) => {
    // LinkedIn News
    const newsColumn = $('aside[aria-label="LinkedIn News"]');
    newsColumn.css({
        "display": "none",
        "visibility": "hidden"
    });

    // Messaging
    const messaging = $('aside#msg-overlay');
    messaging.css({
        "display": "none",
        "visibility": "hidden"
    });

    // “Discover more” box on the left
    const discoverMore = $('section[aria-labelledby]').parent().parent().parent().parent();
    discoverMore.css({
        "display": "none",
        "visibility": "hidden"
    });

    // LinkedIn Premium ads (left)
    const premuimAdLeft = $('li-icon[type="premium-chip"]').parent().parent();
    premuimAdLeft.css({
        "display": "none",
        "visibility": "hidden"
    });

    // LinkedIn Premium ads (upper right)
    const premuimAdRight = $('div.premium-upsell-link').parent();
    premuimAdRight.css({
        "display": "none",
        "visibility": "hidden"
    });

    // "red dot" notifications
    $('span.notification-badge--show').each(function() {
        $( this ).css({
            "display": "none",
            "visibility": "hidden"
        });
    });
}

const removeFacebookDistractions = (container) => {

    if (isHomePage){ // distraction removal applied to only the home page
        // “Stories” and “Reels” video section
        const storiesBar = $('div[aria-label="Stories"]').parent().parent().parent().parent().parent().parent();
        storiesBar.css({
            "display": "none",
            "visibility": "hidden"
        });

        // the whole right column, e.g., your pages and profiles, contacts etc.
        const rightColum = $('div[role="complementary"]');
        rightColum.css({
            "display": "none",
            "visibility": "hidden"
        });

        // // remove sponsored posts
        // $('a[href*="ads"][href*="about"][href*="cft"]').each(function() {
        //     $( this ).closest('span[dir="auto"]').closest('div:has(>div>div>div>div>div>div>div>div)').css({
        //         "display": "none",
        //         "visibility": "hidden"
        //     });
        // });
    }

    // Buttons on top of the page
    // home button
    const homeButton = $('a[aria-label="Home"]').parent().parent().parent();
    homeButton.css({
        "display": "none",
        "visibility": "hidden"
    });

    // watch button
    const watchButton = $('a[aria-label="Watch"]').parent().parent().parent();
    watchButton.css({
        "display": "none",
        "visibility": "hidden"
    });

    // marketplace button
    const marketButton = $('a[aria-label="Marketplace"]').parent().parent().parent();
    marketButton.css({
        "display": "none",
        "visibility": "hidden"
    });

    // groups button
    const groupsButton = $('a[aria-label="Groups"]').parent().parent().parent();
    groupsButton.css({
        "display": "none",
        "visibility": "hidden"
    });

    // gaming button
    const gameButton = $('a[aria-label="Gaming"]').parent().parent().parent();
    gameButton.css({
        "display": "none",
        "visibility": "hidden"
    });

    // "red dot" notifications
    $('div[aria-label*="Notifications"]').each(function() {
        $( this ).css({
            "display": "none",
            "visibility": "hidden"
        });
    });

    // "red dot" notifications for Messenger
    const messengerNotification = $('div[aria-label*="Messenger"][tabindex="-1"]');
    messengerNotification.css({
        "display": "none",
        "visibility": "hidden"
    });

}

const removeInfiniteScrolling = (container) => {
    container.css({
        "max-height": `${feedHeight}px`,
        "min-height": `${feedHeight}px`,
        overflow: "hidden",
        // "margin-bottom": "200px"
    });

    const button = $(`
        <div id="tisd-show-more">
            <button type="button">Show more</button>
        </div>
    `);
    button.css({
        width: container.width(),
        top: `${feedHeight+container_top-100}px`
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

const isAlreadyManipulated = (container) => {
    const button = $("#tisd-show-more");
    return !!button.length;
};

const isCurrentPageFeed = () => {
    if(currentPage == "Twitter"){
        return window.location.href.includes("home");
    }
    else if(currentPage == "Facebook"){
        return window.location.href == "https://www.facebook.com/";
    }
    else if(currentPage == "YouTube"){
        return window.location.href == "https://www.youtube.com/";
    }
    else if(currentPage == "LinkedIn"){
        return window.location.href.includes("feed");
    }
    else{
        console.error("Unknown page to enable purpose mode!");
    }
};

const getCurrentPage = () => {
    const currentWindowURL = window.location.href;
    if (currentWindowURL.includes("twitter.com")){
        return "Twitter";
    }
    else if(currentWindowURL.includes("facebook.com")){
        return "Facebook";
    }
    else if(currentWindowURL.includes("youtube.com")){
        return "YouTube";
    }
    else if(currentWindowURL.includes("linkedin.com")){
        return "LinkedIn";
    }
    else{
        return "NA";
    } 
}

const isHomePage = () => {
    const currentWindowURL = window.location.href;
    if (currentWindowURL == "https://twitter.com/home" || currentWindowURL == "https://www.facebook.com/" || currentWindowURL == "https://www.youtube.com/" || currentWindowURL == "https://www.linkedin.com/feed/"){
        return true;
    }
    else{
        return false;
    }
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

const run = () => getContainer()
    .then(container => {

        // remove distracting contents
        if(currentPage == "Twitter"){
            removeTwitterDistractions(container);
        }
        else if(currentPage == "YouTube"){
            removeYouTubeDistractions(container);
        }
        else if(currentPage == "Facebook"){
            removeFacebookDistractions(container);
        }
        else if(currentPage == "LinkedIn"){
            removeLinkedInDistractions(container);
        }
        
        // remove inifite scrolling only on home page
        if (isHomePage){ 
            container.css("min-height", `${feedHeight}px`);
            container.css("max-height", `${feedHeight}px`);
            container_top = 0;
            if(container){
                var position = container.position();
                if (position){container_top = position.top;}
            }

            if (isCurrentPageFeed() && !isAlreadyManipulated(container)) {
                removeInfiniteScrolling(container);
            }
        }
        // Keep running in case user leaves feed but returns later and we have
        // to reinsert the show more button
        setTimeout(run, 100);
    });

let feedHeight = 2500;
let container_top = 0;
const showMoreIncrement = 2500;
const currentPage = getCurrentPage();

// a quick switch to turn on/off the content script for demo purpose
chrome.storage.local.get(["state"]).then((result) => {
    if(result.state == "purpose_mode"){
        run();
    }
});
