import {
  ILogUtilsType,
  ILogUtils,
  ObjectUtils,
  ITimeUtilsType,
  ITimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  IMasterIndexer,
  IMasterIndexerType,
} from "@snickerdoodlelabs/indexers";
import { TimedCache } from "@snickerdoodlelabs/node-utils";
import {
  LinkedAccount,
  PersistenceError,
  WalletNFT,
  AccountIndexingError,
  AjaxError,
  chainConfig,
  isAccountValidForChain,
  AccountAddress,
  PortfolioUpdate,
  MethodSupportError,
  EChain,
  ERewardType,
  DirectReward,
  EVMNFT,
  BigNumberString,
  URLString,
  InvalidParametersError,
  EIndexerMethod,
  ERecordKey,
  WalletNFTHistory,
  NftIdWithMeasurementDate,
  EIndexedDbOp,
  WalletNftWithHistory,
  NftTokenAddressWithTokenId,
  UnixTimestamp,
  multiplyBigNumberString,
  addBigNumberString,
  isEVMNft,
  isSolanaNft,
  isSuiNft,
  ChainId,
  EContractStandard,
  NftRepositoryCache,
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@snickerdoodlelabs/persistence";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  INftRepository,
} from "@core/interfaces/data/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class NftRepository implements INftRepository {
  private _nftCache?: NftRepositoryCache;
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IMasterIndexerType)
    protected masterIndexer: IMasterIndexer,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.contextProvider.getContext().map((context) => {
      context.publicEvents.onAccountAdded.subscribe((account) =>
        this.getIndexerNftsAndUpdateIndexedDb([account]),
      );
      context.publicEvents.onAccountRemoved.subscribe((_account) =>
        this.getIndexerNftsAndUpdateIndexedDb(),
      );
    });
  }
  public getCachedNFTs(
    benchmark?: UnixTimestamp,
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<
    WalletNftWithHistory[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    if (chains && accounts) {
      return this.getCachedNFTsTasks(chains, accounts, benchmark);
    } else {
      return ResultUtils.combine([
        chains
          ? okAsync(chains)
          : this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
        accounts ? okAsync(accounts) : this.accountRepo.getAccounts(),
      ]).andThen(([selectedChains, selectedAccounts]) => {
        return this.getCachedNFTsTasks(
          selectedChains,
          selectedAccounts,
          benchmark,
        );
      });
    }
  }

  protected getCachedNFTsTasks(
    chains: EChain[],
    accounts: LinkedAccount[],
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    WalletNftWithHistory[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return ResultUtils.combine([this.getCache()]).andThen(([nftCache]) => {
      const chainsThatNeedsUpdating: EChain[] = [];
      const cachedNfts: WalletNftWithHistory[] = [];

      for (const selectedChain of chains) {
        const selectedChainNftCache = nftCache.get(selectedChain);
        if (benchmark != null && selectedChainNftCache != null) {
          if (selectedChainNftCache.lastUpdateTime < benchmark) {
            chainsThatNeedsUpdating.push(selectedChain);
          }
        }
      }

      if (chainsThatNeedsUpdating.length > 0 && benchmark != null) {
        return this.getIndexerNftsAndUpdateIndexedDb(
          undefined,
          chainsThatNeedsUpdating,
        ).andThen(() => {
          return this.getCache().map((updatedCache) => {
            this.getValidAccountNftsFromCache(
              chains,
              accounts,
              updatedCache,
              cachedNfts,
            );
            return this.filterNftHistoriesByTimestamp(benchmark, cachedNfts);
          });
        });
      } else {
        this.getValidAccountNftsFromCache(
          chains,
          accounts,
          nftCache,
          cachedNfts,
        );

        if (benchmark != null) {
          return okAsync(
            this.filterNftHistoriesByTimestamp(benchmark, cachedNfts),
          );
        }
        return okAsync(cachedNfts);
      }
    });
  }

  protected getValidAccountNftsFromCache(
    chains: EChain[],
    accounts: LinkedAccount[],
    cache: NftRepositoryCache,
    cachedNfts: WalletNftWithHistory[],
  ) {
    for (const selectedChain of chains) {
      for (const selectedAccount of accounts) {
        const chainData = cache.get(selectedChain);
        if (chainData) {
          const accountData = chainData.data.get(
            selectedAccount.sourceAccountAddress,
          );
          if (accountData) {
            accountData.forEach((walletNftWithHistory) => {
              cachedNfts.push(walletNftWithHistory);
            });
          }
        }
      }
    }
  }

  protected filterNftHistoriesByTimestamp(
    benchmark: UnixTimestamp,
    walletNftHistories: WalletNftWithHistory[],
  ): WalletNftWithHistory[] {
    return walletNftHistories.reduce<WalletNftWithHistory[]>(
      (filteredNftHistory, walletNftWithHistory) => {
        const historyItems = walletNftWithHistory.history;

        if (historyItems.length === 0) {
          return filteredNftHistory;
        }

        historyItems.sort((a, b) => a.measurementDate - b.measurementDate);

        const validHistory = this.findSubarrayByValue(historyItems, benchmark);
        if (validHistory.length === 0) {
          return filteredNftHistory;
        }

        walletNftWithHistory.history = validHistory;
        filteredNftHistory.push(walletNftWithHistory);

        return filteredNftHistory;
      },
      [],
    );
  }
  protected findSubarrayByValue<T extends { measurementDate: number }>(
    sortedArray: T[],
    targetValue: number,
  ): T[] {
    const result: T[] = [];
    for (const item of sortedArray) {
      if (item.measurementDate <= targetValue) {
        result.push(item);
      } else {
        break;
      }
    }
    return result;
  }
  public getPersistenceNFTs(): ResultAsync<WalletNFT[], PersistenceError> {
    return this.persistence.getAll<WalletNFT>(ERecordKey.NFTS);
  }

  public getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError> {
    return this.persistence.getAll<WalletNFTHistory>(ERecordKey.NFTS_HISTORY);
  }

  public getCache(): ResultAsync<NftRepositoryCache, PersistenceError> {
    return this.getNftCache();
  }

  public getIndexerNftsAndUpdateIndexedDb(
    accounts?: LinkedAccount[],
    chains?: EChain[],
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    if (chains && accounts) {
      return this.getIndexerNftsAndUpdateIndexedDbTasks(accounts, chains);
    } else {
      return ResultUtils.combine([
        chains
          ? okAsync(chains)
          : this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
        accounts ? okAsync(accounts) : this.accountRepo.getAccounts(),
      ]).andThen(([selectedChains, selectedAccounts]) => {
        return this.getIndexerNftsAndUpdateIndexedDbTasks(
          selectedAccounts,
          selectedChains,
        );
      });
    }
  }

  protected getIndexerNftsAndUpdateIndexedDbTasks(
    accounts: LinkedAccount[],
    chains: EChain[],
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    const tasks: ResultAsync<
      WalletNFT[],
      | PersistenceError
      | AccountIndexingError
      | AjaxError
      | MethodSupportError
      | InvalidParametersError
    >[] = [];
    for (const selectedChain of chains) {
      for (const selectedAccount of accounts) {
        tasks.push(
          this.performNftsUpdate(
            selectedAccount.sourceAccountAddress,
            selectedChain,
          ),
        );
      }
    }
    return ResultUtils.combine(tasks).map((indexerResponses) => {
      return indexerResponses.flat(2);
    });
  }
  protected performNftsUpdate(
    accountAddress: AccountAddress,
    chain: EChain,
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return ResultUtils.combine([
      this.masterIndexer.getLatestNFTs(chain, accountAddress),
      this.getNftCache(),
      this.contextProvider.getContext(),
    ]).andThen(([indexerResponse, nftCache, context]) => {
      const [newlyAddedNftHistories, newlyAddedNfts, updatedCache] =
        this.checkForChangesInNftOwnership(indexerResponse, nftCache);

      return ResultUtils.combine([
        this.addNftsToIndexedDb(newlyAddedNfts),
        this.addNftHistoryToIndexedDb(newlyAddedNftHistories),
      ]).map(() => {
        context.publicEvents.onNftBalanceUpdate.next(
          new PortfolioUpdate(
            accountAddress,
            chain,
            new Date().getTime(),
            indexerResponse,
          ),
        );
        this._nftCache = updatedCache;
        return indexerResponse;
      });
    });
  }

  /**
   *
   * @see {@link getIndexerNftsAndUpdateIndexedDb}
   */
  protected checkForChangesInNftOwnership(
    indexerResponse: WalletNFT[],
    nftCache: NftRepositoryCache,
  ): [WalletNFTHistory[], WalletNFT[], NftRepositoryCache] {
    const newlyAddedNftHistories: WalletNFTHistory[] = [];
    const newlyAddedNfts: WalletNFT[] = [];

    const updatedCache = this.deepCopyNftCache(nftCache);

    const chainToindexerNftMap = this.getChainToWalletNftMap(indexerResponse);

    chainToindexerNftMap.forEach((indexerNfts, chain) => {
      const storedChainNfts = nftCache.get(chain);
      const updatedCacheNfts = updatedCache.get(chain);

      if (storedChainNfts != null && updatedCacheNfts != null) {
        const storedChainNftData = storedChainNfts.data;

        this.createdNftHistoryForMissingNftsOnIndexerReponse(
          indexerNfts,
          storedChainNftData,
          newlyAddedNftHistories,
          updatedCacheNfts,
        );

        this.createRecordsForNftsThatExistOnBothDbAndIndexers(
          indexerNfts,
          storedChainNftData,
          newlyAddedNftHistories,
          newlyAddedNfts,
          updatedCache,
          chain,
        );
      } else {
        this.createRecordsAndUpdateCacheForNonExistingChainNftsOnDb(
          indexerNfts,
          newlyAddedNftHistories,
          newlyAddedNfts,
          updatedCache,
          chain,
        );
      }
    });

    return [newlyAddedNftHistories, newlyAddedNfts, updatedCache];
  }

  protected createRecordsForNftsThatExistOnBothDbAndIndexers(
    indexerNfts: Map<NftTokenAddressWithTokenId, WalletNFT>,
    storedChainNftData: Map<
      AccountAddress,
      Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
    >,
    newlyAddedNftHistories: WalletNFTHistory[],
    newlyAddedNfts: WalletNFT[],
    updatedCache: NftRepositoryCache,
    chain: EChain,
  ) {
    indexerNfts.forEach((indexerNft, id) => {
      const dbAccountRecords = storedChainNftData.get(indexerNft.owner);
      if (dbAccountRecords != null) {
        const dbNft = dbAccountRecords.get(id);
        if (dbNft == null) {
          this.addRecordsForNewlyAddedNftFromIndexersAndUpdateCache(
            indexerNft,
            newlyAddedNftHistories,
            newlyAddedNfts,
            updatedCache,
            chain,
          );
        } else {
          if (
            isEVMNft(indexerNft) &&
            indexerNft.amount &&
            indexerNft.contractType === EContractStandard.Erc1155
          ) {
            if (dbNft.totalAmount === BigNumberString("0")) {
              const measurementDate = this.timeUtils.getUnixNow();
              const nftHistory = this.createNftHistory(
                indexerNft.amount,
                id,
                EIndexedDbOp.Added,
                measurementDate,
              );

              newlyAddedNftHistories.push(nftHistory);
              this.addNftHistoryOfAnExistingNftToCache(
                chain,
                updatedCache,
                nftHistory,
                id,
                indexerNft.owner,
                measurementDate,
              );
            } else {
              const dbAmount = BigNumber.from(dbNft.totalAmount);
              const indexerAmount = BigNumber.from(indexerNft.amount);
              const amountDifference = indexerAmount.sub(dbAmount);
              if (!amountDifference.isZero()) {
                const op = amountDifference.isNegative()
                  ? EIndexedDbOp.Removed
                  : EIndexedDbOp.Added;

                const measurementDate = this.timeUtils.getUnixNow();
                const nftHistory = this.createNftHistory(
                  BigNumberString(amountDifference.abs().toString()),
                  id,
                  op,
                  measurementDate,
                );

                newlyAddedNftHistories.push(nftHistory);

                this.addNftHistoryOfAnExistingNftToCache(
                  chain,
                  updatedCache,
                  nftHistory,
                  id,
                  indexerNft.owner,
                  measurementDate,
                );
              }
            }
          } else {
            //User could transferred and then got the nft back
            if (dbNft.totalAmount === BigNumberString("0")) {
              const measurementDate = this.timeUtils.getUnixNow();
              const nftHistory = this.createNftHistory(
                BigNumberString("1"),
                id,
                EIndexedDbOp.Added,
                measurementDate,
              );

              newlyAddedNftHistories.push(nftHistory);
              this.addNftHistoryOfAnExistingNftToCache(
                chain,
                updatedCache,
                nftHistory,
                id,
                indexerNft.owner,
                measurementDate,
              );
            }
          }
        }
      }
    });
  }

  protected createdNftHistoryForMissingNftsOnIndexerReponse(
    indexerNfts: Map<NftTokenAddressWithTokenId, WalletNFT>,
    storedChainNftData: Map<
      AccountAddress,
      Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
    >,
    newlyAddedNftHistories: WalletNFTHistory[],
    updatedCache: {
      data: Map<
        AccountAddress,
        Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
      >;
      lastUpdateTime: UnixTimestamp;
    },
  ): void {
    storedChainNftData.forEach((nftData, owner) => {
      nftData.forEach((dbNft, id) => {
        if (!indexerNfts.has(id)) {
          const measurementDate = this.timeUtils.getUnixNow();
          const nftHistory = this.addOrRemoveWalletNftRecordInDb(
            dbNft,
            EIndexedDbOp.Removed,
            measurementDate,
          );
          newlyAddedNftHistories.push(nftHistory);

          const existingRecord = updatedCache.data.get(owner);
          if (existingRecord != null) {
            const existingNftHistory = existingRecord.get(id);
            if (existingNftHistory) {
              existingNftHistory.history.push({
                measurementDate,
                event: EIndexedDbOp.Removed,
                amount: nftHistory.amount,
              });
              if (measurementDate > updatedCache.lastUpdateTime) {
                updatedCache.lastUpdateTime = measurementDate;
              }
            }
          }
        }
      });
    });
  }
  protected createRecordsAndUpdateCacheForNonExistingChainNftsOnDb(
    indexerNfts: Map<NftTokenAddressWithTokenId, WalletNFT>,
    newlyAddedNftHistories: WalletNFTHistory[],
    newlyAddedNfts: WalletNFT[],
    updatedCache: NftRepositoryCache,
    chain: EChain,
  ): void {
    indexerNfts.forEach((indexerNft) => {
      this.addRecordsForNewlyAddedNftFromIndexersAndUpdateCache(
        indexerNft,
        newlyAddedNftHistories,
        newlyAddedNfts,
        updatedCache,
        chain,
      );
    });
  }

  protected addRecordsForNewlyAddedNftFromIndexersAndUpdateCache(
    indexerNft: WalletNFT,
    newlyAddedNftHistories: WalletNFTHistory[],
    newlyAddedNfts: WalletNFT[],
    updatedCache: NftRepositoryCache,
    chain: EChain,
  ) {
    const measurementDate = this.timeUtils.getUnixNow();
    const nftHistory = this.addOrRemoveWalletNftRecordInDb(
      indexerNft,
      EIndexedDbOp.Added,
      measurementDate,
    );
    const walletNftWithHistory = this.createWalletNftWithHistory(
      indexerNft,
      nftHistory,
      measurementDate,
    );

    newlyAddedNfts.push(indexerNft);
    newlyAddedNftHistories.push(nftHistory);

    this.addNewNftWithHistoryToCache(
      chain,
      updatedCache,
      walletNftWithHistory,
      measurementDate,
    );
  }
  protected addNewNftWithHistoryToCache(
    chain: EChain,
    updatedCache: NftRepositoryCache,
    walletNftWithHistory: WalletNftWithHistory,
    measurementDate: UnixTimestamp,
  ) {
    const updatedCacheChainData = updatedCache.get(chain);
    if (updatedCacheChainData != null) {
      const updatedAccountData = updatedCacheChainData.data.get(
        walletNftWithHistory.owner,
      );

      if (updatedAccountData != null) {
        updatedAccountData.set(walletNftWithHistory.id, walletNftWithHistory);
      } else {
        updatedCacheChainData.data.set(
          walletNftWithHistory.owner,
          new Map([[walletNftWithHistory.id, walletNftWithHistory]]),
        );
      }

      if (measurementDate > updatedCacheChainData.lastUpdateTime) {
        updatedCacheChainData.lastUpdateTime = measurementDate;
      }
    } else {
      updatedCache.set(chain, {
        data: new Map([
          [
            walletNftWithHistory.owner,
            new Map([[walletNftWithHistory.id, walletNftWithHistory]]),
          ],
        ]),
        lastUpdateTime: measurementDate,
      });
    }
  }

  protected addNftHistoryOfAnExistingNftToCache(
    chain: EChain,
    updatedCache: NftRepositoryCache,
    walletNftHistory: WalletNFTHistory,
    walletId: NftTokenAddressWithTokenId,
    owner: AccountAddress,
    measurementDate: UnixTimestamp,
  ) {
    const updatedCacheChainData = updatedCache.get(chain);
    if (updatedCacheChainData != null) {
      const ownerNfts = updatedCacheChainData.data.get(owner);
      if (ownerNfts != null) {
        const nft = ownerNfts.get(walletId);
        if (nft != null) {
          const changeAmount = BigNumber.from(walletNftHistory.amount);
          const newAmount =
            walletNftHistory.event === EIndexedDbOp.Added
              ? BigNumber.from(nft.totalAmount).add(changeAmount)
              : BigNumber.from(nft.totalAmount).sub(changeAmount);

          nft.totalAmount = BigNumberString(newAmount.toString());
          nft.history.push({
            measurementDate,
            event: walletNftHistory.event,
            amount: walletNftHistory.amount,
          });

          if (updatedCacheChainData.lastUpdateTime < measurementDate) {
            updatedCacheChainData.lastUpdateTime = measurementDate;
          }
        }
      }
    }
  }

  protected createWalletNftWithHistory(
    walletNft: WalletNFT,
    nftHistory: WalletNFTHistory,
    measurementDate: UnixTimestamp,
  ): WalletNftWithHistory {
    return {
      ...walletNft,
      history: [
        {
          measurementDate,
          amount: nftHistory.amount,
          event: EIndexedDbOp.Added,
        },
      ],
      totalAmount: nftHistory.amount,
    };
  }

  protected getWalletNftsWithHistoryMap(
    walletNfts: WalletNFT[],
    nftHistories: WalletNFTHistory[],
  ): NftRepositoryCache {
    this.sortWalletNftHistories(nftHistories);

    const nftHistoriesMap = this.getNftIdToWalletHistoryMap(nftHistories);
    const chainToWalletNftMap = this.getChainToWalletNftMap(walletNfts);

    const walletNftWithHistoryMap: NftRepositoryCache = new Map();

    chainToWalletNftMap.forEach((walletNfts, chain) => {
      const cachedData = Array.from(walletNfts.entries()).reduce<{
        data: Map<
          AccountAddress,
          Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
        >;
        lastUpdateTime: UnixTimestamp;
      }>(
        (walletNftWithHistoryAndLastUpdateTime, [id, walletNft]) => {
          const nftHistory = nftHistoriesMap.get(id)?.history;
          const nftHistoryTotalAmount = nftHistoriesMap.get(id)?.totalAmount;
          const nftWithHistory = {
            ...walletNft,
            history: nftHistory ?? [],
            totalAmount: nftHistoryTotalAmount ?? BigNumberString("0"),
          };

          const accountNfts = walletNftWithHistoryAndLastUpdateTime.data.get(
            walletNft.owner,
          );

          if (accountNfts == null) {
            walletNftWithHistoryAndLastUpdateTime.data.set(
              walletNft.owner,
              new Map([[walletNft.id, nftWithHistory]]),
            );
          } else {
            accountNfts.set(walletNft.id, nftWithHistory);
          }

          walletNftWithHistoryAndLastUpdateTime.lastUpdateTime = nftHistory
            ? nftHistory[nftHistory.length - 1].measurementDate
            : UnixTimestamp(0);
          return walletNftWithHistoryAndLastUpdateTime;
        },
        { data: new Map(), lastUpdateTime: UnixTimestamp(0) },
      );
      walletNftWithHistoryMap.set(chain, cachedData);
    });

    return walletNftWithHistoryMap;
  }

  protected getChainToWalletNftMap(
    walletNfts: WalletNFT[],
  ): Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFT>> {
    return walletNfts.reduce<
      Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFT>>
    >((chainToWalletNftMap, walletNft) => {
      const chain = walletNft.chain;
      const chainMap = chainToWalletNftMap.get(chain);
      if (chainMap == null) {
        chainToWalletNftMap.set(chain, new Map([[walletNft.id, walletNft]]));
      } else {
        chainMap.set(walletNft.id, walletNft);
      }
      return chainToWalletNftMap;
    }, new Map());
  }
  protected sortWalletNftHistories(nftHistories: WalletNFTHistory[]) {
    nftHistories.sort((a, b) => {
      const measurementDateA = UnixTimestamp(parseInt(a.id.split("{-}")[1]));
      const measurementDateB = UnixTimestamp(parseInt(b.id.split("{-}")[1]));
      return measurementDateA - measurementDateB;
    });
    return nftHistories;
  }

  protected getNftIdToWalletHistoryMap(
    nftHistories: WalletNFTHistory[],
  ): Map<
    NftTokenAddressWithTokenId,
    Pick<WalletNftWithHistory, "history" | "totalAmount">
  > {
    return nftHistories.reduce<
      Map<
        NftTokenAddressWithTokenId,
        Pick<WalletNftWithHistory, "history" | "totalAmount">
      >
    >((map, nftHistory) => {
      const [nftIdString, measurementDateString] = nftHistory.id.split("{-}");
      const nftId = nftIdString as NftTokenAddressWithTokenId;
      const measurementDate = UnixTimestamp(parseInt(measurementDateString));

      const historyArray = map.get(nftId);
      const amountChange = multiplyBigNumberString(
        nftHistory.amount,
        BigNumberString(nftHistory.event.toString()),
      );

      if (historyArray == null) {
        map.set(nftId, {
          history: [
            {
              measurementDate,
              event: nftHistory.event,
              amount: nftHistory.amount,
            },
          ],
          totalAmount: amountChange,
        });
      } else {
        historyArray.history.push({
          measurementDate,
          event: nftHistory.event,
          amount: nftHistory.amount,
        });
        historyArray.totalAmount = addBigNumberString(
          historyArray.totalAmount,
          amountChange,
        );
      }

      return map;
    }, new Map());
  }

  protected addNftHistoryToIndexedDb(
    nftHistories: WalletNFTHistory[],
  ): ResultAsync<void[], PersistenceError> {
    return ResultUtils.combine(
      nftHistories.map((nftHistory) => {
        return this.persistence.updateRecord(
          ERecordKey.NFTS_HISTORY,
          nftHistory,
        );
      }),
    );
  }

  protected addNftsToIndexedDb(
    nfts: WalletNFT[],
  ): ResultAsync<void[], PersistenceError> {
    return ResultUtils.combine(
      nfts.map((nft) => {
        return this.persistence.updateRecord(ERecordKey.NFTS, nft);
      }),
    );
  }

  protected getNftCache(): ResultAsync<NftRepositoryCache, PersistenceError> {
    if (this._nftCache == null) {
      return ResultUtils.combine([
        this.getPersistenceNFTs(),
        this.getNFTsHistory(),
      ]).map(([dnNfts, nftHistories]) => {
        const cacheCreatedFromIndexDb = this.getWalletNftsWithHistoryMap(
          dnNfts,
          nftHistories,
        );
        this._nftCache = cacheCreatedFromIndexDb;
        return this._nftCache;
      });
    }

    return okAsync(this._nftCache);
  }

  protected earnedRewardsToNFTs(): ResultAsync<
    WalletNftWithHistory[],
    PersistenceError
  > {
    return ResultUtils.combine([
      this.accountRepo.getEarnedRewards(),
      this.configProvider.getConfig(),
    ]).map(([rewards, config]) => {
      return (
        rewards.filter((reward) => {
          return reward.type == ERewardType.Direct;
        }) as DirectReward[]
      ).map<WalletNftWithHistory>((reward) => {
        const nft = new EVMNFT(
          reward.contractAddress,
          BigNumberString("1"),
          reward.type,
          reward.recipientAddress,
          undefined,
          {
            // Add image URL to the raw data
            raw: ObjectUtils.serialize({
              ...reward,
              image: URLString(urlJoin(config.ipfsFetchBaseUrl, reward.image)),
            }),
          }, // metadata
          reward.name,
          reward.chainId as EChain,
          BigNumberString("1"),
          undefined,
          undefined,
        );

        const nftsWithHistory: WalletNftWithHistory = {
          ...nft,
          history: [
            {
              measurementDate: UnixTimestamp(0),
              amount: BigNumberString("1"),
              event: EIndexedDbOp.Added,
            },
          ],
          totalAmount: BigNumberString("1"),
        };
        return nftsWithHistory;
      });
    });
  }

  protected addOrRemoveWalletNftRecordInDb(
    indexerNft: WalletNFT | WalletNftWithHistory,
    op: EIndexedDbOp,
    measurementDate: UnixTimestamp,
  ): WalletNFTHistory {
    let amount = BigNumberString("1");
    if (
      isEVMNft(indexerNft) &&
      indexerNft.contractType === EContractStandard.Erc1155
    ) {
      if (indexerNft.amount) {
        amount = indexerNft.amount;
      }
    }
    return this.createNftHistory(amount, indexerNft.id, op, measurementDate);
  }

  protected createNftHistory(
    amount: BigNumberString,
    nftId: NftTokenAddressWithTokenId,
    op: EIndexedDbOp,
    measurementDate: UnixTimestamp,
  ): WalletNFTHistory {
    const id = NftIdWithMeasurementDate(nftId, measurementDate);
    return new WalletNFTHistory(id, op, amount);
  }

  protected deepCopyNftCache(nftCache: NftRepositoryCache): NftRepositoryCache {
    const nftCacheClone = new Map<
      EChain,
      {
        data: Map<
          AccountAddress,
          Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
        >;
        lastUpdateTime: UnixTimestamp;
      }
    >();

    nftCache.forEach((chainData, chainKey) => {
      const clonedData = new Map<
        AccountAddress,
        Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
      >();

      chainData.data.forEach((accountData, accountKey) => {
        const clonedAccountData = new Map<
          NftTokenAddressWithTokenId,
          WalletNftWithHistory
        >();

        accountData.forEach((walletNftWithHistory, innerKey) => {
          const copiedWalletNftWithHistory: WalletNftWithHistory = {
            ...walletNftWithHistory,
            history: walletNftWithHistory.history.map((h) => ({ ...h })),
          };
          clonedAccountData.set(innerKey, copiedWalletNftWithHistory);
        });

        clonedData.set(accountKey, clonedAccountData);
      });

      nftCacheClone.set(chainKey, {
        data: clonedData,
        lastUpdateTime: chainData.lastUpdateTime,
      });
    });

    return nftCacheClone;
  }
}
