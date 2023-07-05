import { ResultAsync } from "neverthrow";

export class PortfolioCacheItem<T, E> {
  public timestamp: number;

  public constructor(timestamp?: number, public result?: ResultAsync<T, E>) {
    this.timestamp = timestamp ?? 0;
  }

  public clear(): void {
    this.timestamp = 0;
    this.result = undefined;
  }
}
