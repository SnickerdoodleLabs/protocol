import {
  ISolanaBalanceRepository,
  ISolanaTransactionRepository,
  ISolanaNFTRepository,
  AccountBalanceError,
  AjaxError,
  ChainId,
  SolanaAccountAddress,
  SolanaBalance,
  AccountNFTError,
  SolanaNFT,
  AccountIndexingError,
  SolanaTransaction,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class DummySolanaIndexer
  implements
    ISolanaBalanceRepository,
    ISolanaNFTRepository,
    ISolanaTransactionRepository
{
  public constructor() {}
  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaBalance[], AjaxError | AccountBalanceError> {
    return okAsync([]);
  }
  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountNFTError | AjaxError> {
    return okAsync([]);
  }
  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AjaxError | AccountIndexingError> {
    return okAsync([]);
  }
}
