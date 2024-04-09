import { RandomizationUtils } from "@common-utils/implementations/RandomizationUtils.js";

describe("RandomizationUtils", () => {
  describe("getRandomizedSetRange", () => {
    test("returns a set range object with start index 0 and total item count as size if total item count is less than max set size", () => {
      const itemIndex = 3;
      const totalItemCount = 10;
      const maxSetSize = 15;

      const result = RandomizationUtils.getRandomizedSetRange(
        itemIndex,
        totalItemCount,
        maxSetSize,
      );

      expect(result).toEqual({ start: 0, setSize: totalItemCount });
    });

    test("returns a set range object within constraints when total item count is greater than or equal to max set size", () => {
      const itemIndex = 5;
      const totalItemCount = 4500;
      const maxSetSize = 1000;

      const result = RandomizationUtils.getRandomizedSetRange(
        itemIndex,
        totalItemCount,
        maxSetSize,
      );

      expect(result.start).toBeGreaterThanOrEqual(0);
      expect(result.start).toBeLessThanOrEqual(itemIndex);
      expect(result.setSize).toBeGreaterThanOrEqual(1);
      expect(result.setSize).toBeLessThanOrEqual(maxSetSize);
    });

    test("ensures the start index and set size do not exceed total item count", () => {
      const testCases = [
        { itemIndex: 1001, totalItemCount: 6000, maxSetSize: 650 },
        { itemIndex: 2000, totalItemCount: 10000, maxSetSize: 800 },
        { itemIndex: 4500, totalItemCount: 5000, maxSetSize: 1000 },
        { itemIndex: 0, totalItemCount: 4000, maxSetSize: 200 },
        { itemIndex: 10, totalItemCount: 5000, maxSetSize: 1000 },
        { itemIndex: 6000, totalItemCount: 6002, maxSetSize: 1000 },
      ];

      testCases.forEach(({ itemIndex, totalItemCount, maxSetSize }) => {
        const result = RandomizationUtils.getRandomizedSetRange(
          itemIndex,
          totalItemCount,
          maxSetSize,
        );

        expect(result.start + result.setSize).toBeLessThanOrEqual(
          totalItemCount,
        );
      });
    });
    test("ensures item index is between start index and start index plus set size", () => {
      const testCases = [
        { itemIndex: 8, totalItemCount: 20, maxSetSize: 12 },
        { itemIndex: 15, totalItemCount: 30, maxSetSize: 10 },
        { itemIndex: 3, totalItemCount: 10, maxSetSize: 5 },
        { itemIndex: 999, totalItemCount: 65000, maxSetSize: 1000 },
        { itemIndex: 5001, totalItemCount: 5002, maxSetSize: 1000 },
        { itemIndex: 0, totalItemCount: 1, maxSetSize: 1000 },
      ];

      testCases.forEach(({ itemIndex, totalItemCount, maxSetSize }) => {
        const result = RandomizationUtils.getRandomizedSetRange(
          itemIndex,
          totalItemCount,
          maxSetSize,
        );

        expect(itemIndex).toBeGreaterThanOrEqual(result.start);
        expect(itemIndex).toBeLessThanOrEqual(result.start + result.setSize);
      });
    });
  });
});
