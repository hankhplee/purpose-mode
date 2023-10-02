import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*"],
  world: "MAIN",
}

console.log(__filename + " running.");

var spoof = false;

window.addEventListener("message", (event) => {
  if (event.data.type && event.data.type != "FROM_CONTENT_SCRIPT") {
    return;
  }
  if (event.data.toggle === undefined) {
    return;
  }
  console.log("Toggling spoof from " + spoof + " to " + event.data.toggle);
  spoof = event.data.toggle;
  maybePatchWinSize();
}, false);

function maybePatchWinSize() {
  let width = 0;
  if (spoof) {
    width = Math.min(document.documentElement.offsetWidth || 800, 800)
    if (window.innerWidth === width &&
      document.documentElement.clientWidth === width) {
      return;
    }
  } else {
    width = document.documentElement.offsetWidth
  }

  window.__defineGetter__('innerWidth', () => width);
  document.documentElement.__defineGetter__('clientWidth', () => width)
  window.dispatchEvent(new Event('resize'));
}

if (spoof) {
  window.addEventListener("load", maybePatchWinSize);
  window.addEventListener("resize", maybePatchWinSize);
  document.addEventListener("visibilitychange", maybePatchWinSize);
} else {
  window.removeEventListener("load", maybePatchWinSize);
  window.removeEventListener("resize", maybePatchWinSize);
  document.removeEventListener("visibilitychange", maybePatchWinSize);
}

maybePatchWinSize();