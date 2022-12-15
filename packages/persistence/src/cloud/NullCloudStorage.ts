import {
  CeramicStreamID,
  DataWalletBackupID,
  EVMPrivateKey,
  IDataWalletBackup,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";

@injectable()
export class NullCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, IDataWalletBackup>();
  protected _lastRestore = 0;

  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    this._lastRestore =
      backup.header.timestamp > this._lastRestore
        ? backup.header.timestamp
        : this._lastRestore;
    this._backups[backup.header.hash] = backup;
    return okAsync(DataWalletBackupID(""));
  }

  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError> {
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
}
