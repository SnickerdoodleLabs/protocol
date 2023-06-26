import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/index.js";
import { ERecordKey } from "@objects/enum/index.js";
import {
  URLString,
  DomainName,
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

/**
 * Represents a visit to a particular Url
 */
export class SiteVisit extends VersionedObject {
  public get primaryKey(): VolatileStorageKey {
    return `${this.url}_${this.startTime}`;
  }
  public domain: DomainName | undefined;

  public constructor(
    public url: URLString,
    public startTime: UnixTimestamp,
    public endTime: UnixTimestamp,
  ) {
    super();
  }

  public static CURRENT_VERSION = 1;
  public getVersion(): number {
    return SiteVisit.CURRENT_VERSION;
  }
}

export class SiteVisitMigrator extends VersionedObjectMigrator<SiteVisit> {
  public getCurrentVersion(): number {
    return SiteVisit.CURRENT_VERSION;
  }

  public factory(data: Record<string, unknown>): SiteVisit {
    return new SiteVisit(
      data["url"] as URLString,
      data["startTime"] as UnixTimestamp,
      data["endTime"] as UnixTimestamp,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

export class RealmSiteVisit extends Realm.Object<RealmSiteVisit> {
  primaryKey!: Realm.BSON.UUID;
  domain?: string;
  url!: string;
  startTime!: number;
  endTime!: number;

  static schema = {
    name: ERecordKey.SITE_VISITS,
    properties: {
      primaryKey: "uuid",
      domain: "string?",
      url: "string",
      startTime: "int",
      endTime: "int",
    },
    primaryKey: "primaryKey",
  };
}
