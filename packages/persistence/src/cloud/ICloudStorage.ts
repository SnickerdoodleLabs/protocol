import {
  PersistenceError,
  IDataWalletBackup,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(backup: IDataWalletBackup): ResultAsync<string, PersistenceError>;
  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
