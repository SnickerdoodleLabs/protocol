import {
  ChainId,
  DiscordConfig,
  ProviderUrl,
  TwitterConfig,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IExtensionConfigOverrides } from "@snickerdoodlelabs/synamint-extension-sdk/shared";
import { urlJoin } from "url-join-ts";

declare const __ONBOARDING_URL__: string;
declare const __CONTROL_CHAIN_ID__: string;
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
declare const __BLUEZ_API_KEY__: string;
declare const __SPACEANDTIME_API_KEY__: string;
declare const __PRIMARY_INFURA_KEY__: string;
declare const __SECONDARY_INFURA_KEY__: string;

declare const __DNS_SERVER_ADDRESS__: URLString;
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

declare const __DROPBOX_APP_KEY__: string;
declare const __DROPBOX_APP_SECRET__: string;
declare const __DROPBOX_REDIRECT_URI__: string;

const ONE_MINUTE_MS = 60000;

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
  controlChainId:
    typeof __CONTROL_CHAIN_ID__ !== "undefined" && !!__CONTROL_CHAIN_ID__
      ? ChainId(Number.parseInt(__CONTROL_CHAIN_ID__))
      : ChainId(43113),
  domainFilter:
    typeof __DOMAIN_FILTER__ !== "undefined" && !!__DOMAIN_FILTER__
      ? __DOMAIN_FILTER__
      : "(localhost|chrome://)",
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
  apiKeys: {
    alchemyApiKeys: {
      Arbitrum:
        typeof __ALCHEMY_ARBITRUM_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_ARBITRUM_API_KEY__
          ? __ALCHEMY_ARBITRUM_API_KEY__
          : "",
      Astar:
        typeof __ALCHEMY_ASTAR_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_ASTAR_API_KEY__
          ? __ALCHEMY_ASTAR_API_KEY__
          : "",
      Mumbai:
        typeof __ALCHEMY_MUMBAI_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_MUMBAI_API_KEY__
          ? __ALCHEMY_MUMBAI_API_KEY__
          : "",
      Optimism:
        typeof __ALCHEMY_OPTIMISM_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_OPTIMISM_API_KEY__
          ? __ALCHEMY_OPTIMISM_API_KEY__
          : "",
      Polygon:
        typeof __ALCHEMY_POLYGON_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_POLYGON_API_KEY__
          ? __ALCHEMY_POLYGON_API_KEY__
          : "",
      Solana:
        typeof __ALCHEMY_SOLANA_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_SOLANA_API_KEY__
          ? __ALCHEMY_SOLANA_API_KEY__
          : "",
      SolanaTestnet:
        typeof __ALCHEMY_SOLANA_TESTNET_API_KEY__ !== "undefined" &&
        !!__ALCHEMY_SOLANA_TESTNET_API_KEY__
          ? __ALCHEMY_SOLANA_TESTNET_API_KEY__
          : "",
    },
    etherscanApiKeys: {
      Ethereum:
        typeof __ETHERSCAN_ETHEREUM_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_ETHEREUM_API_KEY__
          ? __ETHERSCAN_ETHEREUM_API_KEY__
          : "",
      Polygon:
        typeof __ETHERSCAN_POLYGON_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_POLYGON_API_KEY__
          ? __ETHERSCAN_POLYGON_API_KEY__
          : "",
      Avalanche:
        typeof __ETHERSCAN_AVALANCHE_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_AVALANCHE_API_KEY__
          ? __ETHERSCAN_AVALANCHE_API_KEY__
          : "",
      Binance:
        typeof __ETHERSCAN_BINANCE_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_BINANCE_API_KEY__
          ? __ETHERSCAN_BINANCE_API_KEY__
          : "",
      Moonbeam:
        typeof __ETHERSCAN_MOONBEAM_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_MOONBEAM_API_KEY__
          ? __ETHERSCAN_MOONBEAM_API_KEY__
          : "",
      Optimism:
        typeof __ETHERSCAN_OPTIMISM_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_OPTIMISM_API_KEY__
          ? __ETHERSCAN_OPTIMISM_API_KEY__
          : "",
      Arbitrum:
        typeof __ETHERSCAN_ARBITRUM_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_ARBITRUM_API_KEY__
          ? __ETHERSCAN_ARBITRUM_API_KEY__
          : "",
      Gnosis:
        typeof __ETHERSCAN_GNOSIS_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_GNOSIS_API_KEY__
          ? __ETHERSCAN_GNOSIS_API_KEY__
          : "",
      Fuji:
        typeof __ETHERSCAN_FUJI_API_KEY__ !== "undefined" &&
        !!__ETHERSCAN_FUJI_API_KEY__
          ? __ETHERSCAN_FUJI_API_KEY__
          : "",
    },
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
    bluezApiKey:
      typeof __BLUEZ_API_KEY__ !== "undefined" && !!__BLUEZ_API_KEY__
        ? __BLUEZ_API_KEY__
        : undefined,
    spaceAndTimeKey:
      typeof __SPACEANDTIME_API_KEY__ !== "undefined" &&
      !!__SPACEANDTIME_API_KEY__
        ? __SPACEANDTIME_API_KEY__
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

  dropboxAppKey:
    typeof __DROPBOX_APP_KEY__ !== "undefined" && !!__DROPBOX_APP_KEY__
      ? __DROPBOX_APP_KEY__
      : undefined,

  dropboxAppSecret:
    typeof __DROPBOX_APP_SECRET__ !== "undefined" && !!__DROPBOX_APP_SECRET__
      ? __DROPBOX_APP_SECRET__
      : undefined,

  dropboxRedirectUri:
    typeof __DROPBOX_REDIRECT_URI__ !== "undefined" &&
    !!__DROPBOX_REDIRECT_URI__
      ? __DROPBOX_REDIRECT_URI__
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
      : undefined, // Important, should not have a default so that prod can have this turned off
  ipfsFetchBaseUrl:
    typeof __IPFS_FETCH_BASE_URL__ !== "undefined" && !!__IPFS_FETCH_BASE_URL__
      ? __IPFS_FETCH_BASE_URL__
      : URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
};
