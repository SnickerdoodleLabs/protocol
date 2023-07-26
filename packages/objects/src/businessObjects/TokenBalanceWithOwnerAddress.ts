import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { EChainTechnology } from "@objects/enum/index.js";
import { TokenBalance } from "@objects/businessObjects/TokenBalance.js";
import {
  AccountAddress,
  BigNumberString,
  ChainId,
  TickerSymbol,
} from "@objects/primitives/index.js";

/**
 This Object is exclusively for spa, should not be a part of a query response !
 */
export class TokenBalanceWithOwnerAddress extends TokenBalance {
  public constructor(
    type: EChainTechnology,
    ticker: TickerSymbol,
    chainId: ChainId,
    tokenAddress: TokenAddress = `native`,
    balance: BigNumberString,
    decimals: number,
    public ownerAddress: AccountAddress,
  ) {
    super(type, ticker, chainId, tokenAddress, balance, decimals);
  }
}
