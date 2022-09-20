import { BigNumber } from "@ethersproject/bignumber";
import { ResultAsync } from "neverthrow";

import { AccountBalanceError, AjaxError } from "@objects/errors";
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
  contractAddress: EVMContractAddress;
  quoteBalance: number;
}

export interface IChainTransactions {
  ticker: TickerSymbol;
  value: BigNumberString;
  count: BigNumberString;
}


export interface ITokenBalance {
  ticker: TickerSymbol;
  networkId: ChainId;
  address: EVMContractAddress; // This is the token contract address
  balance: BigNumberString;
}

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AccountBalanceError | AjaxError>;
}
