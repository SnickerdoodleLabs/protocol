import { EChain, EIndexer } from "@snickerdoodlelabs/objects";

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
    public transactionIndexer: EIndexer | null,
    public nftIndexer: EIndexer | null,
    public balanceIndexer: EIndexer | null,
  ) {}
}

export enum EComponentStatus {
  Disabled = "Disabled",
  InUse = "In Use",
  Available = "Available",
  Error = "Error",
  TemporarilyDisabled = "Temporarily Disabled",
}
