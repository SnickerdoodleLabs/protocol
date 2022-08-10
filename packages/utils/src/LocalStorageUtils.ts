import { PersistenceError } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IStorageUtils } from "@utils/IStorageUtils";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface Dictionary<T> {
  [key: string]: T;
}
export class LocalStorageUtils implements IStorageUtils {
  static localStorage = (function () {
    // If the localStorage actually exists, use that
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }

    // If not, then we default to a "memory storage" system
    let store = {};
    return {
      getItem: function (key) {
        return store[key] || null;
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      clear: function () {
        store = {};
      },
      removeItem: function (key) {
        store = Object.keys(store)
          .filter((k) => key !== k)
          .reduce((accumulator, currentItem) => {
            accumulator[currentItem] = store[currentItem];
            return accumulator;
          }, {});
      },
    };
  })();

  static removeLocalStorage(key: string | string[]): string | string[] {
    const keys = Array.isArray(key) ? key : [key];
    keys.forEach((k) => LocalStorageUtils.localStorage.removeItem(k));
    return keys;
  }

  static writeLocalStorage(
    key: string | Dictionary<any>,
    value?: any,
  ): Dictionary<any> {
    const keys = typeof key === "object" ? key : { [key]: value };
    Object.entries(keys).map(([k, val]) =>
      LocalStorageUtils.localStorage.setItem(k, JSON.stringify(val)),
    );
    return keys;
  }

  static readLocalStorage(key: string | string[]) {
    if (Array.isArray(key)) {
      return LocalStorageUtils._fromPairs(
        key.map((k) => [
          k,
          localStorage.getItem(k) && JSON.parse(localStorage.getItem(k)!),
        ]),
      );
    }
    return (
      LocalStorageUtils.localStorage.getItem(key) &&
      JSON.parse(LocalStorageUtils.localStorage.getItem(key))
    );
  }

  static clearLocalStorage(): void {
    LocalStorageUtils.localStorage.clear();
  }

  private static _fromPairs(pairs) {
    let index = -1;
    const length = pairs == null ? 0 : pairs.length;
    const result = {};

    while (++index < length) {
      const pair = pairs[index];
      result[pair[0]] = pair[1];
    }
    return result;
  }

  public remove(key: string | string[]): ResultAsync<void, PersistenceError> {
    return this.remove(key);
  }

  public write<T>(key: string, value: T): ResultAsync<void, PersistenceError> {
    return okAsync(LocalStorageUtils.writeLocalStorage(key, value)).andThen(
      () => okAsync(undefined),
    );
  }

  public read<T>(key: string): ResultAsync<T | null, PersistenceError> {
    return okAsync(LocalStorageUtils.readLocalStorage(key));
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return okAsync(LocalStorageUtils.clearLocalStorage());
  }

  public getMaxDocumentSize(): ResultAsync<number, never> {
    return okAsync(-1);
  }
}
