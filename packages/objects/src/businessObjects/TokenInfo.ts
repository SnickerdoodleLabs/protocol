import { TokenAddress } from "@objects/businessObjects";
import { EChain } from "@objects/enum";
import { TickerSymbol } from "@objects/primitives";

export class TokenInfo {
  public constructor(
    public id: string,
    public symbol: TickerSymbol,
    public name: string,
    public chain: EChain,
    public address: TokenAddress,
  ) {}
}
