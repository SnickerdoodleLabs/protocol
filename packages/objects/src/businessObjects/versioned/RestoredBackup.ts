import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import { DataWalletBackupID } from "@objects/primitives";

export class RestoredBackup extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(public id: DataWalletBackupID) {
    super();
  }

  public getVersion(): number {
    return 1;
  }
}

export class RestoredBackupMigrator extends VersionedObjectMigrator<RestoredBackup> {
  public getCurrentVersion(): number {
    return RestoredBackup.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): RestoredBackup {
    return new RestoredBackup(data["id"] as DataWalletBackupID);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
