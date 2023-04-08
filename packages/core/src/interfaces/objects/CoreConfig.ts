import { IIndexerConfig } from "@snickerdoodlelabs/indexers";
import {
  ChainId,
  ChainInformation,
  ControlChainInformation,
  DiscordConfig,
  ECurrencyCode,
  URLString,
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
    public covalentApiKey: string,
    public moralisApiKey: string,
    public nftScanApiKey: string,
    public poapApiKey: string,
    public dnsServerAddress: URLString,
    public ceramicNodeURL: URLString,
    public quoteCurrency: ECurrencyCode,
    public etherscanApiKeys: Map<ChainId, string>,
    public etherscanTransactionsBatchSize: number,
    public requestForDataCheckingFrequency: number,
    public alchemyEndpoints: {
      solana: string;
      solanaTestnet: string;
      polygon: string;
      polygonMumbai: string;
    },
    public restoreTimeoutMS: number,
    public domainFilter: string,
    public enableBackupEncryption: boolean,
    public backupHeartbeatIntervalMS: number,
    public discord: DiscordConfig,
  ) {}
}
