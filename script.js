console.log("This is Purpose Mode's content script.");
const image_size_threshold = 65; // image height threashold for image blurring 

function initialUpdates() {
  console.log("Applying custom style to existing img tags.");
  blur_img(document);
  // stop_video_autoplay(document);
}

function blur_img(document_query){
  var current_webpage_url = window.top.location.href;
  if (current_webpage_url.includes("twitter")){
    twitter_blur_img(document_query);
  }
  else if(current_webpage_url.includes("facebook")){
    facebook_blur_img(document_query);
  }
  else if(current_webpage_url.includes("youtube")){
    youtube_blur_img(document_query);
  }
}

function facebook_blur_img(document_query){
  const elements = document_query.querySelectorAll("image,img");
  [...elements].forEach(e => {
    if(e.clientWidth>image_size_threshold){
      e.style.filter = "grayscale(100%) blur(5px)";
      e.style.zIndex = "1";
      // some facebook imagse are not the top elements; attach the event listener to the top elements
      if(e.nextElementSibling && (e.nextElementSibling.nodeName == "DIV" || e.nextElementSibling.nodeName == "SPAN")){
        sibling_e = e.nextElementSibling;
        sibling_e.style.zIndex = "1";
        sibling_e.addEventListener("mouseenter", (elem) => {
          e.style.filter = "grayscale(0%) blur(0px)";
          // console.log(e.className);
        });
        sibling_e.addEventListener("mouseleave", (elem) => {
          e.style.filter = "grayscale(100%) blur(5px)";
          // console.log(e.className);
        });
      }
      e.addEventListener("mouseenter", (elem) => {
        e.style.filter = "grayscale(0%) blur(0px)";
        // console.log(e.className);
      });
      e.addEventListener("mouseleave", (elem) => {
        e.style.filter = "grayscale(100%) blur(5px)";
        // console.log(e.className);
      });
    }
  });
}

function youtube_blur_img(document_query){
  // try to remove the existing mouse event on YouTube

  // document.addEventListener("hover", function (event) {
  //       event.stopPropagation();
  //   }, true);
  const elements = document_query.querySelectorAll("image,img");
  [...elements].forEach(e => {
    if(e.clientWidth>image_size_threshold){
      e.style.filter = "grayscale(100%) blur(5px)";
      e.style.zIndex = "1";
      if(e.clientWidth <= e.clientHeight){ // don't unblur for video preview teaser
        e.addEventListener("mouseenter", (elem) => {
          e.style.filter = "grayscale(0%) blur(0px)";
          // console.log(e.className);
        });
        e.addEventListener("mouseleave", (elem) => {
          e.style.filter = "grayscale(100%) blur(5px)";
          // console.log(e.className);
        });
      }
    }
  });
}

function twitter_blur_img(document_query){
  // twitter custom style
  const twitter_elements = document_query.querySelectorAll("div[style^='background-image:']");
  [...twitter_elements].forEach(e => {
    if(e.clientWidth>image_size_threshold){
      e.style.filter = "grayscale(100%) blur(5px)";
      e.style.zIndex = "1";
      e.addEventListener("mouseenter", (elem) => {
        e.style.filter = "grayscale(0%) blur(0px)";
        // console.log(e.className);
      });
      e.addEventListener("mouseleave", (elem) => {
        e.style.filter = "grayscale(100%) blur(5px)";
        // console.log(e.className);
      });
    }
  });
}

// remove auto play
/*
function stop_video_autoplay(document_query){
  document_query.querySelectorAll("video").forEach(function(elem) {
    elem.pause();
    // console.log("remove auto play");
    // console.log("remove auto play", elem);
    // elem.removeAttribute("autoplay");
    // elem.setAttribute("autostart","false");
    // Disable vidoe auto play.
    // elem.setAttribute("preload","none");
    // elem.setAttribute("height","50px");
    // elem.autoplay = false;
  }); 
}
*/

// Listen to page change based on sites
var mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    blur_img(mutation.target);
    // stop_video_autoplay(mutation.target);
  });
});

// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
  attributes: false,
  characterData: false,
  childList: true,
  subtree: true,
  // attributeOldValue: true,
  // characterDataOldValue: true
});
// Takes all changes which haven’t been fired so far.
var changes = mutationObserver.takeRecords();

// main
initialUpdates();