import Browser from "webextension-polyfill";

import { VersionUtils } from "@shared/utils/VersionUtils";

export class BrowserUtils {
  public static get browserAction() {
    return VersionUtils.isManifest3 ? Browser.action : Browser.browserAction;
  }
}
