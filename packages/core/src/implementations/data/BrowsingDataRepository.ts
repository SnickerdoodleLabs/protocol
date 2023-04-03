import {
  SiteVisit,
  PersistenceError,
  DomainName,
  URLString,
  ClickData,
  ERecordKey,
  ISDQLTimestampRange,
  UnixTimestamp,
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
        return this.persistence.updateRecord(
          ERecordKey.SITE_VISITS,
          visit,
          SiteVisit.CURRENT_VERSION,
        );
      }),
    ).map(() => undefined);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this.persistence.getAll(ERecordKey.SITE_VISITS);
  }

  // return a map of URLs
  public getSiteVisitsMap(
    timestampRange?: ISDQLTimestampRange,
  ): ResultAsync<Map<URLString, number>, PersistenceError> {
    return this.getSiteVisits().andThen((siteVisits) => {
      const result = new Map<URLString, number>();
      siteVisits.forEach((siteVisit, _i, _arr) => {
        if (
          timestampRange &&
          this.timestampBetweenDates(
            siteVisit.startTime,
            siteVisit.endTime,
            timestampRange,
          )
        ) {
          return;
        }
        const baseUrl = DomainName(
          siteVisit.domain ? siteVisit.domain : siteVisit.url,
        );
        baseUrl in result || (result[baseUrl] = 0);
        result[baseUrl] += 1;
      });
      return okAsync(result);
    });
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(
      ERecordKey.CLICKS,
      click,
      ClickData.CURRENT_VERSION,
    );
  }

  public getClicks(): ResultAsync<ClickData[], PersistenceError> {
    return this.persistence.getAll<ClickData>(ERecordKey.CLICKS);
  }

  timestampBetweenDates(
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
