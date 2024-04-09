import {
  EChain,
  SolanaAccountAddress,
  AccountIndexingError,
  AjaxError,
  SolanaNFT,
  SolanaTransaction,
  TokenBalance,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IIndexer } from "./IIndexer";

export interface ISolanaIndexer extends IIndexer {
  getBalancesForAccount(
    chain: EChain,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError>;
  getTokensForAccount(
    chain: EChain,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError | AjaxError>;
  getSolanaTransactions(
    chain: EChain,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError>;
}
