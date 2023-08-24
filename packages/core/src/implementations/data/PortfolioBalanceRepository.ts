import {
  ILogUtilsType,
  ILogUtils,
  ObjectUtils,
  TimedCache,
  ITimeUtilsType,
  ITimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  IMasterIndexer,
  IMasterIndexerType,
} from "@snickerdoodlelabs/indexers";
import {
  LinkedAccount,
  TokenBalance,
  PersistenceError,
  WalletNFT,
  AccountIndexingError,
  AjaxError,
  chainConfig,
  isAccountValidForChain,
  AccountAddress,
  EVMAccountAddress,
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
  IPortfolioBalanceRepository,
} from "@core/interfaces/data/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class PortfolioBalanceRepository implements IPortfolioBalanceRepository {
  private _balanceCache?: ResultAsync<TimedCache<TokenBalance[]>, never>;
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
    // reset portfolio cache on account addition and removal
    this.contextProvider.getContext().map((context) => {
      context.publicEvents.onAccountAdded.subscribe((account) =>
        this._clearPortfolioCaches(account),
      );
      context.publicEvents.onAccountRemoved.subscribe((account) =>
        this._clearPortfolioCaches(account),
      );
    });
  }

  public getAccountBalances(
    chains?: EChain[],
    accounts?: LinkedAccount[],
    filterEmpty = true,
  ): ResultAsync<TokenBalance[], PersistenceError> {
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
      // Only get the supported chains for balances!
      this.masterIndexer.getSupportedChains(EIndexerMethod.Balances),
    ])
      .andThen(([linkedAccounts, supportedChains]) => {
        return ResultUtils.combine(
          (accounts ?? linkedAccounts).map((linkedAccount) => {
            return ResultUtils.combine(
              (chains ?? supportedChains).map((chain) => {
                if (!isAccountValidForChain(chain, linkedAccount)) {
                  return okAsync([]);
                }

                return this.getCachedBalances(
                  chain,
                  linkedAccount.sourceAccountAddress as EVMAccountAddress,
                );
              }),
            );
          }),
        );
      })
      .map((balancesArr) => {
        return balancesArr.flat(2).filter((x) => {
          return !filterEmpty || x.balance != "0";
        });
      })
      .mapErr((e) => new PersistenceError("error aggregating balances", e));
  }

  public getAccountNFTs(
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

                return this.getCachedNFTs(
                  chain,
                  linkedAccount.sourceAccountAddress,
                );
              }),
            );
          }),
        );
      })
      .map((nftArr) => {
        return nftArr.flat(2);
      })
      .mapErr((e) => new PersistenceError("error aggregating nfts", e));
  }

  private getCachedBalances(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return ResultUtils.combine([
      this._getBalanceCache(),
      this.contextProvider.getContext(),
    ]).andThen(([cache, context]) => {
      const cacheResult = cache.get(chain, accountAddress);
      if (cacheResult != null) {
        return okAsync(cacheResult);
      }
      return this.masterIndexer
        .getLatestBalances(chain, accountAddress)
        .map((result) => {
          context.publicEvents.onTokenBalanceUpdate.next(
            new PortfolioUpdate(
              accountAddress,
              chain,
              new Date().getTime(),
              result,
            ),
          );
          return result;
        })
        .map((tokenBalances) => {
          cache.set(tokenBalances, chain, accountAddress);
          return tokenBalances;
        });
    });
  }

  private getCachedNFTs(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    | PersistenceError
    | AjaxError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this._getNftCache().andThen((cache) => {
      const cacheResult = cache.get(chain, accountAddress);

      if (cacheResult != null) {
        return okAsync(cacheResult);
      }

      // getSupportedChains() is not exactly expensive but we don't need to do it if we have a cache hit
      return ResultUtils.combine([
        this.contextProvider.getContext(),
        this.masterIndexer.getSupportedChains(EIndexerMethod.NFTs),
      ]).andThen(([context, supportedChains]) => {
        // For some chains, we don't have a way to index NFTs yet.
        // For these chains, we'll just return the earned rewards as NFTs.
        // chain == EChain.Astar || chain == EChain.Shibuya
        if (!supportedChains.includes(chain)) {
          return this.earnedRewardsToNFTs(chain).map((nfts) => {
            cache.set(nfts, chain, accountAddress);
            return nfts;
          });
        }

        return this.masterIndexer
          .getLatestNFTs(chain, accountAddress)
          .map((nfts) => {
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
          });
      });
    });
  }

  private _clearPortfolioCaches(
    account: LinkedAccount,
  ): ResultAsync<void, never> {
    return ResultUtils.combine([this._getBalanceCache(), this._getNftCache()])
      .map(([balanceCache, nftCache]) => {
        chainConfig.forEach((_, chainId) => {
          if (isAccountValidForChain(chainId, account)) {
            balanceCache.clear(chainId, account.sourceAccountAddress);
            nftCache.clear(chainId, account.sourceAccountAddress);
          }
        });
      })
      .map(() => undefined);
  }

  private _getBalanceCache(): ResultAsync<TimedCache<TokenBalance[]>, never> {
    if (this._balanceCache == null) {
      this._balanceCache = this.configProvider.getConfig().map((config) => {
        return new TimedCache<TokenBalance[]>(
          Math.floor(config.accountBalancePollingIntervalMS / 1000),
          this.timeUtils,
        );
      });
    }

    return this._balanceCache;
  }

  protected _getNftCache(): ResultAsync<TimedCache<WalletNFT[]>, never> {
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
