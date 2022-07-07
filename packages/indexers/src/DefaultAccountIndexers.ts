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
  protected avalanche: IAvalancheEVMTransactionRepository;
  protected ethereum: IEthereumEVMTransactionRepository;

  public constructor(
    protected configProvider: IConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    configProvider.getConfig().map((config) => {
      this.avalanche = new CovalentEthereumEVMTransactionRepository(
        config,
        persistence,
        ajaxUtils,
        config.ethChainId,
      );
      this.ethereum = new CovalentEthereumEVMTransactionRepository(
        config,
        persistence,
        ajaxUtils,
        config.avaxChainId,
      ); // as long as chainId is 43114, this will scrape c chain events
    });
  }

  public getAvalancheEVMTransactionRepository(): ResultAsync<
    IAvalancheEVMTransactionRepository,
    never
  > {
    throw new Error("Method not implemented.");
  }

  public getEthereumEVMTransactionRepository(): ResultAsync<
    IEthereumEVMTransactionRepository,
    never
  > {
    throw new Error("Method not implemented.");
  }
}
