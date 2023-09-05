import { IIndexerConfig } from "@snickerdoodlelabs/indexers";
import {
  ControlChainInformation,
  DiscordConfig,
  ECurrencyCode,
  TwitterConfig,
  URLString,
  EChain,
  ProviderUrl,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfig } from "@snickerdoodlelabs/persistence";

import { MetatransactionGasAmounts } from "@core/interfaces/objects/MetatransactionGasAmounts.js";

export class CoreConfig implements IIndexerConfig, IPersistenceConfig {
  public constructor(
    public controlChainId: EChain,
    public controlChainInformation: ControlChainInformation,
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,

    public defaultGoogleCloudBucket: string,
    public dropboxAppKey: string,
    public dropboxAppSecret: string,
    public dropboxRedirectUri: string,

    public accountIndexingPollingIntervalMS: number,
    public accountBalancePollingIntervalMS: number,
    public accountNFTPollingIntervalMS: number,
    public dataWalletBackupIntervalMS: number,
    public backupChunkSizeTarget: number,
    public apiKeys: {
      alchemyApiKeys: {
        Arbitrum: string | null;
        Astar: string | null;
        Mumbai: string | null;
        Optimism: string | null;
        Polygon: string | null;
        Solana: string | null;
        SolanaTestnet: string | null;
      };
      etherscanApiKeys: {
        Ethereum: string | null;
        Polygon: string | null;
        Avalanche: string | null;
        Binance: string | null;
        Moonbeam: string | null;
        Optimism: string | null;
        Arbitrum: string | null;
        Gnosis: string | null;
        Fuji: string | null;
      };
      covalentApiKey: string | null;
      moralisApiKey: string | null;
      nftScanApiKey: string | null;
      poapApiKey: string | null;
      oklinkApiKey: string | null;
      ankrApiKey: string | null;
      primaryInfuraKey: string | null;
      primaryRPCProviderURL: ProviderUrl | null;
      secondaryInfuraKey: string | null;
      secondaryRPCProviderURL: ProviderUrl | null;
    },
    public dnsServerAddress: URLString,
    public quoteCurrency: ECurrencyCode,
    public etherscanTransactionsBatchSize: number,
    public requestForDataCheckingFrequency: number,
    public alchemyEndpoints: Map<EChain, URLString>,
    public restoreTimeoutMS: number,
    public domainFilter: string,
    public enableBackupEncryption: boolean,
    public marketplaceListingsCacheTime: number,
    public backupHeartbeatIntervalMS: number,
    public discord: DiscordConfig,
    public twitter: TwitterConfig,
    public heartbeatIntervalMS: number,
    public gasAmounts: MetatransactionGasAmounts,
    public devChainProviderURL: ProviderUrl | null,
    public maxStatsRetentionSeconds: number,
    public passwordLanguageCode: LanguageCode,
  ) {}
}
