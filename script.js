console.log("Purpose Mode's content script says hello world!");

document.querySelectorAll("img").forEach(function(elem) {
  // Disable and re-enable image blurring when hovering over images.
  elem.addEventListener("mouseenter", (e) => {
    elem.style = "filter: grayscale(0%) blur(0px) !important";
  });
  elem.addEventListener("mouseleave", (e) => {
    elem.style = "filter: grayscale(100%) blur(5px) !important";
  });
});
