import Browser from "webextension-polyfill";

import { VersionUtils } from "@synamint-extension-sdk/extensionShared";

export class BrowserUtils {
  public static get browserAction() {
    return VersionUtils.isManifest3 ? Browser.action : Browser.browserAction;
  }
}
