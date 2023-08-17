import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { PersistenceError } from "@snickerdoodlelabs/objects";
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
  protected backupPollingInterval: NodeJS.Timeout | null = null;

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
      // Set up polling for transactions
      setInterval(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.accountIndexingPollingIntervalMS);

      // Poll transactions after an account is added.
      context.publicEvents.onAccountAdded.subscribe(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      });

      // Cloud Activation here - event found in cloud storage manager
      context.publicEvents.onCloudStorageActivated.subscribe(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });

        // Poll immediately for backups
        this.monitoringService.pollBackups().mapErr((e) => {
          this.logUtils.error(e);
        });

        // Set up polling for backups
        this.backupPollingInterval = setInterval(() => {
          console.log("hitting indexer polling dropbox");
          this.monitoringService
            .pollBackups()
            .map(() => {
              console.log("hitting indexer polling dropbox 2");
            })
            .mapErr((e) => {
              this.logUtils.error(e);
            });
        }, config.dataWalletBackupIntervalMS);

        // Post backups periodically
        console.log(
          "this.backupPollingInterval: " + this.backupPollingInterval,
        );
        setInterval(() => {
          this.monitoringService.postBackups().mapErr((e) => {
            this.logUtils.error(e);
          });
        }, config.backupHeartbeatIntervalMS);
      });

      context.publicEvents.onCloudStorageDeactivated.subscribe(() => {
        console.log(
          "onCloudStorageDeactivated this.backupPollingInterval: " +
            this.backupPollingInterval,
        );
        if (this.backupPollingInterval != null) {
          clearTimeout(this.backupPollingInterval);
        }
      });

      // poll once
      this.logUtils.debug("Doing initial poll for transactions");
      this.monitoringService.pollTransactions().mapErr((e) => {
        this.logUtils.error(e);
      });
    });
  }
}
