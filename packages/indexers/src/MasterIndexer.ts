import {
  IBigNumberUtils,
  IBigNumberUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  ChainTransaction,
  EChain,
  EComponentStatus,
  EVMAccountAddress,
  EVMContractAddress,
  getChainInfoByChain,
  IAlchemyIndexerType,
  IAnkrIndexerType,
  ICovalentEVMTransactionRepositoryType,
  IEtherscanIndexerType,
  IEVMIndexer,
  IMasterIndexer,
  IMoralisEVMPortfolioRepositoryType,
  INftScanEVMPortfolioRepositoryType,
  IOklinkIndexerType,
  IPoapRepositoryType,
  IPolygonIndexerType,
  ISimulatorEVMTransactionRepositoryType,
  ISolanaIndexer,
  ISolanaIndexerType,
  MethodSupportError,
  PersistenceError,
  SolanaAccountAddress,
  TokenAddress,
  TokenBalance,
  UnixTimestamp,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerContextProvider,
  IIndexerContextProviderType,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/index.js";

@injectable()
export class MasterIndexer implements IMasterIndexer {
  public preferredIndexers = new Map<EChain, IEVMIndexer[]>([
    [EChain.EthereumMainnet, [this.ankr, this.etherscan]],
    [EChain.Polygon, [this.ankr, this.alchemy]],
    [EChain.Optimism, [this.ankr, this.alchemy, this.nftscan]],
    [EChain.Binance, [this.ankr, this.etherscan, this.nftscan]],
    [EChain.Arbitrum, [this.ankr, this.alchemy, this.nftscan]],
    [EChain.Avalanche, [this.ankr, this.etherscan, this.nftscan]],

    /* Etherscan Balance Preferred */
    [EChain.Moonbeam, [this.etherscan, this.nftscan]],
    [EChain.Gnosis, [this.etherscan, this.poapRepo]],
    [EChain.Fuji, [this.etherscan, this.nftscan]],

    /* Alchemy Preferred */
    [EChain.Mumbai, [this.alchemy]],
    [EChain.Astar, [this.alchemy]],
    [EChain.Shibuya, [this.alchemy]],

    // Doodlechain
    [EChain.DevDoodle, [this.sim]],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected config: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected indexerContext: IIndexerContextProvider,
    @inject(IAlchemyIndexerType) protected alchemy: IEVMIndexer,
    @inject(IAnkrIndexerType) protected ankr: IEVMIndexer,
    @inject(ICovalentEVMTransactionRepositoryType)
    protected covalent: IEVMIndexer,
    @inject(IEtherscanIndexerType) protected etherscan: IEVMIndexer,
    @inject(IMoralisEVMPortfolioRepositoryType) protected moralis: IEVMIndexer,
    @inject(INftScanEVMPortfolioRepositoryType) protected nftscan: IEVMIndexer,
    @inject(IOklinkIndexerType) protected oklink: IEVMIndexer,
    @inject(IPoapRepositoryType) protected poapRepo: IEVMIndexer,
    @inject(IPolygonIndexerType) protected matic: IEVMIndexer,
    @inject(ISimulatorEVMTransactionRepositoryType) protected sim: IEVMIndexer,
    @inject(ISolanaIndexerType) protected sol: ISolanaIndexer,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IBigNumberUtilsType) protected bigNumberUtils: IBigNumberUtils,
  ) {}

  // call this from elsewhere
  public initialize(): ResultAsync<void, AjaxError> {
    return ResultUtils.combine([
      this.alchemy.initialize(),
      this.ankr.initialize(),
      this.covalent.initialize(),
      this.etherscan.initialize(),
      this.matic.initialize(),
      this.moralis.initialize(),
      this.nftscan.initialize(),
      this.oklink.initialize(),
      this.poapRepo.initialize(),
      this.sim.initialize(),
      this.sol.initialize(),
    ]).map(() => {});
  }

  public getSupportedChains(): ResultAsync<EChain[], never> {
    return this.getHealthStatuses().map((healthStatuses) => {
      const activeChains = new Array<EChain>();
      healthStatuses.forEach((componentStatus, chain) => {
        if (
          componentStatus == EComponentStatus.Available ||
          componentStatus == EComponentStatus.InUse
        ) {
          activeChains.push(chain);
        }
      });
      return activeChains;
    });
  }

  public getLatestBalances(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    const chainInfo = getChainInfoByChain(chain);
    if (chain == EChain.Solana) {
      return this.sol
        .getBalancesForAccount(chain, SolanaAccountAddress(accountAddress))
        .orElse((e) => {
          this.logUtils.log(
            "Error fetching balances from solana indexer",
            chain,
            accountAddress,
            e,
          );
          return okAsync([]);
        })
        .map((tokenBalances) => {
          return tokenBalances.map((tokenBalance) => {
            if (!this.bigNumberUtils.validateBNS(tokenBalance.balance)) {
              tokenBalance.balance = BigNumberString("0");
            }

            return tokenBalance;
          });
        });
    }

    const providers = this.preferredIndexers.get(chain)!;
    const provider = providers.find(
      (element) =>
        element.getSupportedChains().get(chain)?.balances &&
        element.healthStatus().get(chain) == EComponentStatus.Available,
    );

    if (provider == undefined) {
      this.logUtils.warning(
        "error fetching balances: no healthy provider found for " +
          chainInfo.name +
          " protocol",
      );
      return okAsync([]);
    }

    return provider
      .getBalancesForAccount(chain, EVMAccountAddress(accountAddress))
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching balances from " + provider.name() + " indexer",
          chain,
          accountAddress,
          e,
        );
        return okAsync([]);
      })
      .map((tokenBalances) => {
        // Apprently the tokenBalance.balance can return as in invalid
        // BigNumber (blank or null), so we'll just correct any possible issue
        // here.
        return tokenBalances.map((tokenBalance) => {
          if (!this.bigNumberUtils.validateBNS(tokenBalance.balance)) {
            tokenBalance.balance = BigNumberString("0");
          }
          return tokenBalance;
        });
      });
  }

  public getLatestNFTs(
    chain: EChain,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
  > {
    const chainInfo = getChainInfoByChain(chain);
    if (chain == EChain.Solana) {
      return this.sol.getTokensForAccount(
        chain,
        SolanaAccountAddress(accountAddress),
      );
    }

    const providers = this.preferredIndexers.get(chain)!;
    const provider = providers.find(
      (element) =>
        element.getSupportedChains().get(chain)?.nfts &&
        element.healthStatus().get(chain) == EComponentStatus.Available,
    );

    if (provider == undefined) {
      this.logUtils.log(
        "error fetching nfts: no healthy provider found for " +
          chainInfo.name +
          " protocol",
      );
      return okAsync([]);
    }

    return provider
      .getTokensForAccount(chain, EVMAccountAddress(accountAddress))
      .map((tokens) => {
        return tokens;
      })
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching nfts from " + provider.name() + " indexer",
          chain,
          accountAddress,
          e,
        );
        return okAsync([]);
      })
      .map((nfts) => {
        // Apprently the nft.amount can return as in invalid
        // BigNumber (blank or null), so we'll just correct any possible issue
        // here.
        return nfts.map((nft) => {
          if (!this.bigNumberUtils.validateBNS(nft.amount)) {
            nft.amount = BigNumberString("0");
          }
          return nft;
        });
      });
  }

  public getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chain: EChain,
  ): ResultAsync<
    ChainTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    const chainInfo = getChainInfoByChain(chain);
    if (chain == EChain.Solana) {
      return this.sol.getSolanaTransactions(
        chain,
        SolanaAccountAddress(accountAddress),
        new Date(timestamp * 1000),
      );
    }
    let providers = this.preferredIndexers.get(chain);
    if (providers == null) {
      this.logUtils.warning(`No preferred indexers for chain ${chain}`);
      providers = [];
    }
    const provider = providers.find(
      (element) =>
        element.getSupportedChains().get(chain)?.transactions &&
        element.healthStatus().get(chain) == EComponentStatus.Available,
    );

    if (provider == undefined) {
      this.logUtils.log(
        "error fetching transactions: no healthy provider found for " +
          chainInfo.name +
          " protocol",
      );
      return okAsync([]);
    }

    return provider
      .getEVMTransactions(
        chain,
        EVMAccountAddress(accountAddress),
        new Date(timestamp * 1000),
      )
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching transactions from " + provider.name() + " indexer",
          chain,
          accountAddress,
          e,
        );
        return okAsync([]);
      });
  }

  static get nativeAddress(): TokenAddress {
    return EVMContractAddress("0x0");
  }

  /* Sets the health statuses of each provider */
  protected getHealthStatuses(): ResultAsync<
    Map<EChain, EComponentStatus>,
    never
  > {
    return ResultUtils.combine([
      this.indexerContext.getContext(),
      this.alchemy.getHealthCheck(),
      this.ankr.getHealthCheck(),
      this.covalent.getHealthCheck(),
      this.etherscan.getHealthCheck(),
      this.matic.getHealthCheck(),
      this.moralis.getHealthCheck(),
      this.nftscan.getHealthCheck(),
      this.oklink.getHealthCheck(),
      this.poapRepo.getHealthCheck(),
      this.sim.getHealthCheck(),
      this.sol.getHealthCheck(),
    ]).map(
      ([
        context,
        alchemyHealth,
        ankrHealth,
        covalentHealth,
        etherscanHealth,
        maticHealth,
        moralisHealth,
        nftscanHealth,
        oklinkHealth,
        poapHealth,
        simHealth,
        solHealth,
      ]) => {
        const indexerStatuses = context.components;
        indexerStatuses.alchemyIndexer = alchemyHealth;
        indexerStatuses.etherscanIndexer = etherscanHealth;
        indexerStatuses.moralisIndexer = moralisHealth;
        indexerStatuses.nftScanIndexer = nftscanHealth;
        indexerStatuses.oklinkIndexer = oklinkHealth;

        // The status of each indexer is known, and the chains that those indexers support is known.
        // We need to consolidate the component status for each chain via a group-by.
        // For each chain, use the best status of any indexer as the overall status for the chain

        // Need to consolidate the maps of chain->EComponentStatus
        const chainStatuses = new Map<EChain, EComponentStatus>();
        this.consolidateHealthStatus(chainStatuses, alchemyHealth);
        this.consolidateHealthStatus(chainStatuses, ankrHealth);
        this.consolidateHealthStatus(chainStatuses, covalentHealth);
        this.consolidateHealthStatus(chainStatuses, etherscanHealth);
        this.consolidateHealthStatus(chainStatuses, maticHealth);
        this.consolidateHealthStatus(chainStatuses, moralisHealth);
        this.consolidateHealthStatus(chainStatuses, nftscanHealth);
        this.consolidateHealthStatus(chainStatuses, oklinkHealth);
        this.consolidateHealthStatus(chainStatuses, poapHealth);
        this.consolidateHealthStatus(chainStatuses, simHealth);
        this.consolidateHealthStatus(chainStatuses, solHealth);

        return chainStatuses;
      },
    );
  }

  protected consolidateHealthStatus(
    baseHealthStatus: Map<EChain, EComponentStatus>,
    healthStatus: Map<EChain, EComponentStatus>,
  ) {
    healthStatus.forEach((status, chain) => {
      const baseStatus = baseHealthStatus.get(chain);
      if (baseStatus == null) {
        baseHealthStatus.set(chain, status);
        return;
      }

      // Check if the status is better than the existing status
      // InUse > Available > TemporarilyDisabled > Disabled > Error > NoKeyProvided
      else if (status == EComponentStatus.InUse) {
        baseHealthStatus.set(chain, status);
        return;
      } else if (status == EComponentStatus.Available) {
        baseHealthStatus.set(chain, status);
        return;
      } else if (status == EComponentStatus.TemporarilyDisabled) {
        baseHealthStatus.set(chain, status);
        return;
      } else if (status == EComponentStatus.Disabled) {
        baseHealthStatus.set(chain, status);
        return;
      } else if (status == EComponentStatus.Error) {
        baseHealthStatus.set(chain, status);
        return;
      } else if (status == EComponentStatus.NoKeyProvided) {
        baseHealthStatus.set(chain, status);
        return;
      }
    });
  }
}
