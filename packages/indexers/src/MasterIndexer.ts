import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  ChainId,
  ChainTransaction,
  ComponentStatus,
  EChain,
  EComponentStatus,
  EVMAccountAddress,
  getChainInfoByChainId,
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
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/IIndexerContextProvider.js";

@injectable()
export class MasterIndexer implements IMasterIndexer {
  public preferredIndexers = new Map<EChain, IEVMIndexer[]>([
    [EChain.EthereumMainnet, [this.ankr, this.etherscan]],
    [EChain.Polygon, [this.ankr, this.alchemy]],
    [EChain.Optimism, [this.ankr, this.alchemy, this.nftscan]],
    [EChain.Binance, [this.ankr, this.etherscan, this.nftscan]],
    [EChain.Arbitrum, [this.ankr, this.alchemy, this.nftscan]],
    [EChain.Avalanche, [this.ankr, this.etherscan, this.nftscan]],

    [EChain.DevDoodle, [this.sim]],
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

  protected componentStatus: ComponentStatus = new ComponentStatus(
    EComponentStatus.TemporarilyDisabled,
    EComponentStatus.TemporarilyDisabled,
    new Map<EChain, EComponentStatus>(),
    new Map<EChain, EComponentStatus>(),
    new Map<EChain, EComponentStatus>(),
    new Map<EChain, EComponentStatus>(),
    new Map<EChain, EComponentStatus>(),
    [],
  );

  public constructor(
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
  ) {}

  // call this from elsewhere
  public initialize(): ResultAsync<void, AjaxError> {
    return this.getHealthStatuses().map((healthStatuses) => {
      return undefined;
    });
  }

  /* Sets the health statuses of each provider */
  private getHealthStatuses(): ResultAsync<void, AjaxError> {
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
        context.components = indexerStatuses;
      },
    );
  }

  public getLatestBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    const chain = getChainInfoByChainId(chainId).chain;
    if (chain == EChain.Solana) {
      return this.sol
        .getBalancesForAccount(chainId, SolanaAccountAddress(accountAddress))
        .orElse((e) => {
          this.logUtils.log(
            "Error fetching balances from solana indexer",
            chainId,
            accountAddress,
            e,
          );
          return okAsync([]);
        })
        .map((tokenBalances) => {
          return tokenBalances.map((tokenBalance) => {
            try {
              BigNumber.from(tokenBalance.balance);
            } catch (e) {
              // Can't convert to bignumber, set it to 0
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
        element.healthStatus().get(getChainInfoByChainId(chainId).chain) ==
          EComponentStatus.Available,
    );

    if (provider == undefined) {
      this.logUtils.warning(
        "error fetching balances: no healthy provider found for " +
          getChainInfoByChainId(chainId).name +
          " protocol",
      );
      return okAsync([]);
    }

    return provider
      .getBalancesForAccount(chainId, EVMAccountAddress(accountAddress))
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching balances from " + provider.name() + " indexer",
          chainId,
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
          try {
            BigNumber.from(tokenBalance.balance);
          } catch (e) {
            // Can't convert to bignumber, set it to 0
            tokenBalance.balance = BigNumberString("0");
          }
          return tokenBalance;
        });
      });
  }

  public getLatestNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError | MethodSupportError
  > {
    const chain = getChainInfoByChainId(chainId).chain;
    if (chain == EChain.Solana) {
      return this.sol.getTokensForAccount(
        chainId,
        SolanaAccountAddress(accountAddress),
      );
    }

    const providers = this.preferredIndexers.get(chain)!;
    const provider = providers.find(
      (element) =>
        element.getSupportedChains().get(chain)?.nfts &&
        element.healthStatus().get(getChainInfoByChainId(chainId).chain) ==
          EComponentStatus.Available,
    );

    if (provider == undefined) {
      this.logUtils.log(
        "error fetching nfts: no healthy provider found for " +
          getChainInfoByChainId(chainId).name +
          " protocol",
      );
      return okAsync([]);
    }

    return provider
      .getTokensForAccount(chainId, EVMAccountAddress(accountAddress))
      .map((tokens) => {
        return tokens;
      })
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching nfts from " + provider.name() + " indexer",
          chainId,
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
          try {
            BigNumber.from(nft.amount);
          } catch (e) {
            // Can't convert to bignumber, set it to 0
            nft.amount = BigNumberString("0");
          }
          return nft;
        });
      });
  }

  public getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<
    ChainTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    const chain = getChainInfoByChainId(chainId).chain;
    if (chain == EChain.Solana) {
      return this.sol.getSolanaTransactions(
        chainId,
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
        element.healthStatus().get(getChainInfoByChainId(chainId).chain) ==
          EComponentStatus.Available,
    );

    if (provider == undefined) {
      this.logUtils.log(
        "error fetching transactions: no healthy provider found for " +
          getChainInfoByChainId(chainId).name +
          " protocol",
      );
      return okAsync([]);
    }

    return provider
      .getEVMTransactions(
        chainId,
        EVMAccountAddress(accountAddress),
        new Date(timestamp * 1000),
      )
      .orElse((e) => {
        this.logUtils.log(
          "Error fetching transactions from " + provider.name() + " indexer",
          chainId,
          accountAddress,
          e,
        );
        return okAsync([]);
      });
  }

  static get nativeAddress(): TokenAddress {
    return "0x0";
  }
}
