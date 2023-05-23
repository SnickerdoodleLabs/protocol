import { ApiStats, EExternalApi } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { Meter } from "measured-core";
import { ResultAsync, okAsync } from "neverthrow";

import { IMetricsRepository } from "@core/interfaces/data/index.js";

@injectable()
export class MetricsRepository implements IMetricsRepository {
  protected apiMeters = new Map<EExternalApi, Meter>();
  public constructor() {}

  public recordApiCall(api: EExternalApi): ResultAsync<void, never> {
    let meter = this.apiMeters.get(api);

    if (meter == null) {
      meter = new Meter();
      this.apiMeters.set(api, meter);
    }
    // Record the event
    meter.mark(1);

    return okAsync(undefined);
  }

  public getApiStats(): ResultAsync<ApiStats[], never> {
    const apiStats = new Array<ApiStats>();

    this.apiMeters.forEach((meter, api) => {
      const meterData = meter.toJSON();
      const stats = new ApiStats(
        api,
        meterData.mean,
        meterData.count,
        meterData.currentRate,
        meterData["1MinuteRate"],
        meterData["5MinuteRate"],
        meterData["15MinuteRate"],
      );
      apiStats.push(stats);
    });

    return okAsync(apiStats);
  }
}
