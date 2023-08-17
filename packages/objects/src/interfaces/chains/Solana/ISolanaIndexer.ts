import { ResultAsync } from "neverthrow";

import {
  SolanaNFT,
  SolanaTransaction,
  TokenBalance,
} from "@objects/businessObjects/index.js";
import { EChain } from "@objects/enum/index.js";
import { AccountIndexingError, AjaxError } from "@objects/errors/index.js";
import { IIndexer } from "@objects/interfaces/chains/IIndexer.js";
import { SolanaAccountAddress } from "@objects/primitives/index.js";

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
