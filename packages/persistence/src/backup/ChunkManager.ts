import {
  FieldMap,
  TableMap,
  VersionedObjectMigrator,
  VersionedObject,
  IDataWalletBackup,
  VolatileStorageKey,
  PersistenceError,
  EBackupPriority,
  BackupBlob,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IChunkManager } from "@persistence/backup/IChunkManager.js";
import {
  EFieldKey,
  ERecordKey,
  LocalStorageKey,
} from "@persistence/ELocalStorageKey.js";

export class ChunkManager implements IChunkManager {
  /*
    1. Identify Priority Level
    2. Identify Table or Field Name being Added or Updated
    3. Insert the data
  */

  // Map pointing to a map
  // private priorityPointerMap: Map<number, Array<IDataWalletBackup>> = new Map();
  private priorityChunkMap: Map<EBackupPriority, Array<IDataWalletBackup>> =
    new Map();
  private chunkFieldMap: Map<LocalStorageKey, Array<IDataWalletBackup>> =
    new Map();
  private chunkObjectMap: Map<ChunkObjectKey, Array<IDataWalletBackup>> =
    new Map();

  private chunkQueue: Array<IDataWalletBackup> = [];
  private chunkCounter = 0;

  public constructor() {}

  /* Clean and repopulate with template data */
  public clear(): ResultAsync<void, never> {
    this.chunkQueue = [];
    this.priorityChunkMap = new Map();
    this.chunkCounter = 0;
    return okAsync(undefined);
  }

  private renderChunk(
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }

  public size(): number {
    return this.chunkQueue.length;
  }

  public updateChunk(
    priority: EBackupPriority,
  ): ResultAsync<void, PersistenceError> {
    const backup = this.priorityChunkMap.get(priority);
    return okAsync(undefined);
  }

  public addChunk(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    this.chunkCounter = this.chunkCounter + 1;
    this.chunkQueue.push(backup);
    if (
      !this.priorityChunkMap.has(backup.header.priority) ||
      this.priorityChunkMap.has(backup.header.priority) == undefined
    ) {
      this.priorityChunkMap.set(backup.header.priority, [backup]);
      // this.chunkFieldMap.set()
      return okAsync(undefined);
    }

    const storedChunk = this.priorityChunkMap.get(backup.header.priority);
    if (storedChunk !== undefined) {
      storedChunk[storedChunk.length] = backup;
      this.priorityChunkMap.set(backup.header.priority, storedChunk);
    }
    this.renderChunk(backup.header.priority);
    return okAsync(undefined);
  }

  public removeChunk(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    this.chunkCounter = this.chunkCounter + 1;
    if (
      !this.priorityChunkMap.has(backup.header.priority) ||
      this.priorityChunkMap.has(backup.header.priority) == undefined
    ) {
      this.priorityChunkMap.set(backup.header.priority, [backup]);
      return okAsync(undefined);
    }

    const storedChunk = this.priorityChunkMap.get(backup.header.priority);

    if (storedChunk !== undefined) {
      storedChunk[storedChunk.length] = backup;
      this.priorityChunkMap.set(backup.header.priority, storedChunk);

      const fetchedBackup = storedChunk.find((element) => element == backup);
    }
    return okAsync(undefined);
  }

  public displayChunks(): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return okAsync(this.chunkQueue);
  }

  public popChunk(): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return okAsync(this.chunkQueue);
  }

  public fetchBackupChunk(): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }
}

export interface ChunkObjectKey {
  priority: EBackupPriority;
  key: LocalStorageKey;
}
