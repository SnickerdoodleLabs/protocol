import { EBalanceType, ITokenBalance, TokenAddress } from "@objects/interfaces";
import {
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  TickerSymbol,
} from "@objects/primitives";

export class EVMBalance implements ITokenBalance {
  public type = EBalanceType.EVM;

  public constructor(
    public ticker: TickerSymbol,
    public chainId: ChainId,
    public accountAddress: EVMAccountAddress,
    public balance: BigNumberString,
    public tokenAddress: EVMContractAddress,
    public quoteBalance: number,
  ) {}
}
