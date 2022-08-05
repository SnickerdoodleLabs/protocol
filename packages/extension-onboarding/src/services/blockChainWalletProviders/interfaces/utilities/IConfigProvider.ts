import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";

export interface IConfigProvider {
  getConfig(): Config;
}
