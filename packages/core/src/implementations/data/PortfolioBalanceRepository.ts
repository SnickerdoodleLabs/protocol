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
  TokenBalance,
  PersistenceError,
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
  BigNumberString,
  URLString,
  InvalidParametersError,
  EIndexerMethod,
  ERecordKey,
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
    // reset balance cache on account addition and removal
    this.contextProvider.getContext().map((context) => {
      context.publicEvents.onAccountAdded.subscribe((account) =>
        this._clearBalanceCache(account),
      );
      context.publicEvents.onAccountRemoved.subscribe((account) =>
        this._clearBalanceCache(account),
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
                  linkedAccount.sourceAccountAddress,
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

  private _clearBalanceCache(account: LinkedAccount): ResultAsync<void, never> {
    return this._getBalanceCache()
      .map((balanceCache) => {
        chainConfig.forEach((_, chainId) => {
          if (isAccountValidForChain(chainId, account)) {
            balanceCache.clear(chainId, account.sourceAccountAddress);
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
}
