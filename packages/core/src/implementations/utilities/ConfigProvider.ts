import { TypedDataDomain } from "@ethersproject/abstract-signer";
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

  public constructor() {
    const controlChainId = ChainId(31338);
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
      [ChainId(42), ChainId(43113)], //supported chains (kovan, fuji)
      chainConfig,
      controlChainInformation,
      URLString("http://localhost:8080/ipfs"), // ipfsFetchBaseUrl
      URLString("http://localhost:3006"), // defaultInsightPlatformBaseUrl
      snickerdoodleSigningDomain, // snickerdoodleProtocolDomain
      5000, // polling interval indexing,
      5000, // polling interval balance
      5000, // polling interval nfts
      "ckey_ee277e2a0e9542838cf30325665", // covalent api key
      "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag", // moralis api key
      URLString("https://cloudflare-dns.com/dns-query"),
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
    this.config.ipfsFetchBaseUrl =
      overrides.ipfsFetchBaseUrl ?? this.config.ipfsFetchBaseUrl;
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
    this.config.dnsServerAddress =
      overrides.dnsServerAddress ?? this.config.dnsServerAddress;
  }
}
