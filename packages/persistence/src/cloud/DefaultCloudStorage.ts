import {
  IDataWalletBackup,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage";

@injectable()
export class DefaultCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, IDataWalletBackup>();
  protected _lastRestore = 0;

  putBackup(backup: IDataWalletBackup): ResultAsync<void, PersistenceError> {
    this._lastRestore =
      backup.header.timestamp > this._lastRestore
        ? backup.header.timestamp
        : this._lastRestore;
    this._backups[backup.header.hash] = backup;
    return okAsync(undefined);
  }

  pollBackups(
    startTime: number,
  ): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return okAsync([]);
  }

  lastRestore(): ResultAsync<number, PersistenceError> {
    return okAsync(this._lastRestore);
  }
}
