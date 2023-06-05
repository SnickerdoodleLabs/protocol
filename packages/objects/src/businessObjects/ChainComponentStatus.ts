import { EChain, EDataProvider } from "@objects/enum";

export class ChainComponentStatus {
  public constructor(
    public chain: EChain,
    public transactionIndexer: EDataProvider | null,
    public nftIndexer: EDataProvider | null,
    public balanceIndexer: EDataProvider | null,
  ) {}
}
