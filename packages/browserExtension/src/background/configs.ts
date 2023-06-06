import {
  ChainId,
  DiscordConfig,
  EChain,
  ProviderUrl,
  TwitterConfig,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IExtensionConfigOverrides } from "@snickerdoodlelabs/synamint-extension-sdk/shared";
import { urlJoin } from "url-join-ts";

declare const __ONBOARDING_URL__: string;
declare const __ACCOUNT_COOKIE_URL__: string;
declare const __COOKIE_LIFETIME__: string; // year
declare const __CONTROL_CHAIN_ID__: string;
declare const __SUPPORTED_CHAINS__: string;
declare const __IPFS_FETCH_BASE_URL__: URLString;
declare const __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: URLString;

declare const __ETHERSCAN_ETHEREUM_API_KEY__: string;
declare const __ETHERSCAN_POLYGON_API_KEY__: string;
declare const __ETHERSCAN_AVALANCHE_API_KEY__: string;
declare const __ETHERSCAN_BINANCE_API_KEY__: string;
declare const __ETHERSCAN_MOONBEAM_API_KEY__: string;

declare const __ETHERSCAN_OPTIMISM_API_KEY__: string;
declare const __ETHERSCAN_ARBITRUM_API_KEY__: string;
declare const __ETHERSCAN_GNOSIS_API_KEY__: string;
declare const __ETHERSCAN_FUJI_API_KEY__: string;

declare const __ALCHEMY_ARBITRUM_API_KEY__: string;
declare const __ALCHEMY_ASTAR_API_KEY__: string;
declare const __ALCHEMY_MUMBAI_API_KEY__: string;
declare const __ALCHEMY_OPTIMISM_API_KEY__: string;
declare const __ALCHEMY_POLYGON_API_KEY__: string;
declare const __ALCHEMY_SOLANA_API_KEY__: string;
declare const __ALCHEMY_SOLANA_TESTNET_API_KEY__: string;

declare const __COVALENT_API_KEY__: string;
declare const __MORALIS_API_KEY__: string;
declare const __NFTSCAN_API_KEY__: string;
declare const __POAP_API_KEY__: string;
declare const __OKLINK_API_KEY__: string;
declare const __ANKR_API_KEY__: string;
declare const __PRIMARY_INFURA_KEY__: string;
declare const __SECONDARY_INFURA_KEY__: string;

declare const __DNS_SERVER_ADDRESS__: URLString;
declare const __CERAMIC_NODE_URL__: URLString;
declare const __REQUEST_FOR_DATA_EVENT_FREQ__: string;
declare const __DOMAIN_FILTER__: string;
declare const __GOOGLE_CLOUD_BUCKET__: string;
declare const __PORTFOLIO_POLLING_INTERVAL__: string;
declare const __TRANSACTION_POLLING_INTERVAL__: string;
declare const __BACKUP_POLLING_INTERVAL__: string;
declare const __ENABLE_BACKUP_ENCRYPTION__: string;
declare const __DISCORD_CLIENT_ID__: string;
declare const __DISCORD_CLIENT_KEY__: string;
declare const __DISCORD_POLL_INTERVAL__: string;
declare const __TWITTER_CONSUMER_KEY__: string;
declare const __TWITTER_CONSUMER_SECRET__: string;
declare const __TWITTER_POLL_INTERVAL__: string;
declare const __DEV_CHAIN_PROVIDER_URL__: ProviderUrl;

const ONE_MINUTE_MS = 60000;

const supportedChains = (
  typeof __SUPPORTED_CHAINS__ !== "undefined" && !!__SUPPORTED_CHAINS__
    ? __SUPPORTED_CHAINS__
    : "80001,43113,1,137,43114,-1"
)
  .split(",")
  .map((chain) => {
    return ChainId(Number.parseInt(chain));
  });
const _buildDiscordConfig = (): Partial<DiscordConfig> => {
  const oauthRedirectUrl =
    typeof __ONBOARDING_URL__ !== "undefined" && !!__ONBOARDING_URL__
      ? URLString(
          urlJoin(__ONBOARDING_URL__, "/data-dashboard/social-media-data"),
        )
      : URLString(
          "https://datawallet.snickerdoodle.com/data-dashboard/social-media-data",
        );

  const discordConfig = {
    oauthRedirectUrl,
  } as Partial<DiscordConfig>;

  if (typeof __DISCORD_CLIENT_ID__ !== "undefined" && !!__DISCORD_CLIENT_ID__) {
    discordConfig["clientId"] = __DISCORD_CLIENT_ID__;
  }
  if (
    typeof __DISCORD_CLIENT_KEY__ !== "undefined" &&
    !!__DISCORD_CLIENT_KEY__
  ) {
    discordConfig["client_secret"] = __DISCORD_CLIENT_KEY__;
  }
  if (
    typeof __DISCORD_POLL_INTERVAL__ !== "undefined" &&
    !!__DISCORD_POLL_INTERVAL__
  ) {
    discordConfig["pollInterval"] = parseInt(__DISCORD_POLL_INTERVAL__);
  }

  return discordConfig;
};

const _buildTwitterConfig = (): Partial<TwitterConfig> => {
  const oauthRedirectUrl =
    typeof __ONBOARDING_URL__ !== "undefined" && !!__ONBOARDING_URL__
      ? URLString(
          urlJoin(__ONBOARDING_URL__, "/data-dashboard/social-media-data"),
        )
      : URLString(
          "https://datawallet.snickerdoodle.com/data-dashboard/social-media-data",
        );

  const twitterConfig = {
    oAuthCallbackUrl: URLString(oauthRedirectUrl),
  } as Partial<TwitterConfig>;

  if (
    typeof __TWITTER_CONSUMER_KEY__ !== "undefined" &&
    !!__TWITTER_CONSUMER_KEY__
  ) {
    twitterConfig["apiKey"] = __TWITTER_CONSUMER_KEY__;
  }
  if (
    typeof __TWITTER_CONSUMER_SECRET__ !== "undefined" &&
    !!__TWITTER_CONSUMER_SECRET__
  ) {
    twitterConfig["apiSecretKey"] = __TWITTER_CONSUMER_SECRET__;
  }
  if (
    typeof __TWITTER_POLL_INTERVAL__ !== "undefined" &&
    !!__TWITTER_POLL_INTERVAL__
  ) {
    twitterConfig["pollInterval"] = parseInt(__TWITTER_POLL_INTERVAL__);
  }

  return twitterConfig;
};

export const configs: IExtensionConfigOverrides = {
  onboardingUrl:
    typeof __ONBOARDING_URL__ !== "undefined" && !!__ONBOARDING_URL__
      ? URLString(__ONBOARDING_URL__)
      : URLString("https://datawallet.snickerdoodle.com/"),
  accountCookieUrl:
    typeof __ACCOUNT_COOKIE_URL__ !== "undefined" && !!__ACCOUNT_COOKIE_URL__
      ? URLString(__ACCOUNT_COOKIE_URL__)
      : URLString("https://snickerdoodlelabs.io/"),
  controlChainId:
    typeof __CONTROL_CHAIN_ID__ !== "undefined" && !!__CONTROL_CHAIN_ID__
      ? ChainId(Number.parseInt(__CONTROL_CHAIN_ID__))
      : ChainId(43113),
  supportedChains,
  cookieLifeTime:
    typeof __COOKIE_LIFETIME__ !== "undefined" && !!__COOKIE_LIFETIME__
      ? Number.parseInt(__COOKIE_LIFETIME__)
      : 1,
  domainFilter:
    typeof __DOMAIN_FILTER__ !== "undefined" && !!__DOMAIN_FILTER__
      ? __DOMAIN_FILTER__
      : "(localhost|chrome://)",
  ceramicNodeUrl:
    typeof __CERAMIC_NODE_URL__ !== "undefined" && !!__CERAMIC_NODE_URL__
      ? __CERAMIC_NODE_URL__
      : URLString(""),
  portfolioPollingIntervalMS:
    typeof __PORTFOLIO_POLLING_INTERVAL__ !== "undefined" &&
    !!__PORTFOLIO_POLLING_INTERVAL__
      ? Number.parseInt(__PORTFOLIO_POLLING_INTERVAL__)
      : ONE_MINUTE_MS,
  transactionPollingIntervalMS:
    typeof __TRANSACTION_POLLING_INTERVAL__ !== "undefined" &&
    !!__TRANSACTION_POLLING_INTERVAL__
      ? Number.parseInt(__TRANSACTION_POLLING_INTERVAL__)
      : ONE_MINUTE_MS,
  backupPollingIntervalMS:
    typeof __BACKUP_POLLING_INTERVAL__ !== "undefined" &&
    !!__BACKUP_POLLING_INTERVAL__
      ? Number.parseInt(__BACKUP_POLLING_INTERVAL__)
      : ONE_MINUTE_MS,
  defaultInsightPlatformBaseUrl:
    typeof __DEFAULT_INSIGHT_PLATFORM_BASE_URL__ !== "undefined" &&
    !!__DEFAULT_INSIGHT_PLATFORM_BASE_URL__
      ? __DEFAULT_INSIGHT_PLATFORM_BASE_URL__
      : URLString("https://insight-api.snickerdoodle.com/v0/"),

  /* API KEYS */
  /* Alchemy Api Keys */
  // alchemyArbitrum:
  //   typeof __ALCHEMY_ARBITRUM_API_KEY__ !== "undefined" &&
  //   !!__ALCHEMY_ARBITRUM_API_KEY__
  //     ? __ALCHEMY_ARBITRUM_API_KEY__
  //     : "",
  // alchemyAstar:
  //   typeof __ALCHEMY_ASTAR_API_KEY__ !== "undefined" &&
  //   !!__ALCHEMY_ASTAR_API_KEY__
  //     ? __ALCHEMY_ASTAR_API_KEY__
  //     : "",
  // alchemyMumbai:
  //   typeof __ALCHEMY_MUMBAI_API_KEY__ !== "undefined" &&
  //   !!__ALCHEMY_MUMBAI_API_KEY__
  //     ? __ALCHEMY_MUMBAI_API_KEY__
  //     : "",
  // alchemyOptimism:
  //   typeof __ALCHEMY_OPTIMISM_API_KEY__ !== "undefined" &&
  //   !!__ALCHEMY_OPTIMISM_API_KEY__
  //     ? __ALCHEMY_OPTIMISM_API_KEY__
  //     : "",
  // alchemyPolygon:
  //   typeof __ALCHEMY_POLYGON_API_KEY__ !== "undefined" &&
  //   !!__ALCHEMY_POLYGON_API_KEY__
  //     ? __ALCHEMY_POLYGON_API_KEY__
  //     : "",
  // alchemySolana:
  //   typeof __ALCHEMY_SOLANA_API_KEY__ !== "undefined" &&
  //   !!__ALCHEMY_SOLANA_API_KEY__
  //     ? __ALCHEMY_SOLANA_API_KEY__
  //     : "",
  // alchemySolanaTestnet:
  //   typeof __ALCHEMY_SOLANA_TESTNET_API_KEY__ !== "undefined" &&
  //   !!__ALCHEMY_SOLANA_TESTNET_API_KEY__
  //     ? __ALCHEMY_SOLANA_TESTNET_API_KEY__
  //     : "",

  // /* Etherscan Api Keys */
  // etherscanEthereum:
  //   typeof __ETHERSCAN_ETHEREUM_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_ETHEREUM_API_KEY__
  //     ? __ETHERSCAN_ETHEREUM_API_KEY__
  //     : "",
  // etherscanPolygon:
  //   typeof __ETHERSCAN_POLYGON_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_POLYGON_API_KEY__
  //     ? __ETHERSCAN_POLYGON_API_KEY__
  //     : "",
  // etherscanAvalanche:
  //   typeof __ETHERSCAN_AVALANCHE_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_AVALANCHE_API_KEY__
  //     ? __ETHERSCAN_AVALANCHE_API_KEY__
  //     : "",
  // etherscanBinance:
  //   typeof __ETHERSCAN_BINANCE_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_BINANCE_API_KEY__
  //     ? __ETHERSCAN_BINANCE_API_KEY__
  //     : "",
  // etherscanMoonbeam:
  //   typeof __ETHERSCAN_MOONBEAM_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_MOONBEAM_API_KEY__
  //     ? __ETHERSCAN_MOONBEAM_API_KEY__
  //     : "",
  // etherscanOptimism:
  //   typeof __ETHERSCAN_OPTIMISM_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_OPTIMISM_API_KEY__
  //     ? __ETHERSCAN_OPTIMISM_API_KEY__
  //     : "",
  // etherscanArbitrum:
  //   typeof __ETHERSCAN_ARBITRUM_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_ARBITRUM_API_KEY__
  //     ? __ETHERSCAN_ARBITRUM_API_KEY__
  //     : "",
  // etherscanGnosis:
  //   typeof __ETHERSCAN_GNOSIS_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_GNOSIS_API_KEY__
  //     ? __ETHERSCAN_GNOSIS_API_KEY__
  //     : "",
  // etherscanFuji:
  //   typeof __ETHERSCAN_FUJI_API_KEY__ !== "undefined" &&
  //   !!__ETHERSCAN_FUJI_API_KEY__
  //     ? __ETHERSCAN_FUJI_API_KEY__
  //     : "",

  apiKeys: {
    alchemyApiKeys: new Map<EChain, string | null>([
      [
        EChain.Arbitrum,
        typeof __ALCHEMY_ARBITRUM_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_ARBITRUM_API_KEY__
          ? __ALCHEMY_ARBITRUM_API_KEY__
          : "",
      ],
      [
        EChain.Astar,
        typeof __ALCHEMY_ASTAR_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_ASTAR_API_KEY__
          ? __ALCHEMY_ASTAR_API_KEY__
          : "",
      ],
      [
        EChain.Mumbai,
        typeof __ALCHEMY_MUMBAI_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_MUMBAI_API_KEY__
          ? __ALCHEMY_MUMBAI_API_KEY__
          : "",
      ],
      [
        EChain.Optimism,
        typeof __ALCHEMY_OPTIMISM_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_OPTIMISM_API_KEY__
          ? __ALCHEMY_OPTIMISM_API_KEY__
          : "",
      ],
      [
        EChain.Polygon,
        typeof __ALCHEMY_POLYGON_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_POLYGON_API_KEY__
          ? __ALCHEMY_POLYGON_API_KEY__
          : "",
      ],
      [
        EChain.Solana,
        typeof __ALCHEMY_SOLANA_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_SOLANA_API_KEY__
          ? __ALCHEMY_SOLANA_API_KEY__
          : "",
      ],
      [
        EChain.SolanaTestnet,
        typeof __ALCHEMY_SOLANA_TESTNET_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_SOLANA_TESTNET_API_KEY__
          ? __ALCHEMY_SOLANA_TESTNET_API_KEY__
          : "",
      ],
    ]),
    etherscanApiKeys: new Map<EChain, string | null>([
      [
        EChain.EthereumMainnet,
        typeof __ETHERSCAN_ETHEREUM_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_ETHEREUM_API_KEY__
          ? __ETHERSCAN_ETHEREUM_API_KEY__
          : "",
      ],
      [
        EChain.Polygon,
        typeof __ETHERSCAN_POLYGON_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_POLYGON_API_KEY__
          ? __ETHERSCAN_POLYGON_API_KEY__
          : "",
      ],
      [
        EChain.Binance,
        typeof __ETHERSCAN_BINANCE_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_BINANCE_API_KEY__
          ? __ETHERSCAN_BINANCE_API_KEY__
          : "",
      ],
      [
        EChain.Moonbeam,
        typeof __ETHERSCAN_MOONBEAM_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_MOONBEAM_API_KEY__
          ? __ETHERSCAN_MOONBEAM_API_KEY__
          : "",
      ],
      [
        EChain.Optimism,
        typeof __ETHERSCAN_OPTIMISM_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_OPTIMISM_API_KEY__
          ? __ETHERSCAN_OPTIMISM_API_KEY__
          : "",
      ],
      [
        EChain.Arbitrum,
        typeof __ETHERSCAN_ARBITRUM_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_ARBITRUM_API_KEY__
          ? __ETHERSCAN_ARBITRUM_API_KEY__
          : "",
      ],
      [
        EChain.Gnosis,
        typeof __ETHERSCAN_GNOSIS_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_GNOSIS_API_KEY__
          ? __ETHERSCAN_GNOSIS_API_KEY__
          : "",
      ],
      [
        EChain.Fuji,
        typeof __ETHERSCAN_FUJI_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_FUJI_API_KEY__
          ? __ETHERSCAN_FUJI_API_KEY__
          : "",
      ],
      [
        EChain.Avalanche,
        typeof __ETHERSCAN_AVALANCHE_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_AVALANCHE_API_KEY__
          ? __ETHERSCAN_AVALANCHE_API_KEY__
          : "",
      ],
    ]),
    covalentApiKey:
      typeof __COVALENT_API_KEY__ !== "undefined" && !!__COVALENT_API_KEY__
        ? __COVALENT_API_KEY__
        : undefined,
    moralisApiKey:
      typeof __MORALIS_API_KEY__ !== "undefined" && !!__MORALIS_API_KEY__
        ? __MORALIS_API_KEY__
        : undefined,
    nftScanApiKey:
      typeof __NFTSCAN_API_KEY__ !== "undefined" && !!__NFTSCAN_API_KEY__
        ? __NFTSCAN_API_KEY__
        : undefined,
    poapApiKey:
      typeof __POAP_API_KEY__ !== "undefined" && !!__POAP_API_KEY__
        ? __POAP_API_KEY__
        : undefined,
    oklinkApiKey:
      typeof __OKLINK_API_KEY__ !== "undefined" && !!__OKLINK_API_KEY__
        ? __OKLINK_API_KEY__
        : undefined,
    ankrApiKey:
      typeof __ANKR_API_KEY__ !== "undefined" && !!__ANKR_API_KEY__
        ? __ANKR_API_KEY__
        : undefined,
    primaryInfuraKey:
      typeof __PRIMARY_INFURA_KEY__ !== "undefined" && !!__PRIMARY_INFURA_KEY__
        ? __PRIMARY_INFURA_KEY__
        : "a8ae124ed6aa44bb97a7166cda30f1bc",
    secondaryInfuraKey:
      typeof __SECONDARY_INFURA_KEY__ !== "undefined" &&
      !!__SECONDARY_INFURA_KEY__
        ? __SECONDARY_INFURA_KEY__
        : undefined,
  },
  dnsServerAddress:
    typeof __DNS_SERVER_ADDRESS__ !== "undefined" && !!__DNS_SERVER_ADDRESS__
      ? __DNS_SERVER_ADDRESS__
      : undefined,
  requestForDataCheckingFrequency:
    typeof __REQUEST_FOR_DATA_EVENT_FREQ__ !== "undefined" &&
    !!__REQUEST_FOR_DATA_EVENT_FREQ__
      ? Number.parseInt(__REQUEST_FOR_DATA_EVENT_FREQ__)
      : 4000,
  defaultGoogleCloudBucket:
    typeof __GOOGLE_CLOUD_BUCKET__ !== "undefined" && !!__GOOGLE_CLOUD_BUCKET__
      ? __GOOGLE_CLOUD_BUCKET__
      : undefined,
  enableBackupEncryption:
    typeof __ENABLE_BACKUP_ENCRYPTION__ !== "undefined" &&
    !!__ENABLE_BACKUP_ENCRYPTION__
      ? __ENABLE_BACKUP_ENCRYPTION__ == "true"
      : false,
  discordOverrides: _buildDiscordConfig(),
  twitterOverrides: _buildTwitterConfig(),

  devChainProviderURL:
    typeof __DEV_CHAIN_PROVIDER_URL__ !== "undefined" &&
    !!__DEV_CHAIN_PROVIDER_URL__
      ? __DEV_CHAIN_PROVIDER_URL__
      : ProviderUrl("https://doodlechain.dev.snickerdoodle.dev"),
  ipfsFetchBaseUrl:
    typeof __IPFS_FETCH_BASE_URL__ !== "undefined" && !!__IPFS_FETCH_BASE_URL__
      ? __IPFS_FETCH_BASE_URL__
      : URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
};
