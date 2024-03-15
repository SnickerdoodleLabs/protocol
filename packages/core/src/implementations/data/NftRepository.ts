import {
  ILogUtilsType,
  ILogUtils,
  ObjectUtils,
  ITimeUtils,
  ITimeUtilsType,
  IBigNumberUtils,
  IBigNumberUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IMasterIndexer,
  IMasterIndexerType,
} from "@snickerdoodlelabs/indexers";
import {
  LinkedAccount,
  PersistenceError,
  WalletNFT,
  AccountIndexingError,
  AjaxError,
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
  NftAddressesWithTokenId,
  UnixTimestamp,
  multiplyBigNumberString,
  addBigNumberString,
  EContractStandard,
  NftRepositoryCache,
  isAccountValidForChain,
  EarnedReward,
  SolanaTokenAddress,
  TokenAddress,
  EChainTechnology,
  SolanaNFT,
  WalletNFTData,
  SuiNFT,
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import { DataValidationUtils } from "@core/implementations/utilities/index.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  INftRepository,
  INFTRepositoryWithDebug,
} from "@core/interfaces/data/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class NftRepository implements INftRepository, INFTRepositoryWithDebug {
  private _nftCache?: NftRepositoryCache;
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IMasterIndexerType)
    protected masterIndexer: IMasterIndexer,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IBigNumberUtilsType) protected bigNumberUtils: IBigNumberUtils,
  ) {
    this.contextProvider.getContext().map((context) => {
      context.publicEvents.onAccountAdded.subscribe((account) =>
        this.linkAccount(account).orElse((e) => {
          this.logUtils.error(
            `In link account, received an error while retrieving history records for account address ${account.sourceAccountAddress}.\n
             Suggests problem on persistance layer for old records of address ${account.sourceAccountAddress}
          `,
            e,
          );
          return okAsync(undefined);
        }),
      );
      context.publicEvents.onAccountRemoved.subscribe((account) =>
        this.unlinkAccount(account).orElse((e) => {
          this.logUtils.error(
            `In unlinkAccount, received an error while adding removed history records for account address ${account.sourceAccountAddress}.\n
             Records still exists!
            `,
            e,
          );
          return okAsync(undefined);
        }),
      );
    });
  }

  public getPersistenceNFTs(): ResultAsync<WalletNFTData[], PersistenceError> {
    return this.persistence
      .getAll<WalletNFTData>(ERecordKey.NFTS)
      .orElse((_e) => {
        return okAsync([]);
      });
  }

  public getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError> {
    return this.persistence
      .getAll<WalletNFTHistory>(ERecordKey.NFTS_HISTORY)
      .orElse((_e) => {
        return okAsync([]);
      });
  }

  public getNFTCache(): ResultAsync<NftRepositoryCache, PersistenceError> {
    return this.getNftCache();
  }

  public getNfts(
    benchmark?: UnixTimestamp,
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    if (chains != null && accounts != null) {
      return this.getCachedNFTsTasks(chains, accounts, benchmark).andThen(
        (walletNftWithHistories) => {
          if (chains.includes(EChain.Shibuya)) {
            //Should be removed long term
            return this.earnedRewardsToNFTs().map((shibuyaPotentialNfts) => {
              const nfts = [
                ...shibuyaPotentialNfts,
                ...this.convertToWalletNfts(walletNftWithHistories),
              ];
              return nfts;
            });
          }
          return okAsync(this.convertToWalletNfts(walletNftWithHistories));
        },
      );
    }
    return ResultUtils.combine([
      chains
        ? okAsync(chains)
        : this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
      accounts ? okAsync(accounts) : this.getAccounts(),
    ]).andThen(([selectedChains, selectedAccounts]) => {
      return this.getCachedNFTsTasks(
        selectedChains,
        selectedAccounts,
        benchmark,
      ).andThen((walletNftWithHistories) => {
        if (
          (chains != null && chains.includes(EChain.Shibuya)) ||
          chains == null
        ) {
          return this.earnedRewardsToNFTs().map((shibuyaPotentialNfts) => {
            const nfts = [
              ...shibuyaPotentialNfts,
              ...this.convertToWalletNfts(walletNftWithHistories),
            ];

            return nfts;
          });
        }

        return okAsync(this.convertToWalletNfts(walletNftWithHistories));
      });
    });
  }

  protected linkAccount(
    linkedAccount: LinkedAccount,
  ): ResultAsync<
    void,
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    if (this._nftCache == null) {
      // cache is built with respect to linked accounts, simply we ask for new nfts
      return this.getNfts(this.timeUtils.getUnixNow(), undefined, [
        linkedAccount,
      ]).map(() => {});
    } else {
      // If the account was previously linked and then removed records still exist on db
      // They will be removed on cache, we will populate cache and then ask for new nfts
      return ResultUtils.combine([
        this.getPersistenceNFTs(),
        this.getNFTsHistory(),
        this.getNftCache(),
      ]).andThen(([dnNfts, nftHistories, cache]) => {
        const cacheCreatedFromIndexDb = this.getWalletNftsWithHistoryMap(
          dnNfts,
          nftHistories,
          [linkedAccount.sourceAccountAddress],
        );
        this.updateExistingCacheForReLinkedAccountRecords(
          cache,
          cacheCreatedFromIndexDb,
          linkedAccount.sourceAccountAddress,
        );
        return this.getNfts(this.timeUtils.getUnixNow(), undefined, [
          linkedAccount,
        ]).map(() => {});
      });
    }
  }

  protected updateExistingCacheForReLinkedAccountRecords(
    existingCache: NftRepositoryCache,
    updatedCache: NftRepositoryCache,
    accountAddress: AccountAddress,
  ): void {
    updatedCache.forEach((chainData, chain) => {
      const existingChainData = existingCache.get(chain);
      if (existingChainData != null) {
        const accountDataThatWasRemovedOnAnUnlink =
          chainData.data.get(accountAddress);

        if (accountDataThatWasRemovedOnAnUnlink != null) {
          const deepCopyAccountData = ObjectUtils.toGenericObject(
            accountDataThatWasRemovedOnAnUnlink,
          ) as unknown as NftIdToHistoryMap;
          existingChainData.data.set(accountAddress, deepCopyAccountData);
        }
      } else {
        const deepCopyChain = ObjectUtils.toGenericObject(
          chainData,
        ) as unknown as AccountNftsWithUpdateObject;
        existingCache.set(chain, deepCopyChain);
      }
    });
  }

  protected unlinkAccount({
    sourceAccountAddress,
  }: LinkedAccount): ResultAsync<void, PersistenceError> {
    return this.getNftCache().andThen((cache) => {
      const removedHistories: WalletNFTHistory[] = [];
      const affectedChains: EChain[] = [];
      cache.forEach((chainData, chain) => {
        const unlinkedAccountData = chainData.data.get(sourceAccountAddress);
        if (unlinkedAccountData != null) {
          unlinkedAccountData.forEach((walletnftWithHistory) => {
            const nftHistory = this.addOrRemoveWalletNftRecordInDb(
              walletnftWithHistory,
              EIndexedDbOp.Removed,
              this.timeUtils.getUnixNow(),
            );
            removedHistories.push(nftHistory);
          });
          affectedChains.push(chain);
        }
      });
      return this.addNftHistoryToIndexedDb(removedHistories).map(() => {
        affectedChains.forEach((chain) => {
          cache.get(chain)?.data.delete(sourceAccountAddress);
        });
      });
    });
  }

  /**
   * Updates the IndexedDB and cache with NFT data retrieved from indexers.
   *
   * This method serves two primary purposes:
   * 1. To regularly update data based on polling.
   * 2. To process queries that require recent data, ensuring records are up-to-date.
   *
   * Overview:
   * - Utilizes data from indexers as the primary source for NFT information.
   * - Updates both the IndexedDB (storing individual NFT and NFT history records) and an in-memory cache
   *   (aggregating the latest comprehensive NFT data with their historical records).
   * - Handles data for specified blockchain chains; chains not in the indexer's response are not updated.
   *
   * Processing Logic:
   * - New NFT records not present in the database are added to IndexedDB and cache, along with their history.
   * - NFT records present in the database but missing from the indexer's response are added with "Removed" to history.
   * - For each NFT found in both sources:
   *   - For ERC1155 NFTs, differences in amounts are identified, and history records are updated accordingly.
   *   - For ERC721 NFTs, if the last recorded amount is 0, an "Added" history record is created.(User transferred the nft, then got it back again)
   *
   * The method ensures an accurate snapshot of user NFT holdings is maintained for querying purposes,
   * while indexer data is used to trigger events.
   *
   * @param accounts Optional array of `LinkedAccount`. If not provided, all the linked accounts will be used.
   * @param chain Optional array of `EChain`. If not provided, all supported chains will be used.
   * @returns void
   */
  protected getIndexerNftsAndUpdateIndexedDb(
    accounts?: LinkedAccount[],
    chains?: EChain[],
  ): ResultAsync<
    void,
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    if (chains != null && accounts != null) {
      return this.getIndexerNftsAndUpdateIndexedDbTasks(accounts, chains);
    } else {
      return ResultUtils.combine([
        chains
          ? okAsync(chains)
          : this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
        accounts ? okAsync(accounts) : this.getAccounts(),
      ]).andThen(([selectedChains, selectedAccounts]) => {
        return this.getIndexerNftsAndUpdateIndexedDbTasks(
          selectedAccounts,
          selectedChains,
        );
      });
    }
  }

  protected convertToWalletNfts(
    walletNftWithHistories: WalletNftWithHistory[],
  ): WalletNFT[] {
    return walletNftWithHistories.map<WalletNFT>((walletNftWithHistory) => {
      const nft = walletNftWithHistory.nft;
      const measurementDate =
        walletNftWithHistory.history[walletNftWithHistory.history.length - 1]
          .measurementDate;
      const amount = walletNftWithHistory.totalAmount;

      if (this.isEVMNft(nft)) {
        return new EVMNFT(
          nft.token,
          nft.tokenId,
          nft.contractType,
          nft.owner,
          nft.tokenUri,
          nft.metadata,
          nft.name,
          nft.chain,
          amount,
          measurementDate,
          nft.blockNumber,
          nft.lastOwnerTimeStamp,
        );
      } else if (this.isSolanaNft(nft)) {
        return new SolanaNFT(
          nft.chain,
          nft.owner,
          nft.mint,
          nft.collection,
          nft.metadataUri,
          nft.isMutable,
          nft.primarySaleHappened,
          nft.sellerFeeBasisPoints,
          nft.updateAuthority,
          nft.tokenStandard,
          nft.symbol,
          nft.name,
          amount,
          measurementDate,
        );
      } else {
        const suiNft = nft as SuiNFT;
        return new SuiNFT(
          suiNft.token,
          suiNft.tokenId,
          suiNft.contractType,
          suiNft.owner,
          suiNft.tokenUri,
          suiNft.metadata,
          amount,
          suiNft.name,
          suiNft.chain,
          measurementDate,
          suiNft.blockNumber,
          suiNft.lastOwnerTimeStamp,
        );
      }
    });
  }

  protected getCachedNFTsTasks(
    chains: EChain[],
    accounts: LinkedAccount[],
    benchmark: UnixTimestamp | undefined,
  ): ResultAsync<
    WalletNftWithHistory[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.getNftCache()
      .andThen((nftCache) => {
        const cachedNfts: WalletNftWithHistory[] = [];
        const chainsThatNeedsUpdating = this.getChainsThatNeedToBeUpdated(
          chains,
          nftCache,
          benchmark,
        );
        if (
          (chainsThatNeedsUpdating.length > 0 && benchmark != null) ||
          nftCache.size === 0
        ) {
          return this.getIndexerNftsAndUpdateIndexedDb(
            undefined,
            chainsThatNeedsUpdating,
          ).andThen(() => {
            return this.getNftCache().map((updatedCache) => {
              const requestedNfts = this.getAccountSpecificNftsFromCache(
                chains,
                accounts,
                updatedCache,
              );
              cachedNfts.push(...requestedNfts);
              this.updateCacheTimes(
                chainsThatNeedsUpdating,
                updatedCache,
                benchmark ?? this.timeUtils.getUnixNow(),
              );
              return cachedNfts;
            });
          });
        } else {
          const requestedNfts = this.getAccountSpecificNftsFromCache(
            chains,
            accounts,
            nftCache,
          );
          cachedNfts.push(...requestedNfts);
          return okAsync(cachedNfts);
        }
      })
      .map((cachedNfts) => {
        // if (benchmark != null) {
        //   benchmark is disabled for now
        // }
        return this.filterNftHistoriesByTimestamp(cachedNfts);
      });
  }

  protected getChainsThatNeedToBeUpdated(
    chains: EChain[],
    nftCache: NftRepositoryCache,
    benchmark: UnixTimestamp | undefined,
  ): EChain[] {
    const chainsThatNeedsUpdating: EChain[] = [];
    if (benchmark != null || nftCache.size === 0) {
      for (const selectedChain of chains) {
        const selectedChainNftCache = nftCache.get(selectedChain);
        if (selectedChainNftCache != null) {
          if (
            (benchmark != null &&
              selectedChainNftCache.lastUpdateTime < benchmark) ||
            nftCache.size === 0
          ) {
            chainsThatNeedsUpdating.push(selectedChain);
          }
        } else {
          chainsThatNeedsUpdating.push(selectedChain);
        }
      }
    }
    return chainsThatNeedsUpdating;
  }

  protected updateCacheTimes(
    chainsThatNeedsUpdating: EChain[],
    updatedCache: NftRepositoryCache,
    benchmark: UnixTimestamp,
  ): void {
    for (const chainsThatNeedsUpdate of chainsThatNeedsUpdating) {
      const possibleUpdatedChain = updatedCache.get(chainsThatNeedsUpdate);
      if (
        possibleUpdatedChain != null &&
        possibleUpdatedChain.lastUpdateTime < benchmark
      ) {
        //No new nft found for the user, but we did checked for nfts
        possibleUpdatedChain.lastUpdateTime = benchmark;
      }
    }
  }
  protected getAccountSpecificNftsFromCache(
    chains: EChain[],
    accounts: LinkedAccount[],
    cache: NftRepositoryCache,
  ): WalletNftWithHistory[] {
    const cachedNfts: WalletNftWithHistory[] = [];
    for (const selectedChain of chains) {
      const chainData = cache.get(selectedChain);
      if (chainData) {
        for (const selectedAccount of accounts) {
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

    return cachedNfts;
  }

  protected filterNftHistoriesByTimestamp(
    //benchmark: UnixTimestamp,
    walletNftHistories: WalletNftWithHistory[],
  ): WalletNftWithHistory[] {
    return walletNftHistories.reduce<WalletNftWithHistory[]>(
      (filteredNftHistory, walletNftWithHistory) => {
        if (walletNftWithHistory.history.length === 0) {
          return filteredNftHistory;
        }

        const historyWithTotalAmount = {
          data: walletNftWithHistory.history,
          totalAmount: walletNftWithHistory.totalAmount,
        };

        // const validHistory = this.findSubarrayByValue(
        //   historyWithTotalAmount,
        //   benchmark,
        // );

        const newTotalAmount = this.bigNumberUtils.BNSToBN(
          historyWithTotalAmount.totalAmount,
        );
        if (historyWithTotalAmount.data.length === 0 || newTotalAmount <= 0) {
          return filteredNftHistory;
        }

        const filteredWalletNft = {
          ...walletNftWithHistory,
          history: historyWithTotalAmount.data,
          totalAmount: historyWithTotalAmount.totalAmount,
        };
        filteredNftHistory.push(filteredWalletNft);

        return filteredNftHistory;
      },
      [],
    );
  }

  protected findSubarrayByValue<
    T extends {
      data: {
        measurementDate: UnixTimestamp;
        event: EIndexedDbOp;
        amount: BigNumberString;
      }[];
      totalAmount: BigNumberString;
    },
  >(data: T, targetValue: UnixTimestamp): T {
    let currentTotal = this.bigNumberUtils.BNSToBN(data.totalAmount);
    let index = data.data.length - 1;

    for (
      ;
      index >= 0 && data.data[index].measurementDate > targetValue;
      index--
    ) {
      const item = data.data[index];
      const amountChange =
        this.bigNumberUtils.BNSToBN(item.amount) * BigInt(item.event);
      currentTotal = currentTotal - amountChange;
    }

    const resultData = data.data.slice(0, index + 1);

    const result: T = {
      ...data,
      data: resultData,
      totalAmount: currentTotal.toString(),
    };

    return result;
  }

  protected getIndexerNftsAndUpdateIndexedDbTasks(
    accounts: LinkedAccount[],
    chains: EChain[],
  ): ResultAsync<
    void,
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    const tasks: ResultAsync<
      [WalletNFTHistory[], WalletNFTData[], EChain, AccountAddress],
      never
    >[] = [];
    for (const selectedChain of chains) {
      for (const selectedAccount of accounts) {
        if (isAccountValidForChain(selectedChain, selectedAccount)) {
          tasks.push(
            this.performNftsUpdate(
              selectedAccount.sourceAccountAddress,
              selectedChain,
            ),
          );
        }
      }
    }

    return ResultUtils.combine(tasks).andThen((combinedUpdated) => {
      return this.getNftCache().map((cache) => {
        combinedUpdated.forEach(
          ([
            newlyAddedNftHistories,
            newlyAddedNftDatas,
            chain,
            accountAddress,
          ]) => {
            this.upsertCache(
              newlyAddedNftHistories,
              newlyAddedNftDatas,
              chain,
              accountAddress,
              cache,
            );
          },
        );
      });
    });
  }

  protected upsertCache(
    newlyAddedNftHistories: WalletNFTHistory[],
    newlyAddedNftDatas: WalletNFTData[],
    chain: EChain,
    accountAddress: AccountAddress,
    cache: NftRepositoryCache,
  ): void {
    const currentChain = cache.get(chain);
    if (newlyAddedNftHistories.length < 1 && newlyAddedNftDatas.length < 1) {
      if (currentChain == null) {
        cache.set(chain, {
          data: new Map(),
          lastUpdateTime: this.timeUtils.getUnixNow(),
        });
      }
      return;
    }
    const nftHistoriesMap = this.getNftIdToWalletHistoryMap(
      newlyAddedNftHistories,
    );

    if (currentChain == null) {
      this.addNewChainToCache(
        cache,
        newlyAddedNftDatas,
        nftHistoriesMap,
        chain,
        accountAddress,
      );
      return;
    }

    const currentAccount = currentChain.data.get(accountAddress);
    if (currentAccount != null) {
      this.addNewHistoriesToExistingRecordsOnCache(
        nftHistoriesMap,
        currentAccount,
        currentChain,
      );
      this.upsertNewAccountToExistingChainOnCache(
        newlyAddedNftDatas,
        chain,
        nftHistoriesMap,
        currentChain,
        accountAddress,
        currentAccount,
      );
    } else {
      this.upsertNewAccountToExistingChainOnCache(
        newlyAddedNftDatas,
        chain,
        nftHistoriesMap,
        currentChain,
        accountAddress,
      );
    }
  }

  protected addNewHistoriesToExistingRecordsOnCache(
    nftHistoriesMap: NftIdToWalletHistoryMap,
    currentAccount: NftIdToHistoryMap,
    currentChain: AccountNftsWithUpdateObject,
  ): void {
    nftHistoriesMap.forEach((totalHistory, id) => {
      const currentDbNft = currentAccount.get(id);
      if (currentDbNft == null) {
        return;
      }

      const newHistory = totalHistory.history[totalHistory.history.length - 1];

      const changeAmount = this.bigNumberUtils.BNSToBN(newHistory.amount);
      const newAmount =
        newHistory.event === EIndexedDbOp.Added
          ? this.bigNumberUtils.BNSToBN(currentDbNft.totalAmount) + changeAmount
          : this.bigNumberUtils.BNSToBN(currentDbNft.totalAmount) -
            changeAmount;

      currentDbNft.totalAmount = this.bigNumberUtils.BNToBNS(newAmount);
      currentDbNft.history.push({
        measurementDate: newHistory.measurementDate,
        amount: newHistory.amount,
        event: newHistory.event,
      });

      if (currentChain.lastUpdateTime < newHistory.measurementDate) {
        currentChain.lastUpdateTime = newHistory.measurementDate;
      }
    });
  }

  protected upsertNewAccountToExistingChainOnCache(
    newlyAddedNftDatas: WalletNFTData[],
    chain: EChain,
    nftHistoriesMap: NftIdToWalletHistoryMap,
    currentChain: AccountNftsWithUpdateObject,
    accountAddress: AccountAddress,
    currentAccount?: NftIdToHistoryMap,
  ): void {
    const accountNftsMap =
      this.walletDataToChainNftMap(newlyAddedNftDatas).get(chain);

    if (accountNftsMap == null) {
      return;
    }

    const accountWithWalletHistories = this.getAccountsWithWalletHistoriesData(
      accountNftsMap,
      nftHistoriesMap,
      [accountAddress],
    );

    const newUpdateTime = accountWithWalletHistories.lastUpdateTime;
    const newAccountData = accountWithWalletHistories.data.get(accountAddress);
    if (newAccountData == null) {
      return;
    }

    if (currentChain.lastUpdateTime < newUpdateTime) {
      currentChain.lastUpdateTime = newUpdateTime;
    }

    if (currentAccount != null) {
      newAccountData.forEach((walletNftWithHistory, id) => {
        currentAccount.set(id, {
          nft: {
            ...walletNftWithHistory.nft,
          },
          history: [...walletNftWithHistory.history],
          totalAmount: walletNftWithHistory.totalAmount,
          owner: walletNftWithHistory.owner,
          id: walletNftWithHistory.id,
        });
      });
    } else {
      currentChain.data.set(accountAddress, newAccountData);
    }
  }
  protected addNewChainToCache(
    cache: NftRepositoryCache,
    newlyAddedNftDatas: WalletNFTData[],
    nftHistoriesMap: NftIdToWalletHistoryMap,
    chain: EChain,
    accountAddress: AccountAddress,
  ): void {
    const accountNftsMap =
      this.walletDataToChainNftMap(newlyAddedNftDatas).get(chain);
    if (accountNftsMap == null) {
      return;
    }

    const newAccountData = this.getAccountsWithWalletHistoriesData(
      accountNftsMap,
      nftHistoriesMap,
      [accountAddress],
    );

    cache.set(chain, newAccountData);
  }

  protected performNftsUpdate(
    accountAddress: AccountAddress,
    chain: EChain,
  ): ResultAsync<
    [WalletNFTHistory[], WalletNFTData[], EChain, AccountAddress],
    never
  > {
    return ResultUtils.combine([
      this.masterIndexer.getLatestNFTs(chain, accountAddress),
      this.getNftCache(),
      this.contextProvider.getContext(),
    ])
      .andThen(([indexerResponse, nftCache, context]) => {
        const [newlyAddedNftHistories, newlyAddedNftDatas] =
          this.checkForChangesInNftOwnership(
            indexerResponse,
            nftCache,
            chain,
            accountAddress,
          );
        return ResultUtils.combine([
          this.addNftDatasToIndexedDb(newlyAddedNftDatas),
          this.addNftHistoryToIndexedDb(newlyAddedNftHistories),
        ]).map(() => {
          context.publicEvents.onNftBalanceUpdate.next(
            new PortfolioUpdate(
              accountAddress,
              chain,
              this.timeUtils.getUnixNow(),
              indexerResponse,
            ),
          );

          return [
            newlyAddedNftHistories,
            newlyAddedNftDatas,
            chain,
            accountAddress,
          ] as [WalletNFTHistory[], WalletNFTData[], EChain, AccountAddress];
        });
      })
      .orElse((e) => {
        this.logUtils.error(
          `In performNftsUpdates, received an error while updating nfts for chain ${chain} for account address ${accountAddress}.`,
          e,
        );
        return okAsync([[], [], chain, accountAddress] as [
          WalletNFTHistory[],
          WalletNFTData[],
          EChain,
          AccountAddress,
        ]);
      });
  }

  /**
   *
   * @see {@link getIndexerNftsAndUpdateIndexedDb}
   */
  protected checkForChangesInNftOwnership(
    indexerResponse: WalletNFT[],
    nftCache: NftRepositoryCache,
    chain: EChain,
    accountAddress: AccountAddress,
  ): [WalletNFTHistory[], WalletNFTData[]] {
    const newlyAddedNftHistories: WalletNFTHistory[] = [];
    const newlyAddedNfts: WalletNFTData[] = [];

    const storedChainNfts = nftCache.get(chain);
    if (storedChainNfts == null) {
      const [nonExistingChainRecords, nonExistingChainNfts] =
        this.getRecordsForNonExistingChainOrAccountOnDb(indexerResponse);

      newlyAddedNftHistories.push(...nonExistingChainRecords);
      newlyAddedNfts.push(...nonExistingChainNfts);

      return [newlyAddedNftHistories, newlyAddedNfts];
    }

    const storedAccountsChainNfts = storedChainNfts.data.get(accountAddress);
    if (storedAccountsChainNfts == null) {
      const [nonExistingAccountRecords, nonExistingAccountNfts] =
        this.getRecordsForNonExistingChainOrAccountOnDb(indexerResponse);

      newlyAddedNftHistories.push(...nonExistingAccountRecords);
      newlyAddedNfts.push(...nonExistingAccountNfts);

      return [newlyAddedNftHistories, newlyAddedNfts];
    }

    const indexerWalletIdToNft = this.getWalletIdToNftMap(indexerResponse);
    const [recordsForExistingChain, newNftsForTheExistingAccountAndChain] =
      this.getRecordsForExistingChainAndAccountData(
        indexerWalletIdToNft,
        storedAccountsChainNfts,
      );

    newlyAddedNftHistories.push(...recordsForExistingChain);
    newlyAddedNfts.push(...newNftsForTheExistingAccountAndChain);

    const recordsForTheTransferredNfts =
      this.getRecordsForNftsThatAreTransferred(
        indexerWalletIdToNft,
        storedAccountsChainNfts,
      );

    newlyAddedNftHistories.push(...recordsForTheTransferredNfts);

    return [newlyAddedNftHistories, newlyAddedNfts];
  }

  protected getRecordsForNftsThatAreTransferred(
    indexerNfts: WalletIdToWalletNftMap,
    storedAccountsChainNfts: Map<NftAddressesWithTokenId, WalletNftWithHistory>,
  ): WalletNFTHistory[] {
    const newlyAddedNftHistories: WalletNFTHistory[] = [];
    storedAccountsChainNfts.forEach((dbNft, id) => {
      const indexerNft = indexerNfts.get(id);
      if (indexerNft == null) {
        const nftHistory = this.addOrRemoveWalletNftRecordInDb(
          dbNft,
          EIndexedDbOp.Removed,
          this.timeUtils.getUnixNow(),
        );
        newlyAddedNftHistories.push(nftHistory);
      }
    });
    return newlyAddedNftHistories;
  }

  protected getRecordsForExistingChainAndAccountData(
    indexerNfts: WalletIdToWalletNftMap,
    storedAccountsChainNfts: Map<NftAddressesWithTokenId, WalletNftWithHistory>,
  ): [WalletNFTHistory[], WalletNFTData[]] {
    const newlyAddedNftHistories: WalletNFTHistory[] = [];
    const newlyAddedNfts: WalletNFTData[] = [];
    indexerNfts.forEach((indexerNft, id) => {
      const dbNft = storedAccountsChainNfts.get(id);
      if (dbNft == null) {
        //new nft added
        const [nftHistory, nftData] = this.getHistoryAndDataFromNewNft(
          indexerNft,
          EIndexedDbOp.Added,
        );
        newlyAddedNftHistories.push(nftHistory);
        newlyAddedNfts.push(nftData);
      } else {
        if (this.bigNumberUtils.BNSToBN(dbNft.totalAmount) == 0n) {
          // User transferred the nft at some point, now got it back
          const [nftHistory] = this.getHistoryAndDataFromNewNft(
            indexerNft,
            EIndexedDbOp.Added,
          );
          newlyAddedNftHistories.push(nftHistory);
        } else {
          const dbAmount = this.bigNumberUtils.BNSToBN(dbNft.totalAmount);
          const indexerAmount = this.bigNumberUtils.BNSToBN(indexerNft.amount);
          const amountDifference = indexerAmount - dbAmount;
          // if amount diffirence is zero, no change occured
          if (amountDifference != 0n) {
            // This is possible for erc1155, not for erc721 since its amount can only be 1
            const op =
              amountDifference < 0n ? EIndexedDbOp.Removed : EIndexedDbOp.Added;

            const nftHistory = this.createNftHistory(
              this.bigNumberUtils.BNToBNS(
                amountDifference < 0n ? -amountDifference : amountDifference,
              ), // ABS(amountDifference)
              id,
              op,
              indexerNft.measurementDate,
            );

            newlyAddedNftHistories.push(nftHistory);
          }
        }
      }
    });

    return [newlyAddedNftHistories, newlyAddedNfts];
  }

  protected getRecordsForNonExistingChainOrAccountOnDb(
    indexerResponse: WalletNFT[],
  ): [WalletNFTHistory[], WalletNFTData[]] {
    const newlyAddedNftHistories: WalletNFTHistory[] = [];
    const newlyAddedNfts: WalletNFTData[] = [];
    indexerResponse.forEach((newNft) => {
      const [nftHistory, walletNftData] = this.getHistoryAndDataFromNewNft(
        newNft,
        EIndexedDbOp.Added,
      );
      newlyAddedNftHistories.push(nftHistory);
      newlyAddedNfts.push(walletNftData);
    });

    return [newlyAddedNftHistories, newlyAddedNfts];
  }

  protected getHistoryAndDataFromNewNft(
    newNft: WalletNFT,
    op: EIndexedDbOp,
  ): [WalletNFTHistory, WalletNFTData] {
    const measurementDate = newNft.measurementDate;
    const nftHistory = this.addOrRemoveWalletNftRecordInDb(
      newNft,
      op,
      measurementDate,
    );
    const walletNftData = this.getNftDataFromWalletNFT(newNft);
    return [nftHistory, walletNftData];
  }

  protected createWalletNftWithHistory(
    walletNft: WalletNFT,
    nftHistory: WalletNFTHistory,
  ): WalletNftWithHistory {
    const { amount, measurementDate, ...rest } = walletNft;
    return {
      nft: rest,
      history: [
        {
          measurementDate,
          amount: nftHistory.amount,
          event: EIndexedDbOp.Added,
        },
      ],
      totalAmount: nftHistory.amount,
      owner: walletNft.owner,
      id: this.createIdFromWalletNft(walletNft),
    };
  }

  protected getWalletNftsWithHistoryMap(
    walletNftDatas: WalletNFTData[],
    nftHistories: WalletNFTHistory[],
    storedAccounts: AccountAddress[],
  ): NftRepositoryCache {
    const nftHistoriesMap = this.getNftIdToWalletHistoryMap(nftHistories);

    const chainToWalletNftMap = this.walletDataToChainNftMap(walletNftDatas);

    const walletNftWithHistoryMap: NftRepositoryCache = new Map();

    chainToWalletNftMap.forEach((walletNfts, chain) => {
      const cachedData = this.getAccountsWithWalletHistoriesData(
        walletNfts,
        nftHistoriesMap,
        storedAccounts,
      );
      walletNftWithHistoryMap.set(chain, cachedData);
    });

    return walletNftWithHistoryMap;
  }

  protected getAccountsWithWalletHistoriesData(
    walletNfts: Map<NftAddressesWithTokenId, WalletNFTData>,
    nftHistoriesMap: NftIdToWalletHistoryMap,
    storedAccounts: AccountAddress[],
  ): AccountNftsWithUpdateObject {
    return Array.from(walletNfts.entries()).reduce<AccountNftsWithUpdateObject>(
      (walletNftWithHistoryAndLastUpdateTime, [id, walletNft]) => {
        if (!storedAccounts.includes(walletNft.nft.owner)) {
          //old records of an unlinked address
          return walletNftWithHistoryAndLastUpdateTime;
        }
        const nftHistory = nftHistoriesMap.get(id)?.history;
        const nftHistoryTotalAmount = nftHistoriesMap.get(id)?.totalAmount;
        const nftWithHistory: WalletNftWithHistory = {
          nft: walletNft.nft,
          history: nftHistory ?? [],
          totalAmount: nftHistoryTotalAmount ?? BigNumberString("0"),
          owner: walletNft.nft.owner,
          id: walletNft.id,
        };

        const accountNfts = walletNftWithHistoryAndLastUpdateTime.data.get(
          walletNft.nft.owner,
        );

        if (accountNfts == null) {
          walletNftWithHistoryAndLastUpdateTime.data.set(
            walletNft.nft.owner,
            new Map([[nftWithHistory.id, nftWithHistory]]),
          );
        } else {
          accountNfts.set(nftWithHistory.id, nftWithHistory);
        }

        walletNftWithHistoryAndLastUpdateTime.lastUpdateTime = nftHistory
          ? nftHistory[nftHistory.length - 1].measurementDate
          : UnixTimestamp(0);
        return walletNftWithHistoryAndLastUpdateTime;
      },
      { data: new Map(), lastUpdateTime: UnixTimestamp(0) },
    );
  }

  protected walletDataToChainNftMap(
    walletNftDatas: WalletNFTData[],
  ): Map<EChain, Map<NftAddressesWithTokenId, WalletNFTData>> {
    return walletNftDatas.reduce<
      Map<EChain, Map<NftAddressesWithTokenId, WalletNFTData>>
    >((map, walletNftData) => {
      const chain = walletNftData.nft.chain;
      const chainMap = map.get(chain);
      if (chainMap == null) {
        map.set(chain, new Map([[walletNftData.id, walletNftData]]));
      } else {
        chainMap.set(walletNftData.id, walletNftData);
      }
      return map;
    }, new Map());
  }

  protected getWalletIdToNftMap(
    walletNfts: WalletNFT[],
  ): WalletIdToWalletNftMap {
    return new Map(
      walletNfts.map((walletNft) => {
        const nftId = this.createIdFromWalletNft(walletNft);
        return [nftId, walletNft];
      }),
    );
  }

  protected sortWalletNftHistories(nftHistories: WalletNFTHistory[]) {
    nftHistories.sort((a, b) => {
      const [_idA, measurementDateA] =
        this.getTimestampAndIdFromWalletNftHistoryId(a);
      const [_idB, measurementDateB] =
        this.getTimestampAndIdFromWalletNftHistoryId(b);
      return measurementDateA - measurementDateB;
    });
    return nftHistories;
  }

  protected getTimestampAndIdFromWalletNftHistoryId(
    nftHistory: WalletNFTHistory,
  ): [NftAddressesWithTokenId, UnixTimestamp] {
    const [nftIdString, measurementDateString] = nftHistory.id.split("{-}");

    return [
      NftAddressesWithTokenId(nftIdString),
      UnixTimestamp(parseInt(measurementDateString)),
    ];
  }

  protected getNftIdToWalletHistoryMap(
    nftHistories: WalletNFTHistory[],
  ): NftIdToWalletHistoryMap {
    this.sortWalletNftHistories(nftHistories);
    return nftHistories.reduce<NftIdToWalletHistoryMap>((map, nftHistory) => {
      const [nftId, measurementDate] =
        this.getTimestampAndIdFromWalletNftHistoryId(nftHistory);

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
        return this.persistence
          .updateRecord(ERecordKey.NFTS_HISTORY, nftHistory)
          .orElse((_e) => {
            return okAsync(undefined);
          });
      }),
    );
  }

  protected addNftDatasToIndexedDb(
    nftDatas: WalletNFTData[],
  ): ResultAsync<void[], PersistenceError> {
    return ResultUtils.combine(
      nftDatas.map((nftData) => {
        return this.persistence
          .updateRecord(ERecordKey.NFTS, nftData)
          .orElse((_e) => {
            return okAsync(undefined);
          });
      }),
    );
  }

  protected getNftDataFromWalletNFT(nft: WalletNFT): WalletNFTData {
    const id = this.createIdFromWalletNft(nft);
    const { amount, measurementDate, ...rest } = nft;
    return new WalletNFTData(id, rest);
  }

  protected getNftCache(): ResultAsync<NftRepositoryCache, PersistenceError> {
    if (this._nftCache == null) {
      return ResultUtils.combine([
        this.getPersistenceNFTs(),
        this.getNFTsHistory(),
        this.getAccounts(),
      ]).map(([dnNfts, nftHistories, linkedAccounts]) => {
        const cacheCreatedFromIndexDb = this.getWalletNftsWithHistoryMap(
          dnNfts,
          nftHistories,
          linkedAccounts.map(
            (linkedAccount) => linkedAccount.sourceAccountAddress,
          ),
        );
        this._nftCache = cacheCreatedFromIndexDb;
        return this._nftCache;
      });
    }

    return okAsync(this._nftCache);
  }

  protected getShibuyaRewards(rewards: EarnedReward[]): DirectReward[] {
    return rewards.reduce<DirectReward[]>((shibuyaRewards, reward) => {
      if (this.isDirectReward(reward) && reward.chainId === EChain.Shibuya) {
        shibuyaRewards.push(reward);
      }

      return shibuyaRewards;
    }, []);
  }

  protected isDirectReward(reward: EarnedReward): reward is DirectReward {
    return reward.type == ERewardType.Direct;
  }
  protected getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError> {
    return this.persistence.getAll<EarnedReward>(
      ERecordKey.EARNED_REWARDS,
      undefined,
    );
  }

  protected getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.persistence
      .getAll<LinkedAccount>(ERecordKey.ACCOUNT)
      .map((accounts) => {
        return accounts.map((account) => {
          account.sourceAccountAddress =
            DataValidationUtils.removeChecksumFromAccountAddress(
              account.sourceAccountAddress,
              account.sourceChain,
            );
          return account;
        });
      });
  }

  //Should not exist long term, wrong in many ways
  protected earnedRewardsToNFTs(): ResultAsync<EVMNFT[], PersistenceError> {
    return ResultUtils.combine([
      this.getEarnedRewards(),
      this.configProvider.getConfig(),
    ]).map(([rewards, config]) => {
      return this.getShibuyaRewards(rewards).map<EVMNFT>((reward) => {
        const nft = new EVMNFT(
          reward.contractAddress,
          BigNumberString("1"),
          EContractStandard.Unknown,
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
          UnixTimestamp(0),
          undefined,
          undefined,
        );
        return nft;
      });
    });
  }

  protected addOrRemoveWalletNftRecordInDb(
    indexerNft: WalletNFT | WalletNftWithHistory,
    op: EIndexedDbOp,
    measurementDate: UnixTimestamp,
  ): WalletNFTHistory {
    if (this.isWalletNft(indexerNft)) {
      const id = this.createIdFromWalletNft(indexerNft);
      return this.createNftHistory(indexerNft.amount, id, op, measurementDate);
    }
    return this.createNftHistory(
      indexerNft.totalAmount,
      indexerNft.id,
      EIndexedDbOp.Removed,
      measurementDate,
    );
  }

  protected createNftHistory(
    amount: BigNumberString,
    nftId: NftAddressesWithTokenId,
    op: EIndexedDbOp,
    measurementDate: UnixTimestamp,
  ): WalletNFTHistory {
    const id = this.getNftIdWithMeasurementDate(nftId, measurementDate);
    return new WalletNFTHistory(id, op, amount);
  }

  protected createIdFromWalletNft(nft: WalletNFT): NftAddressesWithTokenId {
    let id: string;
    if (this.isEVMNft(nft)) {
      id = `${nft.owner}|#|${nft.token}|#|${nft.tokenId.toString()}`;
    } else if (this.isSolanaNft(nft)) {
      id = `${nft.owner}|#|${nft.updateAuthority}|#|${nft.mint.toString()}`;
    } else {
      const suiNft = nft as SuiNFT;
      id = `${nft.owner}|#|${suiNft.token}|#|${suiNft.tokenId.toString()}`;
    }
    return NftAddressesWithTokenId(id);
  }

  protected getNftIdWithMeasurementDate(
    tokenAddress: NftAddressesWithTokenId,
    measurementDate: UnixTimestamp,
  ): NftIdWithMeasurementDate {
    const id = `${tokenAddress}{-}${measurementDate.toString()}`;
    return NftIdWithMeasurementDate(id);
  }

  /**
   * Only checks the type field !
   */
  protected isEVMNft(nft: Record<string, unknown> | WalletNFT): nft is EVMNFT {
    return nft.type === EChainTechnology.EVM;
  }

  /**
   * Only checks the type field !
   */
  protected isSolanaNft(
    nft: Record<string, unknown> | WalletNFT,
  ): nft is SolanaNFT {
    return nft.type === EChainTechnology.Solana;
  }

  /**
   * Only checks the type field !
   */
  protected isSuiNft(nft: Record<string, unknown> | WalletNFT): nft is SuiNFT {
    return nft.type === EChainTechnology.Sui;
  }

  /**
   * Only checks the type field !
   */
  protected isWalletNft(
    nft: Record<string, unknown> | WalletNFT,
  ): nft is WalletNFT {
    return nft.type != null;
  }
}

type NftIdToHistoryMap = Map<NftAddressesWithTokenId, WalletNftWithHistory>;
type WalletIdToWalletNftMap = Map<NftAddressesWithTokenId, WalletNFT>;
type AccountNftsWithUpdateObject = {
  data: Map<AccountAddress, NftIdToHistoryMap>;
  lastUpdateTime: UnixTimestamp;
};
type NftIdToWalletHistoryMap = Map<
  NftAddressesWithTokenId,
  Pick<WalletNftWithHistory, "history" | "totalAmount">
>;
