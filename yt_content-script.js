"use strict";

const getContainer = () => new Promise((resolve) => {
    // const y = $('#ssrb_feed_start').parent().children("div").first().children("div").first();
    const y = $("#content");

    // check if the container exist
    // if (x.length === 0 || x.find("article").length === 0) {
    //     setTimeout(() => { resolve(getContainer()); }, 100);
    //     return;
    // }

    // console.log(y[0]);

    resolve(y);
});

const showMore = (container, button) => {
    feedHeight += showMoreIncrement;
    container.css("max-height", `${feedHeight}px`);
    container.css("min-height", `${feedHeight}px`);
    button.css("top", `${feedHeight+container_top-100}px`);
};

const manipulateContainer = (container) => {
    container.css({
        "max-height": `${feedHeight}px`,
        "min-height": `${feedHeight}px`,
        overflow: "hidden",
        // "margin-bottom": "100px"
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

    // const bgColor = $("ytd-app").css();
    const bgColor = $("ytd-app").css("background");
    console.log(bgColor);

    if (bgColor.includes("rgb(15, 15, 15)")) {
        button.children("button").css({"color": "rgb(255, 255, 255)", "background-color": "rgba(0 , 0, 0, 0.7)"});
    } else {
        button.children("button").css({"color": "rgb(0, 0, 0)", "background-color": "rgba(255 , 255, 255, 0.7)"});
    }

    button.click(() => showMore(container, button));
};

const isAlreadyManipulated = (container) => {
    const button = $("#tisd-show-more");
    return !!button.length;
};

const isCurrentPageFeed = () => {
    return window.location.href == "https://www.youtube.com/";
};

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

run();
