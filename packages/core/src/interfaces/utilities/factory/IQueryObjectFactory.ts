import { AST_BalanceQuery, AST_NetworkQuery, AST_PropertyQuery } from "@core/interfaces/objects/SDQL";
import { Condition } from "@core/interfaces/objects/SDQL/condition";
import { SDQL_Name } from "@snickerdoodlelabs/objects";

export interface IQueryObjectFactory {

  parseConditions(schema: any): Array<Condition>;
  toNetworkQuery(name: SDQL_Name, schema: any): AST_NetworkQuery;
  toPropertyQuery(name: SDQL_Name, schema: any): AST_PropertyQuery;
  toBalanceQuery(name: SDQL_Name, schema: any): AST_BalanceQuery;
  
}


export const IQueryObjectFactoryType = Symbol.for("IQueryObjectFactory");
