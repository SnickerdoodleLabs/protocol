import { TokenAddress } from "@objects/businessObjects";
import { ChainId, TickerSymbol } from "@objects/primitives";

export class TokenInfo {
  public constructor(
    public id: string,
    public symbol: TickerSymbol,
    public name: string,
    public chain: ChainId,
    public address: TokenAddress,
  ) {}
}
