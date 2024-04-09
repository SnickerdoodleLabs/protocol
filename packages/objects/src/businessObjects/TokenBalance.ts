import { formatUnits } from "ethers";

import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { EChain, EChainTechnology } from "@objects/enum/index.js";
import {
  AccountAddress,
  BigNumberString,
  DecimalString,
  TickerSymbol,
} from "@objects/primitives/index.js";

export class TokenBalance {
  public constructor(
    public type: EChainTechnology,
    public ticker: TickerSymbol,
    public chainId: EChain,
    public tokenAddress: TokenAddress,
    public accountAddress: AccountAddress,
    public balance: BigNumberString,
    public decimals: number,
  ) {}
}

export function formatValue(balance: TokenBalance): DecimalString {
  return DecimalString(formatUnits(BigInt(balance.balance), balance.decimals));
}
