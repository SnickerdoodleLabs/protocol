import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountIndexing,
  IEVMTransactionRepository,
  ISolanaTransactionRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { CovalentEVMTransactionRepository } from "@indexers/CovalentEVMTransactionRepository.js";
import { EthereumIndexer } from "@indexers/EthererumIndexer.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolanaIndexer } from "@indexers/SolanaIndexer.js";

@injectable()
export class DefaultAccountIndexers implements IAccountIndexing {
  protected evm: IEVMTransactionRepository;
  protected eth: IEVMTransactionRepository;
  protected simulatorRepo: IEVMTransactionRepository;
  protected solRepo: ISolanaTransactionRepository;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.eth = new EthereumIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
    this.evm = new CovalentEVMTransactionRepository(configProvider, ajaxUtils);
    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solRepo = new SolanaIndexer(
      configProvider,
      ajaxUtils,
      tokenPriceRepo,
      logUtils,
    );
  }

  public getETHTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.eth);
  }

  public getEVMTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  > {
    return okAsync(this.evm);
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
    return okAsync(this.solRepo);
  }
}
