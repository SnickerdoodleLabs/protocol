import {
  EChain,
  EVMAccountAddress,
  AccountIndexingError,
  AjaxError,
  MethodSupportError,
  EVMNFT,
  EVMTransaction,
  TokenBalance,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IIndexer } from "@indexers/interfaces/IIndexer.js";

export interface IEVMIndexer extends IIndexer {
  getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalance[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
  getTokensForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
  getEVMTransactions(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<
    EVMTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
}

export const IAnkrIndexerType = Symbol.for("IAnkrIndexer");
export const IAlchemyIndexerType = Symbol.for("IAlchemyIndexer");
export const IBlockvisionIndexerType = Symbol.for("IBlockvisionIndexer");

export const IBluezIndexerType = Symbol.for("IBluezIndexer");
export const ICovalentEVMTransactionRepositoryType = Symbol.for(
  "ICovalentEVMTransactionRepository",
);

export const IDummySolanaIndexerType = Symbol.for("IDummySolanaIndexer");

export const IEtherscanIndexerType = Symbol.for("IEtherscanIndexer");

export const IExpandIndexerType = Symbol.for("IExpandIndexerType");

export const IMoralisEVMPortfolioRepositoryType = Symbol.for(
  "IMoralisEVMPortfolioRepository",
);

export const INftScanEVMPortfolioRepositoryType = Symbol.for(
  "INftScanEVMPortfolioRepository",
);

export const IOklinkIndexerType = Symbol.for("IOklinkIndexer");

export const IPoapRepositoryType = Symbol.for("IPoapRepository");

export const IPolygonIndexerType = Symbol.for("IPolygonIndexer");

export const IRaribleIndexerType = Symbol.for("IRaribleIndexer");

export const ISimulatorEVMTransactionRepositoryType = Symbol.for(
  "ISimulatorEVMTransactionRepository",
);

export const ISpaceAndTimeIndexerType = Symbol.for("ISpaceAndTimeIndexer");

export const ISolanaIndexerType = Symbol.for("ISolanaIndexer");
