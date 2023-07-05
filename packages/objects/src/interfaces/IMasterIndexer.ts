import { ResultAsync } from "neverthrow";

import {
  ChainTransaction,
  TokenBalance,
  WalletNFT,
} from "@objects/businessObjects/index.js";
import {
  AccountIndexingError,
  AjaxError,
  MethodSupportError,
  PersistenceError,
} from "@objects/errors/index.js";
import {
  AccountAddress,
  ChainId,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export interface IMasterIndexer {
  initialize(): ResultAsync<void, AjaxError>;
  getLatestBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
  >;
  getLatestNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
  >;
  getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<
    ChainTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
}

export const IMasterIndexerType = Symbol.for("IMasterIndexer");
