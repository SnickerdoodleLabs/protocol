import {
  CeramicStreamID,
  DataWalletBackupID,
  EVMPrivateKey,
  DataWalletBackup,
  PersistenceError,
  AjaxError,
  EBackupPriority,
  BackupFileName,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";

@injectable()
export class NullCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, DataWalletBackup>();
  protected _lastRestore = 0;

  public pollByPriority(
    restored: Set<DataWalletBackupID>,
    priority: EBackupPriority,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return okAsync([]);
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
}
