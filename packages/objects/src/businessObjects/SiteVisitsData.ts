import { UnixTimestamp, ISO8601DateString } from "@objects/primitives/index.js";

export class SiteVisitsData {
  constructor(
    public numberOfVisits: number,
    public averageScreenTime: number,
    public totalScreenTime: UnixTimestamp,
    public lastReportedTime: ISO8601DateString,
  ) {}
}
