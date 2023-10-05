import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  EExternalApi,
  EQueryEvents,
  EStatus,
  IpfsCID,
  RuntimeMetrics,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { QueryPerformanceEvent } from "packages/objects/src/businessObjects/events/query/index.js";

import { IMetricsService } from "@core/interfaces/business/index.js";
import {
  IMetricsRepository,
  IMetricsRepositoryType,
} from "@core/interfaces/data/index.js";
import { CoreContext } from "@core/interfaces/objects";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";
import { DoublyLinkedList } from "@core/implementations/data/utilities/index.js";

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

  protected queryErrors: Record<
    IpfsCID,
    DoublyLinkedList<QueryPerformanceEvent>
  > = {};
  protected globalQueryErrors: DoublyLinkedList<QueryPerformanceEvent> =
    new DoublyLinkedList<QueryPerformanceEvent>();

  public initialize(): ResultAsync<void, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map(([config, context]) => {
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

      this.generateQueryEventStorage(config.queryPerformanceMetricsLimit);
      this.attachEventListenersToQueryPerformanceEvents(
        context,
        config.queryPerformanceMetricsLimit,
      );

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
        const queryErrors: Record<IpfsCID, QueryPerformanceEvent[]> = {};
        for (const cid in this.queryErrors) {
          queryErrors[cid] = this.queryErrors[cid].toArray();
        }
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
          queryErrors,
        );
      },
    );
  }

  private attachEventListenersToQueryPerformanceEvents(
    context: CoreContext,
    sizeLimit: number,
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
          if (!this.queryErrors[event.queryCID]) {
            this.queryErrors[event.queryCID] =
              new DoublyLinkedList<QueryPerformanceEvent>(sizeLimit);
          }
          this.queryErrors[event.queryCID].append(event);
          this.globalQueryErrors.append(event);
          this.removeOldestErrorsUntilLimit(sizeLimit);
        }

        const elapsed =
          this.timeUtils.getUnixNow() -
          this.queryEventsElapsedStartTimes[event.type].pop()!;
        this.metricsRepo.recordQueryPerformanceEvent(event, elapsed);
      }
    };
    context.publicEvents.queryPerformance.subscribe(processEvent);
  }

  private removeOldestErrorsUntilLimit(sizeLimit: number): void {
    while (this.globalQueryErrors.size > sizeLimit) {
      const oldestError = this.globalQueryErrors.removeFirst();
      if (oldestError) {
        const cidList = this.queryErrors[oldestError.queryCID];
        if (cidList && cidList.size > 0) {
          cidList.removeFirst();
          if (cidList.size === 0) {
            delete this.queryErrors[oldestError.queryCID];
          }
        }
      }
    }
  }

  private generateQueryEventStorage(sizeLimit: number): void {
    Object.values(EQueryEvents).forEach((eventName) => {
      this.metricsRepo.createQueryPerformanceStorage(eventName, sizeLimit);
      this.queryEventsElapsedStartTimes[eventName] = [];
    });
  }
}
