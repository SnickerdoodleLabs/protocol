import { ResultAsync } from "neverthrow";

import { EVMTransaction } from "@core/businessObjects";
import { AccountIndexingError, AjaxError } from "@objects/errors";
import { BlockNumber, EVMAccountAddress } from "@objects/primitives";

export interface IEthereumEVMTransactionRepository {
  getEVMTransactions(
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError>;
}

export const IEthereumEVMTransactionRepositoryType = Symbol.for(
  "IEthereumEVMTransactionRepository",
);
