interface Dictionary<T> {
  [key: string]: T;
}
export class LocalStorageUtils {
  static localStorage =
    window.localStorage && window.localStorage.removeItem
      ? window.localStorage
      : (function () {
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

  static readLocalStorage(key: string | string[]) {
    if (Array.isArray(key)) {
      return this._fromPairs(
        key.map((k) => [
          k,
          localStorage.getItem(k) && JSON.parse(localStorage.getItem(k)),
        ]),
      );
    }
    return (
      this.localStorage.getItem(key) &&
      JSON.parse(this.localStorage.getItem(key))
    );
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
