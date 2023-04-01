import { ILogUtilsType, ILogUtils } from "@snickerdoodlelabs/common-utils";
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
  EIndexer,
  EVMAccountAddress,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  PortfolioUpdate,
  SolanaAccountAddress,
  IAccountBalances,
  IAccountBalancesType,
  IAccountNFTs,
  IAccountNFTsType,
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  PortfolioCache,
} from "@snickerdoodlelabs/persistence";
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
    @inject(IAccountNFTsType)
    protected accountNFTs: IAccountNFTs,
    @inject(IAccountBalancesType) protected accountBalances: IAccountBalances,
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
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return ResultUtils.combine([
      this._getBalanceCache(),
      this.contextProvider.getContext(),
    ]).andThen(([cache, context]) => {
      return cache.get(chainId, accountAddress).andThen((cacheResult) => {
        if (cacheResult != null) {
          return okAsync(cacheResult);
        }
        const fetch = this.getLatestBalances(chainId, accountAddress).map(
          (result) => {
            context.publicEvents.onTokenBalanceUpdate.next(
              new PortfolioUpdate(
                accountAddress,
                chainId,
                new Date().getTime(),
                result,
              ),
            );
            return result;
          },
        );
        return cache
          .set(chainId, accountAddress, new Date().getTime(), fetch)
          .andThen(() => fetch);
      });
    });
  }

  private getLatestBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountBalances.getEVMBalanceRepository(),
      this.accountBalances.getSolanaBalanceRepository(),
      this.accountBalances.getSimulatorEVMBalanceRepository(),
      this.accountBalances.getEthereumBalanceRepository(),
      this.accountBalances.getPolygonBalanceRepository(),
      this.accountBalances.getEtherscanBalanceRepository(),
      this.accountBalances.getOptimismBalanceRepository(),
      this.accountBalances.getZettablockBalanceRepository(),
      this.accountBalances.getAlchemyBalanceRepository(),
      // this.accountBalances.getSpaceandTimeBalanceRepository(),
    ])
      .andThen(
        ([
          config,
          evmRepo,
          solRepo,
          simulatorRepo,
          etherscanRepo,
          maticRepo,
          etherscanBalanceRepo,
          optimismRepo,
          zettablock,
          alchemyRepo,
          // sxtRepo,
        ]) => {
          const chainInfo = config.chainInformation.get(chainId);
          if (chainInfo == null) {
            return errAsync(
              new AccountIndexingError(
                `No available chain info for chain ${chainId}`,
              ),
            );
          }

          switch (chainInfo.indexer) {
            /* Simulator Cases */
            case EIndexer.EVM:
            case EIndexer.Simulator:
              return simulatorRepo.getBalancesForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            
            /* Alchemy cases */
            case EIndexer.Solana:
              // return solRepo.getBalancesForAccount(
              //   chainId,
              //   accountAddress as SolanaAccountAddress,
              // );
            case EIndexer.Ethereum:
              // return etherscanRepo.getBalancesForAccount(
              //   chainId,
              //   accountAddress as EVMAccountAddress,
              // );
            case EIndexer.Arbitrum:
            case EIndexer.Optimism:
                return alchemyRepo.getBalancesForAccount(
                  chainId,
                  accountAddress as EVMAccountAddress,
                );

            /* Etherscan cases */
            case EIndexer.Polygon:
            case EIndexer.Gnosis:
            case EIndexer.Binance:
            case EIndexer.Moonbeam:
              return etherscanBalanceRepo.getBalancesForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            default:
              return errAsync(
                new AccountIndexingError(
                  `No available balance repository for chain ${chainId}`,
                ),
              );
          }
        },
      )
      .orElse((e) => {
        this.logUtils.error(
          "error fetching balances",
          chainId,
          accountAddress,
          e,
        );
        return okAsync([]);
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
    PersistenceError | AjaxError | AccountIndexingError
  > {
    return ResultUtils.combine([
      this._getNftCache(),
      this.contextProvider.getContext(),
    ]).andThen(([cache, context]) => {
      return cache.get(chainId, accountAddress).andThen((cacheResult) => {
        if (cacheResult != null) {
          return okAsync(cacheResult);
        }
        const fetch = this.getLatestNFTs(chainId, accountAddress).map(
          (result) => {
            context.publicEvents.onNftBalanceUpdate.next(
              new PortfolioUpdate(
                accountAddress,
                chainId,
                new Date().getTime(),
                result,
              ),
            );
            return result;
          },
        );
        return cache
          .set(chainId, accountAddress, new Date().getTime(), fetch)
          .andThen(() => fetch);
      });
    });
  }

  private getLatestNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountNFTs.getEVMNftRepository(),
      this.accountNFTs.getSolanaNFTRepository(),
      this.accountNFTs.getSimulatorEVMNftRepository(),
      this.accountNFTs.getEthereumNftRepository(),
      this.accountNFTs.getEtherscanNftRepository(),
      this.accountNFTs.getNftScanRepository(),
      this.accountNFTs.getPoapRepository(),
    ])
      .andThen(
        ([
          config,
          evmRepo,
          solRepo,
          simulatorRepo,
          etherscanRepo,
          etherscanMRepo,
          nftScanRepo,
          poapRepo,
        ]) => {
          const chainInfo = config.chainInformation.get(chainId);
          if (chainInfo == null) {
            return errAsync(
              new AccountIndexingError(
                `No available chain info for chain ${chainId}`,
              ),
            );
          }

          switch (chainInfo.indexer) {
            case EIndexer.EVM:
            case EIndexer.Polygon:
              return evmRepo.getTokensForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            case EIndexer.Simulator:
              return simulatorRepo.getTokensForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            case EIndexer.Solana:
              return solRepo.getTokensForAccount(
                chainId,
                accountAddress as SolanaAccountAddress,
              );
            case EIndexer.Ethereum:
              return etherscanRepo.getTokensForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            case EIndexer.Gnosis:
              return poapRepo.getTokensForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            case EIndexer.Binance:
              return etherscanRepo.getTokensForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            case EIndexer.Moonbeam:
              return nftScanRepo.getTokensForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            case EIndexer.Arbitrum:
              return okAsync([]);
            case EIndexer.Optimism:
              return okAsync([]);
            default:
              return errAsync(
                new AccountIndexingError(
                  `No available token repository for chain ${chainId}`,
                ),
              );
          }
        },
      )
      .orElse((e) => {
        this.logUtils.error("error fetching nfts", chainId, accountAddress, e);
        return okAsync([]);
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
      PersistenceError | AccountIndexingError | AjaxError
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
      PersistenceError | AccountIndexingError | AjaxError
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
