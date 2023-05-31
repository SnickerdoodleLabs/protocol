import { EChain, EIndexer, EProvider } from "@objects/enum";
export class ComponentStatus {
  public constructor(
    public primaryProvider: EComponentStatus,
    public secondaryProvider: EComponentStatus,
    public alchemyIndexer: Map<EChain, EComponentStatus>,
    public etherscanIndexer: Map<EChain, EComponentStatus>,
    public moralisIndexer: Map<EChain, EComponentStatus>,
    public nftScanIndexer: Map<EChain, EComponentStatus>,
    public oklinkIndexer: Map<EChain, EComponentStatus>,
    public chainStatus: ChainComponentStatus[],
  ) {}
}
export class ChainComponentStatus {
  public constructor(
    public chain: EChain,
    public transactionIndexer: EProvider | null,
    public nftIndexer: EProvider | null,
    public balanceIndexer: EProvider | null,
  ) {}
}
export enum EComponentStatus {
  Available = "Available",
  Error = "Error",
  Disabled = "Disabled",
  InUse = "In Use",
  TemporarilyDisabled = "Temporarily Disabled",

  NoKeyProvided = "NoKeyProvided",
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

export class IndexerSupportSummary {
  public constructor(
    public chain: EChain,
    public balances: boolean,
    public transactions: boolean,
    public nfts: boolean,
  ) {}
}
