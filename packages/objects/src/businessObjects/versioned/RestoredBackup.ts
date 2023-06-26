import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/index.js";
import { ERecordKey } from "@objects/enum/index.js";
import {
  DataWalletBackupID,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export class RestoredBackup extends VersionedObject {
  public get primaryKey(): VolatileStorageKey {
    return this.id;
  }
  public constructor(public id: DataWalletBackupID) {
    super();
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
  primaryKey!: string;
  id!: string;

  static schema = {
    name: ERecordKey.RESTORED_BACKUPS,
    properties: {
      primaryKey: "string",
      id: "string",
    },
    primaryKey: "primaryKey",
  };
}
