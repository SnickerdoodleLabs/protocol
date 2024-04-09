import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import { StorageKey } from "@objects/enum/index.js";
import { DataWalletBackupID } from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class RestoredBackup extends VersionedObject {
  public static CURRENT_VERSION = 1;
  public constructor(
    public id: DataWalletBackupID,
    public storageKey: StorageKey,
  ) {
    super();
  }

  public getVersion(): number {
    return RestoredBackup.CURRENT_VERSION;
  }
}

export class RestoredBackupMigrator extends VersionedObjectMigrator<RestoredBackup> {
  public getCurrentVersion(): number {
    return RestoredBackup.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<RestoredBackup>): RestoredBackup {
    return new RestoredBackup(data.id, data.storageKey);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
