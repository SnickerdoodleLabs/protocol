import { IIndexerConfigProvider } from "@snickerdoodlelabs/indexers";
import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  ECurrencyCode,
  EChain,
  IConfigOverrides,
  URLString,
  ProviderUrl,
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
      [ChainId(EChain.DevDoodle)], // supported chains (local hardhat only for the test harness, we can index other chains here though)
      chainConfig,
      controlChainInformation,
      URLString("http://127.0.0.1:8080/ipfs"), // ipfsFetchBaseUrl
      URLString("http://localhost:3006"), // defaultInsightPlatformBaseUrl
      "ceramic-replacement-bucket",
      5000, // polling interval indexing,
      5000, // polling interval balance
      5000, // polling interval nfts
      60000, // backup interval
      50, // backup chunk size target
      "ckey_ee277e2a0e9542838cf30325665", // covalent api key
      "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag", // moralis api key
      "lusr87vNmTtHGMmktlFyi4Nt", // NftScan api key
      "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm", // Poap Api Key
      URLString("https://cloudflare-dns.com/dns-query"), // dnsServerAddress
      modelAliases, // ceramicModelAliases
      URLString("https://ceramic.snickerdoodle.dev/"), // ceramicNodeURL
      ECurrencyCode.USD, // quoteCurrency
      new Map([
        [ChainId(1), "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7"],
        [ChainId(5), "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7"],
        [ChainId(137), "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G"],
        [ChainId(80001), "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G"],
        [ChainId(43114), "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1"],
        [ChainId(43113), "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1"],
        [ChainId(100), "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE"],
        [ChainId(56), "KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY"],
        [ChainId(1284), "EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71"],
      ]), // etherscan api key
      100, // etherscan tx batch size
      4000, // polling interval for consent contracts on control chain
      {
        solana:
          "https://solana-mainnet.g.alchemy.com/v2/jTt7xNc-M5Tl3myKDWgsKULpB3tR7uDB",
        solanaTestnet:
          "https://solana-devnet.g.alchemy.com/v2/Fko-iHgKEnUKTkM1SvnFMFMw1AvTVAtg",
        polygon: "iL3Kn-Zw5kt05zaRL2gN7ZFd5oFp7L1N",
        polygonMumbai: "42LAoVbGX9iRb405Uq1jQX6qdHxxZVNg",
      },
      10000,
      "(localhost|chrome://)",
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
    if (this.config.controlChainId == EChain.DevDoodle) {
      this.config.controlChainInformation.providerUrls = [
        overrides.controlChainProviderURL ||
          ProviderUrl("http://127.0.0.1:8545"),
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
    this.config.nftScanApiKey =
      overrides.nftScanApiKey ?? this.config.nftScanApiKey;
    this.config.poapApiKey = overrides.poapApiKey ?? this.config.poapApiKey;
    this.config.dnsServerAddress =
      overrides.dnsServerAddress ?? this.config.dnsServerAddress;
    this.config.dataWalletBackupIntervalMS =
      overrides.dataWalletBackupIntervalMS ??
      this.config.dataWalletBackupIntervalMS;
    this.config.backupChunkSizeTarget =
      overrides.backupChunkSizeTarget ?? this.config.backupChunkSizeTarget;
    this.config.ceramicNodeURL =
      overrides.ceramicNodeURL ?? this.config.ceramicNodeURL;
    this.config.requestForDataCheckingFrequency =
      overrides.requestForDataCheckingFrequency ??
      this.config.requestForDataCheckingFrequency;
    this.config.ceramicModelAliases =
      overrides.ceramicModelAliases ?? this.config.ceramicModelAliases;
    this.config.domainFilter =
      overrides.domainFilter ?? this.config.domainFilter;
  }
}
