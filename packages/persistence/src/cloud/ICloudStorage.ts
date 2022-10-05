import {
  PersistenceError,
  IDataWalletBackup,
  EVMPrivateKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(backup: IDataWalletBackup): ResultAsync<string, PersistenceError>;
  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError>;
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
