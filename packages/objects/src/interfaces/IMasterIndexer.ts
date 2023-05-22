import { ResultAsync } from "neverthrow";

import {
  ChainTransaction,
  TokenBalance,
  WalletNFT,
} from "@objects/businessObjects";
import {
  AccountIndexingError,
  AjaxError,
  PersistenceError,
} from "@objects/errors";
import { AccountAddress, ChainId, UnixTimestamp } from "@objects/primitives";

export interface IMasterIndexer {
  getLatestBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  >;
  getLatestNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError
  >;
  getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<ChainTransaction[], AccountIndexingError | AjaxError>;
}

export const IMasterIndexerType = Symbol.for("IMasterIndexer");
