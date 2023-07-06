import { IIndexerConfig } from "@snickerdoodlelabs/indexers";
import {
  ChainId,
  ChainInformation,
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

export class CoreConfig implements IIndexerConfig, IPersistenceConfig {
  public constructor(
    public controlChainId: ChainId,
    public supportedChains: ChainId[],
    public chainInformation: Map<ChainId, ChainInformation>,
    public controlChainInformation: ControlChainInformation,
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public defaultGoogleCloudBucket: string,
    public accountIndexingPollingIntervalMS: number,
    public accountBalancePollingIntervalMS: number,
    public accountNFTPollingIntervalMS: number,
    public dataWalletBackupIntervalMS: number,
    public backupChunkSizeTarget: number,
    public cloudStorageKey: string,
    public apiKeys: {
      alchemyApiKeys: {
        Arbitrum: string;
        Astar: string;
        Mumbai: string;
        Optimism: string;
        Polygon: string;
        Solana: string;
        SolanaTestnet: string;
      };
      etherscanApiKeys: {
        Ethereum: string;
        Polygon: string;
        Avalanche: string;
        Binance: string;
        Moonbeam: string;
        Optimism: string;
        Arbitrum: string;
        Gnosis: string;
        Fuji: string;
      };
      covalentApiKey: string;
      moralisApiKey: string;
      nftScanApiKey: string;
      poapApiKey: string;
      oklinkApiKey: string;
      primaryInfuraKey: string;
      secondaryInfuraKey: string;
      ankrApiKey: string;
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
    public devChainProviderURL: ProviderUrl,
    public maxStatsRetentionSeconds: number,
    public passwordLanguageCode: LanguageCode,
  ) {}
}

export class MetatransactionGasAmounts {
  public constructor(
    public createCrumbGas: number,
    public removeCrumbGas: number,
    public optInGas: number,
    public optOutGas: number,
    public updateAgreementFlagsGas: number,
  ) {}
}
