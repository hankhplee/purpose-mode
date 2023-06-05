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

const manipulateContainer = (container) => {
    removeInfiniteScrolling(container);
};

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
    else{
        return "NA";
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
    else{
        console.error("Unknown page to enable purpose mode!");
    }
}

const run = () => getContainer()
    .then(container => {
        container.css("min-height", `${feedHeight}px`);
        var position = container.position();
        container_top = position.top
        if (isCurrentPageFeed() && !isAlreadyManipulated(container)) {
            manipulateContainer(container);
        }
        // Keep running in case user leaves feed but returns later and we have
        // to reinsert the show more button
        setTimeout(run, 100);
    });

let feedHeight = 2500;
let container_top = 0;
const showMoreIncrement = 2500;
const currentPage = getCurrentPage();

run();
