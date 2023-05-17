console.log("Purpose Mode's content script v3 says hello world!");

// default event listener
document.querySelectorAll("image,img,iframe,svg").forEach(function(elem) {
  // Disable and re-enable image blurring when hovering over images.
  elem.addEventListener("mouseenter", (e) => {
    elem.style.filter = "grayscale(0%) blur(0px)";
    console.log(elem.className);
  });
  elem.addEventListener("mouseleave", (e) => {
    elem.style.filter = "grayscale(100%) blur(5px)";
    console.log(elem.className);
  });
});

// event listener for twitter div with background image
document.querySelectorAll("div[style^='background-image:']").forEach(function(elem) {
  // Disable and re-enable image blurring when hovering over images.
  elem.addEventListener("mouseenter", (e) => {
    elem.style.filter = "grayscale(0%) blur(0px)";
    console.log(elem.className);
  });
  elem.addEventListener("mouseleave", (e) => {
    elem.style.filter = "grayscale(100%) blur(5px)";
    console.log(elem.className);
  });
});

// document.querySelectorAll("video").forEach(function(elem) {
//   console.log("remove auto play");
//   console.log(elem);
//   // Disable vidoe auto play.
//   // elem.setAttribute("preload","none");
//   // elem.setAttribute("height","50px");
//   elem.removeAttribute("autoplay");
// });

// document.getElementsByTagName('video')[0].removeAttribute('autoplay');
