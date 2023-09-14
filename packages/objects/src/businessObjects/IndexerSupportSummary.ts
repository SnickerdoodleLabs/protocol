import { EChain, EIndexerMethod } from "@objects/enum/index.js";

export class IndexerSupportSummary {
  public constructor(
    public chain: EChain,
    public balances: boolean,
    public transactions: boolean,
    public nfts: boolean,
  ) {}

  // Static methods are safer on business objects, because they survive serialization.
  public static isMethodSupported(
    supportSummary: IndexerSupportSummary,
    method: EIndexerMethod,
  ): boolean {
    if (method == EIndexerMethod.Balances) {
      return supportSummary.balances;
    } else if (method == EIndexerMethod.Transactions) {
      return supportSummary.transactions;
    } else if (method == EIndexerMethod.NFTs) {
      return supportSummary.nfts;
    }
    return false;
  }
}
