import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountBalances,
  IEVMAccountBalanceRepository,
  ISolanaBalanceRepository,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { DummySolanaIndexer } from "@indexers/DummySolanaIndexer.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { MoralisEVMIndexer } from "@indexers/MoralisEVMIndexer.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";

@injectable()
export class DefaultAccountBalances implements IAccountBalances {
  protected evm: IEVMAccountBalanceRepository;
  protected sim: IEVMAccountBalanceRepository;
  protected sol: ISolanaBalanceRepository;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    this.evm = new MoralisEVMIndexer(configProvider, ajaxUtils);
    this.sim = new SimulatorEVMTransactionRepository();
    this.sol = new DummySolanaIndexer();
  }

  public getSolanaBalanceRepository(): ResultAsync<
    ISolanaBalanceRepository,
    never
  > {
    return okAsync(this.sol);
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
}
