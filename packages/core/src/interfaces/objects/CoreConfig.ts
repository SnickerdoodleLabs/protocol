import { MapModelTypes } from "@glazed/types";
import { ICircuitsSDKConfig } from "@snickerdoodlelabs/circuits-sdk";
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
  IApiKeys,
  ModelTypes,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfig } from "@snickerdoodlelabs/persistence";

import { MetatransactionGasAmounts } from "@core/interfaces/objects/MetatransactionGasAmounts.js";

export class CoreConfig
  implements IIndexerConfig, IPersistenceConfig, ICircuitsSDKConfig
{
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
    public questionnaireCacheUpdateIntervalMS: number,
    public backupChunkSizeTarget: number,
    public apiKeys: IApiKeys,
    public dnsServerAddress: URLString,
    public quoteCurrency: ECurrencyCode,
    public etherscanTransactionsBatchSize: number,
    public requestForDataPollingIntervalMS: number,
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
    public queryPerformanceMetricsLimit: number,
    public circuitsIpfsFetchBaseUrl: URLString,

    public ceramicModelAliases: MapModelTypes<ModelTypes, string>,
    public ceramicNodeURL: URLString,
  ) {}
}
