import {
  ChainId,
  EVMContractAddress,
  ProviderUrl,
} from "@snickerdoodlelabs/objects";

import { Config } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects";
import { ChainInformation } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/objects/ChainInformation";
import { IConfigProvider } from "@extension-onboarding/services/blockChainWalletProviders/interfaces/utilities";

declare const __INFURA_ID__: string;
declare const __CONTROL_CHAIN_NAME__: string;
declare const __CONTROL_CHAIN_ID__: string;
declare const __CONTROL_CHAIN_PROVIDER_URLS__: string;
declare const __CONTROL_CHAIN_METATRANSACTION_FORWARDER_ADDRESS__: string;

export class ConfigProvider implements IConfigProvider {
  protected config: Config;

  constructor() {
    this.config = new Config(
      __INFURA_ID__,
      new ChainInformation(
        __CONTROL_CHAIN_NAME__,
        ChainId(parseInt(__CONTROL_CHAIN_ID__)),
        __CONTROL_CHAIN_PROVIDER_URLS__.includes("|")
          ? __CONTROL_CHAIN_PROVIDER_URLS__
              .split("|")
              .map((providerUrl) => ProviderUrl(providerUrl))
          : [ProviderUrl(__CONTROL_CHAIN_PROVIDER_URLS__)],
        EVMContractAddress(__CONTROL_CHAIN_METATRANSACTION_FORWARDER_ADDRESS__),
      ),
    );
  }
  getConfig(): Config {
    return this.config;
  }
}
