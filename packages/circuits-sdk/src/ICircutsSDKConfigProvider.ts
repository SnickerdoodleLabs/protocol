import { ResultAsync } from "neverthrow";

import { ICircutsSDKConfig } from "@circuits-sdk/ICircutsSDKConfig.js";

export interface ICircutsSDKConfigProvider {
  getConfig(): ResultAsync<ICircutsSDKConfig, never>;
}

export const ICircutsSDKConfigProviderype = Symbol.for(
  "ICircutsSDKConfigProvider",
);
