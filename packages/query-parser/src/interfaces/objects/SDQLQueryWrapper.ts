import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  AdKey,
  CompensationKey,
  EVMAccountAddress,
  InsightKey,
  ISDQLAd,
  ISDQLAdsBlock,
  ISDQLCompensationBlock,
  ISDQLCompensations,
  ISDQLConditionString,
  ISDQLInsightBlock,
  ISDQLInsightsBlock,
  ISDQLQueryClause,
  ISDQLQueryObject,
  ISO8601DateString,
  SDQLQuery,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

export class SDQLQueryWrapper {
  /**
   * A object created from string
   */

  constructor(
    readonly sdqlQuery: SDQLQuery,
    readonly internalObj: ISDQLQueryObject,
    readonly timeUtils: ITimeUtils,
  ) {
    this.fixDateFormats();
    this.preProcessAds();
    this.preProcessInsights();
    this.preProcessCompensations();
  }

  public get version(): string | undefined {
    if (!this.internalObj.version) {
      return undefined;
    }
    return `${this.internalObj.version}`;
  }

  public preProcessAds() {
    const adSchema = this.getAdsSchema();
    if (adSchema == null) {
      this.internalObj.ads = {};
      return;
    }

    this.getAdEntries().forEach(([adKey, ad]) => {
      if (!ad.target || ad.target.trim().length == 0) {
        ad.target = ISDQLConditionString("true");
      }
      this.internalObj.ads[adKey] = ad;
    });
  }

  public preProcessInsights() {
    const insightSchema = this.getInsightSchema();
    if (insightSchema == null) {
      this.internalObj.insights = {};
      return;
    }

    this.getInsightEntries().forEach(([iKey, insight]) => {
      if (!insight.target || insight.target.trim().length == 0) {
        insight.target = ISDQLConditionString("true");
      }
      this.internalObj.insights[iKey] = insight;
    });
  }

  public preProcessCompensations() {
    const compSchema = this.getCompensationSchema();
    if (compSchema == null) {
      this.internalObj.compensations = {
        parameters: {
          recipientAddress: {
            type: EVMAccountAddress(""),
            required: false,
          }
        }
      };
      return;
    }

    this.getCompensationEntries().forEach(([cKey, comp]) => {
      if (cKey == "parameters") {
        return;
      }
      if (!comp.requiresRaw || comp.requiresRaw.trim().length == 0) {
        comp.requiresRaw = ISDQLConditionString("true");
      }
      this.internalObj.compensations[cKey] = comp;
    });
  }

  public fixDateFormats() {
    if (this.internalObj.timestamp) {
      this.internalObj.timestamp = this.fixDateFormat(
        this.internalObj.timestamp,
      );
    }

    if (this.internalObj.expiry) {
      this.internalObj.expiry = this.fixDateFormat(this.internalObj.expiry);
    }
  }

  public fixDateFormat(isoDate: ISO8601DateString): ISO8601DateString {
    // Adds time zone if missing
    // 1. check if has time zone in +- format
    if (isoDate.includes("+", 10) || isoDate.includes("-", 10)) {
      return isoDate;
    }

    isoDate = ISO8601DateString(isoDate.toUpperCase());

    if (isoDate[isoDate.length - 1] != "Z") {
      isoDate = ISO8601DateString(isoDate + "Z");
    }

    return isoDate;
  }

  public get timestamp(): UnixTimestamp | null {
    if (this.internalObj.timestamp == null) {
      return null;
    }
    return UnixTimestamp(
      Math.floor(Date.parse(this.internalObj.timestamp) / 1000),
    );
  }

  public get expiry(): UnixTimestamp {
    if (this.internalObj.expiry == null) {
      // If it lacks an expiration date, it's already expired
      return UnixTimestamp(0);
    }

    return UnixTimestamp(
      Math.floor(Date.parse(this.internalObj.expiry) / 1000),
    );
  }

  public isExpired(): boolean {
    if (!this.expiry) {
      return true;
    }
    return this.timeUtils.getUnixNow() > this.expiry;
  }

  public get description(): string {
    return this.internalObj.description;
  }

  public get business(): string {
    return this.internalObj.business;
  }

  public getInsightEntries(): [InsightKey, ISDQLInsightBlock][] {
    const insights = this.getInsightSchema();
    return this._getEntries<InsightKey, ISDQLInsightBlock>(insights);
  }

  public getAdEntries(): [AdKey, ISDQLAd][] {
    const ads = this.getAdsSchema();
    return this._getEntries<AdKey, ISDQLAd>(ads);
  }

  public getCompensationEntries(): [CompensationKey, ISDQLCompensations][] {
    const comps = this.getCompensationSchema();
    return this._getEntries<CompensationKey, ISDQLCompensations>(comps);
  }

  public getQuerySchema(): {
    [queryId: string]: ISDQLQueryClause;
  } {
    return this.internalObj.queries;
  }

  public getAdsSchema(): ISDQLAdsBlock {
    return this.internalObj.ads;
  }

  public getCompensationSchema(): ISDQLCompensationBlock {
    return this.internalObj.compensations;
  }

  public getInsightSchema(): ISDQLInsightsBlock {
    return this.internalObj.insights;
  }

  private _getEntries<K, V>(o: { [s: string]: any }): [K, V][] {
    return (Array.from(Object.entries(o))).map(([k, v]) => [
      k as unknown as K,
      v,
    ]);
  }
}
