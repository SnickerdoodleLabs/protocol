import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

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
    return this.configProvider.getConfig().map((config) => {
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
    });
  }
}
