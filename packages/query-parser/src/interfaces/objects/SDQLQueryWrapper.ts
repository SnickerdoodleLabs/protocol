import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  ISDQLAdsBlock,
  ISDQLCompensationBlock,
  ISDQLLogicObjects,
  ISDQLQueryClause,
  ISDQLQueryObject,
  ISDQLReturnProperties,
  ISO8601DateString,
  SDQLQuery,
  SDQLString,
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
    // console.log("internalObj: " + internalObj)
    this.fixDateFormats();
  }

  // static fromString(s: SDQLString, timeUtils: ITimeUtils): SDQLQueryWrapper {
  //   return new SDQLQueryWrapper(JSON.parse(s)  as ISDQLQueryObject, timeUtils);
  // }

  public get version(): string | undefined {
    if (!this.internalObj.version) {
      return undefined;
    }
    return `${this.internalObj.version}`;
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
    return UnixTimestamp(Date.parse(this.internalObj.timestamp));
  }

  public get expiry(): UnixTimestamp {
    if (this.internalObj.expiry == null) {
      // If it lacks an expiration date, it's already expired
      return UnixTimestamp(0);
    }

    const timestamp = Date.parse(this.internalObj.expiry);
    // console.log(`expiry: ${this.internalObj.expiry} converted to timestamp ${timestamp}`);
    return UnixTimestamp(timestamp);
  }

  public isExpired(): boolean {
    if (!this.expiry) {
      return true;
    }
    return Date.now() > this.expiry;
  }

  public get description(): string {
    return this.internalObj.description;
  }

  public get business(): string {
    return this.internalObj.business;
  }

  public get ads(): ISDQLAdsBlock {
    return this.getAdsSchema();
  }

  public get queries(): {
    [queryId: string]: ISDQLQueryClause;
  } {
    return this.getQuerySchema();
  }
  public get returns(): {
    [returnsObject: string]: ISDQLReturnProperties;
    url: any;
  } {
    return this.getReturnSchema();
  }

  public get compensations(): ISDQLCompensationBlock {
    return this.getCompensationSchema();
  }

  public get logic(): ISDQLLogicObjects {
    return this.getLogicSchema();
  }

  getAdsSchema(): ISDQLAdsBlock {
    return this.internalObj.ads;
  }

  getQuerySchema(): {
    [queryId: string]: ISDQLQueryClause;
  } {
    return this.internalObj.queries;
  }

  getReturnSchema(): {
    [returnsObject: string]: ISDQLReturnProperties;
    url: any;
  } {
    return this.internalObj.returns;
  }

  getCompensationSchema(): ISDQLCompensationBlock {
    return this.internalObj.compensations;
  }

  getLogicSchema(): ISDQLLogicObjects {
    return this.internalObj.logic;
  }
}
