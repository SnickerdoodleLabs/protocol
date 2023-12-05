import { config } from "@browser-extension/background/configs";
import { initializeSDKCore } from "@snickerdoodlelabs/synamint-extension-sdk/core";
import { ExtensionUtils } from "@snickerdoodlelabs/synamint-extension-sdk/extensionShared";
import Browser, { Runtime } from "webextension-polyfill";

//#region first installation
Browser.runtime.onInstalled.addListener((details) => {
  details.reason === "install" &&
    ExtensionUtils.switchToUrlTab(config.onboardingURL ?? "", true);
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
initializeSDKCore(config).map(() => {
  console.log("core initialized");
});

//#endregion
