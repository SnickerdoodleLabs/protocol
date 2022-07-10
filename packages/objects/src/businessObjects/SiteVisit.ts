import { UnixTimestamp, URLString } from "@objects/primitives";

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
