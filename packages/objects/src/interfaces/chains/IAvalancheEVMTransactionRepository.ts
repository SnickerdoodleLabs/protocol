import { ResultAsync } from "neverthrow";

import { EVMTransaction } from "@objects/businessObjects";
import { AccountIndexingError } from "@objects/errors";
import { BlockNumber, EVMAccountAddress } from "@objects/primitives";

export interface IAvalancheEVMTransactionRepository {
  getEthereumTransactions(
    accountAddress: EVMAccountAddress,
    firstBlock: BlockNumber,
    lastBlock?: BlockNumber,
  ): ResultAsync<EVMTransaction[], AccountIndexingError>;
}

export const IAvalancheEVMTransactionRepositoryType = Symbol.for(
  "IAvalancheEVMTransactionRepository",
);
