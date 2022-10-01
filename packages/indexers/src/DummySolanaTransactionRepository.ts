import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  ISolanaTransactionRepository,
  SolanaAccountAddress,
  SolanaTransaction,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class DummySolanaTransactionRepository
  implements ISolanaTransactionRepository
{
  public constructor() {}

  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AjaxError | AccountIndexingError> {
    return okAsync([]);
  }
}
