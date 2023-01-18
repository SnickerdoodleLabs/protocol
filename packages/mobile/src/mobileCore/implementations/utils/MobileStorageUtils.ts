import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistenceError} from '@snickerdoodlelabs/objects';
import {IStorageUtils} from '@snickerdoodlelabs/utils';
import {ResultAsync} from 'neverthrow';

export class MobileStorageUtils implements IStorageUtils {
  public remove<T = any>(key: string): ResultAsync<void, PersistenceError> {
    console.log('MobileStorageWriteRemove');
    return ResultAsync.fromPromise(AsyncStorage.removeItem(key), e => {
      return new PersistenceError(
        `Cannot remove key ${key} from mobile storage, ${e}`,
      );
    });
  }

  public write<T>(key: string, value: T): ResultAsync<void, PersistenceError> {
    console.log('MobileStorageWrite');
    return ResultAsync.fromPromise(
      //@ts-ignore
      AsyncStorage.setItem(key, value),
      e => {
        return new PersistenceError(
          `Cannot write key ${key} to mobile storage, ${e}`,
        );
      },
    );
  }

  public read<T>(key: string): ResultAsync<T | null, PersistenceError> {
    console.log('MobileStorageRead');
    return ResultAsync.fromPromise(AsyncStorage.getItem(key), e => {
      return new PersistenceError(
        `Cannot read key ${key} from mobile storage, ${e}`,
      );
    }).map(vals => {
      //@ts-ignore
      return vals![key];
    });
  }

  public clear(): ResultAsync<void, PersistenceError> {
    console.log('MobileStorageClear');
    return ResultAsync.fromPromise(AsyncStorage.clear(), e => {
      return new PersistenceError(`Cannot clear storage storage: ${e}`);
    });
  }
}
