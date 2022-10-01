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

import { CovalentEVMTransactionRepository } from "@indexers/CovalentEVMTransactionRepository.js";
import { CovalentSolanaBalanceRepository } from "@indexers/CovalentSolanaBalanceRepository.js";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";
import { SimulatorEVMTransactionRepository } from "@indexers/SimulatorEVMTransactionRepository.js";

@injectable()
export class DefaultAccountBalances implements IAccountBalances {
  protected evm: IEVMAccountBalanceRepository;
  protected sol: ISolanaBalanceRepository;
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

    this.sol = new CovalentSolanaBalanceRepository(
      this.configProvider,
      this.ajaxUtils,
    );

    this.sim = new SimulatorEVMTransactionRepository();
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
