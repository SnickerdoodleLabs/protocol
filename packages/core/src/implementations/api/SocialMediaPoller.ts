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
      setInterval(() => {
        this.monitoringService.pollDiscord().mapErr(this.logUtils.error);
      }, config.discord.pollInterval);
      setInterval(() => {
        this.monitoringService.pollTwitter().mapErr(this.logUtils.error);
      }, config.twitter.pollInterval);
    });
  }
}
