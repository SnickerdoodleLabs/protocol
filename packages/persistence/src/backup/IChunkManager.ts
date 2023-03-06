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
  
export interface IChunkManager {
clear(): ResultAsync<void, never>;
addRecord<T extends VersionedObject>(
    tableName: string,
    value: VolatileStorageMetadata<T>,
): ResultAsync<void, PersistenceError>;
deleteRecord(
    tableName: string,
    key: VolatileStorageKey,
    priority: EBackupPriority,
): ResultAsync<void, PersistenceError>;
updateField(
    key: string,
    value: object,
    priority: EBackupPriority,
): ResultAsync<void, PersistenceError>;
popBackup(): ResultAsync<IDataWalletBackup | undefined, PersistenceError>;
restore(unpacked: BackupBlob): ResultAsync<void[][], PersistenceError>;
}
  
export const IChunkManagerType = Symbol.for("IChunkManager");
  