import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { RuntimeMetrics } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IMetricsService } from "@core/interfaces/business/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class MetricsService implements IMetricsService {
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public getMetrics(): ResultAsync<RuntimeMetrics, never> {
    return this.contextProvider.getContext().map((context) => {
      const now = this.timeUtils.getUnixNow();
      const uptime = now - context.startTime;
      return new RuntimeMetrics(uptime, context.startTime, context.apiCalls);
    });
  }
}
