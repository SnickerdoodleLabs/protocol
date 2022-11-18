import { IIndexerConfigProvider } from "@snickerdoodlelabs/indexers";
import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  ECurrencyCode,
  EChain,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfigProvider } from "@snickerdoodlelabs/persistence";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";

const modelAliases = {
  definitions: {
    backupIndex:
      "kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k",
  },
  schemas: {
    DataWalletBackup:
      "ceramic://k3y52l7qbv1fryeqpnu3xx9st37h6soh7cosvpskp59r6wj8ag4zl2n3u3283xrsw",
    BackupIndex:
      "ceramic://k3y52l7qbv1fryk2h9xhsf2mai9wsiga2eld67pn8vgo3845yad3bn9plleei53pc",
  },
  tiles: {},
};

/**
 * The config provider is a stash for data that is determined dynamically
 * but does not change during runtime.
 *
 * The built-in config values should always be appropriate for working in the test-harness package;
 * ie, they should be appropriate for local dev. All config values should be able to be changed via
 * ConfigOverrides, and anywhere that is NOT the test harness should be required to provide a basically
 * full set of ConfigOverrides when creating a new SnickercoodleCore. There is only one place in
 * this repo that does that, in the browserExtension, so it's easy to find.
 */

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
      [ChainId(31338), ChainId(-1), ChainId(1)], // supported chains (local hardhat only for the test harness, we can index other chains here though)
      chainConfig,
      controlChainInformation,
      URLString("http://127.0.0.1:8080/ipfs"), // ipfsFetchBaseUrl
      URLString("http://localhost:3006"), // defaultInsightPlatformBaseUrl
      5000, // polling interval indexing,
      5000, // polling interval balance
      5000, // polling interval nfts
      10000, // backup interval
      10, // backup chunk size target
      "ckey_ee277e2a0e9542838cf30325665", // covalent api key
      "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag", // moralis api key
      URLString("https://cloudflare-dns.com/dns-query"), // dnsServerAddress
      modelAliases, // ceramicModelAliases
      URLString("https://ceramic.snickerdoodle.dev/"), // ceramicNodeURL
      ECurrencyCode.USD, // quoteCurrency
      "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7", // etherscan api key
      new Map([
        [EChain.EthereumMainnet, "3eifUc6etBiT_wAJj4PtgrM9gBbaqsGQ"],
        [EChain.Goerli, "TeZH8KKhEQiC8vi5AjJJnrAynMagsh2P"],
      ]),
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

    // Now, if the control chain is the Dev Doodle Chain, 31337, we have to override it.
    // The whole point of making a different chainID for dev and local was to avoid this,
    // but it is unrealistic to assign a different ChainID for every sandbox. So instead,
    // if the chain ID is 31337 (DevDoodle), we can dynamically override the provider URL
    if (
      overrides.controlChainProviderURL != null &&
      this.config.controlChainId == EChain.DevDoodle
    ) {
      this.config.controlChainInformation.providerUrls = [
        overrides.controlChainProviderURL,
      ];
    }

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
