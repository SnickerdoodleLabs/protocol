import {
  AccountAddress,
  BigNumberString,
  ChainId,
  EVMContractAddress,
  SolanaTokenAddress,
  TickerSymbol,
} from "@objects/primitives";

export enum EBalanceType {
  EVM = "EVM",
  SOL = "SOL",
}

export type TokenAddress = EVMContractAddress | SolanaTokenAddress | string;

export interface ITokenBalance {
  type: EBalanceType;
  ticker: TickerSymbol;
  chainId: ChainId;
  tokenAddress: TokenAddress;
  accountAddress: AccountAddress;
  balance: BigNumberString;
  quoteBalance: number;
}
