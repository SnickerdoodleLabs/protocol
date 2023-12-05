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
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@snickerdoodlelabs/persistence";
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
  private _nftCache?: ResultAsync<TimedCache<WalletNFT[]>, never>;

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
    // reset nft cache on account addition and removal
    this.contextProvider.getContext().map((context) => {
      context.publicEvents.onAccountAdded.subscribe((account) =>
        this.clearNftCache(account),
      );
      context.publicEvents.onAccountRemoved.subscribe((account) =>
        this.clearNftCache(account),
      );
    });
  }

  /**
   * Retrieves WalletNftWithHistory objects with a benchmark timestamp filter.
   * This method uses both the indexed db and cache nfts
   *
   * @param benchmark The Unix timestamp to filter WalletNftWithHistory objects by.
   * @param chains (Optional) An array of EChain values to filter WalletNftWithHistory objects by chain.
   * @param accounts (Optional) An array of LinkedAccount objects to filter WalletNftWithHistory objects by account.
   * @returns  An array of filtered WalletNftWithHistory objects
   */
  public getNftsWithHistoryUsingBenchmark(
    benchmark: UnixTimestamp,
    chains?: EChain[] | undefined,
    accounts?: LinkedAccount[] | undefined,
  ): ResultAsync<WalletNftWithHistory[], PersistenceError> {
    //Should update the cache first if needed
    return this.getCachedNFTs(chains, accounts).andThen((cachedNfts) => {
      return ResultUtils.combine([
        this.getNFTsHistory(),
        this.getPersistenceNFTs(),
      ]).map(([walletNftHistories, indexedDbNfts]) => {
        const mergedNfts = this.mergeWalletNFTs(indexedDbNfts, cachedNfts);
        const nftsWithHistory = this.addHistoriesToWalletNfts(
          mergedNfts,
          walletNftHistories,
        );
        return this.filterNftHistoriesByTimestamp(benchmark, nftsWithHistory);
      });
    });
  }

  public getPersistenceNFTs(): ResultAsync<WalletNFT[], PersistenceError> {
    return this.persistence.getAll<WalletNFT>(ERecordKey.NFTS);
  }

  public getNFTsHistory(): ResultAsync<WalletNFTHistory[], PersistenceError> {
    return this.persistence.getAll<WalletNFTHistory>(ERecordKey.NFTS_HISTORY);
  }

  public getCachedNftsWithHistory(
    chains?: EChain[] | undefined,
    accounts?: LinkedAccount[] | undefined,
  ): ResultAsync<WalletNftWithHistory[], PersistenceError> {
    //Should update the cache first if needed
    return this.getCachedNFTs(chains, accounts).andThen((cachedNfts) => {
      return this.getNFTsHistory().map((nftHistories) => {
        return this.addHistoriesToWalletNfts(cachedNfts, nftHistories);
      });
    });
  }

  public getCachedNFTs(
    chains?: EChain[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], PersistenceError> {
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
      this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
    ])
      .andThen(([linkedAccounts, supportedChains]) => {
        return ResultUtils.combine(
          (accounts ?? linkedAccounts).map((linkedAccount) => {
            return ResultUtils.combine(
              (chains ?? supportedChains).map((chain) => {
                if (!isAccountValidForChain(chain, linkedAccount)) {
                  return okAsync([]);
                }
                return this.retrieveCache(
                  chain,
                  linkedAccount.sourceAccountAddress,
                  supportedChains,
                );
              }),
            );
          }),
        );
      })
      .map((nftArr) => {
        return nftArr.flat(2);
      })
      .mapErr((e) => new PersistenceError("error aggregating cached nfts", e));
  }

  protected addHistoriesToWalletNfts(
    nfts: WalletNFT[],
    nftHistories: WalletNFTHistory[],
  ): WalletNftWithHistory[] {
    const nftHistoryMap = this.getNftHistoryMap(nftHistories);
    return nfts.reduce<WalletNftWithHistory[]>(
      (walletNftWithHistoryArray, walletNft) => {
        const history = nftHistoryMap.get(walletNft.id) ?? [];
        const walletNftWithHistory: WalletNftWithHistory = {
          ...walletNft,
          history,
        };
        walletNftWithHistoryArray.push(walletNftWithHistory);
        return walletNftWithHistoryArray;
      },
      [],
    );
  }

  protected getNftHistoryMap(
    nftHistories: WalletNFTHistory[],
  ): Map<
    NftTokenAddressWithTokenId,
    { measurementDate: UnixTimestamp; event: EIndexedDbOp }[]
  > {
    return nftHistories.reduce<
      Map<
        NftTokenAddressWithTokenId,
        { measurementDate: UnixTimestamp; event: EIndexedDbOp }[]
      >
    >((map, nftHistory) => {
      const [nftIdString, measurementDateString] = nftHistory.id.split("{-}");
      const nftId = nftIdString as NftTokenAddressWithTokenId;
      const measurementDate = UnixTimestamp(parseInt(measurementDateString));

      if (!map.has(nftId)) {
        map.set(nftId, []);
      }
      map.get(nftId)!.push({ measurementDate, event: nftHistory.event });
      return map;
    }, new Map());
  }

  protected retrieveCache(
    chain: EChain,
    accountAddress: AccountAddress,
    supportedChains: EChain[],
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.getNftCache().andThen((cache) => {
      const cacheResult = cache.get(chain, accountAddress);

      if (cacheResult != null) {
        return okAsync(cacheResult);
      }
      return this.resetNftCache(chain, accountAddress, supportedChains, cache);
    });
  }

  protected resetNftCache(
    chain: EChain,
    accountAddress: AccountAddress,
    supportedChains: EChain[],
    cache: TimedCache<WalletNFT[]>,
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      // For some chains, we don't have a way to index NFTs yet.
      // For these chains, we'll just return the earned rewards as NFTs.
      // chain == EChain.Astar || chain == EChain.Shibuya
      if (!supportedChains.includes(chain)) {
        return this.earnedRewardsToNFTs(chain).map((nfts) => {
          cache.set(nfts, chain, accountAddress);
          return nfts;
        });
      }
      return this.getIndexerNftsAndUpdateIndexedDb(chain, accountAddress).map(
        (nfts) => {
          context.publicEvents.onNftBalanceUpdate.next(
            new PortfolioUpdate(
              accountAddress,
              chain,
              new Date().getTime(),
              nfts,
            ),
          );
          cache.set(nfts, chain, accountAddress);
          return nfts;
        },
      );
    });
  }

  /**
   * This method retrieves NFT data from indexers and updates the indexeddb records accordingly.
   *
   * Key Points:
   * - The primary data source is the indexers.
   * - We need to check if a user has gained or lost an NFT for NFT history purposes.
   * - To achieve this we compare the NFTs stored in indexeddb with the indexer response.
   *
   * If an NFT exists on the indexers but not in our indexeddb, it means the user has gained a new NFT.
   * (Note: We are approaching this from our own side; it's possible that the user already had the NFT, but the indexer failed to retrieve it previously.)
   *
   * If our indexeddb had a record, but we did not receive the NFT from the indexers, it means the user has transferred it.
   * Nft history allows tracking the sequence of NFT ownership changes over time.(Note: From our perspective)
   * @param chain The blockchain chain (e.g., Ethereum, Solana).
   * @param accountAddress The user's account address.
   * @returns NFTs from the indexers.
   */
  protected getIndexerNftsAndUpdateIndexedDb(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return ResultUtils.combine([
      this.getNftsFromIndexers(chain, accountAddress),
      this.getPersistenceNFTs(),
    ]).andThen(([indexerResponse, indexedDbNfts]) => {
      const [missingInIndexer, missingInIndexedDb] =
        this.checkForChangesInNftOwnership(indexerResponse, indexedDbNfts);

      return ResultUtils.combine([
        this.addNftsToIndexedDb(missingInIndexedDb),
        this.addNftHistoryToIndexedDb(missingInIndexer, missingInIndexedDb),
      ]).map(() => {
        return indexerResponse;
      });
    });
  }

  protected filterNftHistoriesByTimestamp(
    benchmark: UnixTimestamp,
    walletNftHistories: WalletNftWithHistory[],
  ): WalletNftWithHistory[] {
    return walletNftHistories.filter((walletNftWithHistory) => {
      const validHistoryItems = walletNftWithHistory.history;

      if (validHistoryItems.length === 0) {
        return false;
      }

      validHistoryItems.sort((a, b) => a.measurementDate - b.measurementDate);

      const insertIndex = validHistoryItems.findIndex(
        (historyItem) => historyItem.measurementDate >= benchmark,
      );

      if (insertIndex === -1) {
        return false;
      }

      if (insertIndex > 0) {
        const latestValidEvent = validHistoryItems[insertIndex - 1];
        return latestValidEvent.event !== EIndexedDbOp.Removed;
      }

      return false;
    });
  }

  protected mergeWalletNFTs(
    nfts: WalletNFT[],
    priorityNfts: WalletNFT[],
  ): WalletNFT[] {
    const mergedMap: Map<NftTokenAddressWithTokenId, WalletNFT> = new Map();

    nfts.forEach((item) => {
      mergedMap.set(item.id, item);
    });

    priorityNfts.forEach((item) => {
      mergedMap.set(item.id, item);
    });

    return [...mergedMap.values()];
  }

  protected getNftsFromIndexers(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.masterIndexer.getLatestNFTs(chain, accountAddress);
  }

  protected addNftHistoryToIndexedDb(
    nftsThatWereTransferred: WalletNFT[],
    nftsThatWereReceived: WalletNFT[],
  ): ResultAsync<void, PersistenceError> {
    const removedNftHistory = this.createNftHistory(
      nftsThatWereTransferred,
      EIndexedDbOp.Removed,
    );

    const addedNftHistory = this.createNftHistory(
      nftsThatWereReceived,
      EIndexedDbOp.Added,
    );

    return ResultUtils.combine([
      ...addedNftHistory.map((nftHistory) => {
        return this.persistence.updateRecord(
          ERecordKey.NFTS_HISTORY,
          nftHistory,
        );
      }),
      ...removedNftHistory.map((nftHistory) => {
        return this.persistence.updateRecord(
          ERecordKey.NFTS_HISTORY,
          nftHistory,
        );
      }),
    ]).map(() => {});
  }

  protected createNftHistory(
    nfts: WalletNFT[],
    op: EIndexedDbOp,
  ): WalletNFTHistory[] {
    return nfts.map((nft) => {
      const id = NftIdWithMeasurementDate(nft.id, this.timeUtils.getUnixNow());
      return new WalletNFTHistory(id, op);
    });
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

  protected checkForChangesInNftOwnership(
    indexerResponse: WalletNFT[],
    indexedDbNfts: WalletNFT[],
  ): [missingInIndexer: WalletNFT[], missingInIndexedDb: WalletNFT[]] {
    const missingInIndexer = indexedDbNfts.filter(
      (dbNft) => !indexerResponse.some((nft) => nft.id === dbNft.id),
    );
    const missingInIndexedDb = indexerResponse.filter(
      (nft) => !indexedDbNfts.some((dbNft) => dbNft.id === nft.id),
    );

    return [missingInIndexer, missingInIndexedDb];
  }

  private clearNftCache(account: LinkedAccount): ResultAsync<void, never> {
    return this.getNftCache().map((nftCache) => {
      chainConfig.forEach((_, chainId) => {
        if (isAccountValidForChain(chainId, account)) {
          nftCache.clear(chainId, account.sourceAccountAddress);
        }
      });
    });
  }

  protected getNftCache(): ResultAsync<TimedCache<WalletNFT[]>, never> {
    if (this._nftCache == null) {
      this._nftCache = this.configProvider.getConfig().map((config) => {
        return new TimedCache<WalletNFT[]>(
          Math.floor(config.accountNFTPollingIntervalMS / 1000),
          this.timeUtils,
        );
      });
    }

    return this._nftCache;
  }

  protected earnedRewardsToNFTs(chain: EChain) {
    return ResultUtils.combine([
      this.accountRepo.getEarnedRewards(),
      this.configProvider.getConfig(),
    ]).map(([rewards, config]) => {
      return (
        rewards.filter((reward) => {
          return (
            reward.type == ERewardType.Direct &&
            (reward as DirectReward).chainId == chain
          );
        }) as DirectReward[]
      ).map((reward) => {
        return new EVMNFT(
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
          BigNumberString("1"),
          reward.name,
          chain,
          undefined,
          undefined,
        );
      });
    });
  }
}
