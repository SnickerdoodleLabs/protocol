import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { Action, Tabs } from "webextension-polyfill";

import { BrowserUtils } from "@enviroment/shared/utils";
import { IExtensionListener } from "@interfaces/api";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@shared/interfaces/configProvider";
import { ExtensionUtils } from "@shared/utils/ExtensionUtils";

@injectable()
export class ExtensionListener implements IExtensionListener {
  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}
  public initialize(): ResultAsync<void, never> {
    BrowserUtils.browserAction.onClicked.addListener(
      (
        tab: Tabs.Tab,
        info: Action.OnClickData | undefined,
      ) => {
        this.handleExtensionIconClick(tab, info).mapErr((e) => {
          console.error("Error while handling extensionIconClick", e);
        });
      }
    );
    return okAsync(undefined);
  }

  private handleExtensionIconClick(
    tab: Tabs.Tab,
    info: Action.OnClickData | undefined,
  ): ResultAsync<void, Error> {
    console.debug("Icon clicked");
    const config = this.configProvider.getConfig();
    if (tab.windowId) {
      return ExtensionUtils.getAllTabsOnWindow(tab.windowId).andThen((tabs) => {
        const onboardingTab = tabs.find(
          (tab) =>
            new URL(tab.url || "").origin ===
            new URL(config.onboardingUrl).origin,
        );
        if (onboardingTab) {
          return ExtensionUtils.switchToTab(onboardingTab.id).map(() => {});
        }
        return ExtensionUtils.openTab({ url: config.onboardingUrl }).map(() => {});
      });
    } else {
      return ExtensionUtils.openTab({ url: config.onboardingUrl }).map(() => {});
    }
    // when the below method is called onClick event not gonna fired again this can be called after onboarding is completed
  }
}
