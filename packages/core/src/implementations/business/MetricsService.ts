import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { RuntimeMetrics } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IMetricsService } from "@core/interfaces/business/index.js";
import {
  IMetricsRepository,
  IMetricsRepositoryType,
} from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class MetricsService implements IMetricsService {
  public constructor(
    @inject(IMetricsRepositoryType) protected metricsRepo: IMetricsRepository,
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
        this.metricsRepo.recordApiCall(apiName);

        // Now, we can look for some patterns. For instance, if the API is spiking,
        // we can notify the system and potentially disable things
      });
    });
  }

  public getMetrics(): ResultAsync<RuntimeMetrics, never> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.metricsRepo.getApiStats(),
    ]).map(([context, apiStats]) => {
      const now = this.timeUtils.getUnixNow();
      const uptime = now - context.startTime;
      const statsMap = new Map(apiStats.map((stats) => [stats.api, stats]));

      return new RuntimeMetrics(uptime, context.startTime, statsMap);
    });
  }
}
