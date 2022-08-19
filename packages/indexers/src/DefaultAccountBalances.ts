import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountBalances,
  IEVMAccountBalanceRepository,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { CovalentEVMTransactionRepository } from "@indexers/CovalentEVMTransactionRepository";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository";

@injectable()
export class DefaultAccountBalances implements IAccountBalances {
  protected evm: IEVMAccountBalanceRepository;
  protected sim: IEVMAccountBalanceRepository;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    this.evm = new CovalentEVMTransactionRepository(
      this.configProvider,
      this.ajaxUtils,
    );

    this.sim = new SimulatorEVMTransactionRepository();
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
