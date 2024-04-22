import { ResultAsync } from "neverthrow";

import { ICircuitsSDKConfig } from "@circuits-sdk/ICircuitsSDKConfig.js";

export interface ICircuitsSDKConfigProvider {
  getConfig(): ResultAsync<ICircuitsSDKConfig, never>;
}

export const ICircuitsSDKConfigProviderype = Symbol.for(
  "ICircuitsSDKConfigProvider",
);
