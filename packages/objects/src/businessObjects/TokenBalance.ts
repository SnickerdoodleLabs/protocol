import { TokenAddress } from "@objects/businessObjects";
import { EChainTechnology } from "@objects/enum";
import {
  AccountAddress,
  BigNumberString,
  ChainId,
  EVMContractAddress,
  SolanaTokenAddress,
  TickerSymbol,
} from "@objects/primitives";

export class TokenBalance {
  public constructor(
    public type: EChainTechnology,
    public ticker: TickerSymbol,
    public chainId: ChainId,
    public tokenAddress: TokenAddress | null,
    public accountAddress: AccountAddress,
    public balance: BigNumberString,
    public quoteBalance: BigNumberString,
  ) {}
}
