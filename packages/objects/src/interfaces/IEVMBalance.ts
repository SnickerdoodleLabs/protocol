import {
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  TickerSymbol,
} from "@objects/primitives";

export interface IEVMBalance {
  ticker: TickerSymbol;
  chainId: ChainId;
  accountAddress: EVMAccountAddress;
  balance: BigNumberString; // TODO replace with a BigNumber type (please don't)
  tokenAddress: EVMContractAddress;
  quoteBalance: number;
}
