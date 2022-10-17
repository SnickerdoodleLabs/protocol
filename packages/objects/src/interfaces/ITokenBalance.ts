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

export interface ITokenBalance {
  type: EChainTechnology;
  ticker: TickerSymbol;
  chainId: ChainId;
  tokenAddress: TokenAddress;
  accountAddress: AccountAddress;
  balance: BigNumberString;
  quoteBalance: number;
}
