import { ResultAsync } from "neverthrow";

import { AccountIndexingError, AjaxError } from "@core/errors";
import { EVMTransaction } from "@objects/businessObjects";
import { BlockNumber, EVMAccountAddress } from "@objects/primitives";

export interface IAvalancheEVMTransactionRepository {
  getEVMTransactions(
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError>;
}

export const IAvalancheEVMTransactionRepositoryType = Symbol.for(
  "IAvalancheEVMTransactionRepository",
);
