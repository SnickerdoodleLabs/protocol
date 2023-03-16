import { AESEncryptedString, VersionedObject } from "@objects/businessObjects";
import { EBackupPriority, EFieldKey, StorageKey } from "@objects/enum";
import {
  DataWalletBackupID,
  JSONString,
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives";

export class DataWalletBackupHeader {
  public constructor(
    public hash: DataWalletBackupID,
    public timestamp: UnixTimestamp,
    public signature: string,
    public priority: EBackupPriority,
    public dataType: StorageKey,
  ) {}
}

export class DataWalletBackup {
  public constructor(
    public header: DataWalletBackupHeader,
    public blob: BackupBlob | EncryptedBackupBlob,
  ) {}
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
    public key: VolatileStorageKey,
    public timestamp: number,
    public value: VersionedObject,
    public version?: number,
  ) {}
}

export class FieldDataUpdate {
  public constructor(
    public key: EFieldKey,
    public value: JSONString,
    public timestamp: number,
  ) {}
}
