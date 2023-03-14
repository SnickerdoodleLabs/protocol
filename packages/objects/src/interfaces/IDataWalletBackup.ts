import { AESEncryptedString, VersionedObject } from "@objects/businessObjects";
import { EBackupPriority, EFieldKey, StorageKey } from "@objects/enum";
import {
  DataWalletBackupID,
  JSONString,
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives";

export interface IDataWalletBackupHeader {
  hash: DataWalletBackupID;
  timestamp: UnixTimestamp;
  signature: string;
  priority: EBackupPriority;
  dataType: StorageKey;
}

export interface IDataWalletBackup {
  header: IDataWalletBackupHeader;
  blob: BackupBlob | EncryptedBackupBlob;
}

export enum EDataUpdateOpCode {
  UPDATE = 0,
  REMOVE = 1,
}

export type BackupBlob = VolatileDataUpdate[] | FieldDataUpdate;
export type EncryptedBackupBlob = AESEncryptedString;

export type DataUpdate = VolatileDataUpdate | FieldDataUpdate;

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
    public key: EFieldKey,
    public value: JSONString,
    public timestamp: number,
    public priority: EBackupPriority,
  ) {}
}
