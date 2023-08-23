import Crypto from "crypto";

import { UnixTimestamp } from "@snickerdoodlelabs/objects";

import { ObjectUtils } from "@common-utils/implementations/ObjectUtils.js";
import { ITimeUtils } from "@common-utils/interfaces/index.js";

export class TimedCache<T> {
  protected cache = new Map<string, CacheEntry<T>>();
  public constructor(
    protected cacheTimeSeconds: number,
    protected timeUtils: ITimeUtils,
  ) {}

  public get(...args: unknown[]): T | null {
    const key = this.getKey(args);

    const value = this.cache.get(key);

    // No cached value
    if (value == null) {
      return null;
    }

    // Check the timestamp- return null if the entry is expired
    const now = this.timeUtils.getUnixNow();
    if (now - value.timestamp > this.cacheTimeSeconds) {
      return null;
    }

    // Entry is still valid
    return value.value;
  }

  public set(value: T, ...args: unknown[]): void {
    const key = this.getKey(args);
    const now = this.timeUtils.getUnixNow();
    this.cache.set(key, new CacheEntry(now, value));
  }

  public clearAll(): void {
    this.cache.clear();
  }

  public clear(...args: unknown[]) {
    const key = this.getKey(args);
    this.cache.delete(key);
  }

  protected getKey(args: unknown[]): string {
    const json = ObjectUtils.serialize(args);
    return Crypto.createHash("md5").update(json).digest("base64");
  }
}

class CacheEntry<T> {
  public constructor(public timestamp: UnixTimestamp, public value: T) {}
}
