import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IIndexerConfigProvider } from "@snickerdoodlelabs/indexers";
import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";
import { snickerdoodleSigningDomain } from "@snickerdoodlelabs/signature-verification";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects";
import { IConfigProvider } from "@core/interfaces/utilities";

@injectable()
export class ConfigProvider implements IConfigProvider, IIndexerConfigProvider {
  protected config: CoreConfig;

  public constructor(@inject(ILogUtilsType) protected logUtils: ILogUtils) {
    const controlChainId = ChainId(31337);
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

    // All the default config below is for testing on local, using the test-harness package
    this.config = new CoreConfig(
      controlChainId,
      [], //TODO: supported chains
      URLString("http://localhost:8545"),
      chainConfig,
      controlChainInformation,
      URLString("http://localhost:5021/api/v0"),
      URLString("http://localhost:3006"),
      snickerdoodleSigningDomain,
      5000, // polling interval indexing,
      5000, // polling interval balance
      5000, // polling interval nfts
      "covalent api key",
      "moralis api key",
      URLString("https://cloudflare-dns.com/dns-query")
    );
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }

  public setConfigOverrides(overrides: IConfigOverrides): void {
    this.config.controlChainId =
      overrides.controlChainId ?? this.config.controlChainId;
    this.config.supportedChains =
      overrides.supportedChains ?? this.config.supportedChains;
    this.config.providerAddress =
      overrides.providerAddress ?? this.config.providerAddress;
    this.config.ipfsNodeAddress =
      overrides.ipfsNodeAddress ?? this.config.ipfsNodeAddress;
    this.config.defaultInsightPlatformBaseUrl =
      overrides.defaultInsightPlatformBaseUrl ??
      this.config.defaultInsightPlatformBaseUrl;
    this.config.accountIndexingPollingIntervalMS =
      overrides.accountIndexingPollingIntervalMS ??
      this.config.accountIndexingPollingIntervalMS;
    this.config.accountBalancePollingIntervalMS =
      overrides.accountBalancePollingIntervalMS ??
      this.config.accountBalancePollingIntervalMS;
    this.config.accountNFTPollingIntervalMS =
      overrides.accountNFTPollingIntervalMS ??
      this.config.accountNFTPollingIntervalMS;
    this.config.covalentApiKey =
      overrides.covalentApiKey ?? this.config.covalentApiKey;
    this.config.moralisApiKey =
      overrides.moralisApiKey ?? this.config.moralisApiKey;
  }
}
