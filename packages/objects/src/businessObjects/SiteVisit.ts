import { UnixTimestamp, URLString } from "@objects/primatives";

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
