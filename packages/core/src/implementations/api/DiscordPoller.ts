import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IDiscordPoller } from "@core/interfaces/api/index.js";
import {
  IMonitoringService,
  IMonitoringServiceType,
} from "@core/interfaces/business/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class DiscordPoller implements IDiscordPoller {
  public constructor(
    @inject(IMonitoringServiceType)
    protected monitoringService: IMonitoringService,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      this.logUtils.debug(
        `Initializing Discord Poller with ${config.discord.pollInterval} MS`,
      );
      setInterval(() => {
        this.monitoringService.pollDiscord().mapErr((e) => {
          this.logUtils.error(e);
        });
      }, config.discord.pollInterval);
    });
  }
}
