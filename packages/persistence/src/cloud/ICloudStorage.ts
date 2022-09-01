import {
  PersistenceError,
  IDataWalletBackup,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(backup: IDataWalletBackup): ResultAsync<void, PersistenceError>;
  pollBackups(
    startTime: number,
  ): ResultAsync<IDataWalletBackup[], PersistenceError>;
  lastRestore(): ResultAsync<number, PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
