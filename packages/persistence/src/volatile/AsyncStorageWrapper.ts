import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistenceError } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IAsyncStorageWrapper } from "@persistence/volatile/IAsyncStorageWrapper.js";

@injectable()
export class AsyncStorageWrapper implements IAsyncStorageWrapper {
  public getItem(key: string): ResultAsync<string | null, PersistenceError> {
    return ResultAsync.fromPromise(AsyncStorage.getItem(key), (e) => {
      return new PersistenceError((e as Error).message, e);
    });
  }

  public setItem(
    key: string,
    value: string,
  ): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(AsyncStorage.setItem(key, value), (e) => {
      return new PersistenceError((e as Error).message, e);
    });
  }

  public removeItem(key: string): ResultAsync<void, PersistenceError> {
    return ResultAsync.fromPromise(AsyncStorage.removeItem(key), (e) => {
      return new PersistenceError((e as Error).message, e);
    });
  }

  public getAllKeys(): ResultAsync<readonly string[], PersistenceError> {
    return ResultAsync.fromPromise(AsyncStorage.getAllKeys(), (e) => {
      return new PersistenceError((e as Error).message, e);
    });
  }

  public getItems(
    keys: string[],
  ): ResultAsync<Map<string, string | null>, PersistenceError> {
    return ResultAsync.fromPromise(AsyncStorage.multiGet(keys), (e) => {
      return new PersistenceError((e as Error).message, e);
    }).map((keyValues) => {
      return new Map(keyValues);
    });
  }
}
