import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import { ERecordKey } from "@objects/enum";
import { DataWalletBackupID, VolatileStorageKey } from "@objects/primitives";

export class RestoredBackup extends VersionedObject {
  public pKey: VolatileStorageKey;
  public constructor(public id: DataWalletBackupID) {
    super();
    this.pKey = id;
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return 1;
  }
}

export class RestoredBackupMigrator extends VersionedObjectMigrator<RestoredBackup> {
  public getCurrentVersion(): number {
    return RestoredBackup.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): RestoredBackup {
    return new RestoredBackup(data["id"] as DataWalletBackupID);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class RealmRestoredBackup extends Realm.Object<RealmRestoredBackup> {
  pKey!: string;
  id!: string;

  static schema = {
    name: ERecordKey.RESTORED_BACKUPS,
    properties: {
      pKey: "string",
      id: "string",
    },
    primaryKey: "pKey",
  };
}
