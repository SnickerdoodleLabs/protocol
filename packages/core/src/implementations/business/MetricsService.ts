import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  EExternalApi,
  EQueryEvents,
  EStatus,
  IpfsCID,
  QueryPerformanceMetrics,
  RuntimeMetrics,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IMetricsService } from "@core/interfaces/business/index.js";
import {
  IMetricsRepository,
  IMetricsRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";
import { Timer } from "measured-core";
import { CoreContext } from "@core/interfaces/objects";
import { QueryPerformanceEvent } from "packages/objects/src/businessObjects/events/query/index.js";

@injectable()
export class MetricsService implements IMetricsService {
  public constructor(
    @inject(IMetricsRepositoryType) protected metricsRepo: IMetricsRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  protected queryEventsElapsedStartTimes: Record<EQueryEvents, number[]> | {} =
    {};
  protected queryEventsTimers: Record<EQueryEvents, Timer> | {} = {};
  protected queryEventsDurations: Record<EQueryEvents, number[]> | {} = {};
  protected queryErrors: Record<IpfsCID, QueryPerformanceEvent[]> | {} = {};

  public initialize(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      context.privateEvents.onApiAccessed.subscribe((apiName) => {
        this.metricsRepo.recordApiCall(apiName);
      });

      context.publicEvents.onQueryPosted.subscribe(() => {
        this.metricsRepo.recordQueryPosted();
      });

      context.publicEvents.onBackupCreated.subscribe((event) => {
        this.metricsRepo.recordBackupCreated(
          event.storageType,
          event.dataType,
          event.backupId,
          event.name,
        );
      });

      context.publicEvents.onBackupRestored.subscribe((event) => {
        this.metricsRepo.recordBackupRestored(
          event.storageType,
          event.dataType,
          event.backupId,
          event.name,
        );
      });

      // Will create event listeners and store durations
      // For query performance events
      // - this.generateQueryEventStorage();
      // - this.attachEventListenersToQueryPerformanceEvents(context);

      // Now, we can look for some patterns. For instance, if the API is spiking,
      // we can notify the system and potentially disable things
    });
  }

  public getMetrics(): ResultAsync<RuntimeMetrics, never> {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.metricsRepo.getApiStatSummaries(),
      this.metricsRepo.getQueriesPostedSummary(),
      this.metricsRepo.getCreatedBackupsSummary(),
      this.metricsRepo.getCreatedBackupsByTypeSummary(),
      this.metricsRepo.getCreatedBackups(),
      this.metricsRepo.getRestoredBackupsSummary(),
      this.metricsRepo.getRestoredBackupsByTypeSummary(),
      this.metricsRepo.getRestoredBackups(),
    ]).map(
      ([
        context,
        apiStats,
        queriesPosted,
        createdBackupsTotal,
        createdBackupsByType,
        createdBackups,
        restoredBackupsTotal,
        restoredBackupsByType,
        restoredBackups,
      ]) => {
        const now = this.timeUtils.getUnixNow();
        const uptime = now - context.startTime;
        const statsMap = new Map(
          apiStats.map((stats) => [stats.stat as EExternalApi, stats]),
        );

        return new RuntimeMetrics(
          uptime,
          context.startTime,
          statsMap,
          queriesPosted,
          createdBackupsTotal,
          createdBackupsByType,
          createdBackups,
          restoredBackupsTotal,
          restoredBackupsByType,
          restoredBackups,
          context.components,
          this.metricsRepo.getQueryPerformanceData(),
          this.queryErrors,
        );
      },
    );
  }

  private attachEventListenersToQueryPerformanceEvents(
    context: CoreContext,
  ): void {
    const processEvent = (event: QueryPerformanceEvent) => {
      if (event.status === EStatus.Start) {
        this.queryEventsElapsedStartTimes[event.type].push(
          this.timeUtils.getUnixNow(),
        );
      } else if (
        event.status === EStatus.End &&
        this.queryEventsElapsedStartTimes[event.type].length
      ) {
        if (event.error) {
          if (this.queryErrors[event.queryCID] === undefined) {
            this.queryErrors[event.queryCID].push(event);
          } else {
            this.queryErrors[event.queryCID] = [event];
          }
        }

        const elapsed =
          this.timeUtils.getUnixNow() -
          this.queryEventsElapsedStartTimes[event.type].pop()!;
        this.metricsRepo.recordQueryPerformanceEvent(event, elapsed);
      }
    };
    context.publicEvents.queryPerformance.subscribe(processEvent);
  }

  private generateQueryEventStorage(): void {
    Object.values(EQueryEvents).forEach((eventName) => {
      this.metricsRepo.createQueryPerformanceStorage(eventName);
      this.queryEventsElapsedStartTimes[eventName] = [];
    });
  }
}
