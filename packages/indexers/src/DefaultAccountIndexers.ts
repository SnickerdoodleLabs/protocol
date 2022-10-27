import { DummySolanaIndexer } from "@indexers/DummySolanaIndexer.js";
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

import { CovalentEVMTransactionRepository } from "@indexers/CovalentEVMTransactionRepository.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";

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
    this.evm = new CovalentEVMTransactionRepository(
      this.configProvider,
      this.ajaxUtils,
    );

    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solRepo = new DummySolanaIndexer();
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
