import { IIndexerConfigProvider } from "@snickerdoodlelabs/indexers";
import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfigProvider } from "@snickerdoodlelabs/persistence";
import { snickerdoodleSigningDomain } from "@snickerdoodlelabs/signature-verification";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";

const modelAliases = {
  definitions: {
    backupIndex:
      "kjzl6cwe1jw149f06c8o6hgro45rerad83swxqn5nrijb4i271uc1g5dybjjk22",
  },
  schemas: {
    BackupIndex:
      "ceramic://k3y52l7qbv1frxm8elgkbtatgwkukhh7f3he8h6jarqy8szuq39x96heksob9hqtc",
    DataWalletBackup:
      "ceramic://k3y52l7qbv1frxmf8dp0byvefkkj7j9f4hztn82r85lmpsrln5195njzlaw6zq680",
  },
  tiles: {},
};

@injectable()
export class ConfigProvider
  implements
    IConfigProvider,
    IIndexerConfigProvider,
    IPersistenceConfigProvider
{
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
      URLString("http://127.0.0.1:8080/ipfs"), // ipfsFetchBaseUrl
      URLString("http://localhost:3006"), // defaultInsightPlatformBaseUrl
      snickerdoodleSigningDomain, // snickerdoodleProtocolDomain
      5000, // polling interval indexing,
      5000, // polling interval balance
      5000, // polling interval nfts
      10000, // backup interval
      10, // backup chunk size target
      "ckey_ee277e2a0e9542838cf30325665", // covalent api key
      "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag", // moralis api key
      URLString("https://cloudflare-dns.com/dns-query"),
      modelAliases,
      URLString("http://localhost:7007"),
    );
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }

  public setConfigOverrides(overrides: IConfigOverrides): void {
    // Change the control chain, have to have new control chain info
    this.config.controlChainId =
      overrides.controlChainId ?? this.config.controlChainId;

    const controlChainInformation = chainConfig.get(this.config.controlChainId);

    if (controlChainInformation == null) {
      throw new Error(
        `Invalid configuration! No ChainInformation exists for control chain ${this.config.controlChainId}`,
      );
    }

    if (!(controlChainInformation instanceof ControlChainInformation)) {
      throw new Error(
        `Invalid configuration! Control chain ${controlChainInformation} is not a ControlChainInformation`,
      );
    }
    this.config.controlChainInformation = controlChainInformation;

    // The rest of the config is easier
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
    this.config.dataWalletBackupIntervalMS =
      overrides.dataWalletBackupIntervalMS ??
      this.config.dataWalletBackupIntervalMS;
    this.config.backupChunkSizeTarget =
      overrides.backupChunkSizeTarget ?? this.config.backupChunkSizeTarget;
  }
}
