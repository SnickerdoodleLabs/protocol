import {
  TransactionPaymentCounter,
  PersistenceError,
  ChainId,
  AccountAddress,
  ChainTransaction,
  chainConfig,
  EBackupPriority,
  EVMTransaction,
  getChainInfoByChainId,
  TransactionFilter,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import {
  ERecordKey,
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  IVolatileCursor,
  VolatileStorageMetadata,
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
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
  ) {}

  public getTransactionValueByChain(): ResultAsync<
    TransactionPaymentCounter[],
    PersistenceError
  > {
    return this.accountRepo.getAccounts().andThen((accounts) => {
      return ResultUtils.combine(
        accounts.map((account) => {
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
          ]).andThen(([toTransactions, fromTransactions]) => {
            return this.pushTransaction(toTransactions, fromTransactions, []);
          });
        }),
      ).andThen((transactionsArray) => {
        return this.compoundTransaction(transactionsArray.flat(1));
      });
    });
  }

  protected pushTransaction(
    incomingTransactions: EVMTransaction[],
    outgoingTransactions: EVMTransaction[],
    counters: TransactionPaymentCounter[],
  ): ResultAsync<TransactionPaymentCounter[], PersistenceError> {
    incomingTransactions.forEach((tx) => {
      counters.push(
        new TransactionPaymentCounter(
          tx.chainId,
          this._getTxValue(tx),
          1,
          0,
          0,
        ),
      );
    });
    outgoingTransactions.forEach((tx) => {
      counters.push(
        new TransactionPaymentCounter(
          tx.chainId,
          0,
          0,
          this._getTxValue(tx),
          1,
        ),
      );
    });
    return okAsync(counters);
  }

  protected _getTxValue(tx: EVMTransaction): number {
    const decimals = getChainInfoByChainId(tx.chainId).nativeCurrency.decimals;
    return Number.parseFloat(
      ethers.utils.formatUnits(tx.value || "0", decimals).toString(),
    );
  }

  protected compoundTransaction(
    chainTransaction: TransactionPaymentCounter[],
  ): ResultAsync<TransactionPaymentCounter[], PersistenceError> {
    const flowMap = new Map<ChainId, TransactionPaymentCounter>();
    chainTransaction.forEach((obj) => {
      const getObject = flowMap.get(obj.chainId);
      if (getObject == null) {
        flowMap.set(obj.chainId, obj);
      } else {
        flowMap.set(
          obj.chainId,
          new TransactionPaymentCounter(
            obj.chainId,
            obj.incomingValue + getObject.incomingValue,
            obj.incomingCount + getObject.incomingCount,
            obj.outgoingValue + getObject.outgoingValue,
            obj.outgoingCount + getObject.outgoingCount,
          ),
        );
      }
    });

    return this.tokenPriceRepo
      .getMarketDataForTokens(
        [...flowMap.keys()].map((chain) => {
          return { chain: chain, address: null };
        }),
      )
      .map((marketDataMap) => {
        const retVal: TransactionPaymentCounter[] = [];
        flowMap.forEach((counter, chainId) => {
          const marketData = marketDataMap.get(`${chainId}-${null}`);
          if (marketData != null) {
            counter.incomingValue *= marketData.currentPrice;
            counter.outgoingValue *= marketData.currentPrice;
            retVal.push(counter);
          } else {
            counter.incomingValue = 0;
            counter.outgoingValue = 0;
            retVal.push(counter);
          }
        });
        return retVal;
      })
      .mapErr((e) => new PersistenceError("error compounding transactions", e));
  }

  public addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError> {
    if (transactions.length == 0) {
      return okAsync(undefined);
    }

    return ResultUtils.combine(
      transactions.map((tx) => {
        const metadata = new VolatileStorageMetadata<ChainTransaction>(
          EBackupPriority.NORMAL,
          tx,
        );
        return this.persistence.updateRecord(ERecordKey.TRANSACTIONS, metadata);
      }),
    ).andThen(() => okAsync(undefined));
  }

  public getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError> {
    return this.persistence
      .getAll<ChainTransaction>(ERecordKey.TRANSACTIONS)
      .andThen((transactions) => {
        if (filter == undefined) {
          return okAsync(transactions);
        }
        return okAsync(transactions.filter((value) => filter.matches(value)));
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
        undefined,
        EBackupPriority.NORMAL,
      )
      .andThen((cursor) => {
        const filter = new TransactionFilter([chainId], [address]);
        return this._getNextMatchingTx(cursor, filter);
      });
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

  public getTransactionsMap(): ResultAsync<
    Map<ChainId, number>,
    PersistenceError
  > {
    const chains = Array.from(chainConfig.keys());
    return ResultUtils.combine(
      chains.map((chain) => {
        return this.persistence
          .getAllKeys(
            ERecordKey.TRANSACTIONS,
            "chainId",
            chain,
            undefined,
            EBackupPriority.NORMAL,
          )
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
}
