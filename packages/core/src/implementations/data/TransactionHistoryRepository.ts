import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
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
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getTransactionByChain(): ResultAsync<
    TransactionPaymentCounter[],
    PersistenceError
  > {
    return this.persistence
      .getAll<LinkedAccount>(ERecordKey.ACCOUNT)
      .andThen((accounts) => {
        this.logUtils.debug(
          `In getTransactionByChain, active accounts: `,
          accounts,
        );
        return ResultUtils.combine(
          accounts.map((account) => {
            return ResultUtils.combine([
              this.persistence
                .getCursor<EVMTransaction>(
                  ERecordKey.TRANSACTIONS,
                  "to",
                  account.sourceAccountAddress.toLowerCase(),
                )
                .andThen((cursor) =>
                  cursor.allValues().map((evm) => {
                    this.logUtils.debug(
                      `In getTransactionByChain on account ${account}, all values for "to" transactions:`,
                      evm,
                    );
                    return evm || [];
                  }),
                ),
              this.persistence
                .getCursor<EVMTransaction>(
                  ERecordKey.TRANSACTIONS,
                  "from",
                  account.sourceAccountAddress.toLowerCase(),
                )
                .andThen((cursor) =>
                  cursor.allValues().map((evm) => {
                    this.logUtils.debug(
                      `In getTransactionByChain on account ${account}, all values for "from" transactions:`,
                      evm,
                    );
                    return evm || [];
                  }),
                ),
            ]).map(([toTransactions, fromTransactions]) => {
              const counters = [
                ...toTransactions.map((tx) => {
                  return new TransactionPaymentCounter(
                    tx.chain,
                    this._getTxValue(tx),
                    1,
                    0,
                    0,
                  );
                }),
                ...fromTransactions.map((tx) => {
                  return new TransactionPaymentCounter(
                    tx.chain,
                    0,
                    0,
                    this._getTxValue(tx),
                    1,
                  );
                }),
              ];
              return counters;
            });
          }),
        ).map((transactionsArray) => {
          return this.compoundTransactionPaymentCounters(
            transactionsArray.flat(1),
          );
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

  protected _getTxValue(tx: EVMTransaction): number {
    const decimals = getChainInfoByChain(tx.chain).nativeCurrency.decimals;
    return Number.parseFloat(
      ethers.utils.formatUnits(tx.value || "0", decimals).toString(),
    );
  }

  protected compoundTransactionPaymentCounters(
    chainTransactions: TransactionPaymentCounter[],
  ): TransactionPaymentCounter[] {
    const flowMap = new Map<EChain, TransactionPaymentCounter>();
    chainTransactions.forEach((chainTransaction) => {
      const existingTPC = flowMap.get(chainTransaction.chainId);
      if (existingTPC == null) {
        flowMap.set(chainTransaction.chainId, chainTransaction);
      } else {
        // Just need to increment the existing TPC
        existingTPC.incomingValue += chainTransaction.incomingValue;
        existingTPC.incomingCount += chainTransaction.incomingCount;
        existingTPC.outgoingValue += chainTransaction.outgoingValue;
        existingTPC.outgoingCount += chainTransaction.outgoingCount;
      }
    });

    // Convert back to an array
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
