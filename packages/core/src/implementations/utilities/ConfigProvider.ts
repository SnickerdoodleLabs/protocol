import { IIndexerConfigProvider } from "@snickerdoodlelabs/indexers";
import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  EChain,
  ECurrencyCode,
  EHashAlgorithm,
  ESignatureAlgorithm,
  IConfigOverrides,
  ProviderUrl,
  TokenSecret,
  TwitterConfig,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfigProvider } from "@snickerdoodlelabs/persistence";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  CoreConfig,
  MetatransactionGasAmounts,
} from "@core/interfaces/objects/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";

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

    const discordConfig = {
      clientId: "1093307083102887996",
      clientSecret: TokenSecret("w7BG8KmbqQ2QYF2U8ZIZIV7KUalvZQDK"),
      oauthBaseUrl: URLString("https://discord.com/oauth2/authorize"),
      oauthRedirectUrl: URLString("spa-url"),
      accessTokenUrl: URLString("https://discord.com/api/oauth2/token"),
      refreshTokenUrl: URLString("https://discord.com/api/oauth2/token"),
      dataAPIUrl: URLString("https://discord.com/api"),
      iconBaseUrl: URLString("https://cdn.discordapp.com/icons"),
      pollInterval: 1 * 24 * 3600 * 1000, // days * hours * seconds * milliseconds
    };

    const twitterConfig = {
      apiKey: "IksHLFQGjifiBzswDKpdjtyqW",
      apiSecretKey: TokenSecret(
        "y4FOFgQnuRo7vvnRuKqFhBbM3sYWuSZyg5RqHlRIc3DZ4N7Hnx",
      ),
      signingAlgorithm: ESignatureAlgorithm.HMAC,
      hashingAlgorithm: EHashAlgorithm.SHA1,
      oAuthBaseUrl: URLString("https://api.twitter.com/oauth"),
      oAuthCallbackUrl: URLString("spa-url"),
      dataAPIUrl: URLString("https://api.twitter.com/2"),
      pollInterval: 1 * 24 * 3600 * 1000,
    };

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
      5, // backup chunk size target
      {
        alchemyApiKeys: {
          Arbitrum: "",
          Astar: "",
          Mumbai: "",
          Optimism: "",
          Polygon: "",
          Solana: "",
          SolanaTestnet: "",
        },
        etherscanApiKeys: {
          Ethereum: "",
          Polygon: "",
          Avalanche: "",
          Binance: "",
          Moonbeam: "",
          Optimism: "",
          Arbitrum: "",
          Gnosis: "",
          Fuji: "",
        },
        covalentApiKey: "", // "ckey_ee277e2a0e9542838cf30325665", // covalent api key
        moralisApiKey: "",
        // "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag", // moralis api key
        nftScanApiKey: "", // "lusr87vNmTtHGMmktlFyi4Nt", // NftScan api key
        poapApiKey: "",
        // "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm", // Poap Api Key
        oklinkApiKey: "", // "700c2f71-a4e2-4a85-b87f-58c8a341d1bf", // oklinkApiKeys
        ankrApiKey: "", // ankrApiKey
        primaryInfuraKey: "a8ae124ed6aa44bb97a7166cda30f1bc", // primary Infura Key
        secondaryInfuraKey: "",
      },

      URLString("https://cloudflare-dns.com/dns-query"), // dnsServerAddress
      URLString("https://ceramic.snickerdoodle.dev/"), // ceramicNodeURL
      ECurrencyCode.USD, // quoteCurrency
      100, // etherscan tx batch size
      4000, // polling interval for consent contracts on control chain
      new Map<EChain, URLString>([
        [EChain.Solana, URLString("https://solana-mainnet.g.alchemy.com/v2/")],
        [
          EChain.SolanaTestnet,
          URLString("https://solana-devnet.g.alchemy.com/v2/"),
        ],
        [
          EChain.Polygon,
          URLString("https://polygon-mainnet.g.alchemy.com/v2/"),
        ],
        [EChain.Mumbai, URLString("https://polygon-mumbai.g.alchemy.com/v2/")],
        [EChain.Arbitrum, URLString("https://arb-mainnet.g.alchemy.com/v2/")],
        [EChain.Optimism, URLString("https://opt-mainnet.g.alchemy.com/v2/")],
        [EChain.Astar, URLString("https://astar-mainnet.g.alchemy.com/v2/")],
      ]),
      10000,
      "(localhost|chrome://)",
      false, // enable backup encryption
      300000,
      120000, // backup placement heartbeat
      discordConfig,
      twitterConfig,
      60000, // heartbeatIntervalMS
      new MetatransactionGasAmounts(
        10000000, // createCrumbGas
        10000000, // removeCrumbGas,
        10000000, // optInGas
        10000000, // optOutGas
        10000000, // updateAgreementFlagsGas
      ),
      ProviderUrl("http://127.0.0.1:8545"),
    );
  }

  public getConfig(): ResultAsync<CoreConfig, never> {
    return okAsync(this.config);
  }

  public setConfigOverrides(overrides: IConfigOverrides): void {
    // Change the control chain, have to have new control chain info
    this.config.controlChainId =
      overrides.controlChainId ?? this.config.controlChainId;
    this.config.defaultGoogleCloudBucket =
      overrides.defaultGoogleCloudBucket ??
      this.config.defaultGoogleCloudBucket;

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
      this.config.devChainProviderURL =
        overrides.devChainProviderURL || ProviderUrl("http://127.0.0.1:8545");
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
    this.config.apiKeys.covalentApiKey =
      overrides.covalentApiKey ?? this.config.apiKeys.covalentApiKey;
    this.config.apiKeys.alchemyApiKeys =
      overrides.alchemyApiKeys ?? this.config.apiKeys.alchemyApiKeys;
    this.config.apiKeys.etherscanApiKeys =
      overrides.etherscanApiKeys ?? this.config.apiKeys.etherscanApiKeys;
    this.config.apiKeys.moralisApiKey =
      overrides.moralisApiKey ?? this.config.apiKeys.moralisApiKey;
    this.config.apiKeys.nftScanApiKey =
      overrides.nftScanApiKey ?? this.config.apiKeys.nftScanApiKey;
    this.config.apiKeys.poapApiKey =
      overrides.poapApiKey ?? this.config.apiKeys.poapApiKey;
    this.config.apiKeys.oklinkApiKey =
      overrides.oklinkApiKey ?? this.config.apiKeys.oklinkApiKey;
    this.config.apiKeys.ankrApiKey =
      overrides.ankrApiKey ?? this.config.apiKeys.ankrApiKey;
    this.config.apiKeys.primaryInfuraKey =
      overrides.primaryInfuraKey ?? this.config.apiKeys.primaryInfuraKey;
    this.config.apiKeys.secondaryInfuraKey =
      overrides.secondaryInfuraKey ?? this.config.apiKeys.secondaryInfuraKey;

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
    this.config.domainFilter =
      overrides.domainFilter ?? this.config.domainFilter;
    this.config.enableBackupEncryption =
      overrides.enableBackupEncryption ?? false;
    this.config.discord = {
      ...this.config.discord,
      ...overrides.discordOverrides,
    };
    this.config.twitter = {
      ...this.config.twitter,
      ...overrides.twitterOverrides,
    };
    this.config.heartbeatIntervalMS =
      overrides.heartbeatIntervalMS ?? this.config.heartbeatIntervalMS;
  }
}
