import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IAccountIndexerPoller } from "@core/interfaces/api/index.js";
import {
  IMonitoringServiceType,
  IMonitoringService,
} from "@core/interfaces/business/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class AccountIndexerPoller implements IAccountIndexerPoller {
  public constructor(
    @inject(IMonitoringServiceType)
    protected monitoringService: IMonitoringService,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      setInterval(() => {
        this.monitoringService.pollBackups().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.dataWalletBackupIntervalMS);

      this.contextProvider.getContext().map((ctx) => {
        ctx.publicEvents.onInitialRestore.subscribe(() => {
          setInterval(() => {
            this.monitoringService.pollTransactions().mapErr((e) => {
              this.logUtils.error(e);
            });
          }, config.accountIndexingPollingIntervalMS);
        });
      });
    });
  }
}
