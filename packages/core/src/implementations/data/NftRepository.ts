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
import { okAsync, ResultAsync } from "neverthrow";
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
  ) {}

  public getPersistenceNFTs(): ResultAsync<WalletNFTData[], PersistenceError> {
    return this.persistence.getAll<WalletNFTData>(ERecordKey.NFTS);
  }

  public getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError> {
    return this.persistence.getAll<WalletNFTHistory>(ERecordKey.NFTS_HISTORY);
  }

  public getNFTCache(): ResultAsync<NftRepositoryCache, PersistenceError> {
    return this.getNftCache();
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
   * @returns indexer nft responses, used for events
   */
  protected getIndexerNftsAndUpdateIndexedDb(
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
    if (chains && accounts) {
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
      if (chainsThatNeedsUpdating.length > 0 && benchmark != null) {
        return this.getIndexerNftsAndUpdateIndexedDb(
          undefined,
          chainsThatNeedsUpdating,
        ).andThen(() => {
          return this.getNftCache().map((updatedCache) => {
            this.getValidAccountNftsFromCache(
              chains,
              accounts,
              updatedCache,
              cachedNfts,
            );

            for (const chainsThatNeedsUpdate of chainsThatNeedsUpdating) {
              const possibleUpdatedChain = updatedCache.get(
                chainsThatNeedsUpdate,
              );
              if (possibleUpdatedChain != null) {
                if (possibleUpdatedChain.lastUpdateTime < benchmark) {
                  //No new nft found for the user
                  possibleUpdatedChain.lastUpdateTime = benchmark;
                }
              }
            }
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
        this.addNftDatasToIndexedDb(newlyAddedNfts),
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

        this.mergeCache(this._nftCache!, updatedCache);

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
          indexerResponse,
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

  protected mergeCache(
    existingCache: NftRepositoryCache,
    newCacheData: NftRepositoryCache,
  ): NftRepositoryCache {
    newCacheData.forEach((newChainData, chainKey) => {
      const existingChainData = existingCache.get(chainKey);
      if (existingChainData) {
        newChainData.data.forEach((newAccountData, accountKey) => {
          const existingAccountData = existingChainData.data.get(accountKey);
          if (existingAccountData) {
            newAccountData.forEach((newNftData, nftKey) => {
              existingAccountData.set(nftKey, newNftData);
            });
          } else {
            existingChainData.data.set(accountKey, newAccountData);
          }
        });

        existingChainData.lastUpdateTime = UnixTimestamp(
          Math.max(
            existingChainData.lastUpdateTime,
            newChainData.lastUpdateTime,
          ),
        );
      } else {
        existingCache.set(chainKey, newChainData);
      }
    });

    return existingCache;
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
            this.isEVMNft(indexerNft) &&
            indexerNft.amount &&
            indexerNft.contractType === EContractStandard.Erc1155
          ) {
            if (dbNft.totalAmount === BigNumberString("0")) {
              const nftHistory = this.createNftHistory(
                indexerNft.amount,
                id,
                EIndexedDbOp.Added,
                indexerNft.measurementDate,
              );

              newlyAddedNftHistories.push(nftHistory);
              this.addNftHistoryOfAnExistingNftToCache(
                chain,
                updatedCache,
                nftHistory,
                id,
                indexerNft.owner,
                indexerNft.measurementDate,
              );
            } else {
              const dbAmount = BigNumber.from(dbNft.totalAmount);
              const indexerAmount = BigNumber.from(indexerNft.amount);
              const amountDifference = indexerAmount.sub(dbAmount);

              if (!amountDifference.isZero()) {
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

                this.addNftHistoryOfAnExistingNftToCache(
                  chain,
                  updatedCache,
                  nftHistory,
                  id,
                  indexerNft.owner,
                  indexerNft.measurementDate,
                );
              }
            }
          } else {
            //User could transferred and then got the nft back
            if (dbNft.totalAmount === BigNumberString("0")) {
              const nftHistory = this.createNftHistory(
                BigNumberString("1"),
                id,
                EIndexedDbOp.Added,
                indexerNft.measurementDate,
              );

              newlyAddedNftHistories.push(nftHistory);
              this.addNftHistoryOfAnExistingNftToCache(
                chain,
                updatedCache,
                nftHistory,
                id,
                indexerNft.owner,
                indexerNft.measurementDate,
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
    indexerResponse: WalletNFT[],
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

              existingNftHistory.totalAmount = BigNumberString("0");

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
    const measurementDate = indexerNft.measurementDate;
    const nftHistory = this.addOrRemoveWalletNftRecordInDb(
      indexerNft,
      EIndexedDbOp.Added,
      measurementDate,
    );
    const walletNftWithHistory = this.createWalletNftWithHistory(
      indexerNft,
      nftHistory,
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
  ): NftRepositoryCache {
    const nftHistoriesMap = this.getNftIdToWalletHistoryMap(nftHistories);

    const chainToWalletNftMap = this.walletDataToChainNftMap(walletNftDatas);

    Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFT>>;

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
          const nftWithHistory: WalletNftWithHistory = {
            nft: walletNft,
            history: nftHistory ?? [],
            totalAmount: nftHistoryTotalAmount ?? BigNumberString("0"),
            owner: walletNft.owner,
            id: this.createIdFromWalletNft(walletNft),
          };

          const accountNfts = walletNftWithHistoryAndLastUpdateTime.data.get(
            walletNft.owner,
          );

          if (accountNfts == null) {
            walletNftWithHistoryAndLastUpdateTime.data.set(
              walletNft.owner,
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
      walletNftWithHistoryMap.set(chain, cachedData);
    });

    return walletNftWithHistoryMap;
  }

  protected walletDataToChainNftMap(
    walletNftDatas: WalletNFTData[],
  ): Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFT>> {
    return walletNftDatas.reduce<
      Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFT>>
    >((map, walletNftData) => {
      const nft = walletNftData.nft;
      if (this.isWalletNft(nft)) {
        const chain = nft.chain;
        const chainMap = map.get(chain);
        if (chainMap == null) {
          map.set(chain, new Map([[walletNftData.id, nft]]));
        } else {
          chainMap.set(walletNftData.id, nft);
        }
        return map;
      }
      return map;
    }, new Map());
  }

  protected getChainToWalletNftMap(
    walletNfts: WalletNFT[],
  ): Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFT>> {
    return walletNfts.reduce<
      Map<EChain, Map<NftTokenAddressWithTokenId, WalletNFT>>
    >((chainToWalletNftMap, walletNft) => {
      const chain = walletNft.chain;
      const chainMap = chainToWalletNftMap.get(chain);
      const nftId = this.createIdFromWalletNft(walletNft);
      if (chainMap == null) {
        chainToWalletNftMap.set(chain, new Map([[nftId, walletNft]]));
      } else {
        chainMap.set(nftId, walletNft);
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
    nfts: WalletNFT[],
  ): ResultAsync<void[], PersistenceError> {
    return ResultUtils.combine(
      nfts.map((nft) => {
        const id = this.createIdFromWalletNft(nft);
        const { amount, measurementDate, ...rest } = nft;
        const data = new WalletNFTData(id, rest);
        return this.persistence.updateRecord(ERecordKey.NFTS, data);
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
    let amount = BigNumberString("1");
    if (
      this.isEVMNft(indexerNft) &&
      indexerNft.contractType === EContractStandard.Erc1155
    ) {
      if (indexerNft.amount) {
        amount = indexerNft.amount;
      }
    }
    if (this.isWalletNft(indexerNft)) {
      const id = this.createIdFromWalletNft(indexerNft);
      return this.createNftHistory(amount, id, op, measurementDate);
    }
    return this.createNftHistory(amount, indexerNft.id, op, measurementDate);
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
