import {
  TransactionPaymentCounter,
  PersistenceError,
  ChainId,
  AccountAddress,
  ChainTransaction,
  chainConfig,
  EVMTransaction,
  TransactionFilter,
  ERecordKey,
  getChainInfoByChain,
  EChain,
  TransactionFlowInsight,
  TransactionMetrics,
  LinkedAccount,
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  IVolatileCursor,
} from "@snickerdoodlelabs/persistence";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  ITransactionHistoryRepository,
} from "@core/interfaces/data/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class TransactionHistoryRepository
  implements ITransactionHistoryRepository
{
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
  ) {}

  public getTransactionByChain(): ResultAsync<
    TransactionFlowInsight[],
    PersistenceError
  > {
    return this.accountRepo.getAccounts().andThen((accounts) => {
      return ResultUtils.combine(
        accounts.map((account) => {
          return this.getTransactionFlowsByAccount(account);
        }),
      ).map((arrayOfTransactionFlowMap) => {
        return this.aggregateTransactionFlowsArrays(arrayOfTransactionFlowMap);
      });
    });
  }

  public addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError> {
    if (transactions.length == 0) {
      return okAsync(undefined);
    }

    return ResultUtils.combine(
      transactions.map((tx) => {
        return this.persistence.updateRecord(ERecordKey.TRANSACTIONS, tx);
      }),
    ).map(() => {});
  }

  public getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError> {
    return this.persistence
      .getAll<ChainTransaction>(ERecordKey.TRANSACTIONS)
      .map((transactions) => {
        if (filter == undefined) {
          return transactions;
        }
        return transactions.filter((value) => filter.matches(value));
      });
  }

  public getLatestTransactionForAccount(
    chainId: ChainId,
    address: AccountAddress,
  ): ResultAsync<ChainTransaction | null, PersistenceError> {
    // TODO: add multikey support to cursor function
    return this.persistence
      .getCursor<ChainTransaction>(
        ERecordKey.TRANSACTIONS,
        "timestamp",
        undefined,
        "prev",
      )
      .andThen((cursor) => {
        const filter = new TransactionFilter([chainId], [address]);
        return this._getNextMatchingTx(cursor, filter);
      });
  }

  public getTransactionsMap(): ResultAsync<
    Map<ChainId, number>,
    PersistenceError
  > {
    const chains = Array.from(chainConfig.keys());
    return ResultUtils.combine(
      chains.map((chain) => {
        return this.persistence
          .getAllKeys(ERecordKey.TRANSACTIONS, "chainId", chain)
          .andThen((keys) => {
            return okAsync([chain, keys.length]);
          });
      }),
    ).andThen((result) => {
      const returnVal = new Map<ChainId, number>();
      result.forEach((elem) => {
        const [chain, num] = elem;
        returnVal[chain] = num;
      });
      return okAsync(returnVal);
    });
  }

  protected aggregateTransactionFlowsArrays(
    arrayOfTransactionFlowMaps: Map<EChain, TransactionFlowInsight>[],
  ): TransactionFlowInsight[] {
    const aggregatedMap = new Map<EChain, TransactionFlowInsight>();
    const periods: (keyof Omit<TransactionFlowInsight, 'chainId' | 'measurementTime'>)[] = ['day', 'week', 'month', 'year'];
    arrayOfTransactionFlowMaps.forEach((transactionFlowMap) => {
      transactionFlowMap.forEach((flow, chainId) => {
        const existingFlow = aggregatedMap.get(chainId);
        if (!existingFlow) {
          aggregatedMap.set(chainId, flow );
        } else {
          periods.forEach((period) => {
            existingFlow[period].incomingNativeValue += flow[period].incomingNativeValue;
            existingFlow[period].incomingCount += flow[period].incomingCount;
            existingFlow[period].outgoingNativeValue += flow[period].outgoingNativeValue;
            existingFlow[period].outgoingCount += flow[period].outgoingCount;
          });
          if (flow.measurementTime > existingFlow.measurementTime) {
            existingFlow.measurementTime = flow.measurementTime;
          }
          aggregatedMap.set(chainId, existingFlow);
        }
      });
    });

    return [...aggregatedMap.values()];
  }

  protected getTransactionFlowsByAccount(
    account: LinkedAccount,
  ): ResultAsync<Map<EChain, TransactionFlowInsight>, PersistenceError> {
    return ResultUtils.combine([
      this.persistence
        .getCursor<EVMTransaction>(
          ERecordKey.TRANSACTIONS,
          "to",
          account.sourceAccountAddress,
        )
        .andThen((cursor) => cursor.allValues().map((evm) => evm || [])),
      this.persistence
        .getCursor<EVMTransaction>(
          ERecordKey.TRANSACTIONS,
          "from",
          account.sourceAccountAddress,
        )
        .andThen((cursor) => cursor.allValues().map((evm) => evm || [])),
    ]).map(([toTransactions, fromTransactions]) => {
      return this.generateTransactionFlows(toTransactions, fromTransactions);
    });
  }

  protected generateTransactionFlows(
    incomingTransactions: EVMTransaction[],
    outgoingTransactions: EVMTransaction[],
  ): Map<EChain, TransactionFlowInsight> {
    const transactionFlowInsights = new Map<EChain, TransactionFlowInsight>();

    incomingTransactions.forEach((tx) =>
      this.categorizeTransaction(tx, true, transactionFlowInsights),
    );
    outgoingTransactions.forEach((tx) =>
      this.categorizeTransaction(tx, false, transactionFlowInsights),
    );

    return transactionFlowInsights;
  }

  protected categorizeTransaction = (
    tx: EVMTransaction,
    isIncoming: boolean,
    transactionFlowInsights: Map<EChain, TransactionFlowInsight>,
  ) => {
    const chainInsight =
      transactionFlowInsights.get(tx.chain) ||
      new TransactionFlowInsight(
        tx.chain,
        new TransactionMetrics(0, 0, 0, 0),
        new TransactionMetrics(0, 0, 0, 0),
        new TransactionMetrics(0, 0, 0, 0),
        new TransactionMetrics(0, 0, 0, 0),
        tx.measurementDate,
      );
    const period = this.determineTimePeriod(tx.timestamp);

    if (isIncoming) {
      chainInsight[period].incomingNativeValue += this._getTxValue(tx);
      chainInsight[period].incomingCount += 1;
    } else {
      chainInsight[period].outgoingNativeValue += this._getTxValue(tx);
      chainInsight[period].outgoingCount += 1;
    }

    if (tx.measurementDate > chainInsight.measurementTime) {
      chainInsight.measurementTime = tx.measurementDate;
    }

    transactionFlowInsights.set(tx.chain, chainInsight);
  };

  protected determineTimePeriod(
    transactionTime: number,
  ): keyof Pick<TransactionFlowInsight, "day" | "week" | "month" | "year"> {
    const currentTime = Date.now();
    const transactionTimeInMs = transactionTime * 1000;

    const dayInMs = 24 * 60 * 60 * 1000;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs;

    const elapsedTime = currentTime - transactionTimeInMs;

    if (elapsedTime < dayInMs) {
      return "day";
    } else if (elapsedTime < weekInMs) {
      return "week";
    } else if (elapsedTime < monthInMs) {
      return "month";
    } else {
      return "year";
    }
  }

  protected _getTxValue(tx: EVMTransaction): number {
    const decimals = getChainInfoByChain(tx.chain).nativeCurrency.decimals;
    return Number.parseFloat(
      ethers.utils.formatUnits(tx.value || "0", decimals).toString(),
    );
  }

  private _getNextMatchingTx(
    cursor: IVolatileCursor<ChainTransaction>,
    filter: TransactionFilter,
  ): ResultAsync<ChainTransaction | null, PersistenceError> {
    return cursor.nextValue().andThen((val) => {
      if (!val || filter.matches(val)) {
        return okAsync(val);
      }
      return this._getNextMatchingTx(cursor, filter);
    });
  }
}
