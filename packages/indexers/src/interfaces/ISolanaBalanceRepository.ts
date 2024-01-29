import {
  ChainId,
  SolanaAccountAddress,
  AccountIndexingError,
  AjaxError,
  TokenBalance,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISolanaBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError>;
}
