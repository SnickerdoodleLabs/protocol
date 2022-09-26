import { Brand, make } from "ts-brand";

import { AESEncryptedString } from "@objects/businessObjects";
import { UnixTimestamp } from "@objects/primitives";

export interface IDataWalletBackupHeader {
  hash: string;
  timestamp: UnixTimestamp;
  signature: string;
}

export interface IDataWalletBackup {
  header: IDataWalletBackupHeader;
  blob: AESEncryptedString;
}

export type FieldMap = { [key: string]: [object, number] };
export type TableMap = { [key: string]: object[] };

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
