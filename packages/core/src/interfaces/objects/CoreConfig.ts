import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { MapModelTypes } from "@glazed/types";
import { IIndexerConfig } from "@snickerdoodlelabs/indexers";
import {
  ChainId,
  ChainInformation,
  ControlChainInformation,
  ModelTypes,
  URLString,
  ECurrencyCode,
  EChain,
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
    public accountIndexingPollingIntervalMS: number,
    public accountBalancePollingIntervalMS: number,
    public accountNFTPollingIntervalMS: number,
    public dataWalletBackupIntervalMS: number,
    public backupChunkSizeTarget: number,
    public covalentApiKey: string,
    public moralisApiKey: string,
    public dnsServerAddress: URLString,
    public ceramicModelAliases: MapModelTypes<ModelTypes, string>,
    public ceramicNodeURL: URLString,
    public quoteCurrency: ECurrencyCode,
    public etherscanApiKey: string,
    public etherscanTransactionsBatchSize: number,
    public requestForDataCheckingFrequency: number,
  ) {}
}
