import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<
    void,
    PersistenceError | AccountIndexingError | AjaxError
  > {
    // When we first start up we'll do a poll.
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map(([config, context]) => {
      // Any time we add an account, we should poll the transactions
      context.publicEvents.onAccountAdded.subscribe(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      });

      // When you join a cohort, we should poll transactions just to make sure
      context.publicEvents.onCohortJoined.subscribe(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      });

      // After a query is processed is also a good time to poll
      context.publicEvents.onQueryProcessed.subscribe(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      });

      // When we startup, poll backups and transactions. However, we don't want the initialization
      // to fail if these polls fail, so we have specific error handling
      this.monitoringService.pollTransactions().mapErr((e) => {
        this.logUtils.error(e);
      });
      this.monitoringService.pollBackups().mapErr((e) => {
        this.logUtils.error(e);
      });

      // Set up some intervals for polling transactions and backups
      setInterval(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.accountIndexingPollingIntervalMS);

      setInterval(() => {
        this.monitoringService.pollBackups().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.dataWalletBackupIntervalMS);
    });
  }
}
