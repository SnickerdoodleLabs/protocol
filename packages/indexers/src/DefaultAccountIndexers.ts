import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountIndexing,
  IEVMTransactionRepository,
  ISolanaTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { MoralisEVMIndexer } from "@indexers/MoralisEVMIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";
import { SolscanSolanaIndexer } from "@indexers/SolscanSolanaIndexer.js";

@injectable()
export class DefaultAccountIndexers implements IAccountIndexing {
  protected evm: IEVMTransactionRepository;
  protected simulatorRepo: IEVMTransactionRepository;
  protected solRepo: ISolanaTransactionRepository;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    this.evm = new MoralisEVMIndexer(configProvider, ajaxUtils);
    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solRepo = new SolscanSolanaIndexer(configProvider, ajaxUtils);
  }

  public getSolanaTransactionRepository(): ResultAsync<
    ISolanaTransactionRepository,
    never
  > {
    return okAsync(this.solRepo);
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
}
