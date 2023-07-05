import { ChainId, AccountAddress } from "@snickerdoodlelabs/objects";
import { ResultAsync, okAsync } from "neverthrow";

import { PortfolioCacheItem } from "@persistence/portfolio/PortfolioCacheItem.js";

export class PortfolioCache<T, E> {
  private _cache = new Map<string, PortfolioCacheItem<T, E>>();
  public constructor(public lifespanMS: number) {}

  public get(
    chainId: ChainId,
    address: AccountAddress,
  ): ResultAsync<T | null, E> {
    return this._get(chainId, address).andThen((result) => {
      if (result == null || result.result == undefined) {
        return okAsync(null);
      }
      return result.result;
    });
  }

  private _get(
    chainId: ChainId,
    address: AccountAddress,
  ): ResultAsync<PortfolioCacheItem<T, E> | null, never> {
    if (this._cache.has(PortfolioCache.getKey(chainId, address))) {
      const current = new Date().getTime();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cached = this._cache.get(PortfolioCache.getKey(chainId, address))!;
      if (current - cached.timestamp < this.lifespanMS) {
        return okAsync(cached);
      }
    }
    return okAsync(null); // always undefined
  }

  public set(
    chainId: ChainId,
    address: AccountAddress,
    timestamp: number,
    result: ResultAsync<T, E>,
  ): ResultAsync<void, E> {
    return this._get(chainId, address).andThen((item) => {
      if (item == null || timestamp - item.timestamp < this.lifespanMS) {
        this._cache.set(
          PortfolioCache.getKey(chainId, address),
          new PortfolioCacheItem(timestamp, result),
        );
      }
      return okAsync(undefined);
    });
  }

  public clear(
    chainId: ChainId,
    address: AccountAddress,
  ): ResultAsync<void, never> {
    this._cache.set(
      PortfolioCache.getKey(chainId, address),
      new PortfolioCacheItem<T, E>(),
    );
    return okAsync(undefined);
  }

  public static getKey(chainId: ChainId, address: AccountAddress): string {
    return [chainId, address].toString();
  }
}
