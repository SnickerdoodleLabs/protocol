import { IDataWalletBackup } from "@snickerdoodlelabs/objects";

export class BackupChoice {
  private backupName: string;
  private backupValue: IDataWalletBackup;

  public constructor(
    protected ID: string,
    protected dwBackup: IDataWalletBackup,
  ) {
    this.backupName = ID;
    this.backupValue = dwBackup;
  }

  public get name() {
    return this.backupName;
  }

  public get value() {
    return this.backupValue;
  }
}
