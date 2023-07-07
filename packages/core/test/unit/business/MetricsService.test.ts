import "reflect-metadata";
import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  StatSummary,
  EExternalApi,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { MetricsService } from "@core/implementations/business/index.js";
import { IMetricsService } from "@core/interfaces/business/index.js";
import { IMetricsRepository } from "@core/interfaces/data/index.js";
import { IConfigProvider } from "@core/interfaces/utilities/index.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

const now = UnixTimestamp(1);
const primaryStats = new StatSummary(
  EExternalApi.PrimaryControl,
  1,
  1,
  1,
  1,
  1,
  1,
);
const backupStats = new StatSummary("Backups Restored", 1, 1, 1, 1, 1, 1);
const queryStats = new StatSummary("Queries Posted", 1, 1, 1, 1, 1, 1);

class MetricsServiceMocks {
  public metricsRepo: IMetricsRepository;
  public configProvider: IConfigProvider;
  public contextProvider: ContextProviderMock;
  public timeUtils: ITimeUtils;

  public constructor() {
    this.metricsRepo = td.object<IMetricsRepository>();
    this.configProvider = new ConfigProviderMock();
    this.contextProvider = new ContextProviderMock();
    this.timeUtils = td.object<ITimeUtils>();

    td.when(this.timeUtils.getUnixNow()).thenReturn(now as never);

    td.when(
      this.metricsRepo.recordApiCall(EExternalApi.PrimaryControl),
    ).thenReturn(okAsync(undefined));

    td.when(this.metricsRepo.getApiStatSummaries()).thenReturn(
      okAsync([primaryStats]),
    );

    td.when(this.metricsRepo.getQueriesPostedSummary()).thenReturn(
      okAsync(queryStats),
    );

    td.when(this.metricsRepo.getRestoredBackupSummary()).thenReturn(
      okAsync(backupStats),
    );
  }

  public factory(): IMetricsService {
    return new MetricsService(
      this.metricsRepo,
      this.contextProvider,
      this.configProvider,
      this.timeUtils,
    );
  }
}

describe("MetricsService tests", () => {
  test("initialize happy path", async () => {
    // Arrange
    const mocks = new MetricsServiceMocks();
    const service = mocks.factory();

    // Act
    const result = await service.initialize();

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    mocks.contextProvider.assertEventCounts({});
  });

  test("getMetrics happy path", async () => {
    // Arrange
    const mocks = new MetricsServiceMocks();
    const service = mocks.factory();

    // Act
    const result = await service.initialize().andThen(() => {
      return service.getMetrics();
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const metrics = result._unsafeUnwrap();

    expect(metrics.uptime).toBe(now - mocks.contextProvider.context.startTime);
    expect(metrics.startTime).toBe(mocks.contextProvider.context.startTime);
    expect(metrics.apiCalls).toBeDefined();
    const primaryControlMetrics = metrics.apiCalls.get(
      EExternalApi.PrimaryControl,
    );
    expect(primaryControlMetrics).toBeDefined();
    expect(primaryControlMetrics?.stat).toBe(EExternalApi.PrimaryControl);
    expect(primaryControlMetrics?.count).toBe(1);
    expect(primaryControlMetrics?.mean).toBe(1);
    expect(primaryControlMetrics?.currentRate).toBe(1);
    expect(primaryControlMetrics?.oneMinuteRate).toBe(1);
    expect(primaryControlMetrics?.fiveMinuteRate).toBe(1);
    expect(primaryControlMetrics?.fifteenMinuteRate).toBe(1);

    expect(metrics.queriesPosted).toBe(queryStats);
    expect(metrics.backupsRestored).toBe(backupStats);

    mocks.contextProvider.assertEventCounts({});
  });

  test("getMetrics api accessed", async () => {
    // Arrange
    const mocks = new MetricsServiceMocks();
    const service = mocks.factory();

    // Act
    const result = await service.initialize().andThen(() => {
      mocks.contextProvider.context.privateEvents.onApiAccessed.next(
        EExternalApi.PrimaryControl,
      );
      return service.getMetrics();
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const metrics = result._unsafeUnwrap();

    expect(metrics.uptime).toBe(now - mocks.contextProvider.context.startTime);
    expect(metrics.startTime).toBe(mocks.contextProvider.context.startTime);
    expect(metrics.apiCalls).toBeDefined();
    const primaryControlMetrics = metrics.apiCalls.get(
      EExternalApi.PrimaryControl,
    );
    expect(primaryControlMetrics).toBeDefined();
    expect(primaryControlMetrics?.stat).toBe(EExternalApi.PrimaryControl);
    expect(primaryControlMetrics?.count).toBe(1);
    expect(primaryControlMetrics?.mean).toBe(1);
    expect(primaryControlMetrics?.currentRate).toBe(1);
    expect(primaryControlMetrics?.oneMinuteRate).toBe(1);
    expect(primaryControlMetrics?.fiveMinuteRate).toBe(1);
    expect(primaryControlMetrics?.fifteenMinuteRate).toBe(1);
    mocks.contextProvider.assertEventCounts({ onApiAccessed: 1 });
  });
});
