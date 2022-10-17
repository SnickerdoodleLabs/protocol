import { EChainTechnology } from "@objects/enum";
import { ITokenBalance } from "@objects/interfaces";
import {
  BigNumberString,
  ChainId,
  SolanaAccountAddress,
  SolanaTokenAddress,
  TickerSymbol,
} from "@objects/primitives";

export class SolanaBalance implements ITokenBalance {
  public type = EChainTechnology.Solana;

  public constructor(
    public ticker: TickerSymbol,
    public chainId: ChainId,
    public balance: BigNumberString,
    public tokenAddress: SolanaTokenAddress,
    public accountAddress: SolanaAccountAddress,
    public quoteBalance: number,
  ) {}
}
