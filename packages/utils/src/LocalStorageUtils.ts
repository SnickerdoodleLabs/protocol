import { errAsync, okAsync, ResultAsync } from "neverthrow";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface Dictionary<T> {
  [key: string]: T;
}
export class LocalStorageUtils {
  static localStorage = (function () {
    console.log("chrome: ", typeof chrome);
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    } else if (typeof chrome !== undefined) {
      return {
        getItem: function (key) {
          return new Promise((resolve) => {
            chrome.storage.sync.get(key, (value) => {
              if (chrome.runtime.lastError) {
                resolve(null);
              }
              resolve(value.key);
            });
          });
        },
        setItem: function (key, value) {
          chrome.storage.local.set({ [key]: value });
        },
        clear: function () {
          chrome.storage.local.clear();
        },
        removeItem: function (key) {
          chrome.storage.local.remove(key);
        },
      };
    }
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
    keys.forEach((k) => this.localStorage.removeItem(k));
    return keys;
  }

  static writeLocalStorage(
    key: string | Dictionary<any>,
    value?: any,
  ): Dictionary<any> {
    const keys = typeof key === "object" ? key : { [key]: value };
    Object.entries(keys).map(([k, val]) =>
      this.localStorage.setItem(k, JSON.stringify(val)),
    );
    return keys;
  }

  static readLocalStorage(key: string) {
    const val = this.localStorage.getItem(key);
    if (typeof val === "object" && typeof val.then === "function") {
      return ResultAsync.fromPromise(val, (e) =>
        errAsync(new Error((e as Error).message)),
      );
    }
    // if (Array.isArray(key)) {
    //   return this._fromPairs(
    //     key.map((k) => [
    //       k,
    //       this.localStorage.getItem(k) && JSON.parse(this.localStorage.getItem(k)!),
    //     ]),
    //   );
    // }
    return val && okAsync(JSON.parse(this.localStorage.getItem(key)));
  }

  static clearLocalStorage(): void {
    this.localStorage.clear();
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
}
