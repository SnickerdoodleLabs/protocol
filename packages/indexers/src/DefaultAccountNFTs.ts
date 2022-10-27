import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountNFTs,
  IEVMNftRepository,
  ISolanaNFTRepository,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { DummySolanaIndexer } from "@indexers/DummySolanaIndexer.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { MoralisEVMNftRepository } from "@indexers/MoralisEVMNftRepository.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";

@injectable()
export class DefaultAccountNFTs implements IAccountNFTs {
  protected evm: IEVMNftRepository;
  protected simulatorRepo: IEVMNftRepository;
  protected solRepo: ISolanaNFTRepository;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    this.evm = new MoralisEVMNftRepository(this.configProvider, this.ajaxUtils);
    this.simulatorRepo = new SimulatorEVMTransactionRepository();
    this.solRepo = new DummySolanaIndexer();
  }

  public getEVMNftRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.evm);
  }

  public getSimulatorEVMNftRepository(): ResultAsync<IEVMNftRepository, never> {
    return okAsync(this.simulatorRepo);
  }

  public getSolanaNFTRepository(): ResultAsync<ISolanaNFTRepository, never> {
    return okAsync(this.solRepo);
  }
}
