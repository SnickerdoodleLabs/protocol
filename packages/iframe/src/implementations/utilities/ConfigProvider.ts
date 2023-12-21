import {
  ChainId,
  DomainName,
  LanguageCode,
  ProviderUrl,
  URLString,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { IFrameConfig } from "@core-iframe/interfaces/objects";
import { IConfigProvider } from "@core-iframe/interfaces/utilities/index";

declare const __CONTROL_CHAIN_ID__: string;
declare const __IPFS_FETCH_BASE_URL__: URLString;
declare const __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: URLString;
declare const __DEV_CHAIN_PROVIDER_URL__: ProviderUrl;
declare const __PORTFOLIO_POLLING_INTERVAL__: string;
declare const __NFT_POLLING_INTERVAL__: string;
declare const __TRANSACTION_POLLING_INTERVAL__: string;
declare const __BACKUP_POLLING_INTERVAL__: string;
declare const __REQUEST_FOR_DATA_POLLING_INTERVAL__: string;
declare const __PRIMARY_INFURA_KEY__: string;
declare const __PRIMARY_RPC_PROVIDER_URL__: ProviderUrl;
declare const __SECONDARY_INFURA_KEY__: string;
declare const __SECONDARY_RPC_PROVIDER_URL__: ProviderUrl;
declare const __ALCHEMY_ARBITRUM_API_KEY__: string;
declare const __ALCHEMY_ASTAR_API_KEY__: string;
declare const __ALCHEMY_MUMBAI_API_KEY__: string;
declare const __ALCHEMY_OPTIMISM_API_KEY__: string;
declare const __ALCHEMY_POLYGON_API_KEY__: string;
declare const __ALCHEMY_SOLANA_API_KEY__: string;
declare const __ALCHEMY_SOLANA_TESTNET_API_KEY__: string;
declare const __ETHERSCAN_ETHEREUM_API_KEY__: string;
declare const __ETHERSCAN_POLYGON_API_KEY__: string;
declare const __ETHERSCAN_AVALANCHE_API_KEY__: string;
declare const __ETHERSCAN_BINANCE_API_KEY__: string;
declare const __ETHERSCAN_MOONBEAM_API_KEY__: string;
declare const __ETHERSCAN_OPTIMISM_API_KEY__: string;
declare const __ETHERSCAN_ARBITRUM_API_KEY__: string;
declare const __ETHERSCAN_GNOSIS_API_KEY__: string;
declare const __ETHERSCAN_FUJI_API_KEY__: string;
declare const __COVALENT_API_KEY__: string;
declare const __MORALIS_API_KEY__: string;
declare const __NFTSCAN_API_KEY__: string;
declare const __POAP_API_KEY__: string;
declare const __OKLINK_API_KEY__: string;
declare const __ANKR_API_KEY__: string;
declare const __BLUEZ_API_KEY__: string;
declare const __RARIBILE_API_KEY__: string;
declare const __SPACEANDTIME_API_KEY__: string;
declare const __BLOCKVISION_API_KEY__: string;

const ONE_MINUTE_MS = 60000;

@injectable()
export class ConfigProvider implements IConfigProvider {
  protected config: IFrameConfig;

  public constructor() {
    this.config = new IFrameConfig(
      ChainId(Number(__CONTROL_CHAIN_ID__)),
      __DEV_CHAIN_PROVIDER_URL__ != null && __DEV_CHAIN_PROVIDER_URL__ != ""
        ? __DEV_CHAIN_PROVIDER_URL__
        : null,
      __IPFS_FETCH_BASE_URL__,
      __DEFAULT_INSIGHT_PLATFORM_BASE_URL__,
      // we gonna overide this once handshake is completed
      DomainName(window.location.origin), // Placaholder sourcedomain
      LanguageCode("en"), // This may come in from the URL
      typeof __PORTFOLIO_POLLING_INTERVAL__ !== "undefined" &&
      !!__PORTFOLIO_POLLING_INTERVAL__
        ? Number.parseInt(__PORTFOLIO_POLLING_INTERVAL__)
        : ONE_MINUTE_MS, // portfolioPollingIntervalMS
      typeof __NFT_POLLING_INTERVAL__ !== "undefined" &&
      !!__NFT_POLLING_INTERVAL__
        ? Number.parseInt(__NFT_POLLING_INTERVAL__)
        : 5 * ONE_MINUTE_MS,
      typeof __TRANSACTION_POLLING_INTERVAL__ !== "undefined" &&
      !!__TRANSACTION_POLLING_INTERVAL__
        ? Number.parseInt(__TRANSACTION_POLLING_INTERVAL__)
        : ONE_MINUTE_MS, // transactionPollingIntervalMS
      typeof __BACKUP_POLLING_INTERVAL__ !== "undefined" &&
      !!__BACKUP_POLLING_INTERVAL__
        ? Number.parseInt(__BACKUP_POLLING_INTERVAL__)
        : ONE_MINUTE_MS, // backupPollingIntervalMS
      typeof __REQUEST_FOR_DATA_POLLING_INTERVAL__ !== "undefined" &&
      !!__REQUEST_FOR_DATA_POLLING_INTERVAL__
        ? Number.parseInt(__REQUEST_FOR_DATA_POLLING_INTERVAL__)
        : 300000, // requestForDataPollingIntervalMS
      {
        primaryInfuraKey:
          __PRIMARY_INFURA_KEY__ == "" ? null : __PRIMARY_INFURA_KEY__,
        primaryRPCProviderURL:
          __PRIMARY_RPC_PROVIDER_URL__ == ""
            ? null
            : __PRIMARY_RPC_PROVIDER_URL__,
        secondaryInfuraKey:
          __SECONDARY_INFURA_KEY__ == "" ? null : __SECONDARY_INFURA_KEY__,
        secondaryRPCProviderURL:
          __SECONDARY_RPC_PROVIDER_URL__ == ""
            ? null
            : __SECONDARY_RPC_PROVIDER_URL__,
        alchemyApiKeys: {
          Arbitrum:
            __ALCHEMY_ARBITRUM_API_KEY__ == ""
              ? null
              : __ALCHEMY_ARBITRUM_API_KEY__,
          Astar:
            __ALCHEMY_ASTAR_API_KEY__ == "" ? null : __ALCHEMY_ASTAR_API_KEY__,
          Mumbai:
            __ALCHEMY_MUMBAI_API_KEY__ == ""
              ? null
              : __ALCHEMY_MUMBAI_API_KEY__,
          Optimism:
            __ALCHEMY_OPTIMISM_API_KEY__ == ""
              ? null
              : __ALCHEMY_OPTIMISM_API_KEY__,
          Polygon:
            __ALCHEMY_POLYGON_API_KEY__ == ""
              ? null
              : __ALCHEMY_POLYGON_API_KEY__,
          Solana:
            __ALCHEMY_SOLANA_API_KEY__ == ""
              ? null
              : __ALCHEMY_SOLANA_API_KEY__,
          SolanaTestnet:
            __ALCHEMY_SOLANA_TESTNET_API_KEY__ == ""
              ? null
              : __ALCHEMY_SOLANA_TESTNET_API_KEY__,
        },
        etherscanApiKeys: {
          Ethereum:
            __ETHERSCAN_ETHEREUM_API_KEY__ == ""
              ? null
              : __ETHERSCAN_ETHEREUM_API_KEY__,
          Polygon:
            __ETHERSCAN_POLYGON_API_KEY__ == ""
              ? null
              : __ETHERSCAN_POLYGON_API_KEY__,
          Avalanche:
            __ETHERSCAN_AVALANCHE_API_KEY__ == ""
              ? null
              : __ETHERSCAN_AVALANCHE_API_KEY__,
          Binance:
            __ETHERSCAN_BINANCE_API_KEY__ == ""
              ? null
              : __ETHERSCAN_BINANCE_API_KEY__,
          Moonbeam:
            __ETHERSCAN_MOONBEAM_API_KEY__ == ""
              ? null
              : __ETHERSCAN_MOONBEAM_API_KEY__,
          Optimism:
            __ETHERSCAN_OPTIMISM_API_KEY__ == ""
              ? null
              : __ETHERSCAN_OPTIMISM_API_KEY__,
          Arbitrum:
            __ETHERSCAN_ARBITRUM_API_KEY__ == ""
              ? null
              : __ETHERSCAN_ARBITRUM_API_KEY__,
          Gnosis:
            __ETHERSCAN_GNOSIS_API_KEY__ == ""
              ? null
              : __ETHERSCAN_GNOSIS_API_KEY__,
          Fuji:
            __ETHERSCAN_FUJI_API_KEY__ == ""
              ? null
              : __ETHERSCAN_FUJI_API_KEY__,
        },
        covalentApiKey:
          __COVALENT_API_KEY__ == "" ? null : __COVALENT_API_KEY__,
        moralisApiKey: __MORALIS_API_KEY__ == "" ? null : __MORALIS_API_KEY__,
        nftScanApiKey: __NFTSCAN_API_KEY__ == "" ? null : __NFTSCAN_API_KEY__,
        poapApiKey: __POAP_API_KEY__ == "" ? null : __POAP_API_KEY__,
        oklinkApiKey: __OKLINK_API_KEY__ == "" ? null : __OKLINK_API_KEY__,
        ankrApiKey: __ANKR_API_KEY__ == "" ? null : __ANKR_API_KEY__,
        bluezApiKey: __BLUEZ_API_KEY__ == "" ? null : __BLUEZ_API_KEY__,
        raribleApiKey: __RARIBILE_API_KEY__ == "" ? null : __RARIBILE_API_KEY__,
        spaceAndTimeKey:
          __SPACEANDTIME_API_KEY__ == "" ? null : __SPACEANDTIME_API_KEY__,
        blockvisionKey:
          __BLOCKVISION_API_KEY__ == "" ? null : __BLOCKVISION_API_KEY__,
      }, // defaultKeys
    );
  }

  overrideSourceDomain(domain: DomainName): void {
    this.config.sourceDomain = domain;
  }

  getConfig(): IFrameConfig {
    return this.config;
  }
}
