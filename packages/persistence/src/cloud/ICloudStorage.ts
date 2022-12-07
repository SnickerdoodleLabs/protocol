import {
  PersistenceError,
  IDataWalletBackup,
  EVMPrivateKey,
  CeramicStreamID,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<CeramicStreamID, PersistenceError | AjaxError>;
  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError | AjaxError>;
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError | AjaxError>;

  // this is the nuclear option
  clear(): ResultAsync<void, PersistenceError | AjaxError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
