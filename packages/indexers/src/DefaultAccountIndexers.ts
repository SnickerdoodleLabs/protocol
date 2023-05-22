import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  IAccountIndexing,
  IEVMTransactionRepository,
  ISolanaTransactionRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { EtherscanIndexer } from "@indexers/EtherscanIndexer.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { PolygonIndexer } from "@indexers/PolygonIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/SolanaIndexer.js";

@injectable()
export class DefaultAccountIndexers implements IAccountIndexing {
  protected etherscan: EtherscanIndexer;
  protected simulatorRepo: IEVMTransactionRepository;
  protected solana: SolanaIndexer;
  protected matic: PolygonIndexer;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.etherscan = new EtherscanIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solana = new SolanaIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.matic = new PolygonIndexer(
      this.configProvider,
      this.ajaxUtils,
      this.tokenPriceRepo,
      this.logUtils,
    );

    this.initialize();
  }

  private initialize(): ResultAsync<void, AjaxError> {
    console.log("Initialize Default Account Indexers: ");
    return ResultUtils.combine([
      this.etherscan.healthCheck(),
      this.solana.healthCheck(),
      this.matic.healthCheck(),
    ]).andThen(([etherscanStatus, solanaStatus, polygonStatus]) => {
      console.log("Etherscan Status: ", etherscanStatus);
      console.log("Solana Status: ", solanaStatus);
      console.log("Polygon Status: ", polygonStatus);
      return okAsync(undefined);
    });
  }

  public getLatest(): 

  public getPolygonTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.matic);
  }

  public getEthereumTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.etherscan);
  }

  public getEVMTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.etherscan);
  }

  public getSimulatorEVMTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.simulatorRepo);
  }

  public getSolanaTransactionRepository(): ResultAsync<
    ISolanaTransactionRepository,
    never
  > {
    return okAsync(this.solana);
  }
}
