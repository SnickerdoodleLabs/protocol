import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistenceError } from "@snickerdoodlelabs/objects";
import { IStorageUtils } from "@snickerdoodlelabs/utils";
import { ResultAsync, okAsync } from "neverthrow";
import { MMKV } from "react-native-mmkv";

export class MobileStorageUtils implements IStorageUtils {
  constructor(private MMKVStorage: MMKV) {}
  public remove<T = any>(key: string): ResultAsync<void, PersistenceError> {
    console.log("MOBILESTORAGE_REMOVE", key);
    this.MMKVStorage.delete(key);
    return okAsync(undefined);
  }

  public write<T>(key: string, value: T): ResultAsync<void, PersistenceError> {
    console.log("MOBILESTORAGE_WRITE", { key, value });
    this.MMKVStorage.set(key, JSON.stringify(value));
    return okAsync(undefined);
  }

  public read<T>(key: string): ResultAsync<T | null, PersistenceError> {
    console.log("MOBILESTORAGE_READ", { key });
    const readData = this.MMKVStorage.getString(key);
    if (readData) {
      return okAsync(JSON.parse(readData));
    } else {
      return okAsync(null);
    }
  }

  public clear(): ResultAsync<void, PersistenceError> {
    console.log("MOBILESTORAGE_CLEAR");
    this.MMKVStorage.clearAll();
    return okAsync(undefined);
  }
}
