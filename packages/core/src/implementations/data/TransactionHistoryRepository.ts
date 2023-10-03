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
  ETimePeriods,
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
import { ITimeUtilsType, ITimeUtils } from "@snickerdoodlelabs/common-utils";

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
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
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
    arrayOfTransactionFlowMaps.forEach((transactionFlowMap) => {
      transactionFlowMap.forEach((flow, chainId) => {
        const existingFlow = aggregatedMap.get(chainId);
        if (!existingFlow) {
          aggregatedMap.set(chainId, flow);
        } else {
          TransactionFlowInsight.additionOfMetrics(existingFlow, flow);

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

    let newMetric: TransactionMetrics;
    if (isIncoming) {
      newMetric = new TransactionMetrics(this._getTxValue(tx), 1, 0, 0);
    } else {
      newMetric = new TransactionMetrics(0, 0, this._getTxValue(tx), 1);
    }

    TransactionFlowInsight.addNewTransactionMetrics(
      chainInsight,
      period,
      newMetric,
    );

    if (tx.measurementDate > chainInsight.measurementTime) {
      chainInsight.measurementTime = tx.measurementDate;
    }

    transactionFlowInsights.set(tx.chain, chainInsight);
  };

  protected determineTimePeriod(transactionTime: number): ETimePeriods {
    const currentTime = this.timeUtils.getUnixNow();
    const transactionTimeInMs = transactionTime * 1000;

    const dayInMs = 24 * 60 * 60 * 1000;
    const weekInMs = 7 * dayInMs;
    const monthInMs = 30 * dayInMs;

    const elapsedTime = currentTime - transactionTimeInMs;

    if (elapsedTime < dayInMs) {
      return ETimePeriods.Day;
    } else if (elapsedTime < weekInMs) {
      return ETimePeriods.Week;
    } else if (elapsedTime < monthInMs) {
      return ETimePeriods.Month;
    } else {
      return ETimePeriods.Year;
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
