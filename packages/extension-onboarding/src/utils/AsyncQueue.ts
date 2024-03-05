import { ResultAsync } from "neverthrow";

interface QueueItem<T, E> {
  asyncFunction: ResultAsync<T, E>;
  resolve: (value: void | PromiseLike<void>) => void;
  reject: (reason?: never) => void;
}

export class AsyncQueue {
  private queue: QueueItem<void, unknown>[] = [];
  private running = false;

  async enqueue(asyncFunction: ResultAsync<void, unknown>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.queue.push({ asyncFunction, resolve, reject });
      if (!this.running) {
        this.runNext();
      }
    });
  }

  private async runNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.running = false;
      return;
    }

    this.running = true;
    const { asyncFunction, resolve, reject } = this.queue.shift()!;

    try {
      const result = await asyncFunction;
      result.isOk() ? resolve() : reject();
    } catch (error) {
      reject();
    }

    this.runNext();
  }
}
