import { PersistenceError } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IStorageUtils } from "@utils/IStorageUtils";

export class ChromeStorageUtils implements IStorageUtils {
  public remove(key: string | string[]): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(chrome.storage.sync.remove(key), (e) => {
      return new PersistenceError(
        `Cannot remove key ${key} from chrome storage`,
        e,
      );
    });
  }

  public write<T>(key: string, value: T): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(
      chrome.storage.sync.set({
        [key]: value,
      }),
      (e) => {
        return new PersistenceError(
          `Cannot write key ${key} to chrome storage`,
          e,
        );
      },
    );
  }

  public read<T>(key: string): ResultAsync<T | null, PersistenceError> {
    return ResultAsync.fromPromise(chrome.storage.sync.get(key), (e) => {
      return new PersistenceError(
        `Cannot read key ${key} from chrome storage`,
        e,
      );
    }).map((vals) => {
      return vals[key];
    });
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(chrome.storage.sync.clear(), (e) => {
      return new PersistenceError(`Cannot clear chrome storage`, e);
    });
  }

  public getMaxDocumentSize(): ResultAsync<number, never> {
    return okAsync(4096);
  }
}
