import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { ISocialMediaPoller } from "@core/interfaces/api/index.js";
import {
  IMonitoringService,
  IMonitoringServiceType,
} from "@core/interfaces/business/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";
import { ESocialType } from "@snickerdoodlelabs/objects";
import { CoreConfig } from "@core/interfaces/objects";

@injectable()
export class SocialMediaPoller implements ISocialMediaPoller {
  public constructor(
    @inject(IMonitoringServiceType)
    protected monitoringService: IMonitoringService,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      Object.values(ESocialType).forEach((platform) => {
        if (!this._platformHasValidPollingSettings(config, platform)) {
          return;
        }
        const platformLowerCase = platform.toLowerCase();
        this.logUtils.debug(
          `Initializing ${platformLowerCase} poller with ${config[platformLowerCase].pollInterval} MS`,
        );
        setInterval(() => {
          this.monitoringService[`poll${platform}`]().mapErr(
            this.logUtils.error,
          );
        }, config[platformLowerCase].pollInterval);
      });
    });
  }

  private _platformHasValidPollingSettings(
    config: CoreConfig,
    platform: ESocialType,
  ): boolean {
    if (this.monitoringService[`poll${platform}`] == null) {
      this.logUtils.warning(
        `Not initializing ${platform} poller because it doesn't have a polling function named poll${platform}`,
      );
      return false;
    }

    const platformLowerCase = platform.toLowerCase();
    if (
      config[platformLowerCase] == null ||
      config[platformLowerCase].pollInterval == null
    ) {
      this.logUtils.warning(
        `Not initializing ${platformLowerCase} poller because it doesn't have a polling interval set up.`,
      );
      return false;
    }

    return true;
  }
}
