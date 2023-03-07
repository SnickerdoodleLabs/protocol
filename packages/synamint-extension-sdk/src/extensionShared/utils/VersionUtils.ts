import browser from "webextension-polyfill";
export class VersionUtils {
  public static get isManifest3() {
    return browser.runtime.getManifest().manifest_version === 3;
  }
}
