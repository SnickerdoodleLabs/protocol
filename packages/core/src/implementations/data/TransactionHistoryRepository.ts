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
      ).map((transactionsArray) => {
        return this.compoundTransaction(transactionsArray.flat(1));
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

  protected pushTransaction(
    incomingTransactions: EVMTransaction[],
    outgoingTransactions: EVMTransaction[],
    counters: TransactionPaymentCounter[],
  ): ResultAsync<TransactionPaymentCounter[], PersistenceError> {
    incomingTransactions.forEach((tx) => {
      counters.push(
        new TransactionPaymentCounter(tx.chain, this._getTxValue(tx), 1, 0, 0),
      );
    });
    outgoingTransactions.forEach((tx) => {
      counters.push(
        new TransactionPaymentCounter(tx.chain, 0, 0, this._getTxValue(tx), 1),
      );
    });
    return okAsync(counters);
  }

  protected _getTxValue(tx: EVMTransaction): number {
    const decimals = getChainInfoByChain(tx.chain).nativeCurrency.decimals;
    return Number.parseFloat(
      ethers.utils.formatUnits(tx.value || "0", decimals).toString(),
    );
  }

  protected compoundTransaction(
    chainTransactions: TransactionPaymentCounter[],
  ): TransactionPaymentCounter[] {
    const flowMap = new Map<EChain, TransactionPaymentCounter>();
    chainTransactions.forEach((chainTransaction) => {
      const getObject = flowMap.get(chainTransaction.chainId);
      if (getObject == null) {
        flowMap.set(chainTransaction.chainId, chainTransaction);
      } else {
        flowMap.set(
          chainTransaction.chainId,
          new TransactionPaymentCounter(
            chainTransaction.chainId,
            chainTransaction.incomingValue + getObject.incomingValue,
            chainTransaction.incomingCount + getObject.incomingCount,
            chainTransaction.outgoingValue + getObject.outgoingValue,
            chainTransaction.outgoingCount + getObject.outgoingCount,
          ),
        );
      }
    });

    return [...flowMap.values()];
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
