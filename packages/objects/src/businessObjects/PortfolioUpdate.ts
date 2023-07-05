import { AccountAddress, ChainId } from "@objects/primitives";

export class PortfolioUpdate<T> {
  public constructor(
    public accountAddress: AccountAddress,
    public chainId: ChainId,
    public timestamp: number,
    public data: T,
  ) {}
}
