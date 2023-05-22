import { ResultAsync } from "neverthrow";

import { ChainTransaction } from "@objects/businessObjects";
import { AccountIndexingError, AjaxError } from "@objects/errors";
import {
  IEVMTransactionRepository,
  ISolanaTransactionRepository,
} from "@objects/interfaces/chains";
import { AccountAddress, ChainId, UnixTimestamp } from "@objects/primitives";

export interface IAccountIndexing {
  getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<ChainTransaction[], AccountIndexingError | AjaxError>;
}

export const IAccountIndexingType = Symbol.for("IAccountIndexing");
