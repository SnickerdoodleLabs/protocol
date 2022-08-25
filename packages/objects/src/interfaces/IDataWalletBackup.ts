import { AESEncryptedString } from "@objects/businessObjects";

export interface IDataWalletBackupHeader {
  hash: string;
  timestamp: number;
  signature: string;
  accountAddress: string; // not sure if we should include this
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
