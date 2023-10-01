import {
  StatSummary,
  EExternalApi,
  BackupFileName,
  DataWalletBackupID,
  EDataStorageType,
  StorageKey,
  BackupStat,
  EQueryEvents,
  QueryPerformanceMetrics,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { Meter, Timer } from "measured-core";
import { ResultAsync, okAsync } from "neverthrow";
import { QueryPerformanceEvent } from "packages/objects/src/businessObjects/events/query";

import { IMetricsRepository } from "@core/interfaces/data/index.js";

@injectable()
export class MetricsRepository implements IMetricsRepository {
  protected apiMeters = new Map<EExternalApi, Meter>();
  protected backupCreatedMeter = new Meter();
  protected backupCreatedMeters = new Map<StorageKey, Meter>();
  protected createdBackups = new Array<BackupStat>();

  protected backupRestoredMeter = new Meter();
  protected backupRestoredMeters = new Map<StorageKey, Meter>();
  protected restoredBackups = new Array<BackupStat>();

  protected queryPostedMeter = new Meter();

  protected queryEventsDurations: Record<EQueryEvents, number[]> | {} = {};
  protected queryEventsTimers: Record<EQueryEvents, Timer> | {} = {};
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

  public recordBackupCreated(
    storageType: EDataStorageType,
    dataType: StorageKey,
    backupId: DataWalletBackupID,
    name: BackupFileName,
  ): ResultAsync<void, never> {
    // Record the backup overall as created
    this.backupCreatedMeter.mark(1);

    // Then record the specific type of backup
    let meter = this.backupCreatedMeters.get(dataType);
    if (meter == null) {
      meter = new Meter();
      this.backupCreatedMeters.set(dataType, meter);
    }

    // Mark the type of backup
    meter.mark(1);

    // Now record the BackupStat
    this.createdBackups.push(
      new BackupStat(storageType, dataType, backupId, name),
    );

    return okAsync(undefined);
  }

  public recordBackupRestored(
    storageType: EDataStorageType,
    dataType: StorageKey,
    backupId: DataWalletBackupID,
    name: BackupFileName,
  ): ResultAsync<void, never> {
    // Record the backup overall as created
    this.backupRestoredMeter.mark(1);

    // Then record the specific type of backup
    let meter = this.backupRestoredMeters.get(dataType);
    if (meter == null) {
      meter = new Meter();
      this.backupRestoredMeters.set(dataType, meter);
    }

    // Mark the type of backup
    meter.mark(1);

    // Now record the BackupStat
    this.restoredBackups.push(
      new BackupStat(storageType, dataType, backupId, name),
    );

    return okAsync(undefined);
  }

  public recordQueryPosted(): ResultAsync<void, never> {
    this.queryPostedMeter.mark(1);

    return okAsync(undefined);
  }

  public recordQueryPerformanceEvent(
    event: QueryPerformanceEvent,
    elapsed: number,
  ): void {
    this.queryEventsDurations[event.type].push(elapsed);
    this.queryEventsTimers[event.type].update(elapsed);
  }

  public createQueryPerformanceStorage(eventName: EQueryEvents): void {
    this.queryEventsTimers[eventName] = new Timer();
    this.queryEventsDurations[eventName] = [];
  }

  public getQueryPerformanceData(): QueryPerformanceMetrics[] {
    const queryPerformanceData: QueryPerformanceMetrics[] = [];
    for (const eventName in this.queryEventsTimers) {
      const { meter: meterData, histogram: histogramData } =
        this.queryEventsTimers[eventName].toJSON();
      const durations = this.queryEventsDurations[eventName];
      queryPerformanceData.push(
        new QueryPerformanceMetrics(
          eventName,
          meterData,
          histogramData,
          durations,
        ),
      );
    }
    return queryPerformanceData;
  }

  public getApiStatSummaries(): ResultAsync<StatSummary[], never> {
    const apiStats = new Array<StatSummary>();

    this.apiMeters.forEach((meter, api) => {
      const stats = this.meterToStats(meter, api);
      apiStats.push(stats);
    });

    return okAsync(apiStats);
  }

  public getCreatedBackupsSummary(): ResultAsync<StatSummary, never> {
    return okAsync(
      this.meterToStats(this.backupCreatedMeter, "Backups Created"),
    );
  }

  public getCreatedBackupsByTypeSummary(): ResultAsync<StatSummary[], never> {
    const backupStats = new Array<StatSummary>();

    this.backupCreatedMeters.forEach((meter, key) => {
      backupStats.push(this.meterToStats(meter, `Created Backups: ${key}`));
    });
    return okAsync(backupStats);
  }

  public getCreatedBackups(): ResultAsync<BackupStat[], never> {
    return okAsync(this.createdBackups);
  }

  public getRestoredBackupsSummary(): ResultAsync<StatSummary, never> {
    return okAsync(
      this.meterToStats(this.backupRestoredMeter, "Backups Restored"),
    );
  }

  public getRestoredBackupsByTypeSummary(): ResultAsync<StatSummary[], never> {
    const backupStats = new Array<StatSummary>();

    this.backupRestoredMeters.forEach((meter, key) => {
      backupStats.push(this.meterToStats(meter, `Restored Backups: ${key}`));
    });
    return okAsync(backupStats);
  }

  public getRestoredBackups(): ResultAsync<BackupStat[], never> {
    return okAsync(this.restoredBackups);
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
