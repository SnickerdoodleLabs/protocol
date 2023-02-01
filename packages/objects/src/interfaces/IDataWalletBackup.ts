import { Brand, make } from "ts-brand";

import {
  AESEncryptedString,
  VersionedObject,
  VolatileStorageMetadata,
} from "@objects/businessObjects";
import { EBackupPriority } from "@objects/enum";
import { UnixTimestamp, VolatileStorageKey } from "@objects/primitives";

export interface IDataWalletBackupHeader {
  hash: string;
  timestamp: UnixTimestamp;
  signature: string;
  priority: EBackupPriority;
}

export interface IDataWalletBackup {
  header: IDataWalletBackupHeader;
  blob: AESEncryptedString;
}

export enum EDataUpdateOpCode {
  UPDATE = 0,
  REMOVE = 1,
}

export class DataUpdate<T extends VersionedObject> {
  public constructor(
    public operation: EDataUpdateOpCode,
    public value: T | VolatileStorageKey,
    public timestamp: number,
    public priority: EBackupPriority,
    public version?: number,
  ) {}
}

export type FieldMap = { [key: string]: DataUpdate<VersionedObject> };
export type TableMap = { [key: string]: DataUpdate<VersionedObject>[] };

export class BackupBlob {
  public constructor(public fields: FieldMap, public records: TableMap) {}
}

export type BackupIndexEntry = { id: string; timestamp: number };
export type BackupIndex = { backups: { [key: string]: BackupIndexEntry } };

export type ModelTypes = {
  schemas: {
    DataWalletBackup: IDataWalletBackup;
    BackupIndex: AESEncryptedString;
  };
  definitions: {
    backupIndex: "BackupIndex";
  };
  tiles: Record<string, never>;
};
