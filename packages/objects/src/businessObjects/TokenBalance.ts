import { BigNumber, utils } from "ethers";

import { TokenAddress } from "@objects/businessObjects/TokenAddress.js";
import { EChain, EChainTechnology } from "@objects/enum/index.js";
import {
  AccountAddress,
  BigNumberString,
  DecimalString,
  SuiAccountAddress,
  TickerSymbol,
} from "@objects/primitives/index.js";

export class TokenBalance {
  public constructor(
    public type: EChainTechnology,
    public ticker: TickerSymbol,
    public chainId: EChain,
    public tokenAddress: TokenAddress,
    public accountAddress: AccountAddress | SuiAccountAddress,
    public balance: BigNumberString,
    public decimals: number,
  ) {}
}

export function formatValue(balance: TokenBalance): DecimalString {
  return DecimalString(
    utils.formatUnits(BigNumber.from(balance.balance), balance.decimals),
  );
}
