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
  DataWalletAddress,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IChunkManager } from "@persistence/backup/IChunkManager.js";
import {
  EFieldKey,
  ERecordKey,
  LocalStorageKey,
} from "@persistence/ELocalStorageKey.js";

export class Chunk {
  private fieldUpdates: FieldMap = {};
  private tableUpdates: TableMap = {};
  private numUpdates = 0;
  private tableTemplate: TableMap = {};
  private priority: EBackupPriority = 0;

  /*    
    1. Identify Priority Level
    2. Identify Table or Field Name being Added or Updated
    3. Insert the data
  */

  public constructor(protected tableNames: string[]) {
    tableNames.forEach((tableName) => (this.tableUpdates[tableName] = []));
    const tableTemplate = this.tableUpdates;
    // this.clear();
  }

  /* Clean and repopulate with template data */
  public clear(): ResultAsync<void, never> {
    this.fieldUpdates = {};
    this.tableUpdates = this.tableTemplate;
    return okAsync(undefined);
  }
}

export interface IChunkObjectKey {
  priority: EBackupPriority;
  key: LocalStorageKey;
}
