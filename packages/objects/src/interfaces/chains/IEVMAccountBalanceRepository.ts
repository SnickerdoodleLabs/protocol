import { ResultAsync } from "neverthrow";
import { Brand, make } from "ts-brand";

import { AjaxError, BigNumberString, ChainId, EVMAccountAddress } from "../..";

import { AccountBalanceError } from "@objects/errors/AccountBalanceError";

export type TickerSymbol = Brand<string, "TickerSymbol">;
export const TickerSymbol = make<TickerSymbol>();

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
