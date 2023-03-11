 import {
  AESKey,
  BackupBlob,
  DataWalletBackupID,
  IDataWalletBackup,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { EBackupPriority } from "packages/objects/src/enum/EBackupPriority";

export interface IChunkRenderer {
  updates: number;
  clear(): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
  addRecord<T extends VersionedObject>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
  deleteRecord(
    tableName: string,
    key: VolatileStorageKey,
    priority: EBackupPriority,
  ): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
  updateField(
    key: string,
    value: string,
    priority: EBackupPriority,
    timestamp: number,
  ): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
  restore(unpacked: BackupBlob): ResultAsync<void[][], PersistenceError>;
}

export const IChunkManagerType = Symbol.for("IChunkManager");
