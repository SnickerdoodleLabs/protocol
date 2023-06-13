import {
  ILogUtilsType,
  ILogUtils,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  ChainId,
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
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  PortfolioUpdate,
  IMasterIndexerType,
  IMasterIndexer,
  MethodSupportError,
  EChain,
  ERecordKey,
  EarnedReward,
  ERewardType,
  DirectReward,
  EChainTechnology,
  EVMNFT,
  BigNumberString,
  TokenUri,
  URLString,
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  PortfolioCache,
} from "@snickerdoodlelabs/persistence";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
import { urlJoin } from "url-join-ts";

@injectable()
export class PortfolioBalanceRepository implements IPortfolioBalanceRepository {
  private _balanceCache?: ResultAsync<
    PortfolioCache<
      TokenBalance[],
      PersistenceError | AccountIndexingError | AjaxError
    >,
    never
  >;
  private _nftCache?: ResultAsync<
    PortfolioCache<
      WalletNFT[],
      PersistenceError | AccountIndexingError | AjaxError
    >,
    never
  >;

  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IMasterIndexerType)
    protected masterIndexer: IMasterIndexer,
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
    chains?: ChainId[],
    accounts?: LinkedAccount[],
    filterEmpty = true,
  ): ResultAsync<TokenBalance[], PersistenceError> {
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([linkedAccounts, config]) => {
        return ResultUtils.combine(
          (accounts ?? linkedAccounts).map((linkedAccount) => {
            return ResultUtils.combine(
              (chains ?? config.supportedChains).map((chainId) => {
                if (!isAccountValidForChain(chainId, linkedAccount)) {
                  return okAsync([]);
                }

                return this.getCachedBalances(
                  chainId,
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

  private getCachedBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
  > {
    return ResultUtils.combine([
      this._getBalanceCache(),
      this.contextProvider.getContext(),
    ]).andThen(([cache, context]) => {
      return cache.get(chainId, accountAddress).andThen((cacheResult) => {
        if (cacheResult != null) {
          return okAsync(cacheResult);
        }
        const fetch = this.masterIndexer
          .getLatestBalances(chainId, accountAddress)
          .map((result) => {
            context.publicEvents.onTokenBalanceUpdate.next(
              new PortfolioUpdate(
                accountAddress,
                chainId,
                new Date().getTime(),
                result,
              ),
            );
            return result;
          });
        return cache
          .set(chainId, accountAddress, new Date().getTime(), fetch)
          .andThen(() => fetch);
      });
    });
  }

  public getAccountNFTs(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], PersistenceError> {
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([linkedAccounts, config]) => {
        return ResultUtils.combine(
          (accounts ?? linkedAccounts).map((linkedAccount) => {
            return ResultUtils.combine(
              (chains ?? config.supportedChains).map((chainId) => {
                if (!isAccountValidForChain(chainId, linkedAccount)) {
                  return okAsync([]);
                }

                return this.getCachedNFTs(
                  chainId,
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

  private getCachedNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AjaxError | AccountIndexingError | MethodSupportError
  > {
    return ResultUtils.combine([
      this._getNftCache(),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen(([cache, context, config]) => {
      return cache.get(chainId, accountAddress).andThen((cacheResult) => {
        if (cacheResult != null) {
          return okAsync(cacheResult);
        }

        if (chainId == EChain.Astar) {
          return ResultUtils.combine([
            this.accountRepo.getEarnedRewards(),
            this.configProvider.getConfig(),
          ])
            .map(([rewards, config]) => {
              return (
                rewards.filter((reward) => {
                  return reward.type == ERewardType.Direct;
                }) as DirectReward[]
              )
                .filter((reward) => reward.chainId == ChainId(592))
                .map((reward) => {
                  return {
                    ...reward,
                    image: URLString(
                      urlJoin(config.ipfsFetchBaseUrl, reward.image),
                    ),
                  };
                });
            })
            .map((rewards) => {
              return rewards.map((reward) => {
                return new EVMNFT(
                  reward.contractAddress,
                  BigNumberString("1"),
                  reward.type,
                  reward.recipientAddress,
                  undefined,
                  { raw: ObjectUtils.serialize(reward) }, // metadata
                  BigNumberString("1"),
                  reward.name,
                  ChainId(592),
                  undefined,
                  undefined,
                );
              });
            })
            .map((nfts) => {
              return nfts;
            });
        }

        if (chainId == EChain.Shibuya) {
          return ResultUtils.combine([
            this.accountRepo.getEarnedRewards(),
            this.configProvider.getConfig(),
          ])
            .map(([rewards, config]) => {
              return (
                rewards.filter((reward) => {
                  return reward.type == ERewardType.Direct;
                }) as DirectReward[]
              )
                .filter((reward) => reward.chainId == ChainId(81))
                .map((reward) => {
                  return {
                    ...reward,
                    image: URLString(
                      urlJoin(config.ipfsFetchBaseUrl, reward.image),
                    ),
                  };
                });
            })
            .map((rewards) => {
              return rewards.map((reward) => {
                return new EVMNFT(
                  reward.contractAddress,
                  BigNumberString("123"),
                  reward.type,
                  reward.recipientAddress,
                  undefined,
                  { raw: ObjectUtils.serialize(reward) }, // metadata
                  BigNumberString("1"),
                  reward.name,
                  ChainId(81),
                  undefined,
                  undefined,
                );
              });
            })
            .map((nfts) => {
              return nfts;
            });
        }

        const fetch = this.masterIndexer
          .getLatestNFTs(chainId, accountAddress)
          .map((result) => {
            context.publicEvents.onNftBalanceUpdate.next(
              new PortfolioUpdate(
                accountAddress,
                chainId,
                new Date().getTime(),
                result,
              ),
            );
            return result;
          });
        return cache
          .set(chainId, accountAddress, new Date().getTime(), fetch)
          .andThen(() => fetch);
      });
    });
  }

  private _clearPortfolioCaches(
    account: LinkedAccount,
  ): ResultAsync<void, never> {
    return ResultUtils.combine([this._getBalanceCache(), this._getNftCache()])
      .andThen(([balanceCache, nftCache]) => {
        const results = new Array<ResultAsync<void, never>>();
        chainConfig.forEach((_, chainId) => {
          if (isAccountValidForChain(chainId, account)) {
            results.push(
              balanceCache.clear(chainId, account.sourceAccountAddress),
            );
            results.push(nftCache.clear(chainId, account.sourceAccountAddress));
          }
        });
        return ResultUtils.combine(results);
      })
      .map(() => undefined);
  }

  private _getBalanceCache(): ResultAsync<
    PortfolioCache<
      TokenBalance[],
      PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
    >,
    never
  > {
    if (this._balanceCache) {
      return this._balanceCache;
    }

    this._balanceCache = this.configProvider.getConfig().andThen((config) => {
      return okAsync(
        new PortfolioCache<
          TokenBalance[],
          PersistenceError | AccountIndexingError | AjaxError
        >(config.accountBalancePollingIntervalMS),
      );
    });
    return this._balanceCache;
  }

  private _getNftCache(): ResultAsync<
    PortfolioCache<
      WalletNFT[],
      PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
    >,
    never
  > {
    if (this._nftCache) {
      return this._nftCache;
    }

    this._nftCache = this.configProvider.getConfig().andThen((config) => {
      return okAsync(
        new PortfolioCache<
          WalletNFT[],
          PersistenceError | AccountIndexingError | AjaxError
        >(config.accountNFTPollingIntervalMS),
      );
    });
    return this._nftCache;
  }
}
