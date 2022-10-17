import { EChainTechnology } from "@objects/enum";
import { ITokenBalance } from "@objects/interfaces";
import {
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  TickerSymbol,
} from "@objects/primitives";

export class EVMBalance implements ITokenBalance {
  public type = EChainTechnology.EVM;

  public constructor(
    public ticker: TickerSymbol,
    public chainId: ChainId,
    public accountAddress: EVMAccountAddress,
    public balance: BigNumberString,
    public tokenAddress: EVMContractAddress,
    public quoteBalance: number,
  ) {}
}
