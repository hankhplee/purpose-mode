console.log("This is Purpose Mode's content script.");
const image_size_threshold = 50 // image height threashold for image blurring 

function initialUpdates() {
  console.log("Applying custom style to existing img tags.");
  // const elements = document.getElementsByTagName("img");
  const elements = document.querySelectorAll("image,img");
  [...elements].forEach(e => {
    if(e.clientWidth>image_size_threshold){
      e.style = "filter: grayscale(100%) blur(5px)";
    }
  });

  // twitter custom style
  const twitter_elements = document.querySelectorAll("div[style^='background-image:']");
  [...twitter_elements].forEach(e => {
    e.style = "filter: grayscale(100%) blur(5px)";
  });
}


// default event listener
document.querySelectorAll("image,img").forEach(function(elem) {
  if(elem.clientWidth>image_size_threshold){
    // Disable and re-enable image blurring when hovering over images.
    elem.addEventListener("mouseenter", (e) => {
      elem.style.filter = "grayscale(0%) blur(0px)";
      console.log(elem.className);
    });
    elem.addEventListener("mouseleave", (e) => {
      elem.style.filter = "grayscale(100%) blur(5px)";
      console.log(elem.className);
    });
  }
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
initialUpdates()
