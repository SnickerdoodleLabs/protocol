import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  URLString,
  DomainName,
  UnixTimestamp,
} from "@objects/primitives/index.js";
import { PropertiesOf } from "@objects/utilities/index.js";

/**
 * Represents a visit to a particular Url
 */
export class SiteVisit extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public domain: DomainName | undefined;

  public constructor(
    public url: URLString,
    public startTime: UnixTimestamp,
    public endTime: UnixTimestamp,
  ) {
    super();
  }

  public getVersion(): number {
    return SiteVisit.CURRENT_VERSION;
  }
}

export class SiteVisitMigrator extends VersionedObjectMigrator<SiteVisit> {
  public getCurrentVersion(): number {
    return SiteVisit.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<SiteVisit>): SiteVisit {
    return new SiteVisit(data.url, data.startTime, data.endTime);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
