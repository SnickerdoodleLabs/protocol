import {
  SiteVisit,
  PersistenceError,
  DomainName,
  URLString,
  ClickData,
  ERecordKey,
  ISDQLTimestampRange,
  UnixTimestamp,
  SiteVisitInsight,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
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

  public getSiteVisitInsights(
    timestampRange?: ISDQLTimestampRange,
  ): ResultAsync<SiteVisitInsight[], PersistenceError> {
    return this.getSiteVisits().map((siteVisits) => {
      const siteVisitMap = this.getSiteVisitInsightsMap(
        siteVisits,
        timestampRange,
      );
      return [...siteVisitMap.values()];
    });
  }

  protected getSiteVisitInsightsMap(
    siteVisits: SiteVisit[],
    timestampRange?: ISDQLTimestampRange,
  ): Map<URLString | DomainName, SiteVisitInsight> {
    return siteVisits.reduce<Map<URLString | DomainName, SiteVisitInsight>>(
      (insightMap, siteVisit) => {
        if (
          timestampRange &&
          this.checkInvalidTimestamp(
            siteVisit.startTime,
            siteVisit.endTime,
            timestampRange,
          )
        ) {
          return insightMap;
        }
        this.upsertSiteVisitInsight(insightMap, siteVisit);
        return insightMap;
      },
      new Map(),
    );
  }

  protected upsertSiteVisitInsight(
    insightMap: Map<URLString | DomainName, SiteVisitInsight>,
    siteVisit: SiteVisit,
  ): void {
    const baseUrl = siteVisit.domain ? siteVisit.domain : siteVisit.url;
    const siteScreenTime = UnixTimestamp(
      siteVisit.endTime - siteVisit.startTime,
    );
    const siteVisitInsight = insightMap.get(baseUrl);

    if (siteVisitInsight) {
      siteVisitInsight.numberOfVisits += 1;
      siteVisitInsight.totalScreenTime = UnixTimestamp(
        siteVisitInsight.totalScreenTime + siteScreenTime,
      );
      siteVisitInsight.averageScreenTime = UnixTimestamp(
        siteVisitInsight.totalScreenTime / siteVisitInsight.numberOfVisits,
      );
    } else {
      insightMap.set(
        baseUrl,
        new SiteVisitInsight(baseUrl, 1, siteScreenTime, siteScreenTime),
      );
    }
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(ERecordKey.CLICKS, click);
  }

  public getClicks(): ResultAsync<ClickData[], PersistenceError> {
    return this.persistence.getAll<ClickData>(ERecordKey.CLICKS);
  }

  protected checkInvalidTimestamp(
    startTime: UnixTimestamp,
    endTime: UnixTimestamp,
    timestampRange: ISDQLTimestampRange,
  ): boolean {
    const start = timestampRange.start;
    const end = timestampRange.end;

    if (start !== "*") {
      const startTimeStamp = UnixTimestamp(Number(start));
      if (startTimeStamp > startTime) {
        return true;
      }
    }

    if (end !== "*") {
      const endTimeStamp = UnixTimestamp(Number(end));
      if (endTimeStamp < endTime) {
        return true;
      }
    }

    return false;
  }
}
