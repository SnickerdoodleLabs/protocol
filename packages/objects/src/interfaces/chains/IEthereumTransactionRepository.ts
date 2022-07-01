import { ResultAsync } from "neverthrow";

import { EVMTransaction } from "@core/businessObjects";
import { AccountIndexingError } from "@objects/errors";
import { BlockNumber, EVMAccountAddress } from "@objects/primatives";

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
