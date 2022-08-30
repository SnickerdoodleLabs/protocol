import {
  ChainId,
  EVMContractAddress,
  ProviderUrl,
  chainConfig,
  ControlChainInformation,
} from "@snickerdoodlelabs/objects";

import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";
import { IConfigProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/utilities";

declare const __INFURA_ID__: string;
declare const __CONTROL_CHAIN_ID__: string;

export class ConfigProvider implements IConfigProvider {
  protected config: Config;

  constructor() {
    // Get the chain info
    const controlChainId = ChainId(parseInt(__CONTROL_CHAIN_ID__));

    const controlChainInformation = chainConfig.get(controlChainId);

    if (controlChainInformation == null) {
      throw new Error(
        `Invalid configuration! No ChainInformation exists for control chain ${controlChainId}`,
      );
    }

    if (!(controlChainInformation instanceof ControlChainInformation)) {
      throw new Error(
        `Invalid configuration! Control chain ${controlChainInformation} is not a ControlChainInformation`,
      );
    }

    this.config = new Config(__INFURA_ID__, controlChainInformation);
  }
  getConfig(): Config {
    return this.config;
  }
}
