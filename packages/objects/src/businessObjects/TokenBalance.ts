import { BigNumber, utils } from "ethers";

import { TokenAddress } from "@objects/businessObjects";
import { EChainTechnology } from "@objects/enum";
import {
  AccountAddress,
  BigNumberString,
  ChainId,
  TickerSymbol,
} from "@objects/primitives";

export class TokenBalance {
  public constructor(
    public type: EChainTechnology,
    public ticker: TickerSymbol,
    public chainId: ChainId,
    public tokenAddress: TokenAddress | null, // null implies native
    public accountAddress: AccountAddress,
    public balance: BigNumberString,
    public decimals: number,
  ) {}
}

export function formatValue(balance: TokenBalance): BigNumberString {
  return BigNumberString(
    utils.formatUnits(BigNumber.from(balance.balance), balance.decimals),
  );
}
