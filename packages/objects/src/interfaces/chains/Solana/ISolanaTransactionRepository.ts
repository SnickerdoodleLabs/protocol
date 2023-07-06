import { ResultAsync } from "neverthrow";

import { SolanaTransaction } from "@objects/businessObjects/index.js";
import { AccountIndexingError, AjaxError } from "@objects/errors/index.js";
import { ChainId, SolanaAccountAddress } from "@objects/primitives/index.js";

export interface ISolanaTransactionRepository {
  getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError>;
}
