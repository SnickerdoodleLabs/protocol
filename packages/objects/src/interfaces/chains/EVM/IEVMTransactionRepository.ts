import { ResultAsync } from "neverthrow";

import { EVMTransaction } from "@objects/businessObjects";
import { EChain } from "@objects/enum";
import { AccountIndexingError, AjaxError } from "@objects/errors";
import { BlockNumber, ChainId, EVMAccountAddress } from "@objects/primitives";

export interface IEVMTransactionRepository {
  getEVMTransactions(
    chainId: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError>;
}

export const IEVMTransactionRepositoryType = Symbol.for(
  "IEVMTransactionRepository",
);
