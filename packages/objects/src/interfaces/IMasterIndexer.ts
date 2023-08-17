import { ResultAsync } from "neverthrow";

import {
  ChainTransaction,
  TokenBalance,
  WalletNFT,
} from "@objects/businessObjects/index.js";
import { EChain } from "@objects/enum/index.js";
import {
  AccountIndexingError,
  AjaxError,
  MethodSupportError,
  PersistenceError,
} from "@objects/errors/index.js";
import { AccountAddress, UnixTimestamp } from "@objects/primitives/index.js";

export interface IMasterIndexer {
  initialize(): ResultAsync<void, AjaxError>;
  getLatestBalances(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
  >;
  getLatestNFTs(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
  >;
  getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chain: EChain,
  ): ResultAsync<
    ChainTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
  getSupportedChains(): ResultAsync<EChain[], never>;
}

export const IMasterIndexerType = Symbol.for("IMasterIndexer");
