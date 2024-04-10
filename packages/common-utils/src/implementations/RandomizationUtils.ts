export class RandomizationUtils {
  static getRandomizedSetRange(
    itemIndex: number,
    totalItemCount: number,
    maxSetSize = 1000,
  ) {
    if (totalItemCount < maxSetSize) {
      return { start: 0, setSize: totalItemCount };
    } else {
      const maxShiftAmount = Math.min(maxSetSize - 1, itemIndex);
      let randomCoef = Math.random();
      if (itemIndex > totalItemCount - itemIndex) {
        // make randomCoef close to 1
        randomCoef = 0.6 + Math.random() * 0.4;
      }
      const randomShiftAmount = Math.round(randomCoef * maxShiftAmount);
      const startIndex = itemIndex - randomShiftAmount;
      const setSize = Math.min(maxSetSize, totalItemCount - startIndex);
      return { start: startIndex, setSize };
    }
  }
}
