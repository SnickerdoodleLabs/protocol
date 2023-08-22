import {
  ILogUtilsType,
  ILogUtils,
  ObjectUtils,
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
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  PortfolioCache,
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
    chains?: EChain[],
    accounts?: LinkedAccount[],
    filterEmpty = true,
  ): ResultAsync<TokenBalance[], PersistenceError> {
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
      this.masterIndexer.getSupportedChains(),
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
      this.masterIndexer.getSupportedChains(),
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
      return cache.get(chain, accountAddress).andThen((cacheResult) => {
        if (cacheResult != null) {
          return okAsync(cacheResult);
        }
        const fetch = this.masterIndexer
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
          });
        return cache
          .set(chain, accountAddress, new Date().getTime(), fetch)
          .andThen(() => fetch);
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
    return ResultUtils.combine([
      this._getNftCache(),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen(([cache, context, config]) => {
      return cache.get(chain, accountAddress).andThen((cacheResult) => {
        if (cacheResult != null) {
          return okAsync(cacheResult);
        }

        if (chain == EChain.Astar || chain == EChain.Shibuya) {
          return this.accountRepo.getEarnedRewards().map((rewards) => {
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
                    image: URLString(
                      urlJoin(config.ipfsFetchBaseUrl, reward.image),
                    ),
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

        const fetch = this.masterIndexer
          .getLatestNFTs(chain, accountAddress)
          .map((result) => {
            context.publicEvents.onNftBalanceUpdate.next(
              new PortfolioUpdate(
                accountAddress,
                chain,
                new Date().getTime(),
                result,
              ),
            );
            return result;
          });
        return cache
          .set(chain, accountAddress, new Date().getTime(), fetch)
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
      | PersistenceError
      | AccountIndexingError
      | AjaxError
      | MethodSupportError
      | InvalidParametersError
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
      | PersistenceError
      | AccountIndexingError
      | AjaxError
      | MethodSupportError
      | InvalidParametersError
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
