import Realm from "realm";

import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
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
  public pKey: string;

  public constructor(
    public recordKey: ERecordKey,
    public primaryKey: VolatileStorageKey,
    public lastUpdate: UnixTimestamp,
    public deleted: EBoolean = EBoolean.FALSE,
  ) {
    super();
    this.pKey = VolatileStorageMetadata.getKey(recordKey, primaryKey);
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
      data["primaryKey"] as VolatileStorageKey,
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

export class RealmVolatileStorageMetadata extends Realm.Object<VolatileStorageMetadata> {
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
    primaryKey: "pKey",
  };
}
