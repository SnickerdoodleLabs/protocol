import {
  AccountAddress,
  AccountIndexingError,
  AjaxError,
  ChainTransaction,
  EChain,
  EIndexerMethod,
  InvalidParametersError,
  MethodSupportError,
  PersistenceError,
  TokenBalance,
  UnixTimestamp,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMasterIndexer {
  initialize(): ResultAsync<void, AjaxError>;
  getLatestBalances(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  >;
  getLatestNFTs(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  >;
  getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chain: EChain,
  ): ResultAsync<
    ChainTransaction[],
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  >;
  getSupportedChains(method?: EIndexerMethod): ResultAsync<EChain[], never>;
}

export const IMasterIndexerType = Symbol.for("IMasterIndexer");
