import {
  URLString,
  UnixTimestamp,
  DomainName,
} from "@objects/primitives/index.js";
export class SiteVisitInsight {
  constructor(
    public url: URLString | DomainName,
    public numberOfVisits: number,
    public averageScreenTime: UnixTimestamp,
    public totalScreenTime: UnixTimestamp,
  ) {}
}
