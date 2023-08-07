import { initializeSDKCore } from "@snickerdoodlelabs/synamint-extension-sdk/core";
import { ExtensionUtils } from "@snickerdoodlelabs/synamint-extension-sdk/extensionShared";
import Browser, { Runtime } from "webextension-polyfill";

import { configs } from "@browser-extension/background/configs";

//#region first installation
Browser.runtime.onInstalled.addListener((details) => {
  details.reason === "install" &&
    ExtensionUtils.switchToUrlTab(configs.onboardingUrl ?? "", true);
});
// #endregion

//#region auto update when available
const handleUpdateAvailable = (
  details: Runtime.OnUpdateAvailableDetailsType,
) => {
  // Proceed to upgrade
  Browser.runtime.reload();
};
Browser.runtime.onUpdateAvailable.addListener(handleUpdateAvailable);
//#endregion

//#region keepAlive
async function createOffscreen() {
  // @ts-ignore
  await Browser?.offscreen
    ?.createDocument?.({
      url: "offscreen/offscreen.html",
      reasons: ["BLOBS"],
      justification: "keep service worker running",
    })
    .catch(() => {});
}

Browser.runtime.onStartup.addListener(createOffscreen);
self.onmessage = (e) => {}; // keepAlive
createOffscreen();
//#endregion

//#region core initialization
initializeSDKCore(configs).map(() => {
  console.log("core initialized");
});

//#endregion
