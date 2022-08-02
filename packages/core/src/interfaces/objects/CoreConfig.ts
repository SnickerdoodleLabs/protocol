import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { IIndexerConfig } from "@snickerdoodlelabs/indexers";
import {
  ChainId,
  ChainInformation,
  ControlChainInformation,
  URLString,
} from "@snickerdoodlelabs/objects";
import { IPersistenceConfig } from "@snickerdoodlelabs/persistence";

export class CoreConfig implements IIndexerConfig, IPersistenceConfig {
  public constructor(
    public controlChainId: ChainId,
    public supportedChains: ChainId[],
    public providerAddress: URLString,
    public chainInformation: Map<ChainId, ChainInformation>,
    public controlChainInformation: ControlChainInformation,
    public ipfsNodeAddress: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public snickerdoodleProtocolDomain: TypedDataDomain,
    public accountIndexingPollingIntervalMS: number,
    public accountBalancePollingIntervalMS: number,
    public accountNFTPollingIntervalMS: number,
    public covalentApiKey: string,
    public moralisApiKey: string,
    public dnsServerAddress: URLString,
  ) {}
}
