import {
  ISDQLQueryObject,
  SDQLString,
  ISDQLQueryClause,
  ISDQLReturnProperties,
  ISDQLCompensations,
  ISDQLLogicObjects,
} from "@snickerdoodlelabs/objects";

export class SDQLSchema {
  /**
   * A object created from string
   */

  constructor(readonly internalObj: ISDQLQueryObject) {}

  static fromString(s: string): SDQLSchema {
    return new SDQLSchema(JSON.parse(s));
  }

  public get version(): string {
    return `${this.internalObj.version}`;
  }

  public get description(): string {
    return this.internalObj.description;
  }

  public get business(): string {
    return this.internalObj.business;
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
