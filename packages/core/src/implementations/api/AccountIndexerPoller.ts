import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAccountIndexerPoller } from "@core/interfaces/api/index.js";
import {
  IMonitoringServiceType,
  IMonitoringService,
} from "@core/interfaces/business/index.js";
import {
  IDataWalletPersistenceType,
  IDataWalletPersistence,
} from "@core/interfaces/data/index.js";
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
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map(([config, context]) => {
      // Set up polling for backups
      setInterval(() => {
        this.monitoringService.pollBackups().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.dataWalletBackupIntervalMS);

      // Set up polling for transactions
      setInterval(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.accountIndexingPollingIntervalMS);

      // Post backups periodically
      setInterval(() => {
        this.monitoringService.postBackups().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.backupHeartbeatIntervalMS);

      // Poll transactions after an account is added.
      context.publicEvents.onAccountAdded.subscribe(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      });

      // poll once
      this.logUtils.debug("Doing initial poll for transactions");
      this.monitoringService.pollTransactions().mapErr((e) => {
        this.logUtils.error(e);
      });
    });
  }
}
