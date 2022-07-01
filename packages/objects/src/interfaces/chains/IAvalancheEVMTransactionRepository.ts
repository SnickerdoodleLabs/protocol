import { ResultAsync } from "neverthrow";

import { AccountIndexingError } from "@core/errors";
import { EVMTransaction } from "@objects/businessObjects";
import { BlockNumber, EVMAccountAddress } from "@objects/primatives";

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
