import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject";
import { ERecordKey } from "@objects/enum";
import {
  URLString,
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives";

/**
 * I honestly don't know what we need to collect for clicks. I'm not a data guy. Presumeably,
 * you want to know where you clicked and when you did it.
 */
export class ClickData extends VersionedObject {
  public pKey: VolatileStorageKey | null = null;
  public constructor(
    public url: URLString,
    public timestamp: UnixTimestamp,
    public element: string,
  ) {
    super();
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return ClickData.CURRENT_VERSION;
  }
}

export class ClickDataMigrator extends VersionedObjectMigrator<ClickData> {
  public getCurrentVersion(): number {
    return ClickData.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): ClickData {
    return new ClickData(
      data["url"] as URLString,
      data["timestamp"] as UnixTimestamp,
      data["element"] as string,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class RealmClickData extends Realm.Object<RealmClickData> {
  pKey!: Realm.BSON.UUID;
  url!: string;
  timestamp!: number;
  element!: string;

  static schema = {
    name: ERecordKey.CLICKS,
    properties: {
      pKey: "uuid",
      url: "string",
      timestamp: "number",
      element: "string",
    },
    primaryKey: "pKey",
  };
}
