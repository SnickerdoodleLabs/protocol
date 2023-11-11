import { EChain, EComponentStatus } from "@objects/enum/index.js";

export class ComponentStatus {
  public constructor(
    public primaryProvider: EComponentStatus,
    public secondaryProvider: EComponentStatus,
    public ankrIndexer: Map<EChain, EComponentStatus>,
    public alchemyIndexer: Map<EChain, EComponentStatus>,
    public covalentIndexer: Map<EChain, EComponentStatus>,
    public etherscanIndexer: Map<EChain, EComponentStatus>,
    public maticIndexer: Map<EChain, EComponentStatus>,
    public moralisIndexer: Map<EChain, EComponentStatus>,
    public nftScanIndexer: Map<EChain, EComponentStatus>,
    public oklinkIndexer: Map<EChain, EComponentStatus>,
    public poapIndexer: Map<EChain, EComponentStatus>,
    public polygonIndexer: Map<EChain, EComponentStatus>,
    public simulatorIndexer: Map<EChain, EComponentStatus>,
    public solanaIndexer: Map<EChain, EComponentStatus>,
    public blockvisionIndexer: Map<EChain, EComponentStatus>,
    public sxtIndexer: Map<EChain, EComponentStatus>,
  ) {}
}

export class EProviderFunctions {
  public constructor(
    public balances: EIndexerFunction | null,
    public nft: EIndexerFunction | null,
    public transactions: EIndexerFunction | null,
  ) {}
}

export enum EIndexerFunction {
  Available = "Available",
  Error = "Error",
  NoKeyProvided = "NoKeyProvided",

  Disabled = "Disabled",
  InUse = "In Use",
  TemporarilyDisabled = "Temporarily Disabled",
}
