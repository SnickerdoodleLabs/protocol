import {
  URLString,
  UnixTimestamp,
  DomainName,
} from "@objects/primitives/index.js";
export type SiteVisitsMap = Map<URLString | DomainName, SiteVisitsData>;

export type SiteVisitsData = {
  numberOfVisits: number;
  averageScreenTime: UnixTimestamp;
  totalScreenTime: UnixTimestamp;
  lastReportedTime: UnixTimestamp;
};
