import { PersistenceError } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IStorageUtils } from "./IStorageUtils";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface Dictionary<T> {
  [key: string]: T;
}
export class LocalStorageUtils implements IStorageUtils {
  public remove(key: string | string[]): ResultAsync<void, PersistenceError> {
    const keys = Array.isArray(key) ? key : [key];
    keys.forEach((k) => LocalStorageUtils.localStorage.removeItem(k));
    return okAsync(undefined);
  }

  public write<T>(key: string, value: T): ResultAsync<void, PersistenceError> {
    const keys = typeof key === "object" ? key : { [key]: value };
    Object.entries(keys).map(([k, val]) =>
      LocalStorageUtils.localStorage.setItem(k, JSON.stringify(val)),
    );
    return okAsync(undefined);
  }

  public read<T>(key: string): ResultAsync<T | null, PersistenceError> {
    return okAsync(
      LocalStorageUtils.localStorage.getItem(key) &&
        JSON.parse(LocalStorageUtils.localStorage.getItem(key)),
    );
  }

  public clear(): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.localStorage.clear();
    return okAsync(undefined);
  }

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
}
