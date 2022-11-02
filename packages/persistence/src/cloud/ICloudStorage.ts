import {
  PersistenceError,
  IDataWalletBackup,
  EVMPrivateKey,
  CeramicStreamID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICloudStorage {
  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<CeramicStreamID, PersistenceError>;
  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError>;
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError>;

  // this is the nuclear option
  clear(): ResultAsync<void, PersistenceError>;
}

export const ICloudStorageType = Symbol.for("ICloudStorage");
