import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
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
} from "@core/interfaces/utilities/index.js";

@injectable()
export class AccountIndexerPoller implements IAccountIndexerPoller {
  public constructor(
    @inject(IMonitoringServiceType)
    protected monitoringService: IMonitoringService,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().andThen((config) => {
      setInterval(() => {
        this.monitoringService.pollTransactions().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.accountIndexingPollingIntervalMS);
      this.monitoringService
        .pollTransactions()
        .mapErr((e) => this.logUtils.error(e));

      setInterval(() => {
        this.monitoringService.pollBackups().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.dataWalletBackupIntervalMS);
      this.monitoringService
        .pollBackups()
        .mapErr((e) => this.logUtils.error(e));

      // setInterval(() => {
      //   this.monitoringService.pollBalances().mapErr((e) => {
      //     this.logUtils.error(e);
      //   });
      // }, config.accountBalancePollingIntervalMS);

      // setInterval(() => {
      //   this.monitoringService.pollNFTs().mapErr((e) => {
      //     this.logUtils.error(e);
      //   });
      // }, config.accountNFTPollingIntervalMS);

      return okAsync(undefined);
    });
  }
}
