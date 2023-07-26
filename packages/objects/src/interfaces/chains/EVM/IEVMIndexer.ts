import { ResultAsync } from "neverthrow";

import {
  EVMNFT,
  EVMTransaction,
  TokenBalanceWithOwnerAddress,
} from "@objects/businessObjects/index.js";
import {
  AccountIndexingError,
  AjaxError,
  MethodSupportError,
} from "@objects/errors/index.js";
import { IIndexer } from "@objects/interfaces/chains/IIndexer.js";
import { ChainId, EVMAccountAddress } from "@objects/primitives/index.js";

export interface IEVMIndexer extends IIndexer {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    TokenBalanceWithOwnerAddress[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  >;
  getEVMTransactions(
    chainId: ChainId,
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
