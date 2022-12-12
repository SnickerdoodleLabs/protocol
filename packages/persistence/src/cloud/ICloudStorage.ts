import {
  PersistenceError,
  IDataWalletBackup,
  EVMPrivateKey,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError | AjaxError>;
  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError | AjaxError>;
  unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError | AjaxError>;

  // this is the nuclear option
  clear(): ResultAsync<void, PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
