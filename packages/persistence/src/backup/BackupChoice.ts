import { IDataWalletBackup } from "@snickerdoodlelabs/objects";

export class BackupChoice {
  private backupName: string;
  private backupValue: IDataWalletBackup;
  private backupPosition: number;

  public constructor(
    protected ID: string,
    protected dwBackup: IDataWalletBackup,
    protected index: number,
  ) {
    this.backupName = ID;
    this.backupValue = dwBackup;
    this.backupPosition = index;
  }

  public get name() {
    return this.backupName;
  }

  public get value() {
    return this.backupValue;
  }

  public get position() {
    return this.backupPosition;
  }
}
