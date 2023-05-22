import { ResultAsync } from "neverthrow";

import { EVMNFT, EVMTransaction, TokenBalance } from "@objects/businessObjects";
import {
  AccountIndexingError,
  AjaxError,
  MethodSupportError,
} from "@objects/errors";
import { ChainId, EVMAccountAddress } from "@objects/primitives";

export interface IEVMIndexer {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalance[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
  getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<
    EVMTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
  healthCheck(): ResultAsync<string, AjaxError>;
}
