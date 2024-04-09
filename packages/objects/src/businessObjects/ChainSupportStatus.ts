import { EChain, EDataProvider } from "@objects/enum/index.js";

export class ChainSupportStatus {
  public constructor(
    public chain: EChain,
    public transactions: EDataProvider | null,
    public nfts: EDataProvider | null,
    public balances: EDataProvider | null,
  ) {}
}
