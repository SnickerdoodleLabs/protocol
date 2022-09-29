import { ResultAsync } from "neverthrow";

import { SolanaTransaction } from "@objects/businessObjects";
import { AccountIndexingError, AjaxError } from "@objects/errors";
import { ChainId, SolanaAccountAddress } from "@objects/primitives";

export interface ISolanaTransactionRepository {
  getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError>;
}

export const ISolanaTransactionRepositoryType = Symbol.for(
  "ISolanaTransactionRepository",
);
