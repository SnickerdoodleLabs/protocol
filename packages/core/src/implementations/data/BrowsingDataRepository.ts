import {
  SiteVisit,
  PersistenceError,
  DomainName,
  URLString,
  ClickData,
  ERecordKey,
  ISDQLTimestampRange,
  UnixTimestamp,
  SiteVisitsMap,
  SiteVisitsData,
  ISO8601DateString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { parse } from "tldts";

import {
  IBrowsingDataRepository,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";

@injectable()
export class BrowsingDataRepository implements IBrowsingDataRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
  ) {}

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      siteVisits.map((visit: SiteVisit) => {
        const url = parse(visit.url);
        visit.domain = url.domain ? DomainName(url.domain) : undefined;
        return this.persistence.updateRecord(ERecordKey.SITE_VISITS, visit);
      }),
    ).map(() => undefined);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this.persistence.getAll(ERecordKey.SITE_VISITS);
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(ERecordKey.CLICKS, click);
  }

  public getClicks(): ResultAsync<ClickData[], PersistenceError> {
    return this.persistence.getAll<ClickData>(ERecordKey.CLICKS);
  }

  public getSiteVisitsMap(
    timestampRange?: ISDQLTimestampRange,
  ): ResultAsync<SiteVisitsMap, PersistenceError> {
    return this.getSiteVisits().map((siteVisits) => {
      const filteredVisits = timestampRange
        ? this.filterSiteVisists(siteVisits, timestampRange)
        : siteVisits;
      const visitsMap = this.mapSiteVisitData(filteredVisits);

      return visitsMap;
    });
  }

  protected filterSiteVisists(
    siteVisits: SiteVisit[],
    timestampRange: ISDQLTimestampRange,
  ): SiteVisit[] {
    const { start, end } = timestampRange;
    return siteVisits.filter((visit) => {
      return visit.startTime >= start && visit.endTime <= end;
    });
  }

  protected mapSiteVisitData(siteVisits: SiteVisit[]): SiteVisitsMap {
    const visitsMap = new Map<URLString | DomainName, SiteVisitsData>();
    siteVisits.forEach((visit) => {
      const siteName = visit.domain || visit.url;
      const screenTime = visit.endTime - visit.startTime;
      const siteVisitData = visitsMap.get(siteName);

      if (siteVisitData) {
        siteVisitData.numberOfVisits += 1;
        siteVisitData.totalScreenTime = UnixTimestamp(
          siteVisitData.totalScreenTime + screenTime,
        );
        if (
          this.convertTimestampToISOString(visit.endTime) >
          siteVisitData.lastReportedTime
        ) {
          siteVisitData.lastReportedTime = this.convertTimestampToISOString(
            visit.endTime,
          );
        }
      } else {
        visitsMap.set(
          siteName,
          new SiteVisitsData(
            1,
            screenTime, //Will be average later
            UnixTimestamp(screenTime),
            this.convertTimestampToISOString(visit.endTime),
          ),
        );
      }
    });
    this.calculateAverageScreenTime(visitsMap);
    return visitsMap;
  }

  protected convertTimestampToISOString(
    unixTimestamp: UnixTimestamp,
  ): ISO8601DateString {
    const date = new Date(unixTimestamp * 1000);
    return ISO8601DateString(date.toISOString());
  }

  protected calculateAverageScreenTime(visitsMap: SiteVisitsMap): void {
    for (const [_, siteVisitData] of visitsMap) {
      siteVisitData.averageScreenTime =
        siteVisitData.totalScreenTime / siteVisitData.numberOfVisits;
    }
  }
}
