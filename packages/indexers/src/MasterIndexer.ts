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
  IAccountBalances,
  IEVMAccountBalanceRepository,
  IMasterIndexer,
  ISolanaBalanceRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
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
import { AlchemyIndexer } from "@indexers/providers/AlchemyIndexer.js";
import { AnkrIndexer } from "@indexers/providers/AnkrIndexer.js";
import { CovalentEVMTransactionRepository } from "@indexers/providers/CovalentEVMTransactionRepository.js";
import { EtherscanIndexer } from "@indexers/providers/EtherscanIndexer.js";
import { MoralisEVMPortfolioRepository } from "@indexers/providers/MoralisEVMPortfolioRepository.js";
import { NftScanEVMPortfolioRepository } from "@indexers/providers/NftScanEVMPortfolioRepository.js";
import { OklinkIndexer } from "@indexers/providers/OklinkIndexer.js";
import { PoapRepository } from "@indexers/providers/PoapRepository.js";
import { PolygonIndexer } from "@indexers/providers/PolygonIndexer.js";
import { SolanaIndexer } from "@indexers/providers/SolanaIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { EtherscanNativeBalanceRepository } from "packages/indexers/src/providers/EtherscanNativeBalanceRepository.js";

@injectable()
export class MasterIndexer implements IMasterIndexer {
  protected ankr: IEVMAccountBalanceRepository;
  protected alchemy: AlchemyIndexer;
  protected covalent: IEVMAccountBalanceRepository;
  protected ethereum: EtherscanIndexer;
  protected etherscanNativeBalance: EtherscanNativeBalanceRepository;
//   protected evm: IEVMAccountBalanceRepository;
  protected nftscan: NftScanEVMPortfolioRepository;
  protected oklink: OklinkIndexer;
  protected poapRepo: PoapRepository;
  protected matic: PolygonIndexer;
  protected sim: SimulatorEVMTransactionRepository;
  protected sol: SolanaIndexer;

  protected preferredIndexers = new Map<EChain, EProvider[]>();
  protected indexerHealthStatus = new Map<EProvider, EComponentStatus>();

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.ankr = new AnkrIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.covalent = new CovalentEVMTransactionRepository(
      configProvider,
      ajaxUtils,
    );
    // this.evm = new MoralisEVMPortfolioRepository(configProvider, ajaxUtils);
    this.ethereum = new EtherscanIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.sim = new SimulatorEVMTransactionRepository();
    this.sol = new SolanaIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.matic = new PolygonIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.etherscanNativeBalance = new EtherscanNativeBalanceRepository(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.alchemy = new AlchemyIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.oklink = new OklinkIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    this.nftscan = new NftScanEVMPortfolioRepository(configProvider, ajaxUtils);
    this.poapRepo = new PoapRepository(configProvider, ajaxUtils);

    this.preferredIndexers = new Map<EChain, EProvider[]>([
      [EChain.EthereumMainnet, [EProvider.Etherscan]],

      [EChain.Avalanche, [EProvider.Etherscan]],
      [EChain.Fuji, [EProvider.Etherscan]],

      [EChain.Polygon, [EProvider.Etherscan]],
      [EChain.Mumbai, [EProvider.Etherscan]],

      [EChain.Solana, [EProvider.Solana]],
      [EChain.SolanaTestnet, [EProvider.Solana]],

      [EChain.Moonbeam, [EProvider.Etherscan, EProvider.Ankr]],
      [EChain.Binance, [EProvider.EtherscanNative, EProvider.Ankr]],
      [EChain.Gnosis, [EProvider.Etherscan]],
    ]);

    this.indexerHealthStatus = new Map<EProvider, EComponentStatus>([
      [EProvider.Ankr, EComponentStatus.Available],
      [EProvider.Alchemy, EComponentStatus.Available], 
      [EProvider.Covalent, EComponentStatus.Available],
      [EProvider.Etherscan, EComponentStatus.Available],
      [EProvider.EtherscanNative, EComponentStatus.Available],
      [EProvider.Oklink, EComponentStatus.Available],
      [EProvider.Poap, EComponentStatus.Available], // DONE
      [EProvider.Solana, EComponentStatus.Available],
    ]);

    this.initialize();
  }

  private initialize(): ResultAsync<void, AjaxError> {
    // console.log("Initialize Master Indexer: ");
    // return ResultUtils.combine([this.configProvider.getConfig()])
    //   .andThen(([config]) => {
    //     const chains = config.supportedChains;
    //     console.log("Supported Chains: ", chains);
    //     const chainValues = chains.map((chain) => {
    //       const providers = this.preferredIndexers.get(
    //         getChainInfoByChainId(chain).chain,
    //       )!;
    //       const status = providers.forEach((provider) => {
    //         if (
    //           this.indexerHealthStatus.get(provider) ==
    //           EComponentStatus.Available
    //         ) {
    //           this.preferredIndexers.set(getChainInfoByChainId(chain).chain, [
    //             provider,
    //           ]);
    //           break;
    //         }
    //       });
    //     });
    //     return chainValues;
    //   })
    //   .andThen(() => {
    //     return okAsync(undefined);
    //   });
    return okAsync(undefined);
  }

  public getLatestBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    const chainInfo = chainConfig.get(chainId);
    if (chainInfo == null) {
      return errAsync(
        new AccountIndexingError(
          `No available chain info for chain ${chainId}`,
        ),
      );
    }

    return this.configProvider
      .getConfig()
      .andThen((config) => {
        switch (chainInfo.indexer) {
          case EIndexer.EVM:
            return this.etherscanNativeBalance.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Polygon:
            return this.alchemy.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Simulator:
            return this.sim.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Solana:
            return this.sol.getBalancesForAccount(
              chainId,
              accountAddress as SolanaAccountAddress,
            );
          case EIndexer.Ethereum:
            return this.ethereum.getBalancesForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Gnosis:
          case EIndexer.Binance:
          case EIndexer.Moonbeam:
            return this.etherscanNativeBalance.getBalancesForAccount(
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
    PersistenceError | AccountIndexingError | AjaxError
  > {
    const chainInfo = chainConfig.get(chainId);
    if (chainInfo == null) {
      return errAsync(
        new AccountIndexingError(
          `No available chain info for chain ${chainId}`,
        ),
      );
    }

    if (chainInfo.type == EChainType.Testnet) {
      return okAsync([]);
    }

    switch (chainInfo.indexer) {
      case EIndexer.EVM:
        return this.nftscan.getTokensForAccount(
          chainId,
          accountAddress as EVMAccountAddress,
        );
      case EIndexer.Polygon:
        return this.nftscan.getTokensForAccount(
          chainId,
          accountAddress as EVMAccountAddress,
        );
      case EIndexer.Simulator:
        return this.sim.getTokensForAccount(
          chainId,
          accountAddress as EVMAccountAddress,
        );
      case EIndexer.Solana:
        return this.sol.getTokensForAccount(
          chainId,
          accountAddress as SolanaAccountAddress,
        );
      case EIndexer.Ethereum:
        return this.nftscan.getTokensForAccount(
          chainId,
          accountAddress as EVMAccountAddress,
        );
      case EIndexer.Gnosis:
        return this.poapRepo.getTokensForAccount(
          chainId,
          accountAddress as EVMAccountAddress,
        );
      case EIndexer.Binance:
        return this.nftscan.getTokensForAccount(
          chainId,
          accountAddress as EVMAccountAddress,
        );
      case EIndexer.Moonbeam:
        return this.nftscan.getTokensForAccount(
          chainId,
          accountAddress as EVMAccountAddress,
        );
      default:
        return errAsync(
          new AccountIndexingError(
            `No available token repository for chain ${chainId}`,
          ),
        );
    }
  }

  public getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<ChainTransaction[], AccountIndexingError | AjaxError> {
    // Get the chain info for the transaction
    const chainInfo = chainConfig.get(chainId);
    if (chainInfo == null) {
      this.logUtils.error(`No available chain info for chain ${chainId}`);
      return okAsync([]);
    }

    switch (chainInfo.indexer) {
      case EIndexer.EVM:
        return this.ethereum.getEVMTransactions(
          chainId,
          accountAddress as EVMAccountAddress,
          new Date(timestamp * 1000),
        );
      case EIndexer.Simulator:
        return this.sim.getEVMTransactions(
          chainId,
          accountAddress as EVMAccountAddress,
          new Date(timestamp * 1000),
        );
      case EIndexer.Solana:
        return this.sol.getSolanaTransactions(
          chainId,
          accountAddress as SolanaAccountAddress,
          new Date(timestamp * 1000),
        );
      case EIndexer.Ethereum:
        return this.ethereum.getEVMTransactions(
          chainId,
          accountAddress as EVMAccountAddress,
          new Date(timestamp * 1000),
        );
      case EIndexer.Polygon:
        return this.matic.getEVMTransactions(
          chainId,
          accountAddress as EVMAccountAddress,
          new Date(timestamp * 1000),
        );
      case EIndexer.Gnosis:
        return this.ethereum.getEVMTransactions(
          chainId,
          accountAddress as EVMAccountAddress,
          new Date(timestamp * 1000),
        );
      case EIndexer.Binance:
        return this.ethereum.getEVMTransactions(
          chainId,
          accountAddress as EVMAccountAddress,
          new Date(timestamp * 1000),
        );
      case EIndexer.Moonbeam:
        return this.ethereum.getEVMTransactions(
          chainId,
          accountAddress as EVMAccountAddress,
          new Date(timestamp * 1000),
        );
      default:
        this.logUtils.error(
          `No available indexer repository for chain ${chainId}`,
        );
        return okAsync([]);
    }
  }
}

// interface AlchemyAcceptableChains: {
//     Ethereum: ProviderRpcError;

// }
