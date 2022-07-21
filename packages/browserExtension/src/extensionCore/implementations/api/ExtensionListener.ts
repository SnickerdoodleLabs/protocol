import { BrowserUtils } from "@enviroment/shared/utils";
import { IExtensionListener } from "@interfaces/api";
import Config from "@shared/constants/Config";
import { ExtensionUtils } from "@shared/utils/ExtensionUtils";
import { okAsync, ResultAsync } from "neverthrow";
import { Action, Tabs } from "webextension-polyfill";

export class ExtensionListener implements IExtensionListener {
  initialize(): ResultAsync<void, never> {
    BrowserUtils.browserAction.onClicked.addListener(
      this.handleExtensionIconClick,
    );
    return okAsync(undefined);
  }

  private handleExtensionIconClick(
    tab: Tabs.Tab,
    info: Action.OnClickData | undefined,
  ) {
    if (tab.windowId) {
      ExtensionUtils.getAllTabsOnWindow(tab.windowId).andThen((tabs) => {
        const onboardingTab = tabs.find(
          (tab) =>
            new URL(tab.url || "").origin ===
            new URL(Config.onboardingUrl).origin,
        );
        if (onboardingTab) {
          return ExtensionUtils.switchToTab(onboardingTab.id);
        }
        return ExtensionUtils.openTab({ url: Config.onboardingUrl });
      });
    } else {
      ExtensionUtils.openTab({ url: Config.onboardingUrl });
    }
    // when the below method is called onClick event not gonna fired again this can be called after onboarding is completed
  }
}
