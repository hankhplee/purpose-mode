"use strict";

const getContainer = () => new Promise((resolve) => {
    const x = $('section[aria-labelledby]');

    if (x.length === 0 || x.find("article").length === 0) {
        setTimeout(() => { resolve(getContainer()); }, 100);
        return;
    }

    const y = x.children("div[aria-label]").first().children().first();
    // console.log(y[0]);

    resolve(y);
});

const showMore = (container, button) => {
    feedHeight += showMoreIncrement;
    container.css("max-height", `${feedHeight}px`);
    container.css("min-height", `${feedHeight}px`);
    button.css("top", `${feedHeight-100}px`);
};

const manipulateContainer = (container) => {
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
        top: `${feedHeight-100}px`
    });
    container.prepend(button);

    const bgColor = $("body").css("background-color");

    if (bgColor === "rgb(21, 32, 43)" || bgColor === "rgb(0, 0, 0)") {
        button.children("button").css("color", "rgb(255, 255, 255)");
    } else {
        button.children("button").css("color", "rgb(0, 0, 0)");
    }

    button.click(() => showMore(container, button));
};

const isAlreadyManipulated = (container) => {
    const button = $("#tisd-show-more");
    return !!button.length;
};

const isCurrentPageFeed = () => {
    return window.location.href.includes("home");
};

const run = () => getContainer()
    .then(container => {
        container.css("min-height", `${feedHeight}px`);
        if (isCurrentPageFeed() && !isAlreadyManipulated(container)) {
            manipulateContainer(container);
        }
        // Keep running in case user leaves feed but returns later and we have
        // to reinsert the show more button
        setTimeout(run, 100);
    });

let feedHeight = 2500;
const showMoreIncrement = 2500;

run();
