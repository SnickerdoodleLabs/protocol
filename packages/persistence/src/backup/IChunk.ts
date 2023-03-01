import {
  AESKey,
  DataWalletBackupID,
  IDataWalletBackup,
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { EBackupPriority } from "packages/objects/src/enum/EBackupPriority";

export interface IChunk {
clear(): ResultAsync<void, never>;
}

export const IChunkType = Symbol.for("IChunk");
