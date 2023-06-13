import "reflect-metadata";
import { EExternalApi } from "@snickerdoodlelabs/objects";

import { MetricsRepository } from "@core/implementations/data/index.js";
import { IMetricsRepository } from "@core/interfaces/data/index.js";

class MetricsRepositoryMocks {
  public constructor() {}

  public factory(): IMetricsRepository {
    return new MetricsRepository();
  }
}

describe("MetricsRepository tests", () => {
  test("recordApiCall happy path", async () => {
    // Arrange
    const mocks = new MetricsRepositoryMocks();
    const repo = mocks.factory();

    // Act
    const result = await repo.recordApiCall(EExternalApi.PrimaryControl);

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
  });

  test("getApiStatSummaries no recorded stats", async () => {
    // Arrange
    const mocks = new MetricsRepositoryMocks();
    const repo = mocks.factory();

    // Act
    const result = await repo.getApiStatSummaries();

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    const stats = result._unsafeUnwrap();
    expect(stats.length).toBe(0);
  });

  test("getApiStatSummaries one stat recorded", async () => {
    // Arrange
    const mocks = new MetricsRepositoryMocks();
    const repo = mocks.factory();

    // Act
    const result = await repo
      .recordApiCall(EExternalApi.PrimaryControl)
      .andThen(() => {
        return repo.getApiStatSummaries();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();

    const stats = result._unsafeUnwrap();
    expect(stats.length).toBe(1);
    const stat = stats[0];
    expect(stat.stat).toBe(EExternalApi.PrimaryControl);
    expect(stat.count).toBe(1);
    expect(stat.currentRate).toBeGreaterThan(0);
    expect(stat.mean).toBeGreaterThan(0);
    // These values need at least 5 seconds to update, so they will be 0 still
    expect(stat.oneMinuteRate).toBe(0);
    expect(stat.fiveMinuteRate).toBe(0);
    expect(stat.fifteenMinuteRate).toBe(0);
  });
});
