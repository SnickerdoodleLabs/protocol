import { IExtensionListener } from "@synamint-extension-sdk/core/interfaces/api";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { BrowserUtils } from "@synamint-extension-sdk/enviroment/shared/utils";
import { ExtensionUtils } from "@synamint-extension-sdk/extensionShared";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { Action, Tabs } from "webextension-polyfill";

@injectable()
export class ExtensionListener implements IExtensionListener {
  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}
  public initialize(): ResultAsync<void, never> {
    BrowserUtils.browserAction.onClicked.addListener(
      (tab: Tabs.Tab, info: Action.OnClickData | undefined) => {
        this.handleExtensionIconClick(tab, info).mapErr((e) => {
          console.error("Error while handling extensionIconClick", e);
        });
      },
    );
    return okAsync(undefined);
  }

  private handleExtensionIconClick(
    tab: Tabs.Tab,
    info: Action.OnClickData | undefined,
  ): ResultAsync<void, Error> {
    console.debug("Icon clicked");
    const config = this.configProvider.getConfig();
    return ExtensionUtils.openUrlOrSwitchToUrlTab(config.onboardingUrl);
    // when the below method is called onClick event not gonna fired again this can be called after onboarding is completed
  }
}
