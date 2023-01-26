import { Brand, make } from "ts-brand";

import { AESEncryptedString } from "@objects/businessObjects/index.js";
import { EBackupPriority } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/index.js";

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

export class DataUpdate {
  public constructor(
    public value: object,
    public timestamp: number,
    public operation: EDataUpdateOpCode,
    public priority: EBackupPriority,
  ) {}
}

export type FieldMap = { [key: string]: DataUpdate };
export type TableMap = { [key: string]: DataUpdate[] };

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
