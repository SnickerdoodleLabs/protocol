import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { RuntimeMetrics } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IMetricsService } from "@core/interfaces/business/index.js";
import { ApiStats } from "@core/interfaces/objects";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class MetricsService implements IMetricsService {
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).map(([context, config]) => {
      context.privateEvents.onApiAccessed.subscribe((apiName) => {
        // Update the stats. We'll record a timestamp for the api call
        // so we can calculate the rate
        const apiStats = context.apiCalls.get(apiName);
        const now = this.timeUtils.getUnixNow();

        // If no existing stats for this API, it's easier
        if (apiStats == null) {
          context.apiCalls.set(apiName, new ApiStats(apiName, 1, [now]));
          return;
        }

        // Already existing stats
        apiStats.totalCalls++;
        apiStats.timestamps.push(now);

        // To manage memory, we'll remove all timestamps older than the maxStatsRetentionSeconds
        const oldestStat = now - config.maxStatsRetentionSeconds;
        apiStats.timestamps = apiStats.timestamps.filter((timestamp) => {
          return timestamp >= oldestStat;
        });

        // Now, we can look for some patterns. For instance, if the API is spiking,
        // we can notify the system and potentially disable things
      });
    });
  }

  public getMetrics(): ResultAsync<RuntimeMetrics, never> {
    return this.contextProvider.getContext().map((context) => {
      const now = this.timeUtils.getUnixNow();
      const uptime = now - context.startTime;
      return new RuntimeMetrics(uptime, context.startTime, context.apiCalls);
    });
  }
}
