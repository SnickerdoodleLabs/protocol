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

export interface ISuiIndexer extends IIndexer {
  getBalancesForAccount(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError>;
  getTokensForAccount(
    chain: EChain,
    accountAddress: SuiAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError | AjaxError>;
  getSuiTransactions(
    chain: EChain,
    accountAddress: SuiAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<SuiTransaction[], AccountIndexingError | AjaxError>;
}
