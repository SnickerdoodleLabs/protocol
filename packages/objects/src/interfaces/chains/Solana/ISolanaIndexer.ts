import { ResultAsync } from "neverthrow";

import {
  SolanaNFT,
  SolanaTransaction,
  TokenBalanceWithOwnerAddress,
} from "@objects/businessObjects/index.js";
import { AccountIndexingError, AjaxError } from "@objects/errors/index.js";
import { IIndexer } from "@objects/interfaces/chains/IIndexer.js";
import { ChainId, SolanaAccountAddress } from "@objects/primitives/index.js";

export interface ISolanaIndexer extends IIndexer {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<
    TokenBalanceWithOwnerAddress[],
    AccountIndexingError | AjaxError
  >;
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
