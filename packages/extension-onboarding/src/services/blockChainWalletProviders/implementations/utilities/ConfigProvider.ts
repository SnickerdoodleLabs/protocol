import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";
import { IConfigProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/utilities";

declare const __INFURA_ID__: string;

export class ConfigProvider implements IConfigProvider {
  protected config: Config;

  constructor() {
    this.config = new Config(
      typeof __INFURA_ID__ !== "undefined" && !!__INFURA_ID__
        ? __INFURA_ID__
        : "",
    );
  }
  getConfig(): Config {
    return this.config;
  }
}
