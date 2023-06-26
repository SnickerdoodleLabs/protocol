import Realm from "realm";

import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObjectMigrator.js";
import { EBoolean, ERecordKey } from "@objects/enum/index.js";
import {
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export interface VolatileStorageMetadataWrapper<T extends VersionedObject> {
  data: T | null;
  metadata: VolatileStorageMetadata;
}

export class VolatileStorageMetadata extends VersionedObject {
  public get primaryKey(): VolatileStorageKey {
    return VolatileStorageMetadata.getKey(this.recordKey, this.pKey);
  }

  public constructor(
    public recordKey: ERecordKey,
    public pKey: string,
    public lastUpdate: UnixTimestamp,
    public deleted: EBoolean = EBoolean.FALSE,
  ) {
    super();
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return VolatileStorageMetadata.CURRENT_VERSION;
  }

  public static getKey(
    recordKey: ERecordKey,
    primaryKey: VolatileStorageKey,
  ): string {
    return `${recordKey}_${primaryKey}`;
  }
}

export class VolatileStorageMetadataMigrator extends VersionedObjectMigrator<VolatileStorageMetadata> {
  public getCurrentVersion(): number {
    return VolatileStorageMetadata.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): VolatileStorageMetadata {
    return new VolatileStorageMetadata(
      data["recordKey"] as ERecordKey,
      data["pKey"] as string,
      data["lastUpdate"] as UnixTimestamp,
      data["deleted"] as EBoolean,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class RealmVolatileStorageMetadata extends Realm.Object<RealmVolatileStorageMetadata> {
  pKey!: string;
  recordKey!: string;
  primaryKey!: Realm.Mixed;
  lastUpdate!: number;
  deleted!: number;

  static schema = {
    name: "LinkedAccount",
    properties: {
      sourceAccountAddress: "string",
      sourceChain: "int",
      derivedAccountAddress: "string",
    },
    primaryKey: "primaryKey",
  };
}
