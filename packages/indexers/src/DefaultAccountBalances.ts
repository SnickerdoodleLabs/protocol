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

import { EtherscanIndexer } from "@indexers/EtherscanIndexer.js";
import { GnosisIndexer } from "@indexers/GnosisIndexer.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { MoralisEVMPortfolioRepository } from "@indexers/MoralisEVMPortfolioRepository.js";
import { PolygonIndexer } from "@indexers/PolygonIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/SolanaIndexer.js";

@injectable()
export class DefaultAccountBalances implements IAccountBalances {
  protected evm: IEVMAccountBalanceRepository;
  protected sim: IEVMAccountBalanceRepository;
  protected sol: ISolanaBalanceRepository;
  protected ethereum: IEVMAccountBalanceRepository;
  protected matic: IEVMAccountBalanceRepository;
  protected gnosis: IEVMAccountBalanceRepository;

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
    this.gnosis = new GnosisIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );
  }

  public getGnosisBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    console.log("Gnosis Indexer: ", this.gnosis);
    return okAsync(this.gnosis);
  }

  public getPolygonBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    console.log("Polygon Indexer: ", this.matic);
    return okAsync(this.matic);
  }

  public getEthereumBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    console.log("Ethereum Indexer: ", this.ethereum);
    return okAsync(this.ethereum);
  }

  public getEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    console.log("EVM Indexer: ", this.evm);
    return okAsync(this.evm);
  }

  public getSimulatorEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    console.log("SIM Indexer: ", this.sim);
    return okAsync(this.sim);
  }

  public getSolanaBalanceRepository(): ResultAsync<
    ISolanaBalanceRepository,
    never
  > {
    console.log("Sol Indexer: ", this.sol);
    return okAsync(this.sol);
  }
}
