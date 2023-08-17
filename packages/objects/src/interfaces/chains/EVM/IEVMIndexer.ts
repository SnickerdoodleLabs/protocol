import { ResultAsync } from "neverthrow";

import {
  EVMNFT,
  EVMTransaction,
  TokenBalance,
} from "@objects/businessObjects/index.js";
import { EChain, EComponentStatus } from "@objects/enum/index.js";
import {
  AccountIndexingError,
  AjaxError,
  MethodSupportError,
} from "@objects/errors/index.js";
import { IIndexer } from "@objects/interfaces/chains/IIndexer.js";
import { EVMAccountAddress } from "@objects/primitives/index.js";

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

  getHealthCheck(): ResultAsync<Map<EChain, EComponentStatus>, never>;
}

export const IAnkrIndexerType = Symbol.for("IAnkrIndexer");

export const IAlchemyIndexerType = Symbol.for("IAlchemyIndexer");

export const ICovalentEVMTransactionRepositoryType = Symbol.for(
  "ICovalentEVMTransactionRepository",
);

export const IDummySolanaIndexerType = Symbol.for("IDummySolanaIndexer");

export const IEtherscanIndexerType = Symbol.for("IEtherscanIndexer");

export const IMoralisEVMPortfolioRepositoryType = Symbol.for(
  "IMoralisEVMPortfolioRepository",
);

export const INftScanEVMPortfolioRepositoryType = Symbol.for(
  "INftScanEVMPortfolioRepository",
);

export const IOklinkIndexerType = Symbol.for("IOklinkIndexer");

export const IPoapRepositoryType = Symbol.for("IPoapRepository");

export const IPolygonIndexerType = Symbol.for("IPolygonIndexer");

export const ISimulatorEVMTransactionRepositoryType = Symbol.for(
  "ISimulatorEVMTransactionRepository",
);

export const ISolanaIndexerType = Symbol.for("ISolanaIndexer");
