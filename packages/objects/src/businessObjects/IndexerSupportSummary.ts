import { EChain } from "@objects/enum/index.js";

export class IndexerSupportSummary {
  public constructor(
    public chain: EChain,
    public balances: boolean,
    public transactions: boolean,
    public nfts: boolean,
  ) {}
}
