import { BrowserUtils } from "@enviroment/shared/utils";
import { IExtensionListener } from "@interfaces/api";
import { IConfigProvider } from "@shared/interfaces/configProvider";
import { ExtensionUtils } from "@shared/utils/ExtensionUtils";
import { okAsync, ResultAsync } from "neverthrow";
import { Action, Tabs } from "webextension-polyfill";

export class ExtensionListener implements IExtensionListener {
  constructor(protected configProvider: IConfigProvider) {}
  public initialize(): ResultAsync<void, never> {
    BrowserUtils.browserAction.onClicked.addListener(
      this.handleExtensionIconClick.bind(this),
    );
    return okAsync(undefined);
  }

  private handleExtensionIconClick(
    tab: Tabs.Tab,
    info: Action.OnClickData | undefined,
  ) {
    const config = this.configProvider.getConfig();
    if (tab.windowId) {
      ExtensionUtils.getAllTabsOnWindow(tab.windowId).andThen((tabs) => {
        const onboardingTab = tabs.find(
          (tab) =>
            new URL(tab.url || "").origin ===
            new URL(config.onboardingUrl).origin,
        );
        if (onboardingTab) {
          return ExtensionUtils.switchToTab(onboardingTab.id);
        }
        return ExtensionUtils.openTab({ url: config.onboardingUrl });
      });
    } else {
      ExtensionUtils.openTab({ url: config.onboardingUrl });
    }
    // when the below method is called onClick event not gonna fired again this can be called after onboarding is completed
  }
}
