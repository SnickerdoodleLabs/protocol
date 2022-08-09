import { PersistenceError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class ChromeStorageUtils {
  static remove(key: string | string[]): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(chrome.storage.sync.remove(key), (e) => {
      return new PersistenceError(
        `Cannot remove key ${key} from chrome storage, ${e}`,
      );
    });
  }

  static write<T>(key: string, value: T): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(
      chrome.storage.sync.set({
        [key]: value,
      }),
      (e) => {
        return new PersistenceError(
          `Cannot write key ${key} to chrome storage, ${e}`,
        );
      },
    );
  }

  static read<T>(key: string): ResultAsync<T | null, PersistenceError> {
    return ResultAsync.fromPromise(chrome.storage.sync.get(key), (e) => {
      return new PersistenceError(
        `Cannot read key ${key} from chrome storage, ${e}`,
      );
    }).map((vals) => {
      return vals[key];
    });
  }

  static clear(): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(chrome.storage.sync.clear(), (e) => {
      return new PersistenceError(`Cannot clear chrome storage: ${e}`);
    });
  }
}
