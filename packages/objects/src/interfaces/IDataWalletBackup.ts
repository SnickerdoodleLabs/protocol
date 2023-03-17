import { AESEncryptedString, VersionedObject } from "@objects/businessObjects";
import { EBackupPriority, EFieldKey, ERecordKey } from "@objects/enum";
import { UnixTimestamp, VolatileStorageKey } from "@objects/primitives";

export interface IDataWalletBackupHeader {
  hash: string;
  timestamp: UnixTimestamp;
  signature: string;
  priority: EBackupPriority;
  dataType: EFieldKey | ERecordKey;
}

export interface IDataWalletBackup {
  header: IDataWalletBackupHeader;
  blob: AESEncryptedString | BackupBlob;
}

export enum EDataUpdateOpCode {
  UPDATE = 0,
  REMOVE = 1,
}

export class VolatileDataUpdate {
  public constructor(
    public operation: EDataUpdateOpCode,
    public value: VersionedObject | VolatileStorageKey,
    public timestamp: number,
    public priority: EBackupPriority,
    public version?: number,
  ) {}
}

export class FieldDataUpdate {
  public constructor(
    public key: string,
    public value: string,
    public timestamp: number,
    public priority: EBackupPriority,
  ) {}
}

export type FieldMap = {
  [key: string]: FieldDataUpdate;
};
export type TableMap = {
  [key: string]: VolatileDataUpdate[];
};

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
