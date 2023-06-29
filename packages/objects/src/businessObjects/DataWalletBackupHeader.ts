import { EBackupPriority, StorageKey } from "@objects/enum/index.js";
import {
  DataWalletBackupID,
  Signature,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class DataWalletBackupHeader {
  public constructor(
    public hash: DataWalletBackupID,
    public timestamp: UnixTimestamp,
    public signature: Signature,
    public priority: EBackupPriority,
    public dataType: StorageKey,
    public isField: boolean,
  ) {}

  public get name() {
    const sanitized = this._sanitizeDataType(this.dataType);
    return `${this.priority}_${sanitized}_${this.timestamp}_${this.hash}_${this.isField}`;
  }

  private _sanitizeDataType(dataType: StorageKey): string {
    return dataType.replace("_", "$");
  }
}
