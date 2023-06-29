import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
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
    console.log("maybePatchWinSize: " + spoof);
    if (!spoof) {
      return;
    }
    const width = Math.min(document.documentElement.offsetWidth || 800, 800)
    if (window.innerWidth === width &&
        document.documentElement.clientWidth === width) {
        return;
    }

    window.__defineGetter__('innerWidth', () => width);
    document.documentElement.__defineGetter__('clientWidth', () => width)
    window.dispatchEvent(new Event('resize'));
}

window.addEventListener("load", maybePatchWinSize);
window.addEventListener("resize", maybePatchWinSize);
document.addEventListener("visibilitychange", maybePatchWinSize);
maybePatchWinSize();