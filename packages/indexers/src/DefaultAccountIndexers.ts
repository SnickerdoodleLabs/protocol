import { IConfigProvider, ILogUtils } from "@core/interfaces/utilities";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IAccountIndexing,
  IAvalancheEVMTransactionRepository,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IEthereumEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "./IIndexerConfigProvider";

import { CovalentEthereumEVMTransactionRepository } from "@indexers/CovalentEthereumEVMTransactionRepository";

@injectable()
export class DefaultAccountIndexers implements IAccountIndexing {
  protected avalanche: IAvalancheEVMTransactionRepository | undefined;
  protected ethereum: IEthereumEVMTransactionRepository | undefined;

  public constructor(
    protected configProvider: IConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    this.avalanche = undefined;
    this.ethereum = undefined;
  }

  public getAvalancheEVMTransactionRepository(): ResultAsync<
    IAvalancheEVMTransactionRepository,
    never
  > {
    //unsure about default value here
    if (this.avalanche !== undefined) {
      return okAsync(this.avalanche);
    }

    return this.configProvider.getConfig().andThen((config) => {
      this.avalanche = new CovalentEthereumEVMTransactionRepository(
        config,
        this.persistence,
        this.ajaxUtils,
        config.avaxChainId,
      );
      return this.avalanche;
    });
  }

  public getEthereumEVMTransactionRepository(): ResultAsync<
    IEthereumEVMTransactionRepository,
    never
  > {
    //unsure about default value here
    if (this.ethereum !== undefined) {
      return okAsync(this.ethereum);
    }

    return this.configProvider.getConfig().andThen((config) => {
      this.ethereum = new CovalentEthereumEVMTransactionRepository(
        config,
        this.persistence,
        this.ajaxUtils,
        config.ethChainId,
      );
      return this.ethereum;
    });
  }
}
