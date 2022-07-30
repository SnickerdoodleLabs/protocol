import { URLString } from "@objects/primitives";
import { UnixTimestamp } from "@objects/businessObjects";
/**
 * Represents a visit to a particular Url
 */
export class SiteVisit {
  public constructor(
    public url: URLString,
    public startTime: UnixTimestamp,
    public endTime: UnixTimestamp,
  ) {}
}
