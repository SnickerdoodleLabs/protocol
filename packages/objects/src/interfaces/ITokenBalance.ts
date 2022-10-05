import {
  BigNumberString,
  ChainId,
  EVMContractAddress,
  TickerSymbol,
} from "@objects/primitives";

export interface ITokenBalance {
  ticker: TickerSymbol;
  networkId: ChainId;
  address: EVMContractAddress; // This is the token contract address
  balance: BigNumberString;
}
