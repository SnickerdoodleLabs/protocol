import { ResultAsync } from "neverthrow";

import { AjaxError, BigNumberString, ChainId, EVMAccountAddress } from "../..";

import { AccountBalanceError } from "@objects/errors/AccountBalanceError";

export type TickerSymbol = string;
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
