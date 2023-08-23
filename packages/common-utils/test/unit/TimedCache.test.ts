import "reflect-metadata";
import { UnixTimestamp } from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { TimedCache } from "@common-utils/implementations/index.js";
import { ITimeUtils } from "@common-utils/interfaces/index.js";

const then = UnixTimestamp(1);
const now = UnixTimestamp(2);
const cachedValue = "Phoebe";
const param1 = "param1";
const param2 = { a: 1, b: 2 };
const param3 = 3;
const param4 = 4;

describe("TimedCache tests", () => {
  test("TimedCache returns cached value", async () => {
    // Arrange
    const timeUtils = td.object<ITimeUtils>();
    td.when(timeUtils.getUnixNow()).thenReturn(then as never, now as never);

    const timedCache = new TimedCache<string>(1, timeUtils);

    // Act
    timedCache.set(cachedValue, param1, param2, param3);
    const result = timedCache.get(param1, param2, param3);

    // Assert
    expect(result).toBe(cachedValue);
  });

  test("TimedCache returns null if no value was cached", async () => {
    // Arrange
    const timeUtils = td.object<ITimeUtils>();
    td.when(timeUtils.getUnixNow()).thenReturn(then as never, now as never);

    const timedCache = new TimedCache<string>(1, timeUtils);

    // Act
    const result = timedCache.get(param1, param2, param3);

    // Assert
    expect(result).toBeNull();
  });

  test("TimedCache returns null if no value was cached (different keys)", async () => {
    // Arrange
    const timeUtils = td.object<ITimeUtils>();
    td.when(timeUtils.getUnixNow()).thenReturn(then as never, now as never);

    const timedCache = new TimedCache<string>(1, timeUtils);

    // Act
    timedCache.set(cachedValue, param1, param2, param3);
    const result = timedCache.get(param1, param2, param3, param4);

    // Assert
    expect(result).toBeNull();
  });

  test("TimedCache returns null if cache is expired", async () => {
    // Arrange
    const timeUtils = td.object<ITimeUtils>();
    td.when(timeUtils.getUnixNow()).thenReturn(then as never, now as never);

    const timedCache = new TimedCache<string>(0.5, timeUtils);

    // Act
    timedCache.set(cachedValue, param1, param2, param3);
    const result = timedCache.get(param1, param2, param3);

    // Assert
    expect(result).toBeNull();
  });
});
