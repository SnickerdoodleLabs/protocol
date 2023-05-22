import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  IAccountBalances,
  IEVMAccountBalanceRepository,
  ISolanaBalanceRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { AlchemyIndexer } from "@indexers/AlchemyIndexer.js";
import { EtherscanIndexer } from "@indexers/EtherscanIndexer.js";
import { EtherscanNativeBalanceRepository } from "@indexers/EtherscanNativeBalanceRepository.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { MoralisEVMPortfolioRepository } from "@indexers/MoralisEVMPortfolioRepository.js";
import { OklinkIndexer } from "@indexers/OklinkIndexer.js";
import { PolygonIndexer } from "@indexers/PolygonIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/SolanaIndexer.js";

@injectable()
export class DefaultAccountBalances implements IAccountBalances {
  protected evm: IEVMAccountBalanceRepository;
  protected sim: IEVMAccountBalanceRepository;
  protected sol: SolanaIndexer;
  protected ethereum: EtherscanIndexer;
  protected matic: IEVMAccountBalanceRepository;
  protected etherscan: EtherscanNativeBalanceRepository;
  protected alchemy: AlchemyIndexer;
  protected oklink: OklinkIndexer;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    console.log("Default Account Balances configuration: ", configProvider);
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

    this.initialize();
  }

  private initialize(): ResultAsync<void, AjaxError> {
    console.log("Initialize Default Account Balances: ");
    return ResultUtils.combine([
      this.ethereum.healthCheck(),
      this.alchemy.healthCheck(),
      this.sol.healthCheck(),
      this.etherscan.healthCheck(),
    ]).andThen(
      ([
        etherscanStatus,
        alchemyStatus,
        solRepoStatus,
        nativeBalanceStatus,
      ]) => {
        console.log("Etherscan Status: ", etherscanStatus);
        console.log("Alchemy Status: ", alchemyStatus);
        console.log("Sol Repo Status: ", solRepoStatus);
        console.log("Native Balance Status: ", nativeBalanceStatus);
        return okAsync(undefined);
      },
    );
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

  public getAlchemyBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.alchemy);
  }

  public getOklinkBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  > {
    return okAsync(this.oklink);
  }
}
