// import {
//   ChainId,
//   DiscordConfig,
//   ProviderUrl,
//   TwitterConfig,
//   URLString,
// } from "@snickerdoodlelabs/objects";
// import { urlJoin } from "url-join-ts";

// import {
//   EManifestVersion,
//   EPlatform,
// } from "@synamint-extension-sdk/shared/enums/config";
// import { IConfigProvider } from "@synamint-extension-sdk/shared/interfaces/configProvider";
// import { ExtensionConfig } from "@synamint-extension-sdk/shared/objects/businessObjects/Config";

// declare const __ONBOARDING_URL__: string;
// declare const __ACCOUNT_COOKIE_URL__: string;
// declare const __COOKIE_LIFETIME__: string; // year
// declare const __MANIFEST_VERSION__: EManifestVersion;
// declare const __PLATFORM__: EPlatform;
// declare const __CONTROL_CHAIN_ID__: string;
// declare const __SUPPORTED_CHAINS__: string;
// declare const __IPFS_FETCH_BASE_URL__: URLString;
// declare const __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: URLString;
// declare const __COVALENT_API_KEY__: string;
// declare const __MORALIS_API_KEY__: string;
// declare const __NFTSCAN_API_KEY__: string;
// declare const __POAP_API_KEY__: string;
// declare const __OKLINK_API_KEY__: string;
// declare const __DNS_SERVER_ADDRESS__: URLString;
// declare const __CERAMIC_NODE_URL__: URLString;
// declare const __REQUEST_FOR_DATA_EVENT_FREQ__: string;
// declare const __DOMAIN_FILTER__: string;
// declare const __GOOGLE_CLOUD_BUCKET__: string;
// declare const __PORTFOLIO_POLLING_INTERVAL__: string;
// declare const __TRANSACTION_POLLING_INTERVAL__: string;
// declare const __BACKUP_POLLING_INTERVAL__: string;
// declare const __ENABLE_BACKUP_ENCRYPTION__: string;
// declare const __DISCORD_CLIENT_ID__: string;
// declare const __DISCORD_CLIENT_KEY__: string;
// declare const __DISCORD_POLL_INTERVAL__: string;
// declare const __TWITTER_CONSUMER_KEY__: string;
// declare const __TWITTER_CONSUMER_SECRET__: string;
// declare const __TWITTER_POLL_INTERVAL__: string;
// declare const __PRIMARY_INFURA_KEY__: string;
// declare const __DEV_CHAIN_PROVIDER_URL__: ProviderUrl;

// const ONE_MINUTE_MS = 60000;

// class ConfigProvider implements IConfigProvider {
//   protected extensionConfig: ExtensionConfig;
//   constructor() {
//     // SUPPORTED_CHAINS is a comma-separated list
//     // Need to split it into an array
//     const supportedChains = (
//       typeof __SUPPORTED_CHAINS__ !== "undefined" && !!__SUPPORTED_CHAINS__
//         ? __SUPPORTED_CHAINS__
//         : "80001,43113,1,137,43114,-1"
//     )
//       .split(",")
//       .map((chain) => {
//         return ChainId(Number.parseInt(chain));
//       });

//     this.extensionConfig = new ExtensionConfig(
//       typeof __ONBOARDING_URL__ !== "undefined" && !!__ONBOARDING_URL__
//         ? __ONBOARDING_URL__
//         : "https://datawallet.snickerdoodle.com/",
//       typeof __ACCOUNT_COOKIE_URL__ !== "undefined" && !!__ACCOUNT_COOKIE_URL__
//         ? __ACCOUNT_COOKIE_URL__
//         : "https://snickerdoodlelabs.io/",
//       typeof __COOKIE_LIFETIME__ !== "undefined" && !!__COOKIE_LIFETIME__
//         ? Number.parseInt(__COOKIE_LIFETIME__)
//         : 1,
//       typeof __MANIFEST_VERSION__ !== "undefined" && !!__MANIFEST_VERSION__
//         ? __MANIFEST_VERSION__
//         : EManifestVersion.V3,
//       typeof __PLATFORM__ !== "undefined" && !!__PLATFORM__
//         ? __PLATFORM__
//         : EPlatform.CHROME,
//       typeof __CONTROL_CHAIN_ID__ !== "undefined" && !!__CONTROL_CHAIN_ID__
//         ? ChainId(Number.parseInt(__CONTROL_CHAIN_ID__))
//         : ChainId(43113),
//       supportedChains,
//       typeof __IPFS_FETCH_BASE_URL__ !== "undefined" &&
//       !!__IPFS_FETCH_BASE_URL__
//         ? __IPFS_FETCH_BASE_URL__
//         : URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),

//       typeof __DEFAULT_INSIGHT_PLATFORM_BASE_URL__ !== "undefined" &&
//       !!__DEFAULT_INSIGHT_PLATFORM_BASE_URL__
//         ? __DEFAULT_INSIGHT_PLATFORM_BASE_URL__
//         : URLString("https://insight-api.snickerdoodle.com/v0/"),
//       typeof __CERAMIC_NODE_URL__ !== "undefined" && !!__CERAMIC_NODE_URL__
//         ? __CERAMIC_NODE_URL__
//         : URLString(""),
//       typeof __COVALENT_API_KEY__ !== "undefined" && !!__COVALENT_API_KEY__
//         ? __COVALENT_API_KEY__
//         : undefined,
//       typeof __MORALIS_API_KEY__ !== "undefined" && !!__MORALIS_API_KEY__
//         ? __MORALIS_API_KEY__
//         : undefined,
//       typeof __NFTSCAN_API_KEY__ !== "undefined" && !!__NFTSCAN_API_KEY__
//         ? __NFTSCAN_API_KEY__
//         : undefined,
//       typeof __POAP_API_KEY__ !== "undefined" && !!__POAP_API_KEY__
//         ? __POAP_API_KEY__
//         : undefined,
//       typeof __OKLINK_API_KEY__ !== "undefined" && !!__OKLINK_API_KEY__
//         ? __OKLINK_API_KEY__
//         : undefined,
//       typeof __DNS_SERVER_ADDRESS__ !== "undefined" && !!__DNS_SERVER_ADDRESS__
//         ? __DNS_SERVER_ADDRESS__
//         : undefined,
//       typeof __REQUEST_FOR_DATA_EVENT_FREQ__ !== "undefined" &&
//       !!__REQUEST_FOR_DATA_EVENT_FREQ__
//         ? Number.parseInt(__REQUEST_FOR_DATA_EVENT_FREQ__)
//         : 4000,
//       typeof __DOMAIN_FILTER__ !== "undefined" && !!__DOMAIN_FILTER__
//         ? __DOMAIN_FILTER__
//         : "(localhost|chrome://)",
//       typeof __GOOGLE_CLOUD_BUCKET__ !== "undefined" &&
//       !!__GOOGLE_CLOUD_BUCKET__
//         ? __GOOGLE_CLOUD_BUCKET__
//         : undefined,
//       typeof __PORTFOLIO_POLLING_INTERVAL__ !== "undefined" &&
//       !!__PORTFOLIO_POLLING_INTERVAL__
//         ? Number.parseInt(__PORTFOLIO_POLLING_INTERVAL__)
//         : ONE_MINUTE_MS,
//       typeof __TRANSACTION_POLLING_INTERVAL__ !== "undefined" &&
//       !!__TRANSACTION_POLLING_INTERVAL__
//         ? Number.parseInt(__TRANSACTION_POLLING_INTERVAL__)
//         : ONE_MINUTE_MS,
//       typeof __BACKUP_POLLING_INTERVAL__ !== "undefined" &&
//       !!__BACKUP_POLLING_INTERVAL__
//         ? Number.parseInt(__BACKUP_POLLING_INTERVAL__)
//         : ONE_MINUTE_MS,
//       typeof __ENABLE_BACKUP_ENCRYPTION__ !== "undefined" &&
//       !!__ENABLE_BACKUP_ENCRYPTION__
//         ? __ENABLE_BACKUP_ENCRYPTION__ == "true"
//         : false,
//       this._buildDiscordConfig(),
//       this._buildTwitterConfig(),
//       typeof __PRIMARY_INFURA_KEY__ !== "undefined" && !!__PRIMARY_INFURA_KEY__
//         ? __PRIMARY_INFURA_KEY__
//         : "a8ae124ed6aa44bb97a7166cda30f1bc",
//       typeof __DEV_CHAIN_PROVIDER_URL__ !== "undefined" &&
//       !!__DEV_CHAIN_PROVIDER_URL__
//         ? __DEV_CHAIN_PROVIDER_URL__
//         : ProviderUrl("https://doodlechain.dev.snickerdoodle.dev"),
//     );
//   }

//   public getConfig() {
//     return this.extensionConfig;
//   }

//   private _buildDiscordConfig(): Partial<DiscordConfig> {
//     const oauthRedirectUrl =
//       typeof __ONBOARDING_URL__ !== "undefined" && !!__ONBOARDING_URL__
//         ? URLString(
//             urlJoin(__ONBOARDING_URL__, "/data-dashboard/social-media-data"),
//           )
//         : URLString(
//             "https://datawallet.snickerdoodle.com/data-dashboard/social-media-data",
//           );

//     let discordConfig = {
//       oauthRedirectUrl,
//     } as Partial<DiscordConfig>;

//     if (
//       typeof __DISCORD_CLIENT_ID__ !== "undefined" &&
//       !!__DISCORD_CLIENT_ID__
//     ) {
//       discordConfig["clientId"] = __DISCORD_CLIENT_ID__;
//     }
//     if (
//       typeof __DISCORD_CLIENT_KEY__ !== "undefined" &&
//       !!__DISCORD_CLIENT_KEY__
//     ) {
//       discordConfig["client_secret"] = __DISCORD_CLIENT_KEY__;
//     }
//     if (
//       typeof __DISCORD_POLL_INTERVAL__ !== "undefined" &&
//       !!__DISCORD_POLL_INTERVAL__
//     ) {
//       discordConfig["pollInterval"] = parseInt(__DISCORD_POLL_INTERVAL__);
//     }

//     return discordConfig;
//   }

//   private _buildTwitterConfig(): Partial<TwitterConfig> {
//     const oauthRedirectUrl =
//       typeof __ONBOARDING_URL__ !== "undefined" && !!__ONBOARDING_URL__
//         ? URLString(
//             urlJoin(__ONBOARDING_URL__, "/data-dashboard/social-media-data"),
//           )
//         : URLString(
//             "https://datawallet.snickerdoodle.com/data-dashboard/social-media-data",
//           );

//     let twitterConfig = {
//       callbackUrl: URLString(oauthRedirectUrl),
//     } as Partial<TwitterConfig>;

//     if (
//       typeof __TWITTER_CONSUMER_KEY__ !== "undefined" &&
//       !!__TWITTER_CONSUMER_KEY__
//     ) {
//       twitterConfig["apiKey"] = __TWITTER_CONSUMER_KEY__;
//     }
//     if (
//       typeof __TWITTER_CONSUMER_SECRET__ !== "undefined" &&
//       !!__TWITTER_CONSUMER_SECRET__
//     ) {
//       twitterConfig["apiSecretKey"] = __TWITTER_CONSUMER_SECRET__;
//     }
//     if (
//       typeof __TWITTER_POLL_INTERVAL__ !== "undefined" &&
//       !!__TWITTER_POLL_INTERVAL__
//     ) {
//       twitterConfig["pollInterval"] = parseInt(__TWITTER_POLL_INTERVAL__);
//     }

//     return twitterConfig;
//   }
// }

// export const configProvider = new ConfigProvider();
