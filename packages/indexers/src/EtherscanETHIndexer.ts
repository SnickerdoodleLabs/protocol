import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IEVMAccountBalanceRepository,
  IEVMNftRepository,
  IEVMTransactionRepository,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider";

export class EtherscanETHIndexer {
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

//   private initialize(): ResultAsync<void, PersistenceError> {

//   }
}
