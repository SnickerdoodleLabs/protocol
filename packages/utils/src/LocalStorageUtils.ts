import {
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import { JSONString, PersistenceError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IStorageUtils } from "@utils/IStorageUtils.js";

/**
 * Instead of making three different implementations of this class, I just made the class itself detect
 * what kind of storage it can use, so that this logic can be centralized. Beacuse the chrome.storage API
 * is different from the localStorage api, I define a simple intermediate interface that both of them can
 * implement, ISimpleStorage, which is promise based. The conversion to ResultAsync is done in the
 * LocalStorageUtils class.
 */

interface ISimpleStorage {
  getItem(key: string): Promise<JSONString | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

@injectable()
export class LocalStorageUtils implements IStorageUtils {
  protected simpleStorage: ISimpleStorage;
  public constructor(@inject(ILogUtilsType) protected logUtils: ILogUtils) {
    // Determine what kind of storage we can use. If we're in a browser, we can use localStorage.
    // If we're in a chrome extension, we can use chrome.storage.local
    // If we're in a node environment, we can use a memory storage system
    if (typeof window !== "undefined" && window.localStorage) {
      this.logUtils.log("Using LocalStorage for IStorageUtils");
      this.simpleStorage = new LocalStorageStore();
    }
    // else if (chrome != null &&chrome.storage != null) {
    //   this.logUtils.log("Using Chrome Storage API for IStorageUtils");
    //   this.simpleStorage = new ChromeStorageStore();
    // }
    else {
      this.logUtils.log(
        "No storage API available, using memory-only storage for IStorageUtils",
      );
      this.simpleStorage = new MemoryStore();
    }
  }

  public remove(key: string | string[]): ResultAsync<void, PersistenceError> {
    const keys = Array.isArray(key) ? key : [key];
    return ResultUtils.combine(
      keys.map((key) => {
        return ResultAsync.fromPromise(
          this.simpleStorage.removeItem(key),
          (err) => {
            return new PersistenceError(
              "Cannot remove an item from storage",
              err,
            );
          },
        );
      }),
    ).map(() => {});
  }

  public write<T>(key: string, value: T): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(
      this.simpleStorage.setItem(key, ObjectUtils.serialize(value)),
      (err) => {
        return new PersistenceError("Cannot write to storage", err);
      },
    );
  }

  public read<T>(key: string): ResultAsync<T | null, PersistenceError> {
    return ResultAsync.fromPromise(this.simpleStorage.getItem(key), (err) => {
      return new PersistenceError("Cannot read from storage", err);
    }).map((val) => {
      if (val == null) {
        return null;
      }
      return ObjectUtils.deserialize(val);
    });
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(this.simpleStorage.clear(), (err) => {
      return new PersistenceError("Cannot clear storage", err);
    });
  }
}

class MemoryStore implements ISimpleStorage {
  protected store: Record<string, string> = {};
  public getItem(key) {
    const val = this.store[key];
    return Promise.resolve(val == null ? null : JSONString(val));
  }
  public setItem(key: string, value: string) {
    this.store[key] = value.toString();
    return Promise.resolve();
  }
  public clear() {
    this.store = {};
    return Promise.resolve();
  }
  public removeItem(key) {
    this.store = Object.keys(this.store)
      .filter((k) => key !== k)
      .reduce((accumulator, currentItem) => {
        accumulator[currentItem] = this.store[currentItem];
        return accumulator;
      }, {});
    return Promise.resolve();
  }
}

class LocalStorageStore implements ISimpleStorage {
  public getItem(key) {
    const val = window.localStorage.getItem(key);
    return Promise.resolve(val == null ? null : JSONString(val));
  }
  public setItem(key, value) {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  }
  public removeItem(key) {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  }
  public clear() {
    window.localStorage.clear();
    return Promise.resolve();
  }
}

// class ChromeStorageStore implements ISimpleStorage {
//   public async getItem(key) {
//     return (await chrome.storage.local.get(key))[key];
//   }

//   public setItem(key, value) {
//     return chrome.storage.local.set({ key: value });
//   }
//   public removeItem(key: string) {
//     return chrome.storage.local.remove(key);
//   }
//   public clear() {
//     return chrome.storage.local.clear();
//   }
// }
