import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  AccountIndexingError,
  AjaxError,
  BigNumberString,
  ChainComponentStatus,
  chainConfig,
  ChainId,
  ChainTransaction,
  ComponentStatus,
  EChain,
  EChainType,
  EComponentStatus,
  EIndexer,
  EProvider,
  EVMAccountAddress,
  getChainInfoByChainId,
  IAlchemyIndexerType,
  IAnkrIndexerType,
  ICovalentEVMTransactionRepositoryType,
  IDummySolanaIndexerType,
  IEtherscanIndexerType,
  IEtherscanNativeBalanceRepositoryType,
  IEVMIndexer,
  IMasterIndexer,
  IMoralisEVMPortfolioRepositoryType,
  IndexerSupportSummary,
  INftScanEVMPortfolioRepositoryType,
  IOklinkIndexerType,
  IPoapRepositoryType,
  IPolygonIndexerType,
  ISimulatorEVMTransactionRepositoryType,
  ISolanaBalanceRepository,
  ISolanaIndexer,
  ISolanaIndexerType,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  MethodSupportError,
  PersistenceError,
  SolanaAccountAddress,
  TokenBalance,
  UnixTimestamp,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

@injectable()
export class MasterIndexer implements IMasterIndexer {
  protected preferredIndexers = new Map<EChain, IEVMIndexer[]>();
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
    @inject(IAlchemyIndexerType) protected alchemy: IEVMIndexer,
    @inject(IAnkrIndexerType) protected ankr: IEVMIndexer,
    @inject(ICovalentEVMTransactionRepositoryType)
    protected covalent: IEVMIndexer,
    @inject(IEtherscanIndexerType) protected etherscan: IEVMIndexer,
    @inject(IEtherscanNativeBalanceRepositoryType)
    protected etherscanNative: IEVMIndexer,
    @inject(IMoralisEVMPortfolioRepositoryType) protected moralis: IEVMIndexer,
    @inject(INftScanEVMPortfolioRepositoryType) protected nftscan: IEVMIndexer,
    @inject(IOklinkIndexerType) protected oklink: IEVMIndexer,
    @inject(IPoapRepositoryType) protected poapRepo: IEVMIndexer,
    @inject(IPolygonIndexerType) protected matic: IEVMIndexer,
    @inject(ISimulatorEVMTransactionRepositoryType) protected sim: IEVMIndexer,
    @inject(ISolanaIndexerType) protected sol: ISolanaIndexer,

    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.preferredIndexers = new Map<EChain, IEVMIndexer[]>([
      [EChain.EthereumMainnet, [this.etherscan]],

      /* Alchemy Preferred */
      [EChain.Mumbai, [this.alchemy]],
      [EChain.Astar, [this.alchemy]],
      [EChain.Polygon, [this.alchemy]],
      [EChain.Optimism, [this.alchemy, this.nftscan]],
      [EChain.Arbitrum, [this.alchemy, this.nftscan]],

      /* Etherscan Native Balance Preferred */
      [EChain.Moonbeam, [this.etherscanNative, this.nftscan]],
      [EChain.Binance, [this.etherscanNative, this.nftscan]],
      [EChain.Gnosis, [this.etherscanNative, this.poapRepo]],
      [EChain.Avalanche, [this.etherscanNative, this.nftscan]],
      [EChain.Fuji, [this.etherscanNative, this.nftscan]],
    ]);
    this.initialize();
  }

  // call this from elsewhere
  public initialize(): ResultAsync<void, AjaxError> {
    return this.getHealthStatuses().andThen((healthStatuses) => {
      return okAsync(undefined);
    });
  }

  /* Sets the health statuses of each provider */
  private getHealthStatuses(): ResultAsync<void, AjaxError> {
    return ResultUtils.combine([
      this.alchemy.getHealthCheck(),
      this.ankr.getHealthCheck(),
      this.covalent.getHealthCheck(),
      this.etherscan.getHealthCheck(),
      this.etherscanNative.getHealthCheck(),
      this.matic.getHealthCheck(),
      this.moralis.getHealthCheck(),
      this.nftscan.getHealthCheck(),
      this.oklink.getHealthCheck(),
      this.poapRepo.getHealthCheck(),
      this.sim.getHealthCheck(),
      this.sol.getHealthCheck(),
    ]).map(
      ([
        alchemyHealth,
        ankrHealth,
        covalentHealth,
        etherscanHealth,
        etherscanNativeHealth,
        maticHealth,
        moralisHealth,
        nftscanHealth,
        oklinkHealth,
        poapHealth,
        simHealth,
        solHealth,
      ]) => {
        this.componentStatus = new ComponentStatus(
          alchemyHealth.get(EChain.EthereumMainnet)!,
          alchemyHealth.get(EChain.EthereumMainnet)!,
          alchemyHealth,
          etherscanHealth,
          moralisHealth,
          nftscanHealth,
          oklinkHealth,
          [],
        );
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
      return this.sol.getBalancesForAccount(
        chainId,
        SolanaAccountAddress(accountAddress),
      );
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
          "error fetching balances",
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

    // can make this another generic function
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
      .orElse((e) => {
        this.logUtils.log("error fetching nfts", chainId, accountAddress, e);
        return okAsync([]);
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
    const providers = this.preferredIndexers.get(chain)!;
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
        this.logUtils.error(
          "error fetching transactions",
          chainId,
          accountAddress,
          e,
        );
        return okAsync([]);
      });
  }
}
