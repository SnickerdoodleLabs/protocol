import { EBackupPriority, StorageKey } from "@objects/enum";
import {
  DataWalletBackupID,
  Signature,
  UnixTimestamp,
} from "@objects/primitives";

export class DataWalletBackupHeader {
  public constructor(
    public hash: DataWalletBackupID,
    public timestamp: UnixTimestamp,
    public signature: Signature,
    public priority: EBackupPriority,
    public dataType: StorageKey,
    public isField: boolean,
  ) {}
}
