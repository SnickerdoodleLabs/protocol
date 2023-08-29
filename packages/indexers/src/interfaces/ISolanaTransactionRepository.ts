import {
  ChainId,
  SolanaAccountAddress,
  SolanaTransaction,
  AccountIndexingError,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISolanaTransactionRepository {
  getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError>;
}
