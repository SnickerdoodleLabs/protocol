import { ResultAsync } from "neverthrow";

import {
  SolanaNFT,
  SolanaTransaction,
  TokenBalance,
} from "@objects/businessObjects/index.js";
import { AccountIndexingError, AjaxError } from "@objects/errors/index.js";
import { IIndexer } from "@objects/interfaces/chains/IIndexer.js";
import { ChainId, SolanaAccountAddress } from "@objects/primitives/index.js";

export interface ISolanaIndexer extends IIndexer {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError>;
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError | AjaxError>;
  getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError>;
}
