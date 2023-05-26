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

  private initialize(): ResultAsync<void, AjaxError> {
    return this.getHealthStatuses().andThen((healthStatuses) => {
      return okAsync(undefined);
    });
  }

  /* Sets the health statuses of each provider */
  private getHealthStatuses(): ResultAsync<Array<EComponentStatus>, AjaxError> {
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
    ]).map(() => {
      return [
        this.alchemy.healthStatus(),
        this.ankr.healthStatus(),
        this.covalent.healthStatus(),
        this.etherscan.healthStatus(),
        this.etherscanNative.healthStatus(),
        this.matic.healthStatus(),
        this.moralis.healthStatus(),
        this.nftscan.healthStatus(),
        this.oklink.healthStatus(),
        this.poapRepo.healthStatus(),
        this.sim.healthStatus(),
        this.sol.healthStatus(),
      ];
    });
  }

  public getLatestBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    const chain = getChainInfoByChainId(chainId).chain;
    const providers = this.preferredIndexers.get(chain);
    if (providers == null) {
      this.logUtils.error(
        "error fetching balances: no provider found for " +
          getChainInfoByChainId(chainId).name +
          " protocol",
      );
      return okAsync([]);
    }
    if (getChainInfoByChainId(chainId).chain == EChain.Solana) {
      return this.sol.getBalancesForAccount(
        chainId,
        SolanaAccountAddress(accountAddress),
      );
    }

    const provider = providers.find(
      (element) => element.getSupportedChains().get(chain)?.balances,
    );

    console.log("chain: + " + chainId + " and providers: ", providers);
    console.log("chain: + " + chainId + " and getLatestBalances: ", provider);

    if (provider == undefined) {
      this.logUtils.error(
        "error fetching balances: no provider found for " +
          getChainInfoByChainId(chainId).name +
          " protocol",
      );
      return okAsync([]);
    }

    return provider
      .getBalancesForAccount(chainId, EVMAccountAddress(accountAddress))
      .orElse((e) => {
        this.logUtils.error(
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
    const providers = this.preferredIndexers.get(chain);
    if (providers == null) {
      this.logUtils.error(
        "error fetching nfts: no provider found for " +
          getChainInfoByChainId(chainId).name +
          " protocol",
      );
      return okAsync([]);
    }
    if (getChainInfoByChainId(chainId).chain == EChain.Solana) {
      return this.sol.getTokensForAccount(
        chainId,
        SolanaAccountAddress(accountAddress),
      );
    }

    const provider = providers.find(
      (element) => element.getSupportedChains().get(chain)?.nfts,
    );

    console.log("Nft chain: + " + chainId + " and providers: ", providers);
    console.log("chain: + " + chainId + " and getLatestNFTs: ", provider);

    if (provider == undefined) {
      this.logUtils.error(
        "error fetching nfts: no provider found for " +
          getChainInfoByChainId(chainId).name +
          " protocol",
      );
      return okAsync([]);
    }

    return provider
      .getTokensForAccount(chainId, EVMAccountAddress(accountAddress))
      .orElse((e) => {
        this.logUtils.error("error fetching nfts", chainId, accountAddress, e);
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
    const providers = this.preferredIndexers.get(chain);
    if (providers == null) {
      this.logUtils.error(
        "error fetching transactions: no provider found for " +
          getChainInfoByChainId(chainId).name +
          " protocol",
      );
      return okAsync([]);
    }
    if (getChainInfoByChainId(chainId).chain == EChain.Solana) {
      return this.sol.getSolanaTransactions(
        chainId,
        SolanaAccountAddress(accountAddress),
        new Date(timestamp * 1000),
      );
    }

    const provider = providers.find(
      (element) => element.getSupportedChains().get(chain)?.transactions,
    );

    console.log(
      "Transactions chain: + " + chainId + " and providers: ",
      providers,
    );
    console.log("chain: + " + chainId + " and getLatestBalances: ", provider);

    if (provider == undefined) {
      this.logUtils.error(
        "error fetching transactions: no provider found for " +
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
