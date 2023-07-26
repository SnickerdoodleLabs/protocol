import {
  DataWalletBackupID,
  EVMPrivateKey,
  DataWalletBackup,
  PersistenceError,
  BackupFileName,
  ERecordKey,
  VolatileStorageKey,
  StorageKey,
  ECloudStorageType,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { okAsync, ResultAsync, errAsync } from "neverthrow";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";

@injectable()
export class NullCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, DataWalletBackup>();
  protected _lastRestore = 0;

  constructor() { } // protected storageUtils: IStorageUtils, // @inject(IStorageUtilsType)

  public type(): ECloudStorageType {
    return ECloudStorageType.Local_Only;
  }

  public readBeforeUnlock(
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    // return this.storageUtils.read(key);
    return okAsync(undefined);
  }

  public writeBeforeUnlock(
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    // return this.storageUtils.write(key);
    return okAsync(undefined);
  }

  public pollByStorageType(
    restored: Set<DataWalletBackupID>,
    recordKey: StorageKey,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return okAsync([]);
  }

  public getLatestBackup(
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    return okAsync(null);
  }

  public putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    this._lastRestore =
      backup.header.timestamp > this._lastRestore
        ? backup.header.timestamp
        : this._lastRestore;
    this._backups[backup.header.hash] = backup;
    return okAsync(DataWalletBackupID(""));
  }

  public pollBackups(): ResultAsync<DataWalletBackup[], PersistenceError> {
    return okAsync([]);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }

  public fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return okAsync([]);
  }

  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    return okAsync([]);
  }

  public copy(): ResultAsync<void, PersistenceError> {
    return errAsync(
      new PersistenceError("Error: DropBox copy() is not implemented yet"),
    );
  }
}
