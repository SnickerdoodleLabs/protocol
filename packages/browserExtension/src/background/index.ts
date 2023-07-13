import { initializeSDKCore } from "@snickerdoodlelabs/synamint-extension-sdk/core";

import { configs } from "@browser-extension/background/configs";

async function createOffscreen() {
  // @ts-ignore
  await chrome?.offscreen
    ?.createDocument?.({
      url: "offscreen/offscreen.html",
      reasons: ["BLOBS"],
      justification: "keep service worker running",
    })
    .catch(() => {});
}
chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = (e) => {}; // keepAlive
createOffscreen();

initializeSDKCore(configs).map(() => {
  console.log("core initialized");
});
