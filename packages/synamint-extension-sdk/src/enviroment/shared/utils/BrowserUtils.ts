import { VersionUtils } from "@synamint-extension-sdk/extensionShared";
import Browser from "webextension-polyfill";

export class BrowserUtils {
  public static get browserAction() {
    return VersionUtils.isManifest3 ? Browser.action : Browser.browserAction;
  }
}
