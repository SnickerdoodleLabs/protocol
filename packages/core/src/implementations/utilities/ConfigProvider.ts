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
      "kjzl6cwe1jw14aqi7nvqjgm146nn3dlmqchbmhlp69k1933mu10ili388ofrw7h",
  },
  schemas: {
    DataWalletBackup:
      "ceramic://k3y52l7qbv1fryghpzxm0nfokqq2y52aj3qlr1a95ksxhknw8sz8n6468tsffuqkg",
    BackupIndex:
      "ceramic://k3y52l7qbv1frxi1g0kxkb81vdiegvw0py4secyd3soxnrvjcu31b233npz2zhg5c",
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
      [ChainId(5), ChainId(43113), ChainId(80001), ChainId(137), ChainId(1)], //supported chains (goerli, fuji,eth mainnet)
      chainConfig,
      controlChainInformation,
      URLString("http://127.0.0.1:8080/ipfs"), // ipfsFetchBaseUrl
      URLString("http://localhost:3006"), // defaultInsightPlatformBaseUrl
      snickerdoodleSigningDomain, // snickerdoodleProtocolDomain
      5000, // polling interval indexing,
      5000, // polling interval balance
      5000, // polling interval nfts
      10000, // backup interval
      3, // backup chunk size target
      "ckey_ee277e2a0e9542838cf30325665", // covalent api key
      "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag", // moralis api key
      URLString("https://cloudflare-dns.com/dns-query"), // dnsServerAddress
      modelAliases, // ceramicModelAliases
      URLString("https://ceramic.snickerdoodle.dev/"), // ceramicNodeURL
      "USD", // quoteCurrency
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
    this.config.ceramicNodeURL =
      overrides.ceramicNodeURL ?? this.config.ceramicNodeURL;
    this.config.ceramicModelAliases =
      overrides.ceramicModelAliases ?? this.config.ceramicModelAliases;
  }
}
