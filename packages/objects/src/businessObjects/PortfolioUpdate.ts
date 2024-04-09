import { EChain } from "@objects/enum/index.js";
import { AccountAddress } from "@objects/primitives/index.js";

export class PortfolioUpdate<T> {
  public constructor(
    public accountAddress: AccountAddress,
    public chain: EChain,
    public timestamp: number,
    public data: T,
  ) {}
}
