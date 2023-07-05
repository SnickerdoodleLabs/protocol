import {
  BigNumberString,
  ChainId,
  EVMContractAddress,
  TickerSymbol,
} from "@objects/primitives/index.js";

export interface ITokenBalance {
  ticker: TickerSymbol;
  networkId: ChainId;
  address: EVMContractAddress; // This is the token contract address
  balance: BigNumberString;
}
