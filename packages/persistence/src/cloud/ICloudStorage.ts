import {
  AjaxError,
  PersistenceError,
  IDataWalletBackup,
  EVMPrivateKey,
  CeramicStreamID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError | AjaxError>;

  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError | AjaxError>;
  unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, AjaxError | PersistenceError>;

  // this is the nuclear option
  clear(): ResultAsync<void, PersistenceError | AjaxError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
