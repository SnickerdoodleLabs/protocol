import {
  PersistenceError,
  IDataWalletBackup,
  EVMPrivateKey,
  CeramicStreamID,
  DataWalletBackupID,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError | AjaxError>;
  pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<IDataWalletBackup[], PersistenceError | AjaxError>;
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;

  // this is the nuclear option
  clear(): ResultAsync<void, PersistenceError | AjaxError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
