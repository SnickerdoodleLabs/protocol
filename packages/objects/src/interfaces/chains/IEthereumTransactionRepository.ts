import { ResultAsync } from "neverthrow";

import { EVMTransaction } from "@objects/businessObjects";
import { AccountIndexingError } from "@objects/errors";
import { BlockNumber, EVMAccountAddress } from "@objects/primitives";

export interface IEthereumEVMTransactionRepository {
  getEVMTransactions(
    accountAddress: EVMAccountAddress,
    firstBlock: BlockNumber,
    lastBlock?: BlockNumber,
  ): ResultAsync<EVMTransaction[], AccountIndexingError>;
}

export const IEthereumEVMTransactionRepositoryType = Symbol.for(
  "IEthereumEVMTransactionRepository",
);
