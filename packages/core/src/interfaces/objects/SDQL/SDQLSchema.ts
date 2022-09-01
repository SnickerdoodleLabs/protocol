import {
  ISDQLQueryObject,
  SDQLString,
  ISDQLQueryClause,
  ISDQLReturnProperties,
  ISDQLCompensations,
  ISDQLLogicObjects,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

export class SDQLSchema {
  /**
   * A object created from string
   */

  constructor(readonly internalObj: ISDQLQueryObject) {
    // console.log("internalObj: " + internalObj)
  }

  static fromString(s: SDQLString): SDQLSchema {
    return new SDQLSchema(JSON.parse(s)  as ISDQLQueryObject);
  }

  public get version(): string {
    return `${this.internalObj.version}`;
  }

  public get timestamp(): UnixTimestamp | undefined { 
    if (!this.internalObj.timestamp) {
      return undefined;
    }
    return UnixTimestamp(Date.parse(this.internalObj.timestamp));
  }

  public  get expiry(): UnixTimestamp | undefined {
    if (!this.internalObj.expiry) {
      return undefined;
    }
    return UnixTimestamp(Date.parse(this.internalObj.expiry));
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

  public get compenstations(): {
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
