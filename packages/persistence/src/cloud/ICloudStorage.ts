import {
  PersistenceError,
  IDataWalletBackup,
  EVMPrivateKey,
  CeramicStreamID,
  DataWalletBackupID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError>;
  pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<IDataWalletBackup[], PersistenceError>;
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;

  // this is the nuclear option
  clear(): ResultAsync<void, PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
