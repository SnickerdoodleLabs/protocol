import {
  ILogUtilsType,
  ILogUtils,
  ObjectUtils,
  ITimeUtils,
  ITimeUtilsType,
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
  NftTokenAddressWithTokenId,
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
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
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
        this.linkAccount(account),
      );
      context.publicEvents.onAccountRemoved.subscribe((account) =>
        this.unlinkAccount(account),
      );
    });
  }

  public getPersistenceNFTs(): ResultAsync<WalletNFTData[], PersistenceError> {
    return this.persistence.getAll<WalletNFTData>(ERecordKey.NFTS);
  }

  public getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError> {
    return this.persistence.getAll<WalletNFTHistory>(ERecordKey.NFTS_HISTORY);
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
      ])
        .andThen(([dnNfts, nftHistories, cache]) => {
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
        })
        .orElse((e) => {
          this.logUtils.error(
            `In link account, received an error while retrieving history records for account address ${linkedAccount.sourceAccountAddress}.\n
             Suggests problem on persistance layer for old records of address ${linkedAccount.sourceAccountAddress}
          `,
            e,
          );
          return okAsync(undefined);
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
          ) as unknown as Map<NftTokenAddressWithTokenId, WalletNftWithHistory>;
          existingChainData.data.set(accountAddress, deepCopyAccountData);
        }
      } else {
        const deepCopyChain = ObjectUtils.toGenericObject(
          chainData,
        ) as unknown as {
          data: Map<
            AccountAddress,
            Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
          >;
          lastUpdateTime: UnixTimestamp;
        };
        existingCache.set(chain, deepCopyChain);
      }
    });
  }

  protected unlinkAccount({
    sourceAccountAddress,
  }: LinkedAccount): ResultAsync<void, PersistenceError> {
    return this.getNftCache().andThen((cache) => {
      const removedHistories: WalletNFTHistory[] = [];
      const effectedChains: EChain[] = [];
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
          effectedChains.push(chain);
        }
      });
      return this.addNftHistoryToIndexedDb(removedHistories)
        .map(() => {
          effectedChains.forEach((chain) => {
            cache.get(chain)?.data.delete(sourceAccountAddress);
          });
        })
        .orElse((e) => {
          this.logUtils.error(
            `In unlinkAccount, received an error while adding removed history records for account address ${sourceAccountAddress}.\n
             Records still exists!
            `,
            e,
          );
          return okAsync(undefined);
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
        accounts ? okAsync(accounts) : this.accountRepo.getAccounts(),
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
    benchmark?: UnixTimestamp,
  ): ResultAsync<
    WalletNftWithHistory[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.getNftCache().andThen((nftCache) => {
      const chainsThatNeedsUpdating: EChain[] = [];
      const cachedNfts: WalletNftWithHistory[] = [];

      this.populateChainsThatNeedToBeUpdated(
        chains,
        nftCache,
        benchmark,
        chainsThatNeedsUpdating,
      );
      if (chainsThatNeedsUpdating.length > 0 && benchmark != null) {
        return this.getIndexerNftsAndUpdateIndexedDb(
          undefined,
          chainsThatNeedsUpdating,
        ).andThen(() => {
          return this.getNftCache().map((updatedCache) => {
            this.populateResponseWithAccountSpecificNftsFromCache(
              chains,
              accounts,
              updatedCache,
              cachedNfts,
            );

            this.updateCacheTimes(
              chainsThatNeedsUpdating,
              updatedCache,
              benchmark,
            );
            return this.filterNftHistoriesByTimestamp(benchmark, cachedNfts);
          });
        });
      } else {
        this.populateResponseWithAccountSpecificNftsFromCache(
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

  protected populateChainsThatNeedToBeUpdated(
    chains: EChain[],
    nftCache: NftRepositoryCache,
    benchmark: UnixTimestamp | undefined,
    chainsThatNeedsUpdating: EChain[],
  ): void {
    for (const selectedChain of chains) {
      const selectedChainNftCache = nftCache.get(selectedChain);
      if (benchmark != null) {
        if (selectedChainNftCache != null) {
          if (selectedChainNftCache.lastUpdateTime < benchmark) {
            chainsThatNeedsUpdating.push(selectedChain);
          }
        } else {
          chainsThatNeedsUpdating.push(selectedChain);
        }
      }
    }
  }

  protected updateCacheTimes(
    chainsThatNeedsUpdating: EChain[],
    updatedCache: NftRepositoryCache,
    benchmark: UnixTimestamp,
  ): void {
    for (const chainsThatNeedsUpdate of chainsThatNeedsUpdating) {
      const possibleUpdatedChain = updatedCache.get(chainsThatNeedsUpdate);
      if (possibleUpdatedChain != null) {
        if (possibleUpdatedChain.lastUpdateTime < benchmark) {
          //No new nft found for the user, but we did checked for nfts
          possibleUpdatedChain.lastUpdateTime = benchmark;
        }
      }
    }
  }
  protected populateResponseWithAccountSpecificNftsFromCache(
    chains: EChain[],
    accounts: LinkedAccount[],
    cache: NftRepositoryCache,
    cachedNfts: WalletNftWithHistory[],
  ): void {
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
        if (walletNftWithHistory.history.length === 0) {
          return filteredNftHistory;
        }

        const historyWithTotalAmount = {
          data: walletNftWithHistory.history,
          totalAmount: walletNftWithHistory.totalAmount,
        };

        const validHistory = this.findSubarrayByValue(
          historyWithTotalAmount,
          benchmark,
        );
        const newTotalAmount = BigNumber.from(validHistory.totalAmount);
        if (
          validHistory.data.length === 0 ||
          newTotalAmount.isNegative() ||
          newTotalAmount.isZero()
        ) {
          return filteredNftHistory;
        }

        walletNftWithHistory.history = validHistory.data;
        walletNftWithHistory.totalAmount = validHistory.totalAmount;

        filteredNftHistory.push(walletNftWithHistory);

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
    let currentTotal = BigNumber.from(data.totalAmount);
    let index = data.data.length - 1;

    while (index >= 0 && data.data[index].measurementDate > targetValue) {
      const item = data.data[index];
      const amountChange = BigNumber.from(item.amount).mul(item.event);
      currentTotal = currentTotal.sub(amountChange);
      index--;
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
    if (newlyAddedNftHistories.length < 1 && newlyAddedNftDatas.length < 1) {
      return;
    }
    const nftHistoriesMap = this.getNftIdToWalletHistoryMap(
      newlyAddedNftHistories,
    );
    const currentChain = cache.get(chain);
    if (currentChain != null) {
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
    } else {
      this.addNewChainToCache(
        cache,
        newlyAddedNftDatas,
        nftHistoriesMap,
        chain,
        accountAddress,
      );
    }
  }

  protected addNewHistoriesToExistingRecordsOnCache(
    nftHistoriesMap: Map<
      NftTokenAddressWithTokenId,
      Pick<WalletNftWithHistory, "history" | "totalAmount">
    >,
    currentAccount: Map<NftTokenAddressWithTokenId, WalletNftWithHistory>,
    currentChain: {
      data: Map<
        AccountAddress,
        Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
      >;
      lastUpdateTime: UnixTimestamp;
    },
  ): void {
    nftHistoriesMap.forEach((totalHistory, id) => {
      const currentDbNft = currentAccount.get(id);
      if (currentDbNft == null) {
        return;
      }

      const newHistory = totalHistory.history[totalHistory.history.length - 1];

      const changeAmount = BigNumber.from(newHistory.amount);
      const newAmount =
        newHistory.event === EIndexedDbOp.Added
          ? BigNumber.from(currentDbNft.totalAmount).add(changeAmount)
          : BigNumber.from(currentDbNft.totalAmount).sub(changeAmount);
      currentDbNft.totalAmount = BigNumberString(newAmount.toString());
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
    nftHistoriesMap: Map<
      NftTokenAddressWithTokenId,
      Pick<WalletNftWithHistory, "history" | "totalAmount">
    >,
    currentChain: {
      data: Map<
        AccountAddress,
        Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
      >;
      lastUpdateTime: UnixTimestamp;
    },
    accountAddress: AccountAddress,
    currentAccount?: Map<NftTokenAddressWithTokenId, WalletNftWithHistory>,
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
    nftHistoriesMap: Map<
      NftTokenAddressWithTokenId,
      Pick<WalletNftWithHistory, "history" | "totalAmount">
    >,
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
              new Date().getTime(),
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
    if (storedChainNfts != null) {
      const storedAccountsChainNfts = storedChainNfts.data.get(accountAddress);
      if (storedAccountsChainNfts != null) {
        const indexerWalletIdToNft = this.getWalletIdToNftMap(indexerResponse);
        this.createRecordsForNftsThatExistOnBothDbAndIndexers(
          indexerWalletIdToNft,
          storedAccountsChainNfts,
          newlyAddedNftHistories,
          newlyAddedNfts,
        );

        this.createRecordsForNftsThatAreTransferred(
          indexerWalletIdToNft,
          storedAccountsChainNfts,
          newlyAddedNftHistories,
        );
      } else {
        //Newly added account
        this.createRecordsForNonExistingRecordsOnDb(
          indexerResponse,
          newlyAddedNftHistories,
          newlyAddedNfts,
        );
      }
    } else {
      //Newly added chain
      this.createRecordsForNonExistingRecordsOnDb(
        indexerResponse,
        newlyAddedNftHistories,
        newlyAddedNfts,
      );
    }
    return [newlyAddedNftHistories, newlyAddedNfts];
  }

  protected createRecordsForNftsThatAreTransferred(
    indexerNfts: Map<NftTokenAddressWithTokenId, WalletNFT>,
    storedAccountsChainNfts: Map<
      NftTokenAddressWithTokenId,
      WalletNftWithHistory
    >,
    newlyAddedNftHistories: WalletNFTHistory[],
  ): void {
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
  }

  protected createRecordsForNftsThatExistOnBothDbAndIndexers(
    indexerNfts: Map<NftTokenAddressWithTokenId, WalletNFT>,
    storedAccountsChainNfts: Map<
      NftTokenAddressWithTokenId,
      WalletNftWithHistory
    >,
    newlyAddedNftHistories: WalletNFTHistory[],
    newlyAddedNfts: WalletNFTData[],
  ) {
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
        if (dbNft.totalAmount === BigNumberString("0")) {
          // User transferred the nft at some point, now got it back
          const [nftHistory] = this.getHistoryAndDataFromNewNft(
            indexerNft,
            EIndexedDbOp.Added,
          );
          newlyAddedNftHistories.push(nftHistory);
        } else {
          const dbAmount = BigNumber.from(dbNft.totalAmount);
          const indexerAmount = BigNumber.from(indexerNft.amount);
          const amountDifference = indexerAmount.sub(dbAmount);
          // if amount diffirence is zero, no change occured
          if (!amountDifference.isZero()) {
            // This is possible for erc1155, not for erc721 since its amount can only be 1
            const op = amountDifference.isNegative()
              ? EIndexedDbOp.Removed
              : EIndexedDbOp.Added;

            const nftHistory = this.createNftHistory(
              BigNumberString(amountDifference.abs().toString()),
              id,
              op,
              indexerNft.measurementDate,
            );

            newlyAddedNftHistories.push(nftHistory);
          }
        }
      }
    });
  }

  protected createRecordsForNonExistingRecordsOnDb(
    indexerResponse: WalletNFT[],
    newlyAddedNftHistories: WalletNFTHistory[],
    newlyAddedNfts: WalletNFTData[],
  ): void {
    indexerResponse.forEach((newNft) => {
      const [nftHistory, walletNftData] = this.getHistoryAndDataFromNewNft(
        newNft,
        EIndexedDbOp.Added,
      );
      newlyAddedNftHistories.push(nftHistory);
      newlyAddedNfts.push(walletNftData);
    });
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

    Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFT>>;

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
    walletNfts: Map<NftTokenAddressWithTokenId, WalletNFTData>,
    nftHistoriesMap: Map<
      NftTokenAddressWithTokenId,
      Pick<WalletNftWithHistory, "history" | "totalAmount">
    >,
    storedAccounts: AccountAddress[],
  ): {
    data: Map<
      AccountAddress,
      Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
    >;
    lastUpdateTime: UnixTimestamp;
  } {
    return Array.from(walletNfts.entries()).reduce<{
      data: Map<
        AccountAddress,
        Map<NftTokenAddressWithTokenId, WalletNftWithHistory>
      >;
      lastUpdateTime: UnixTimestamp;
    }>(
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
  ): Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFTData>> {
    return walletNftDatas.reduce<
      Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFTData>>
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
  ): Map<NftTokenAddressWithTokenId, WalletNFT> {
    return walletNfts.reduce<Map<NftTokenAddressWithTokenId, WalletNFT>>(
      (walletNftMap, walletNft) => {
        const nftId = this.createIdFromWalletNft(walletNft);
        walletNftMap.set(nftId, walletNft);
        return walletNftMap;
      },
      new Map(),
    );
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
    this.sortWalletNftHistories(nftHistories);
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

  protected addNftDatasToIndexedDb(
    nftDatas: WalletNFTData[],
  ): ResultAsync<void[], PersistenceError> {
    return ResultUtils.combine(
      nftDatas.map((nftData) => {
        return this.persistence.updateRecord(ERecordKey.NFTS, nftData);
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
        this.accountRepo.getAccounts(),
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

  //Should not exist long term, wrong in many ways
  protected earnedRewardsToNFTs(): ResultAsync<EVMNFT[], PersistenceError> {
    return ResultUtils.combine([
      this.accountRepo.getEarnedRewards(),
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
    nftId: NftTokenAddressWithTokenId,
    op: EIndexedDbOp,
    measurementDate: UnixTimestamp,
  ): WalletNFTHistory {
    const id = this.getNftIdWithMeasurementDate(nftId, measurementDate);
    return new WalletNFTHistory(id, op, amount);
  }

  protected createIdFromWalletNft(nft: WalletNFT): NftTokenAddressWithTokenId {
    let id: NftTokenAddressWithTokenId;
    if (this.isEVMNft(nft)) {
      id = this.getNftTokenAddressWithTokenId(nft.token, nft.tokenId);
    } else if (this.isSolanaNft(nft)) {
      id = this.getNftTokenAddressWithTokenId(nft.updateAuthority, nft.mint);
    } else {
      const suiNft = nft as SuiNFT;
      id = this.getNftTokenAddressWithTokenId(suiNft.token, suiNft.tokenId);
    }
    return id;
  }

  protected getNftTokenAddressWithTokenId(
    tokenAddress: TokenAddress,
    tokenId: BigNumberString | SolanaTokenAddress,
  ): NftTokenAddressWithTokenId {
    const id = `${tokenAddress}|#|${tokenId.toString()}`;
    return NftTokenAddressWithTokenId(id);
  }

  protected getNftIdWithMeasurementDate(
    tokenAddress: NftTokenAddressWithTokenId,
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
