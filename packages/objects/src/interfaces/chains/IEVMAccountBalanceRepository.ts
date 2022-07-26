import { ResultAsync } from "neverthrow";

import { AccountBalanceError, AjaxError } from "@objects/errors";
import {
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  TickerSymbol,
} from "@objects/primitives";

export interface IEVMBalance {
  ticker: TickerSymbol;
  chainId: ChainId;
  accountAddress: EVMAccountAddress;
  balance: BigNumberString;
}

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AccountBalanceError | AjaxError>;
}
