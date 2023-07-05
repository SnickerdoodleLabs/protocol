import { StatSummary, EExternalApi } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { Meter } from "measured-core";
import { ResultAsync, okAsync } from "neverthrow";

import { IMetricsRepository } from "@core/interfaces/data/index.js";

@injectable()
export class MetricsRepository implements IMetricsRepository {
  protected apiMeters = new Map<EExternalApi, Meter>();
  protected backupRestoredMeter = new Meter();
  protected queryPostedMeter = new Meter();

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

  public recordRestoredBackup(): ResultAsync<void, never> {
    this.backupRestoredMeter.mark(1);

    return okAsync(undefined);
  }

  public recordQueryPosted(): ResultAsync<void, never> {
    this.queryPostedMeter.mark(1);

    return okAsync(undefined);
  }

  public getApiStatSummaries(): ResultAsync<StatSummary[], never> {
    const apiStats = new Array<StatSummary>();

    this.apiMeters.forEach((meter, api) => {
      const stats = this.meterToStats(meter, api);
      apiStats.push(stats);
    });

    return okAsync(apiStats);
  }

  public getRestoredBackupSummary(): ResultAsync<StatSummary, never> {
    return okAsync(
      this.meterToStats(this.backupRestoredMeter, "Backups Restored"),
    );
  }

  public getQueriesPostedSummary(): ResultAsync<StatSummary, never> {
    return okAsync(this.meterToStats(this.queryPostedMeter, "Queries Posted"));
  }

  protected meterToStats(meter: Meter, stat: string): StatSummary {
    const meterData = meter.toJSON();
    return new StatSummary(
      stat,
      meterData.mean,
      meterData.count,
      meterData.currentRate,
      meterData["1MinuteRate"],
      meterData["5MinuteRate"],
      meterData["15MinuteRate"],
    );
  }
}
