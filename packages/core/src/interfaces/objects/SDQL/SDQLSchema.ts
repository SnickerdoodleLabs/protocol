import {
  ISDQLQueryObject,
  SDQLString,
  ISDQLQueryClause,
  ISDQLReturnProperties,
  ISDQLCompensations,
  ISDQLLogicObjects,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";

export class SDQLSchema {
  /**
   * A object created from string
   */

  constructor(readonly internalObj: ISDQLQueryObject) {
    // console.log("internalObj: " + internalObj)
    this.fixDateFormats();
  }

  static fromString(s: SDQLString): SDQLSchema {
    return new SDQLSchema(JSON.parse(s)  as ISDQLQueryObject);
  }

  public get version(): string | undefined {
    if (!this.internalObj.version) {
      return undefined;
    }
    return `${this.internalObj.version}`;
  }

  public fixDateFormats() {

    if (this.internalObj.timestamp) {
      this.internalObj.timestamp = this.fixDateFormat(this.internalObj.timestamp);
    }

    if (this.internalObj.expiry) {
      this.internalObj.expiry = this.fixDateFormat(this.internalObj.expiry);
    }


  }
  public fixDateFormat(isoDate: string): string {
    // Adds time zone if missing
    // 1. check if has time zone in +- format
    if (isoDate.includes("+", 10) || isoDate.includes("-", 10)) {
      return isoDate;
    } 
    
    isoDate = isoDate.toUpperCase();

    if (isoDate[isoDate.length - 1] != "Z") {
      isoDate = isoDate + "Z";
    }

    return isoDate;
  }

  public get timestamp(): UnixTimestamp | undefined { 
    if (!this.internalObj.timestamp) {
      return undefined;
    }
    return UnixTimestamp(Date.parse(this.internalObj.timestamp));
  }

  public get expiry(): UnixTimestamp | undefined {
    if (!this.internalObj.expiry) {
      return undefined;
    }

    const timestamp = Date.parse(this.internalObj.expiry);
    // console.log(`expiry: ${this.internalObj.expiry} converted to timestamp ${timestamp}`);
    return UnixTimestamp(timestamp);
  }

  public isExpired(): boolean {
    const expiry = this.expiry! as number;
    // console.log("current gmt timestamp", Date.now() );
    // console.log("expiry gmt timestamp", this.expiry! );
    // console.log("current gmt time", new Date().toISOString());
    // console.log("expiry gmt time", new Date(expiry).toISOString());
    return Date.now() > expiry;
  }

  public get description(): string {
    return this.internalObj.description;
  }

  public get business(): string {
    return this.internalObj.business;
  }

  public get queries():{
    [queryId: string]: ISDQLQueryClause;
  }  {
    return this.getQuerySchema();
  }
  public get returns (): {
    [returnsObject: string]: ISDQLReturnProperties;
    url: any;
  } {
    return this.getReturnSchema()
  }

  public get compensations(): {
    [compensationObjects: string]: ISDQLCompensations;
  } {
    return this.getCompensationSchema();
  }

  public get logic():  ISDQLLogicObjects {
    return this.getLogicSchema()
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
  getCompensationSchema(): {
    [compensationObjects: string]: ISDQLCompensations;
  } {
    return this.internalObj.compensations;
  }
  getLogicSchema(): ISDQLLogicObjects {
    return this.internalObj.logic;
  }
}
