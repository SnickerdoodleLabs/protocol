import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountBalances,
  IEVMAccountBalanceRepository,
  ISolanaBalanceRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

// import { ArbitrumIndexer } from "@indexers/ArbitrumIndexer.js";
import { EtherscanIndexer } from "@indexers/protocols/EtherscanIndexer.js";
import { EtherscanNativeBalanceRepository } from "@indexers/EtherscanNativeBalanceRepository.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import { MoralisEVMPortfolioRepository } from "@indexers/nfts/MoralisEVMPortfolioRepository.js";
import { OptimismIndexer } from "@indexers/protocols/OptimismIndexer.js";
import { PolygonIndexer } from "@indexers/protocols/PolygonIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/protocols/SolanaIndexer.js";

@injectable()
export class DefaultAccountBalances implements IAccountBalances {
  protected evm: IEVMAccountBalanceRepository;
  protected sim: IEVMAccountBalanceRepository;
  protected sol: ISolanaBalanceRepository;
  protected ethereum: IEVMAccountBalanceRepository;
  protected matic: IEVMAccountBalanceRepository;
  protected etherscan: IEVMAccountBalanceRepository;
  // protected arbitrum: IEVMAccountBalanceRepository;
  protected optimism: IEVMAccountBalanceRepository;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.evm = new MoralisEVMPortfolioRepository(configProvider, ajaxUtils);
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
    this.etherscan = new EtherscanNativeBalanceRepository(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
    // this.arbitrum = new ArbitrumIndexer(
    //   this.configProvider,
    //   this.ajaxUtils,
    //   this.tokenPriceRepo,
    //   this.logUtils,
    // );
    this.optimism = new OptimismIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
  }

  // public getArbitrumBalanceRepository(): ResultAsync<
  //   IEVMAccountBalanceRepository,
  //   never
  // > {
  //   return okAsync(this.arbitrum);
  // }

  public getOptimismBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.optimism);
  }

  public getEtherscanBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.etherscan);
  }

  public getPolygonBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.matic);
  }

  public getEthereumBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.ethereum);
  }

  public getEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.evm);
  }

  public getSimulatorEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.sim);
  }

  public getSolanaBalanceRepository(): ResultAsync<
    ISolanaBalanceRepository,
    never
  > {
    return okAsync(this.sol);
  }
}
