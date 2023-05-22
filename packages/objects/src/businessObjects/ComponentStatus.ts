import { EChain, EIndexer, EProvider } from "@objects/enum";
export class ComponentStatus {
  public constructor(
    public primaryProvider: EComponentStatus,
    public secondaryProvider: EComponentStatus,
    public alchemyIndexer: EComponentStatus,
    public etherscanIndexer: EComponentStatus,
    public moralisIndexer: EComponentStatus,
    public nftScanIndexer: EComponentStatus,
    public oklinkIndexer: EComponentStatus,
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
  NoKeyProvided = "NoKeyProvided",

  Disabled = "Disabled",
  InUse = "In Use",
  TemporarilyDisabled = "Temporarily Disabled",
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
